const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
    content: { type: String, required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
