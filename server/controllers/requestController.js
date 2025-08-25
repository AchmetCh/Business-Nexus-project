const Request = require('../models/Request');

// Send collaboration request
exports.sendRequest = async (req, res) => {
  try {
    const { entrepreneurId, message } = req.body;
    const investorId = req.user.userId;

    // Check if request already exists
    const existingRequest = await Request.findOne({
      investorId,
      entrepreneurId
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const request = new Request({
      investorId,
      entrepreneurId,
      message
    });

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('investorId', 'name email')
      .populate('entrepreneurId', 'name email');

    res.status(201).json({
      message: 'Request sent successfully',
      request: populatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's requests
exports.getRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let requests;
    if (userRole === 'investor') {
      // Get requests sent by investor
      requests = await Request.find({ investorId: userId })
        .populate('entrepreneurId', 'name email startup')
        .sort({ createdAt: -1 });
    } else {
      // Get requests received by entrepreneur
      requests = await Request.find({ entrepreneurId: userId })
        .populate('investorId', 'name email investmentInterests')
        .sort({ createdAt: -1 });
    }

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only entrepreneur can update status
    if (request.entrepreneurId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('investorId', 'name email')
      .populate('entrepreneurId', 'name email');

    res.json({
      message: 'Request status updated',
      request: populatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};