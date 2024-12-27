document.addEventListener('DOMContentLoaded', function() {
    // URL'den slug'ı al
    const slug = window.location.pathname.split('/').pop();
    loadPost(slug);
});

async function loadPost(slug) {
    try {
        const response = await fetch(`/api/posts/read_by_slug.php?slug=${slug}`);
        const data = await response.json();
        
        if(data.status === 'success' && data.post) {
            const post = data.post;
            document.title = `${post.title} - Blog`;
            
            const article = document.querySelector('.blog-post');
            article.innerHTML = `
                <header class="mb-4">
                    <h1 class="fw-bold">${post.title}</h1>
                    <div class="text-muted mb-2">
                        <span class="me-2"><i class="fas fa-folder me-1"></i>${post.category_name}</span>
                        <span><i class="fas fa-calendar me-1"></i>${new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                </header>
                <div class="blog-post-content">
                    ${post.content}
                </div>
            `;
        } else {
            document.querySelector('.blog-post').innerHTML = `
                <div class="alert alert-warning">
                    Yazı bulunamadı.
                </div>
            `;
        }
    } catch (error) {
        console.error('Yazı yüklenirken hata:', error);
        document.querySelector('.blog-post').innerHTML = `
            <div class="alert alert-danger">
                Yazı yüklenirken bir hata oluştu.
            </div>
        `;
    }
}

async function loadComments(postId) {
    try {
        const response = await fetch(`/api/comments/read.php?post_id=${postId}`);
        const data = await response.json();
        
        const commentsSection = document.querySelector('.comments-section');
        if(data.status === 'success' && data.comments) {
            commentsSection.innerHTML = `
                <h3 class="mb-4">Yorumlar (${data.comments.length})</h3>
                <div class="comments-list mb-4">
                    ${data.comments.map(comment => `
                        <div class="comment border-bottom pb-3 mb-3">
                            <div class="d-flex justify-content-between">
                                <h6 class="mb-1">${comment.author_name || 'Misafir'}</h6>
                                <small class="text-muted">${new Date(comment.created_at).toLocaleDateString('tr-TR')}</small>
                            </div>
                            <p class="mb-0">${comment.content}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Yorum formu ekle
        commentsSection.innerHTML += `
            <div class="comment-form">
                <h4>Yorum Yap</h4>
                <form id="commentForm" class="mt-3">
                    <input type="hidden" name="post_id" value="${postId}">
                    <div class="mb-3">
                        <input type="text" class="form-control" name="author_name" placeholder="Adınız" required>
                    </div>
                    <div class="mb-3">
                        <input type="email" class="form-control" name="author_email" placeholder="E-posta" required>
                    </div>
                    <div class="mb-3">
                        <textarea class="form-control" name="content" rows="4" placeholder="Yorumunuz..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Gönder</button>
                </form>
            </div>
        `;

        // Yorum formu gönderme işlemi
        document.getElementById('commentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('/api/comments/create.php', {
                    method: 'POST',
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                
                const result = await response.json();
                if(result.status === 'success') {
                    alert('Yorumunuz başarıyla gönderildi ve onay bekliyor.');
                    e.target.reset();
                } else {
                    alert('Yorum gönderilirken bir hata oluştu.');
                }
            } catch (error) {
                console.error('Yorum gönderme hatası:', error);
                alert('Bir hata oluştu.');
            }
        });
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
    }
}

// Beğeni sistemi
async function handleLike(postId) {
    try {
        const response = await fetch('/api/posts/like.php', {
            method: 'POST',
            body: JSON.stringify({ post_id: postId })
        });
        
        const result = await response.json();
        if(result.status === 'success') {
            const likeButton = document.querySelector('.like-button');
            likeButton.innerHTML = `
                <i class="fas fa-heart"></i> ${result.likes_count}
            `;
            likeButton.classList.toggle('liked');
        }
    } catch (error) {
        console.error('Beğeni hatası:', error);
    }
}

// Paylaşım butonları
function addShareButtons(post) {
    const shareSection = document.createElement('div');
    shareSection.className = 'share-buttons mt-4';
    shareSection.innerHTML = `
        <h5>Paylaş</h5>
        <div class="d-flex gap-2">
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}" 
               class="btn btn-outline-primary" target="_blank">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
               class="btn btn-outline-primary" target="_blank">
                <i class="fab fa-facebook"></i>
            </a>
            <a href="https://www.linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}" 
               class="btn btn-outline-primary" target="_blank">
                <i class="fab fa-linkedin"></i>
            </a>
            <button class="btn btn-outline-primary" onclick="copyLink()">
                <i class="fas fa-link"></i>
            </button>
        </div>
    `;
    document.querySelector('.blog-post').appendChild(shareSection);
}

// Link kopyalama
function copyLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link kopyalandı!'))
        .catch(err => console.error('Link kopyalama hatası:', err));
}

// İlgili yazılar
async function loadRelatedPosts(categoryId, currentPostId) {
    try {
        const response = await fetch(`/api/posts/related.php?category_id=${categoryId}&post_id=${currentPostId}`);
        const data = await response.json();
        
        if(data.status === 'success' && data.posts.length > 0) {
            const relatedSection = document.createElement('div');
            relatedSection.className = 'related-posts mt-5';
            relatedSection.innerHTML = `
                <h4 class="mb-4">İlgili Yazılar</h4>
                <div class="row">
                    ${data.posts.map(post => `
                        <div class="col-md-4">
                            <div class="card h-100">
                                <img src="${post.image_url || 'https://picsum.photos/300/200'}" class="card-img-top" alt="${post.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${post.title}</h5>
                                    <a href="/post/${post.slug}" class="btn btn-link p-0">Devamını Oku</a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            document.querySelector('.blog-post').after(relatedSection);
        }
    } catch (error) {
        console.error('İlgili yazılar yüklenirken hata:', error);
    }
} 