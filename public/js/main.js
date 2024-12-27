// Ana uygulama JavaScript dosyası
document.addEventListener('DOMContentLoaded', () => {
    // Tema değişimi için kod
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Tema tercihini localStorage'dan al
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.classList.toggle('dark', savedTheme === 'dark');
    }

    // Tema değişim fonksiyonu
    function toggleTheme() {
        htmlElement.classList.toggle('dark');
        const newTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
    }

    // Tema değişim butonu varsa event listener ekle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Sayfa yüklendiğinde yapılacak diğer işlemler
    console.log('Sayfa yüklendi ve hazır.');
});
