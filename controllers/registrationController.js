const Registration = require('../models/registrationModel');
const Event = require('../models/eventModel');

exports.registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user.id; // From JWT

    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check capacity
    const currentRegistrations = await Registration.countDocuments({ eventId });
    if (currentRegistrations >= event.capacity) {
      return res.status(400).json({ message: 'Registration failed: Event has reached maximum capacity' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({ studentId, eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    const registration = new Registration({ studentId, eventId });
    await registration.save();

    res.status(201).json({ message: 'Successfully registered for the event', registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.unregisterEvent = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const studentId = req.user.id; // From JWT

    const registration = await Registration.findById(registrationId);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if the student owns this registration
    if (registration.studentId !== studentId) {
      return res.status(403).json({ message: 'Access denied: You can only cancel your own registration' });
    }

    await Registration.findByIdAndDelete(registrationId);

    res.json({ message: 'Successfully unregistered from the event' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.listRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const registrations = await Registration.find()
      .skip(skip)
      .limit(limit)
      .sort({ registrationDate: -1 });

    const total = await Registration.countDocuments();

    if (registrations.length === 0) {
      return res.json({ message: 'No student has registered for any event yet', data: [], total: 0, page, totalPages: 0 });
    }

    res.json({
      data: registrations,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRegistrationsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide startDate and endDate' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ message: 'registrationDate start must be earlier than registrationDate end' });
    }

    const registrations = await Registration.find({
      registrationDate: {
        $gte: start,
        $lte: end
      }
    });

    if (registrations.length === 0) {
      return res.json({ message: 'No registrations found in the specified date range', data: [] });
    }

    res.json({ data: registrations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
