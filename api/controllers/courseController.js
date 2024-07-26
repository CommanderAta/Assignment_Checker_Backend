const Course = require('../models/courseModel');

const createCourse = async (req, res) => {
    const { name } = req.body;
    const professorId = req.user.userId;

    try {
        const newCourse = new Course({ name, professor: professorId });
        await newCourse.save();

        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Error creating course' });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
};

module.exports = { createCourse, getCourses };
