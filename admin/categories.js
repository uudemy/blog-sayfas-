document.addEventListener('DOMContentLoaded', function() {
    // Kategorileri yükle
    loadCategories();
    
    // Sidebar toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Aktif menü öğesini işaretle
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if(link.getAttribute('href') === '/admin/categories.html') {
            link.parentElement.classList.add('active');
        }
    });
});

// Kategorileri yükle
async function loadCategories() {
    try {
        const response = await fetch('/api/categories/read.php');
        const data = await response.json();
        
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        if(data.records && data.records.length > 0) {
            data.records.forEach(category => {
                tbody.innerHTML += `
                    <tr>
                        <td>${category.name}</td>
                        <td>${category.slug}</td>
                        <td>${new Date(category.created_at).toLocaleDateString('tr-TR')}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editCategory(${category.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">Henüz kategori bulunmuyor</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
    }
}

// Kategori modalını göster
function showCategoryModal(category = null) {
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    const form = document.getElementById('categoryForm');
    
    if(category) {
        // Düzenleme modu
        form.querySelector('[name="id"]').value = category.id;
        form.querySelector('[name="name"]').value = category.name;
        form.querySelector('[name="slug"]').value = category.slug;
    } else {
        // Yeni kategori modu
        form.reset();
    }
    
    modal.show();
}

// Form gönderimi
document.getElementById('categoryForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const id = formData.get('id');
    const endpoint = id ? '/api/categories/update.php' : '/api/categories/create.php';
    
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
            bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
            loadCategories();
        } else {
            alert('İşlem sırasında bir hata oluştu');
        }
    } catch (error) {
        console.error('Form gönderimi sırasında hata:', error);
    }
});

// Otomatik slug oluşturma
document.querySelector('[name="name"]').addEventListener('input', function(e) {
    const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    
    document.querySelector('[name="slug"]').value = slug;
});

// Kategori düzenle
async function editCategory(id) {
    try {
        const response = await fetch(`/api/categories/read_one.php?id=${id}`);
        const data = await response.json();
        
        if(data.status === 'success') {
            showCategoryModal(data.category);
        }
    } catch (error) {
        console.error('Kategori yüklenirken hata:', error);
    }
}

// Kategori sil
async function deleteCategory(id) {
    if(confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
        try {
            const response = await fetch('/api/categories/delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            
            const data = await response.json();
            
            if(data.status === 'success') {
                loadCategories(); // Tabloyu yenile
            } else {
                alert('Kategori silinirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Silme işlemi sırasında hata:', error);
        }
    }
} 