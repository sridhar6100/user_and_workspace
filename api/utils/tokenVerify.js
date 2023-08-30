const jwt = require('jsonwebtoken');

function verifyToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    return 'Invalid token';
  }
}

module.exports = {
  verifyToken,
};
