async function lookup() {
    const phone = document.getElementById("phone").value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Cargando...";

    try {
        // Cambia la URL por tu backend (local o en Render)
        const response = await fetch(`http://localhost:5000/lookup?number=${phone}`);
        // Si usas Render, reemplaza por: https://your-app-name.onrender.com/lookup?number=${phone}
        const data = await response.json();
        if (data.error) {
            resultsDiv.innerHTML = `Error: ${data.error}`;
        } else {
            resultsDiv.innerHTML = `
                <p><strong>Número:</strong> ${data.number}</p>
                <p><strong>País:</strong> ${data.country || 'No disponible'}</p>
                <p><strong>Operador:</strong> ${data.carrier || 'No disponible'}</p>
                <p><strong>Tipo:</strong> ${data.line_type || 'No disponible'}</p>
                <p><strong>OSINT Adicional:</strong> ${data.osint || 'No disponible'}</p>
            `;
        }
    } catch (error) {
        resultsDiv.innerHTML = `Error al conectar con el servidor: ${error.message}`;
    }
}