const mongoose = require('mongoose');

const atsResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobDescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescription', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
    resumeSnapshot: { type: String }, // plain-text resume content used for this scoring run
    computedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

atsResultSchema.index({ userId: 1, computedAt: -1 });

module.exports = mongoose.model('ATSResult', atsResultSchema);
