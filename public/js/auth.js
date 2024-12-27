document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm') || document.getElementById('registerForm');
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    const successMessage = urlParams.get('message');
    
    const errorMessageDiv = document.querySelector('.bg-red-100');
    const successMessageDiv = document.querySelector('.bg-green-100');

    if (errorMessage && errorMessageDiv) {
        errorMessageDiv.innerHTML = `
            <p class="font-bold">Hata:</p>
            <p>${decodeURIComponent(errorMessage)}</p>
        `;
        errorMessageDiv.style.display = 'block';
    }

    if (successMessage && successMessageDiv) {
        successMessageDiv.innerHTML = `
            <p class="font-bold">Bilgi:</p>
            <p>${decodeURIComponent(successMessage)}</p>
        `;
        successMessageDiv.style.display = 'block';
    }

    // Kayıt sayfası için şifre kontrolü
    if (form && form.id === 'registerForm') {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (passwordInput.value !== confirmPasswordInput.value) {
                alert('Şifreler eşleşmiyor. Lütfen tekrar kontrol edin.');
                return;
            }

            form.submit();
        });
    }
});
