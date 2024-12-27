const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        minlength: 10
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        required: true,
        trim: true
    },
    readTime: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['taslak', 'yayında', 'arşivde'],
        default: 'taslak'
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Okuma süresi hesaplama
BlogSchema.methods.calculateReadTime = function() {
    const wordsPerMinute = 200;
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
};

// Kaydetmeden önce okuma süresini hesapla
BlogSchema.pre('save', function(next) {
    this.calculateReadTime();
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Blog', BlogSchema);
