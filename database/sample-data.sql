-- Örnek kategoriler
INSERT INTO categories (name, slug) VALUES 
('Teknoloji', 'teknoloji'),
('Yaşam', 'yasam'),
('Bilim', 'bilim'),
('Seyahat', 'seyahat'),
('Eğitim', 'egitim'),
('Yazılım', 'yazilim'),
('Donanım', 'donanim'),
('Yapay Zeka', 'yapay-zeka')
ON CONFLICT (slug) DO NOTHING;

-- Örnek kullanıcı (şifre: admin123)
INSERT INTO users (username, password, email, full_name, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'Admin User', 'admin'),
('user1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user1@example.com', 'User One', 'user'),
('user2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user2@example.com', 'User Two', 'user')
ON CONFLICT (username) DO NOTHING;

-- Örnek blog yazıları
INSERT INTO posts (title, slug, content, status, user_id, category_id) VALUES 
('Modern Web Teknolojileri', 'modern-web-teknolojileri', 'Bu yazıda modern web teknolojilerini inceliyoruz...', 'published', 1, 1),       
('Yaşam Tarzı Değişiklikleri', 'yasam-tarzi-degisiklikleri', 'Hayatınızı değiştirecek 10 yaşam tarzı değişikliği...', 'published', 2, 2),
('Bilim ve Teknoloji', 'bilim-ve-teknoloji', 'Bilim ve teknolojinin kesişim noktaları...', 'published', 1, 3),
('Seyahat Rehberi', 'seyahat-rehberi', 'Dünyanın en güzel seyahat noktaları...', 'published', 2, 4),
('Eğitimde Yeni Yaklaşımlar', 'egitimde-yeni-yaklasimlar', 'Eğitimde yenilikçi yaklaşımlar ve yöntemler...', 'draft', 1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Örnek etiketler
INSERT INTO tags (name, slug) VALUES 
('Programlama', 'programlama'),
('Python', 'python'),
('JavaScript', 'javascript'),
('Web Tasarım', 'web-tasarim'),
('SEO', 'seo'),
('Laravel', 'laravel')
ON CONFLICT (slug) DO NOTHING;

-- Post-Tag ilişkileri
INSERT INTO post_tags (post_id, tag_id) VALUES 
(1, 1), -- Programlama
(1, 2), -- Python
(2, 3), -- JavaScript
(3, 4), -- Web Tasarım
(3, 5), -- SEO
(4, 6) -- Laravel
ON CONFLICT (post_id, tag_id) DO NOTHING;

-- Örnek yazılar için meta veriler güncelleme
UPDATE posts SET 
    excerpt = 'Programlama dünyasına giriş...',
    meta_title = 'Modern Web Teknolojileri 2024',
    meta_description = 'Programlamaya başlamak isteyenler için kapsamlı rehber',
    reading_time = 8,
    is_featured = TRUE,
    view_count = 156
WHERE slug = 'modern-web-teknolojileri';

UPDATE posts SET 
    excerpt = 'Hayatınızı değiştirecek 10 yaşam tarzı değişikliği...',
    meta_title = 'Yaşam Tarzı Değişiklikleri',
    meta_description = 'Yaşam kalitesini artıracak pratik öneriler',
    reading_time = 5,
    is_featured = FALSE,
    view_count = 45
WHERE slug = 'yasam-tarzi-degisiklikleri';

UPDATE posts SET 
    excerpt = 'Bilim ve teknoloji hakkında daha fazla yazı bekliyorum.',
    meta_title = 'Bilim ve Teknoloji',
    meta_description = 'Bilim ve teknolojinin son gelişmeleri',
    reading_time = 6,
    is_featured = FALSE,
    view_count = 78
WHERE slug = 'bilim-ve-teknoloji';

-- Örnek yorumlar
INSERT INTO comments (content, post_id, user_id, author_name, author_email, status) VALUES 
('Bu yazı çok bilgilendirici, teşekkürler!', 1, NULL, 'Misafir', 'misafir@example.com', 'approved'),
('Yazı çok güzel ama daha fazla örnek eklenebilir.', 2, NULL, 'Misafir', 'misafir2@example.com', 'pending'),
('Bilim ve teknoloji hakkında daha fazla yazı bekliyorum.', 3, 1, NULL, NULL, 'approved'),
('Seyahat önerileri harika, teşekkürler!', 4, 2, NULL, NULL, 'approved'),
('Eğitimde yeni yaklaşımlar hakkında daha fazla bilgi verir misiniz?', 5, NULL, 'Misafir', 'misafir3@example.com', 'pending')