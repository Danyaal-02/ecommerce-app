import Session from '../models/Session.js';

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate('user', 'email');
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ loginTime: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};