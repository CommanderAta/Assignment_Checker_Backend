const Submission = require('../models/submissionModel');
const Assessment = require('../models/assessmentModel');

const submitSubmission = async (req, res) => {
    const { content, assessmentId } = req.body;
    const studentId = req.user.userId;

    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        const newSubmission = new Submission({ content, student: studentId, assessment: assessmentId });
        await newSubmission.save();

        res.status(201).json({ message: 'Submission created successfully', submission: newSubmission });
    } catch (error) {
        console.error('Error creating submission:', error);
        res.status(500).json({ error: 'Error creating submission' });
    }
};

const getSubmissions = async (req, res) => {
    const { assessmentId } = req.params;

    try {
        const submissions = await Submission.find({ assessment: assessmentId }).populate('student', 'username');
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Error fetching submissions' });
    }
};

module.exports = { submitSubmission, getSubmissions };
