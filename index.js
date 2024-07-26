require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./api/db');
const promptRoutes = require('./api/routes/promptRoutes');
const userRoutes = require('./api/routes/userRoutes');
const courseRoutes = require('./api/routes/courseRoutes');
const assessmentRoutes = require('./api/routes/assessmentRoutes');
const submissionRoutes = require('./api/routes/submissionRoutes');

const app = express();
const port = process.env.PORT || 3000;

db.connect(); // Initialize MongoDB connection

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

app.use('/chat', promptRoutes);
app.use('/user', userRoutes);
app.use('/courses', courseRoutes);
app.use('/assessments', assessmentRoutes);
app.use('/submissions', submissionRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use((req, res) => {
    console.log(`404 Not Found: ${req.url}`);
    res.status(404).send('Not Found');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
