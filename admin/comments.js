document.addEventListener('DOMContentLoaded', function() {
    // Yorumları yükle
    loadComments();
    
    // Sidebar toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Form gönderimi
    document.getElementById('commentForm').addEventListener('submit', handleFormSubmit);
});

// Yorumları yükle
async function loadComments() {
    try {
        const response = await fetch('/api/comments/read.php');
        const data = await response.json();
        
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        if(data.records && data.records.length > 0) {
            data.records.forEach(comment => {
                tbody.innerHTML += `
                    <tr>
                        <td>${comment.author_name || comment.username || 'Anonim'}</td>
                        <td>${comment.content.substring(0, 100)}${comment.content.length > 100 ? '...' : ''}</td>
                        <td>${comment.post_title || 'Silinmiş Yazı'}</td>
                        <td>${new Date(comment.created_at).toLocaleDateString('tr-TR')}</td>
                        <td>
                            <span class="badge ${getStatusBadgeClass(comment.status)}">
                                ${getStatusText(comment.status)}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editComment(${comment.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Henüz yorum bulunmuyor</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
    }
}

// Yorum düzenle
async function editComment(id) {
    try {
        const response = await fetch(`/api/comments/read_one.php?id=${id}`);
        const data = await response.json();
        
        if(data.status === 'success') {
            const modal = new bootstrap.Modal(document.getElementById('commentModal'));
            const form = document.getElementById('commentForm');
            
            form.querySelector('[name="id"]').value = data.comment.id;
            form.querySelector('[name="content"]').value = data.comment.content;
            form.querySelector('[name="status"]').value = data.comment.status;
            
            modal.show();
        }
    } catch (error) {
        console.error('Yorum yüklenirken hata:', error);
    }
}

// Yorum sil
async function deleteComment(id) {
    if(confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
        try {
            const response = await fetch('/api/comments/delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            
            const data = await response.json();
            
            if(data.status === 'success') {
                loadComments();
            } else {
                alert('Yorum silinirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Silme işlemi sırasında hata:', error);
        }
    }
}

// Form gönderimi
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const id = formData.get('id');
    
    try {
        const response = await fetch('/api/comments/update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        
        const data = await response.json();
        
        if(data.status === 'success') {
            bootstrap.Modal.getInstance(document.getElementById('commentModal')).hide();
            loadComments();
        } else {
            alert('İşlem sırasında bir hata oluştu');
        }
    } catch (error) {
        console.error('Form gönderimi sırasında hata:', error);
    }
}

// Yardımcı fonksiyonlar
function getStatusBadgeClass(status) {
    switch(status) {
        case 'approved': return 'bg-success';
        case 'rejected': return 'bg-danger';
        default: return 'bg-warning';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'approved': return 'Onaylandı';
        case 'rejected': return 'Reddedildi';
        default: return 'Beklemede';
    }
} 