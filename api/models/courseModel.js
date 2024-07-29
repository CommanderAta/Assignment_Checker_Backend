const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    name: { type: String, required: true },
    professor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: String, unique: true },
    briefDescription: { type: String, required: true },
    courseDescription: { type: String, required: true },
    outline: { type: String, required: true },
    learningOutcomes: { type: String, required: true },
    type: { type: String, enum: ['open', 'restricted'], required: true }  // open or restricted enrollment
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
