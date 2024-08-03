import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date },
  lastActivity: { type: Date, default: Date.now },
  ipAddress: { type: String, required: true },
});

export default mongoose.model('Session', sessionSchema);