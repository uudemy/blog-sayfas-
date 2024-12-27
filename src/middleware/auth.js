const jwt = require('jsonwebtoken');

// Token doğrulama middleware'i
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ 
            message: 'Yetkilendirme gerekli' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                message: 'Geçersiz token' 
            });
        }

        req.user = user;
        next();
    });
};

// Admin rolü kontrolü
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: 'Bu işlemi gerçekleştirmek için yetkiniz yok' 
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    isAdmin
};
