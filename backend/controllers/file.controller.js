import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import File from '../models/File.model.js';

// @desc    Upload and parse Excel file
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Read the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Parse to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: null });
    
    if (jsonData.length === 0) {
      // Clean up file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Excel file is empty'
      });
    }

    // Extract headers
    const headers = Object.keys(jsonData[0] || {});

    // Create file record in database
    const fileRecord = await File.create({
      userId: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      filePath: req.file.path,
      parsedData: jsonData,
      headers: headers,
      rowCount: jsonData.length,
      columnCount: headers.length,
      metadata: {
        sheetName,
        uploadDate: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded and parsed successfully',
      data: {
        fileId: fileRecord._id,
        filename: fileRecord.originalName,
        rowCount: fileRecord.rowCount,
        columnCount: fileRecord.columnCount,
        headers: fileRecord.headers,
        preview: jsonData.slice(0, 10), // First 10 rows as preview
        createdAt: fileRecord.createdAt
      }
    });
  } catch (error) {
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading file'
    });
  }
};

// @desc    Get all user files
// @route   GET /api/files
// @access  Private
export const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id })
      .select('-parsedData') // Exclude large parsed data
      .populate('charts', 'chartType title thumbnail createdAt')
      .populate('insights', 'summary generatedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching files'
    });
  }
};

// @desc    Get single file with data
// @route   GET /api/files/:id
// @access  Private
export const getFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id
    })
      .populate('charts', 'chartType title thumbnail createdAt')
      .populate('insights', 'summary keyFindings generatedAt');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching file'
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete physical file
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Delete from database
    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting file'
    });
  }
};

// @desc    Get file statistics
// @route   GET /api/files/stats/summary
// @access  Private
export const getFileStats = async (req, res) => {
  try {
    const totalFiles = await File.countDocuments({ userId: req.user.id });
    
    const recentFile = await File.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('originalName createdAt');

    const totalSize = await File.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: null, total: { $sum: '$fileSize' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFiles,
        recentFile,
        totalSize: totalSize.length > 0 ? totalSize[0].total : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching statistics'
    });
  }
};
