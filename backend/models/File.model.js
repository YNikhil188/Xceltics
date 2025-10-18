import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    default: null
  },
  parsedData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  headers: [{
    type: String
  }],
  rowCount: {
    type: Number,
    default: 0
  },
  columnCount: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  charts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chart'
  }],
  insights: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Insight'
  }
}, {
  timestamps: true
});

// Index for faster queries
fileSchema.index({ userId: 1, createdAt: -1 });

const File = mongoose.model('File', fileSchema);

export default File;
