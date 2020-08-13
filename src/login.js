/* src/resolvers.js */
import jwt from 'jsonwebtoken';

const unauthorized = (res) => {
  res.status(401).json({ message: 'unauthorized' });
};

const badRequest = (res, message) => {
  res.status(400).json({ message });
};

const validate = (req) => {
  const { username, password } = req.body;
  if (!username) {
    badRequest('missing username');
  }

  if (!password) {
    badRequest('missing password');
  }
};

const login = (req, res) => {
  const { username, password } = req.body;
  validate(req, res);

  if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET);
    res.json({
      token,
    });
  } else {
    unauthorized(res);
  }
};

const verifyJwt = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    unauthorized(res);
  } else {
    next();
  }
};

export { login, verifyJwt };
