const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const { store } = require('../data/store');

const jwtSecret = process.env.JWT_SECRET || 'local-development-secret';

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, jwtSecret, { expiresIn: '7d' });
}

async function signup(req, res) {
  const { name, email, password, role = 'tourist' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  if (!['tourist', 'guide'].includes(role)) {
    return res.status(400).json({ message: 'Invalid account type.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (store.users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ message: 'Email already in use.' });
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10),
    role,
    savedPlaces: []
  };

  store.users.push(user);

  return res.status(201).json({
    token: makeToken(user),
    role: user.role,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = store.users.find((candidate) => candidate.email === normalizedEmail);

  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json({
    token: makeToken(user),
    role: user.role,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}

function forgotPassword(req, res) {
  return res.json({ message: 'If an account exists, a reset link will be sent shortly.' });
}

function getMe(req, res) {
  return res.json({ user: req.user });
}

module.exports = { signup, login, forgotPassword, getMe }; 
