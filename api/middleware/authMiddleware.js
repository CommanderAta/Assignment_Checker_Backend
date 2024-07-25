const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

const professorMiddleware = (req, res, next) => {
    if (req.user.role !== 'professor') {
        return res.status(403).send('Access forbidden: Professors only');
    }
    next();
};

module.exports = { authMiddleware, professorMiddleware };
