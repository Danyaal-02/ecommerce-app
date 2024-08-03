import supabase from '../config/supabase.js';
import User from '../models/User.js';
import Session from '../models/Session.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (role !== 'user' && role !== 'admin') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw error;
    
    const newUser = new User({
      name: name,
      email: email,
      supabaseId: data.user.id,
      role: role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;

    const dbUser = await User.findOne({ supabaseId: data.user.id });
    
    const session = new Session({
      userId: dbUser._id,
      ipAddress: req.ip,
    });

    await session.save();

    res.status(200).json({ 
      message: 'Login successful', 
      userId: dbUser._id,
      sessionId: session._id,
      token: data.session.access_token,
      userRole: dbUser.role,
      userName: dbUser.name
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { session } = req;

    session.logoutTime = new Date();
    await session.save();

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'An error occurred during logout' });
  }
};