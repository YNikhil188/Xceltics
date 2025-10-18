import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  keyFindings: [{
    title: String,
    value: String,
    description: String
  }],
  trends: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  aiModel: {
    type: String,
    default: 'gpt-4'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
insightSchema.index({ userId: 1, fileId: 1 });

const Insight = mongoose.model('Insight', insightSchema);

export default Insight;
