// ui.js (Funciones para manipulación de la interfaz de usuario)

const UI = {
    showModal: (modal) => {
        modal.style.display = 'block';
    },

    hideModal: (modal) => {
        modal.style.display = 'none';
    },

    showNotification: (message, type = 'info') => {
        // Crear el elemento de notificación
        const notification = document.createElement('div');
        notification.classList.add('notification', type); // Clases CSS: notification, success/error/info
        notification.textContent = message;

        // Agregar al body
        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Ocultar después de unos segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove(); // Eliminar del DOM
            }, 300); // Esperar la transición de salida
        }, 3000); // Duración de la notificación
    },
};