const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Kayıt Olma
router.post('/register', async (req, res) => {
    console.log('Kayıt İsteği Alındı:', req.body);

    try {
        const { username, email, password } = req.body;

        // Gelen verilerin kontrolü
        if (!username || !email || !password) {
            console.error('Eksik kullanıcı bilgileri:', req.body);
            return res.redirect('/register?error=' + encodeURIComponent('Tüm alanları doldurunuz'));
        }

        // Kullanıcı zaten var mı?
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            console.warn('Mevcut kullanıcı:', existingUser);
            return res.redirect('/register?error=' + encodeURIComponent('Kullanıcı zaten mevcut'));
        }

        // Yeni kullanıcı oluştur
        const newUser = new User({
            username,
            email,
            password
        });

        try {
            const savedUser = await newUser.save();
            console.log('Kullanıcı başarıyla kaydedildi:', savedUser);

            return res.redirect('/login?message=' + encodeURIComponent('Kayıt başarılı. Giriş yapabilirsiniz.'));

        } catch (saveError) {
            console.error('Kullanıcı Kaydetme Hatası:', saveError);
            
            // Detaylı hata mesajı
            const errorMessage = saveError.errors 
                ? Object.values(saveError.errors).map(err => err.message).join(', ')
                : 'Kayıt sırasında hata oluştu';

            return res.redirect('/register?error=' + encodeURIComponent(errorMessage));
        }

    } catch (error) {
        console.error('Kayıt hatası:', error);
        
        return res.redirect('/register?error=' + encodeURIComponent('Sunucu hatası'));
    }
});

// Giriş Yapma
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ 
                message: 'Geçersiz kimlik bilgileri' 
            });
        }

        // Şifre kontrolü
        const isMatch = user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Geçersiz kimlik bilgileri' 
            });
        }

        // JWT Token oluştur
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            } 
        });

    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ 
            message: 'Sunucu hatası', 
            error: error.message 
        });
    }
});

module.exports = router;
