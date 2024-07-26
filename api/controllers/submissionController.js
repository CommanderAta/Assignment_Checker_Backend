const Submission = require('../models/submissionModel');
const Assessment = require('../models/assessmentModel');

const submitSubmission = async (req, res) => {
    const { content, assessmentId } = req.body;
    const studentId = req.user.userId;

    try {
        const existingSubmission = await Submission.findOne({ assessment: assessmentId, student: studentId });
        if (existingSubmission) {
            return res.status(400).json({ error: 'You have already submitted for this assessment' });
        }

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
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        let submissions;
        if (userRole === 'professor') {
            submissions = await Submission.find({ assessment: assessmentId }).populate('student', 'username');
        } else {
            submissions = await Submission.find({ assessment: assessmentId, student: userId }).populate('student', 'username');
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Error fetching submissions' });
    }
};

// Add this function
const getSubmissionDetails = async (req, res) => {
    const { submissionId } = req.params;

    try {
        const submission = await Submission.findById(submissionId).populate('student', 'username');
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.status(200).json(submission);
    } catch (error) {
        console.error('Error fetching submission details:', error);
        res.status(500).json({ error: 'Error fetching submission details' });
    }
};

module.exports = { submitSubmission, getSubmissions, getSubmissionDetails };
