// Dashboard fonksiyonları
document.addEventListener('DOMContentLoaded', function() {
    // İstatistikleri yükle
    loadStats();
    // Yazıları yükle
    loadPosts();
    
    // Sidebar toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
});

// İstatistikleri yükle
async function loadStats() {
    try {
        // Yazı sayısı
        const postsResponse = await fetch('/api/posts/count.php');
        const postsData = await postsResponse.json();
        if(postsData.status === 'success') {
            document.querySelector('.bg-primary h2').textContent = postsData.count;
        }

        // Yorum sayısı
        const commentsResponse = await fetch('/api/comments/count.php');
        const commentsData = await commentsResponse.json();
        if(commentsData.status === 'success') {
            document.querySelector('.bg-success h2').textContent = commentsData.count;
        }

        // Kategori sayısı
        const categoriesResponse = await fetch('/api/categories/count.php');
        const categoriesData = await categoriesResponse.json();
        if(categoriesData.status === 'success') {
            document.querySelector('.bg-warning h2').textContent = categoriesData.count;
        }

        // Görüntülenme sayısı
        const viewsResponse = await fetch('/api/posts/views.php');
        const viewsData = await viewsResponse.json();
        if(viewsData.status === 'success') {
            document.querySelector('.bg-info h2').textContent = viewsData.count;
        }

    } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
    }
}

// Yazıları yükle
async function loadPosts() {
    try {
        const response = await fetch('/api/posts/read.php');
        const data = await response.json();
        
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        if(data.records && data.records.length > 0) {
            data.records.forEach(post => {
                tbody.innerHTML += `
                    <tr>
                        <td>${post.title}</td>
                        <td>${post.category_name || 'Kategorisiz'}</td>
                        <td>${new Date(post.created_at).toLocaleDateString('tr-TR')}</td>
                        <td>
                            <span class="badge ${post.status === 'published' ? 'bg-success' : 'bg-warning'}">
                                ${post.status === 'published' ? 'Yayında' : 'Taslak'}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editPost(${post.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Henüz yazı bulunmuyor</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Yazılar yüklenirken hata:', error);
    }
}

// Yazı modalını göster
function showPostModal(post = null) {
    const modal = new bootstrap.Modal(document.getElementById('postModal'));
    const form = document.getElementById('postForm');
    
    // Kategorileri yükle
    loadCategories();
    
    if(post) {
        // Düzenleme modu
        form.querySelector('[name="id"]').value = post.id;
        form.querySelector('[name="title"]').value = post.title;
        form.querySelector('[name="content"]').value = post.content;
        form.querySelector('[name="category_id"]').value = post.category_id;
        form.querySelector('[name="status"]').value = post.status;
    } else {
        // Yeni yazı modu
        form.reset();
    }
    
    modal.show();
}

// Kategorileri yükle
async function loadCategories() {
    try {
        const response = await fetch('/api/categories/read.php');
        const data = await response.json();
        
        const select = document.querySelector('[name="category_id"]');
        select.innerHTML = '<option value="">Kategori Seçin</option>';
        
        if(data.records) {
            data.records.forEach(category => {
                select.innerHTML += `
                    <option value="${category.id}">${category.name}</option>
                `;
            });
        }
    } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
    }
}

// Yazı düzenle
async function editPost(id) {
    try {
        const response = await fetch(`/api/posts/read_one.php?id=${id}`);
        const data = await response.json();
        
        if(data.status === 'success') {
            showPostModal(data.post);
        }
    } catch (error) {
        console.error('Yazı yüklenirken hata:', error);
    }
}

// Yazı sil
async function deletePost(id) {
    if(confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
        try {
            const response = await fetch('/api/posts/delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            
            const data = await response.json();
            
            if(data.status === 'success') {
                loadPosts(); // Tabloyu yenile
            } else {
                alert('Yazı silinirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Silme işlemi sırasında hata:', error);
        }
    }
}

// Form gönderimi
document.getElementById('postForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const id = formData.get('id');
    const endpoint = id ? '/api/posts/update.php' : '/api/posts/create.php';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        
        const data = await response.json();
        
        if(data.status === 'success') {
            bootstrap.Modal.getInstance(document.getElementById('postModal')).hide();
            loadPosts(); // Tabloyu yenile
        } else {
            alert('İşlem sırasında bir hata oluştu');
        }
    } catch (error) {
        console.error('Form gönderimi sırasında hata:', error);
    }
}); 