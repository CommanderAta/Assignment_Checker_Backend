const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['professor', 'student'], required: true },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]  // Enrolled courses for students
});

const User = mongoose.model('User', userSchema);

module.exports = User;
