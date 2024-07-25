const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    name: { type: String, required: true },
    professor: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
