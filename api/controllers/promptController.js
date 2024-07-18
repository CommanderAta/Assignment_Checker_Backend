const axios = require('axios');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

exports.prompt = async (req, res) => {
    const userMessage = req.body.message;
    let questions = [];
    let answers = [];
    let marks = [];
    let feedbacks = [];

    if (!userMessage) {
        console.error('Message field is required');
        return res.status(400).json({ error: 'Message field is required' });
    }

    if (req.file) {
        const fileContent = req.file.buffer.toString('utf-8');
        const lines = fileContent.split('\n');
        let currentQuestion = '';
        let currentAnswer = '';
        let questionNumber = 0;

        lines.forEach(line => {
            if (line.startsWith('# QUESTION')) {
                if (currentQuestion && currentAnswer) {
                    questions.push(currentQuestion.trim());
                    answers.push(currentAnswer.trim());
                }
                currentQuestion = line.replace('# QUESTION', '').trim();
                currentAnswer = '';
                questionNumber++;
            } else if (line.startsWith('# ANSWER')) {
                currentAnswer += line.replace('# ANSWER', '').trim() + '\n ';
            } else if (line.startsWith('## ')) {
                if (currentQuestion && currentAnswer) {
                    questions.push(currentQuestion.trim());
                    answers.push(currentAnswer.trim());
                }
                currentQuestion = `Subpart of Question ${questionNumber}: ` + line.replace('## ', '').trim();
                currentAnswer = '';
            } else if (line.startsWith('# ')) {
                if (currentQuestion && currentAnswer) {
                    questions.push(currentQuestion.trim());
                    answers.push(currentAnswer.trim());
                }
                currentQuestion = line.replace('# ', '').trim();
                currentAnswer = '';
            } else {
                currentAnswer += line + '\n ';
            }
        });

        if (currentQuestion && currentAnswer) {
            questions.push(currentQuestion.trim());
            answers.push(currentAnswer.trim());
        }
    }

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const answer = answers[i];
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o',
            messages: [
                {
                    role: "system",
                    content: "You are an expert assistant in the R programming language. Please check the following code in a very basic way, as it is submitted by a beginner-level coder. Provide simple and clear feedback, focusing on fundamental concepts. If the answer is correct, do not mention any errors, mistakes, or issues."
                },
                { role: "user", content: `Question: ${question}\nAnswer: ${answer}` }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;
        let mark = 0;
        let feedbackLine = '';

        const lowerCaseReply = reply.toLowerCase();
        if (lowerCaseReply.includes('incorrect') || lowerCaseReply.includes('error') || lowerCaseReply.includes('mistake') || lowerCaseReply.includes('issue')) {
            mark = 0;
            feedbackLine = `Question ${i + 1}: Incorrect. Feedback: ${reply.replace(/\n/g, '\n ')}`;
        } else if (lowerCaseReply.includes('correct') || lowerCaseReply.includes('right') || lowerCaseReply.includes('good job') || lowerCaseReply.includes('well done')) {
            mark = 1;
            feedbackLine = `Question ${i + 1}: Correct. Feedback: ${reply.replace(/\n/g, '\n ')}`;
        } else {
            // Default to 0 if we cannot determine correctness explicitly
            mark = 0;
            feedbackLine = `Question ${i + 1}: Cannot determine correctness. Feedback: ${reply.replace(/\n/g, '\n ')}`;
        }

        marks.push(mark);
        feedbacks.push(feedbackLine);
    }

    const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);

    res.json({
        questions: questions,
        answers: answers,
        marks: marks,
        feedbacks: feedbacks,
        totalMarks: totalMarks
    });
};

module.exports.upload = upload;
