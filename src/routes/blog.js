const express = require('express');
const Blog = require('../models/Blog');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Blog Oluşturma
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { title, content, tags, category } = req.body;

        const blog = new Blog({
            title,
            content,
            author: req.user.id,
            tags,
            category
        });

        await blog.save();

        res.status(201).json({ 
            message: 'Blog yazısı oluşturuldu', 
            blogId: blog._id 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Blog yazısı oluşturulurken hata oluştu', 
            error: error.message 
        });
    }
});

// Blog Listeleme
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag } = req.query;

        const query = {};
        if (category) query.category = category;
        if (tag) query.tags = tag;

        const blogs = await Blog.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Blog yazıları listelenemedi', 
            error: error.message 
        });
    }
});

module.exports = router;
