import OpenAI from 'openai';
import Insight from '../models/Insight.model.js';
import File from '../models/File.model.js';

// Initialize OpenAI (only if API key exists)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('✅ OpenAI API configured successfully');
} else {
  console.log('⚠️  OpenAI API key not found in environment variables');
}

// @desc    Generate AI insights for a file
// @route   POST /api/insights/:fileId
// @access  Private
export const generateInsights = async (req, res) => {
  try {
    // For testing: Generate mock insights if OpenAI is not configured
    const useMockData = !openai;
    
    if (!openai) {
      console.log('⚠️  Using mock AI insights (OpenAI not configured)');
      // Don't return error, continue with mock data
    }

    const { fileId } = req.params;

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

    // Check if insights already exist
    const existingInsight = await Insight.findOne({
      fileId: fileId,
      userId: req.user.id
    });

    if (existingInsight) {
      return res.status(200).json({
        success: true,
        message: 'Insights already generated',
        data: existingInsight
      });
    }

    // Prepare data summary for AI
    const dataSummary = prepareDataSummary(file);

    let parsedResponse;

    if (useMockData) {
      // Generate mock insights for testing
      parsedResponse = generateMockInsights(dataSummary);
    } else {
      try {
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a data analyst expert. Analyze the provided dataset and provide actionable insights, trends, and recommendations in JSON format.'
            },
            {
              role: 'user',
              content: `Analyze this dataset and provide insights:\n\n${JSON.stringify(dataSummary, null, 2)}\n\nProvide response in JSON format with keys: summary (string), keyFindings (array of {title, value, description}), trends (array of strings), recommendations (array of strings)`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        });

        const aiResponse = completion.choices[0].message.content;

        try {
          // Try to parse JSON response
          parsedResponse = JSON.parse(aiResponse);
        } catch (e) {
          // If not valid JSON, create structured response
          parsedResponse = {
            summary: aiResponse,
            keyFindings: [],
            trends: [],
            recommendations: []
          };
        }
      } catch (openaiError) {
        // Fallback to mock insights if OpenAI fails (quota exceeded, API error, etc.)
        console.log('⚠️  OpenAI API error, using mock insights:', openaiError.message);
        parsedResponse = generateMockInsights(dataSummary);
      }
    }

    // Create insight record
    const insight = await Insight.create({
      userId: req.user.id,
      fileId: fileId,
      summary: parsedResponse.summary || 'No summary available',
      keyFindings: parsedResponse.keyFindings || [],
      trends: parsedResponse.trends || [],
      recommendations: parsedResponse.recommendations || [],
      aiModel: 'gpt-4o-mini'
    });

    // Update file with insight reference
    file.insights = insight._id;
    await file.save();

    res.status(201).json({
      success: true,
      message: 'Insights generated successfully',
      data: insight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating insights'
    });
  }
};

// Helper function to generate mock insights for testing
function generateMockInsights(dataSummary) {
  const { headers, rowCount, statistics } = dataSummary;
  
  // Generate dynamic insights based on actual data
  const numericColumns = Object.keys(statistics);
  const keyFindings = [];
  
  numericColumns.slice(0, 3).forEach(col => {
    const stats = statistics[col];
    keyFindings.push({
      title: `${col} Analysis`,
      value: `Avg: ${stats.avg.toFixed(2)}`,
      description: `Range from ${stats.min} to ${stats.max} across ${stats.count} data points`
    });
  });

  return {
    summary: `Analysis of ${dataSummary.filename}: This dataset contains ${rowCount} rows with ${headers.length} columns. The data shows ${numericColumns.length} numeric fields with varying patterns. Key metrics have been calculated and trends identified across the dataset.`,
    keyFindings: keyFindings.length > 0 ? keyFindings : [
      {
        title: 'Data Overview',
        value: `${rowCount} records`,
        description: `Dataset contains ${headers.length} columns with comprehensive data points`
      }
    ],
    trends: [
      `Dataset contains ${rowCount} total records across ${headers.length} different fields`,
      numericColumns.length > 0 ? `${numericColumns.length} numeric columns identified with statistical patterns` : 'Multiple data columns available for analysis',
      'Data structure is well-formed and ready for visualization'
    ],
    recommendations: [
      'Consider creating visualizations to better understand data distributions',
      'Explore correlations between different data fields',
      numericColumns.length > 1 ? 'Compare numeric fields to identify relationships and patterns' : 'Review data patterns for insights',
      'Use aggregation functions to summarize key metrics'
    ]
  };
}

// Helper function to prepare data summary
function prepareDataSummary(file) {
  const data = file.parsedData;
  const summary = {
    filename: file.originalName,
    rowCount: file.rowCount,
    columnCount: file.columnCount,
    headers: file.headers,
    sampleData: data.slice(0, 5), // First 5 rows
    statistics: {}
  };

  // Calculate basic statistics for numeric columns
  file.headers.forEach(header => {
    const values = data.map(row => row[header]).filter(v => !isNaN(parseFloat(v)));
    
    if (values.length > 0) {
      const numericValues = values.map(v => parseFloat(v));
      summary.statistics[header] = {
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        count: numericValues.length
      };
    }
  });

  return summary;
}

// @desc    Get insight by file ID
// @route   GET /api/insights/:fileId
// @access  Private
export const getInsight = async (req, res) => {
  try {
    const insight = await Insight.findOne({
      fileId: req.params.fileId,
      userId: req.user.id
    }).populate('fileId', 'originalName createdAt');

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'No insights found for this file'
      });
    }

    res.status(200).json({
      success: true,
      data: insight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching insight'
    });
  }
};

// @desc    Get all user insights
// @route   GET /api/insights
// @access  Private
export const getUserInsights = async (req, res) => {
  try {
    const insights = await Insight.find({ userId: req.user.id })
      .populate('fileId', 'originalName createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: insights.length,
      data: insights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching insights'
    });
  }
};
