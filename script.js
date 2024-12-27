// Blog fonksiyonları buraya eklenecek
document.addEventListener('DOMContentLoaded', function() {
    // AOS Animasyon başlatma
    AOS.init({
        duration: 800,
        once: true
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Aktif menü öğesini vurgulama
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Blog yazılarını yükle
    loadPosts();
});

// Blog yazılarını yükle
async function loadPosts() {
    try {
        console.log('Yazılar yükleniyor...');
        const response = await fetch('/api/posts/read.php');
        console.log('API yanıtı:', response);
        
        const data = await response.json();
        console.log('Gelen veri:', data);
        
        if(data.records && data.records.length > 0) {
            const blogPosts = document.querySelector('.blog-posts .row');
            blogPosts.innerHTML = '';
            
            data.records.forEach(post => {
                blogPosts.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <img src="${post.image_url || 'https://picsum.photos/800/400'}" class="card-img-top" alt="${post.title}">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="badge bg-primary">${post.category_name || 'Genel'}</span>
                                    <small class="text-muted">${new Date(post.created_at).toLocaleDateString('tr-TR')}</small>
                                </div>
                                <h5 class="card-title">${post.title}</h5>
                                <p class="card-text">${post.content.substring(0, 150)}...</p>
                                <a href="/post/${post.slug}" class="btn btn-link p-0">
                                    Devamını Oku <i class="fas fa-arrow-right ms-2"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            console.log('Hiç yazı bulunamadı');
            document.querySelector('.blog-posts .row').innerHTML = `
                <div class="col-12 text-center">
                    <p class="lead">Henüz yazı bulunmuyor.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Yazılar yüklenirken hata:', error);
        document.querySelector('.blog-posts .row').innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Yazılar yüklenirken bir hata oluştu.</p>
            </div>
        `;
    }
} 