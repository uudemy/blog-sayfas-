document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    form.addEventListener('submit', (e) => {
        // Şifre eşleşme kontrolü
        if (passwordInput.value !== confirmPasswordInput.value) {
            e.preventDefault();
            alert('Şifreler eşleşmiyor!');
            return;
        }

        // Şifre uzunluk kontrolü
        if (passwordInput.value.length < 6) {
            e.preventDefault();
            alert('Şifre en az 6 karakter olmalıdır!');
            return;
        }
    });
});
