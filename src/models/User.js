const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    salt: {
        type: String,
        default: () => crypto.randomBytes(16).toString('hex')
    },
    profilePicture: {
        type: String,
        default: '/images/default-avatar.png'
    },
    bio: {
        type: String,
        maxlength: 500
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Mongoose hook'larını etkinleştir
    timestamps: true
});

// Şifre hashleme
UserSchema.pre('save', function(next) {
    // Sadece şifre değiştiğinde hash'le
    if (this.isModified('password')) {
        console.log('Şifre hash\'leniyor', {
            username: this.username,
            salt: this.salt
        });

        this.password = crypto.pbkdf2Sync(
            this.password, 
            this.salt, 
            1000, 
            64, 
            'sha512'
        ).toString('hex');
    }
    
    next();
});

// Şifre doğrulama
UserSchema.methods.comparePassword = function(candidatePassword) {
    const hashedPassword = crypto.pbkdf2Sync(
        candidatePassword, 
        this.salt, 
        1000, 
        64, 
        'sha512'
    ).toString('hex');
    
    return this.password === hashedPassword;
};

module.exports = mongoose.model('User', UserSchema);
