import Chart from '../models/Chart.model.js';
import File from '../models/File.model.js';

// @desc    Generate chart data
// @route   POST /api/charts/generate
// @access  Private
export const generateChart = async (req, res) => {
  try {
    const { fileId, chartType, xAxis, yAxis, zAxis, aggregation, title, description } = req.body;

    // Validation
    if (!fileId || !chartType || !xAxis || !yAxis) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fileId, chartType, xAxis, and yAxis'
      });
    }

    // Get file and verify ownership
    const file = await File.findOne({
      _id: fileId,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify axes exist in data
    if (!file.headers.includes(xAxis) || !file.headers.includes(yAxis)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid axis selection'
      });
    }

    // For 3D charts, verify Z-axis
    if ((chartType === 'scatter3d' || chartType === 'bar3d') && (!zAxis || !file.headers.includes(zAxis))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Z-axis selection for 3D chart'
      });
    }

    // Process data based on chart type and aggregation
    const chartData = processChartData(file.parsedData, xAxis, yAxis, zAxis, aggregation, chartType);

    // Create chart record
    const chart = await Chart.create({
      userId: req.user.id,
      fileId: fileId,
      chartType,
      chartConfig: {
        xAxis,
        yAxis,
        zAxis,
        aggregation: aggregation || 'none'
      },
      chartData,
      title: title || `${yAxis} vs ${xAxis}`,
      description: description || ''
    });

    // Add chart reference to file
    file.charts.push(chart._id);
    await file.save();

    res.status(201).json({
      success: true,
      message: 'Chart generated successfully',
      data: chart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating chart'
    });
  }
};

// Helper function to process chart data
function processChartData(data, xAxis, yAxis, zAxis, aggregation, chartType) {
  // Handle 3D charts (Plotly format)
  if (chartType === 'scatter3d') {
    const xValues = data.map(row => parseFloat(row[xAxis]) || row[xAxis]);
    const yValues = data.map(row => parseFloat(row[yAxis]) || 0);
    const zValues = data.map(row => parseFloat(row[zAxis]) || 0);

    return {
      data: [{
        type: 'scatter3d',
        mode: 'markers',
        x: xValues,
        y: yValues,
        z: zValues,
        marker: {
          size: 5,
          color: zValues,
          colorscale: 'Viridis',
          showscale: true
        },
        text: data.map((row, i) => `${xAxis}: ${xValues[i]}<br>${yAxis}: ${yValues[i]}<br>${zAxis}: ${zValues[i]}`),
      }],
      layout: {
        scene: {
          xaxis: { title: xAxis },
          yaxis: { title: yAxis },
          zaxis: { title: zAxis }
        },
        title: `3D Scatter: ${xAxis} vs ${yAxis} vs ${zAxis}`
      }
    };
  }

  if (chartType === 'bar3d') {
    const xValues = data.map(row => parseFloat(row[xAxis]) || row[xAxis]);
    const yValues = data.map(row => parseFloat(row[yAxis]) || row[yAxis]);
    const zValues = data.map(row => parseFloat(row[zAxis]) || 0);

    return {
      data: [{
        type: 'scatter3d',
        mode: 'markers',
        x: xValues,
        y: yValues,
        z: zValues,
        marker: {
          size: 8,
          color: zValues,
          colorscale: 'Portland',
          showscale: true,
          line: {
            color: 'white',
            width: 0.5
          }
        },
        text: data.map((row, i) => `${xAxis}: ${xValues[i]}<br>${yAxis}: ${yValues[i]}<br>${zAxis}: ${zValues[i]}`),
      }],
      layout: {
        scene: {
          xaxis: { title: xAxis },
          yaxis: { title: yAxis },
          zaxis: { title: zAxis }
        },
        title: `3D Bar: ${xAxis} vs ${yAxis} vs ${zAxis}`
      }
    };
  }

  // Handle 2D charts (Chart.js format)
  if (aggregation === 'none' || !aggregation) {
    // Simple mapping for scatter, line charts
    const labels = data.map(row => row[xAxis]);
    const values = data.map(row => parseFloat(row[yAxis]) || 0);

    return {
      labels,
      datasets: [{
        label: yAxis,
        data: values,
        backgroundColor: generateColors(1)[0],
        borderColor: generateColors(1)[0],
      }]
    };
  }

  // Aggregation logic
  const grouped = {};
  
  data.forEach(row => {
    const key = row[xAxis];
    const value = parseFloat(row[yAxis]) || 0;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(value);
  });

  const labels = Object.keys(grouped);
  const values = labels.map(label => {
    const arr = grouped[label];
    
    switch (aggregation) {
      case 'sum':
        return arr.reduce((a, b) => a + b, 0);
      case 'avg':
        return arr.reduce((a, b) => a + b, 0) / arr.length;
      case 'count':
        return arr.length;
      case 'min':
        return Math.min(...arr);
      case 'max':
        return Math.max(...arr);
      default:
        return arr[0];
    }
  });

  const colors = generateColors(labels.length);

  return {
    labels,
    datasets: [{
      label: yAxis,
      data: values,
      backgroundColor: chartType === 'pie' || chartType === 'doughnut' ? colors : colors[0],
      borderColor: chartType === 'pie' || chartType === 'doughnut' ? colors : colors[0],
    }]
  };
}

// Generate colors for charts
function generateColors(count) {
  const colors = [
    'rgba(99, 102, 241, 0.8)',   // Indigo
    'rgba(168, 85, 247, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(251, 146, 60, 0.8)',   // Orange
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(249, 115, 22, 0.8)',   // Orange
    'rgba(20, 184, 166, 0.8)',   // Teal
    'rgba(244, 63, 94, 0.8)',    // Rose
    'rgba(132, 204, 22, 0.8)',   // Lime
  ];

  if (count <= colors.length) {
    return colors.slice(0, count);
  }

  // Generate more colors if needed
  const extraColors = [];
  for (let i = colors.length; i < count; i++) {
    const hue = (i * 137.5) % 360; // Golden angle
    extraColors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
  }

  return [...colors, ...extraColors];
}

// @desc    Get all charts for user
// @route   GET /api/charts
// @access  Private
export const getUserCharts = async (req, res) => {
  try {
    const charts = await Chart.find({ userId: req.user.id })
      .populate('fileId', 'originalName createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: charts.length,
      data: charts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching charts'
    });
  }
};

// @desc    Get single chart
// @route   GET /api/charts/:id
// @access  Private
export const getChart = async (req, res) => {
  try {
    const chart = await Chart.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('fileId', 'originalName createdAt headers');

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: 'Chart not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching chart'
    });
  }
};

// @desc    Delete chart
// @route   DELETE /api/charts/:id
// @access  Private
export const deleteChart = async (req, res) => {
  try {
    const chart = await Chart.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: 'Chart not found'
      });
    }

    await chart.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Chart deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting chart'
    });
  }
};
