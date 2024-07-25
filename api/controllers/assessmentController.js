const Assessment = require('../models/assessmentModel');
const Course = require('../models/courseModel');

const createAssessment = async (req, res) => {
    const { title, content, courseId } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const newAssessment = new Assessment({ title, content, course: courseId });
        await newAssessment.save();

        res.status(201).json({ message: 'Assessment created successfully', assessment: newAssessment });
    } catch (error) {
        console.error('Error creating assessment:', error);
        res.status(500).json({ error: 'Error creating assessment' });
    }
};

const getAssessments = async (req, res) => {
    const { courseId } = req.params;

    try {
        const assessments = await Assessment.find({ course: courseId });
        res.status(200).json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({ error: 'Error fetching assessments' });
    }
};

module.exports = { createAssessment, getAssessments };
