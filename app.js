// app.js (Manejo de eventos y lógica principal)

document.addEventListener('DOMContentLoaded', () => {
    console.log('¡Foro ético cargado!');

    // --- Modales de Login y Registro ---
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    // Funciones para abrir modales (UI.js)
    loginBtn.addEventListener('click', () => UI.showModal(loginModal));
    registerBtn.addEventListener('click', () => UI.showModal(registerModal));

    // Cerrar modales (UI.js)
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => UI.hideModal(button.closest('.modal')));
    });

    // --- Envío de Formularios (simulado) ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el envío real
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Aquí iría la lógica real de autenticación (con un backend)
        console.log(`Intento de inicio de sesión: ${email}, ${password}`);
        UI.hideModal(loginModal); // Cerrar el modal después del intento
        // Mostrar un mensaje de éxito/error (UI.js)
        UI.showNotification('Inicio de sesión simulado', 'success');
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        console.log(`Intento de registro: ${username}, ${email}, ${password}`);
        UI.hideModal(registerModal);
        UI.showNotification('Registro simulado', 'success');
    });
});