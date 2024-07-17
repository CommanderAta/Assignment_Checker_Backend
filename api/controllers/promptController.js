const axios = require('axios');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

exports.prompt = async (req, res) => {
    const userMessage = req.body.message;
    let questions = [];
    let answers = [];

    if (!userMessage) {
        console.error('Message field is required');
        return res.status(400).json({ error: 'Message field is required' });
    }

    if (req.files) {
        req.files.forEach(file => {
            const fileContent = file.buffer.toString('utf-8');
            const lines = fileContent.split('\n');
            let currentQuestion = '';
            let currentAnswer = '';

            lines.forEach(line => {
                if (line.startsWith('# QUESTION')) {
                    if (currentQuestion && currentAnswer) {
                        questions.push(currentQuestion.trim());
                        answers.push(currentAnswer.trim());
                    }
                    currentQuestion = line.replace('# QUESTION', '').trim();
                    currentAnswer = '';
                } else if (line.startsWith('# ANSWER')) {
                    currentAnswer += line.replace('# ANSWER', '').trim() + '\n';
                } else {
                    currentAnswer += line + '\n';
                }
            });

            if (currentQuestion && currentAnswer) {
                questions.push(currentQuestion.trim());
                answers.push(currentAnswer.trim());
            }
        });
    }

    let marks = [];
    let feedbacks = [];
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const answer = answers[i];
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: "system", content: "You are an expert assistant in the R programming language, specializing in checking and grading assignments. You provide detailed feedback on incorrect solutions and mark assignments out of 10 as fast as possible." },
                { role: "user", content: `Question: ${question}\nAnswer: ${answer}` }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;
        const mark = reply.includes('correct') ? 1 : 0;
        marks.push(mark);
        feedbacks.push(reply);
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
