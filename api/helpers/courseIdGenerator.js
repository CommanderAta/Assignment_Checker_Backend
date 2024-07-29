const Course = require('../models/courseModel');

const generateCourseId = async (courseName) => {
    const prefix = courseName.substring(0, 3).toUpperCase();
    const courses = await Course.find({ name: new RegExp(`^${prefix}`, 'i') }).sort({ courseId: -1 });
    
    let nextIdNumber = 100;
    if (courses.length > 0) {
        const lastCourse = courses[0];
        const lastIdNumber = parseInt(lastCourse.courseId.slice(3));
        nextIdNumber = lastIdNumber + 1;
    }

    return `${prefix}${nextIdNumber}`;
};

module.exports = generateCourseId;
