const mongoose = require('mongoose');
const { Schema } = mongoose;

const assessmentSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
