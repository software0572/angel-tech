document.addEventListener('DOMContentLoaded', function() {
    // Modales
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close-button');

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target == registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // Formulario de Inicio de Sesión (ejemplo)
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Aquí iría la lógica para verificar el usuario y la contraseña
        // y redirigir al usuario si las credenciales son correctas.
        alert(`Intento de inicio de sesión con usuario: ${username}`);
        loginModal.style.display = 'none'; // Cierra el modal después del intento
    });

     // Formulario de Registro (ejemplo)
     const registerForm = document.getElementById('registerForm');
     registerForm.addEventListener('submit', (event) => {
         event.preventDefault(); // Evita que el formulario se envíe
         const newUsername = document.getElementById('newUsername').value;
         const newEmail = document.getElementById('newEmail').value;
         const newPassword = document.getElementById('newPassword').value;

         // Aquí iría la lógica para registrar un nuevo usuario
         alert(`Intento de registro con usuario: ${newUsername} y email: ${newEmail}`);
         registerModal.style.display = 'none'; // Cierra el modal después del intento
     });


    // Interacción con las categorías (ejemplo)
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            alert(`Has seleccionado la categoría: ${category}`);
            // Aquí podrías redirigir al usuario a la página de la categoría
        });
    });
