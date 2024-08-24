import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateTokenAndSetCookie = (userId, res) => {
    const payload = {
        userId,
        iat: Math.floor(Date.now() / 1000), 
        nonce: crypto.randomBytes(16).toString('hex'), 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15d', 
        algorithm: 'HS256', 
    });

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
    });
};

