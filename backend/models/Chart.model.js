import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
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
  chartType: {
    type: String,
    enum: ['bar', 'line', 'pie', 'scatter', 'doughnut', 'radar', 'scatter3d', 'bar3d'],
    required: true
  },
  chartConfig: {
    xAxis: {
      type: String,
      required: true
    },
    yAxis: {
      type: String,
      required: true
    },
    zAxis: {
      type: String,
      default: null
    },
    aggregation: {
      type: String,
      enum: ['sum', 'avg', 'count', 'min', 'max', 'none'],
      default: 'none'
    }
  },
  chartData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: 'Untitled Chart'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
chartSchema.index({ userId: 1, fileId: 1, createdAt: -1 });

const Chart = mongoose.model('Chart', chartSchema);

export default Chart;
