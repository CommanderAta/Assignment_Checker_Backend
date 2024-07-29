const Course = require('../models/courseModel');

const createCourse = async (req, res) => {
    const { name, briefDescription, courseDescription, outline, learningOutcomes, type } = req.body;
    const professorId = req.user.userId;

    try {
        const courseId = await generateCourseId(name);
        const newCourse = new Course({
            name,
            professor: professorId,
            courseId,
            briefDescription,
            courseDescription,
            outline,
            learningOutcomes,
            type
        });
        await newCourse.save();

        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Error creating course' });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ professor: req.user.userId });
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
};

const getCourseById = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId).populate('professor', 'username');
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ error: 'Error fetching course details' });
    }
};

const generateCourseId = async (name) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const courses = await Course.find({ name: new RegExp(`^${prefix}`) }).sort({ courseId: -1 }).limit(1);
    let courseId = 100;
    if (courses.length > 0) {
        const lastCourseId = parseInt(courses[0].courseId.substring(3));
        courseId = lastCourseId + 1;
    }
    return `${prefix}${courseId}`;
};

module.exports = { createCourse, getCourses, getCourseById };
