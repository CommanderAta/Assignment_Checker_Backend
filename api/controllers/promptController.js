const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

exports.prompt = async (req, res) => {
    const userMessage = req.body.message;
    let fileContent = '';

    if (!userMessage) {
        return res.status(400).json({ error: 'Message field is required' });
    }

    if (req.file) {
        const filePath = path.join(__dirname, '../../', req.file.path);
        fileContent = fs.readFileSync(filePath, 'utf-8');
        fs.unlinkSync(filePath);  // Remove the file after reading
    }

    const messages = [
        { role: "system", content: "You are an intelligent assistant." },
        { role: "user", content: userMessage }
    ];

    if (fileContent) {
        messages.push({ role: "user", content: fileContent });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: messages
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;
        res.json({ reply: reply });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to communicate with OpenAI API' });
    }
};

module.exports.upload = upload;
