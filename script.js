const apiKey = '0160e806256cb2fc38c587cac580a2bc';

// Función para mostrar resultados con animación
function mostrarResultado(id, texto) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.classList.add('visible');
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.opacity = 1;
  }, 50);
}

// Función para habilitar o deshabilitar botón y cambiar texto
function toggleBoton(idBtn, habilitar, textoOriginal, textoAlterno = 'Buscando...') {
  const btn = document.getElementById(idBtn);
  btn.disabled = !habilitar;
  btn.textContent = habilitar ? textoOriginal : textoAlterno;
}

// Validar número telefónico (ej: +1234567890)
function validarNumero(num) {
  return /^\+\d{7,15}$/.test(num);
}

// Validar IP simple
function validarIP(ip) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip);
}

// Validar email básico
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validar URL con objeto URL nativo
function validarURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// --- 1. Validar Número Telefónico ---
document.getElementById('btnValidarNumero').addEventListener('click', async () => {
  const num = document.getElementById('inputNumero').value.trim();
  const resId = 'resultadoNumero';

  if (!validarNumero(num)) {
    mostrarResultado(resId, 'Número inválido. Debe comenzar con + y tener entre 7 y 15 dígitos.');
    return;
  }

  toggleBoton('btnValidarNumero', false);

  mostrarResultado(resId, 'Buscando número...');

  try {
    const response = await fetch(`https://apilayer.net/api/validate?access_key=${apiKey}&number=${encodeURIComponent(num)}&format=1`);
    const data = await response.json();

    if (!data.valid) {
      mostrarResultado(resId, 'Número inválido o no encontrado.');
      toggleBoton('btnValidarNumero', true, 'Buscar número');
      return;
    }

    mostrarResultado(resId, 
      `Número: ${data.number}\n` +
      `Formato internacional: ${data.international_format}\n` +
      `País: ${data.country_name}\n` +
      `Ubicación: ${data.location || 'No disponible'}\n` +
      `Operador: ${data.carrier || 'No disponible'}\n` +
      `Tipo línea: ${data.line_type || 'No disponible'}`
    );
  } catch (error) {
    mostrarResultado(resId, 'Error buscando número: ' + error.message);
  }

  toggleBoton('btnValidarNumero', true, 'Buscar número');
});

// --- 2. Geolocalizar IP ---
document.getElementById('btnBuscarIP').addEventListener('click', async () => {
  const ip = document.getElementById('inputIP').value.trim();
  const resId = 'resultadoIP';

  if (!validarIP(ip)) {
    mostrarResultado(resId, 'IP inválida. Ejemplo: 8.8.8.8');
    return;
  }

  toggleBoton('btnBuscarIP', false);

  mostrarResultado(resId, 'Buscando IP...');

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    if (data.error) {
      mostrarResultado(resId, 'IP no encontrada o error en consulta.');
      toggleBoton('btnBuscarIP', true, 'Buscar IP');
      return;
    }

    mostrarResultado(resId, 
      `IP: ${data.ip}\n` +
      `Ciudad: ${data.city || 'No disponible'}\n` +
      `Región: ${data.region || 'No disponible'}\n` +
      `País: ${data.country_name || 'No disponible'}\n` +
      `ISP: ${data.org || 'No disponible'}`
    );
  } catch (error) {
    mostrarResultado(resId, 'Error buscando IP: ' + error.message);
  }

  toggleBoton('btnBuscarIP', true, 'Buscar IP');
});

// --- 3. Verificar Email ---
document.getElementById('btnVerificarEmail').addEventListener('click', () => {
  const email = document.getElementById('inputEmail').value.trim();
  const resId = 'resultadoEmail';

  if (!validarEmail(email)) {
    mostrarResultado(resId, 'Email con formato inválido.');
    return;
  }

  // Solo aviso, no API pública integrada
  document.getElementById(resId).innerHTML = 
    `Email válido.<br>Para verificar brechas, consulta en sitios como <a href="https://haveibeenpwned.com/" target="_blank" style="color:#3ddc97;">Have I Been Pwned</a>.`;
});

// --- 4. Buscar Usuario en Redes Sociales ---
document.getElementById('btnBuscarUsuario').addEventListener('click', () => {
  const username = document.getElementById('inputUsuario').value.trim();
  const res = document.getElementById('resultadoUsuario');

  if (!username) {
    mostrarResultado('resultadoUsuario', 'Introduce un nombre de usuario válido.');
    return;
  }

  const sites = [
    {name: 'Twitter', url: `https://twitter.com/${username}`},
    {name: 'Instagram', url: `https://www.instagram.com/${username}`},
    {name: 'GitHub', url: `https://github.com/${username}`},
    {name: 'Reddit', url: `https://www.reddit.com/user/${username}`},
    {name: 'TikTok', url: `https://www.tiktok.com/@${username}`},
  ];

  let html = '';
  sites.forEach(site => {
    html += `<p>🔗 <a href="${site.url}" target="_blank" style="color:#3ddc97;">${site.name}</a></p>`;
  });

  res.innerHTML = html + '\n* Haz clic para abrir cada perfil y verificar existencia.';
});

// --- 5. Análisis básico URL ---
document.getElementById('btnAnalizarURL').addEventListener('click', () => {
  const urlStr = document.getElementById('inputURL').value.trim();
  const resId = 'resultadoURL';

  if (!validarURL(urlStr)) {
    mostrarResultado(resId, 'Introduce una URL válida.');
    return;
  }

  try {
    const url = new URL(urlStr);
    let info = `URL: ${url.href}\n`;
    info += `Protocolo: ${url.protocol}\n`;
    info += `Host: ${url.host}\n`;
    info += `Dominio: ${url.hostname}\n`;
    info += `Puerto: ${url.port || '(default)'}\n`;
    info += `Ruta: ${url.pathname}\n`;
    info += `Parámetros: ${url.search || 'Ninguno'}\n`;
    info += `Hash: ${url.hash || 'Ninguno'}\n`;
    info += `HTTPS: ${url.protocol === 'https:' ? 'Sí' : 'No'}\n`;
    mostrarResultado(resId, info);
  } catch {
    mostrarResultado(resId, 'URL no válida.');
  }
});

// --- 6. WHOIS simplificado ---
// Nota: Este endpoint CORS es inestable y para producción se necesita backend propio
document.getElementById('btnWhois').addEventListener('click', async () => {
  const domain = document.getElementById('inputDominio').value.trim();
  const resId = 'resultadoWhois';

  if (!domain) {
    mostrarResultado(resId, 'Introduce un dominio válido.');
    return;
  }

  toggleBoton('btnWhois', false);
  mostrarResultado(resId, 'Consultando WHOIS...');

  const proxy = 'https://cors-anywhere.herokuapp.com/';
  const url = `https://whois.domaintools.com/${domain}`;

  try {
    const response = await fetch(proxy + url);
    const text = await response.text();
    const snippet = text.substring(0, 1000);
    mostrarResultado(resId, snippet);
  } catch {
    mostrarResultado(resId, 'Error consultando WHOIS. Este servicio puede necesitar backend.');
  }

  toggleBoton('btnWhois', true, 'Consultar WHOIS');
});

// --- 7. Extraer metadatos EXIF ---
document.getElementById('btnExtraerExif').addEventListener('click', () => {
  const fileInput = document.getElementById('inputImagen');
  const resId = 'resultadoExif';
  const file = fileInput.files[0];

  if (!file) {
    mostrarResultado(resId, 'Debes subir una imagen primero.');
    return;
  }

  mostrarResultado(resId, 'Extrayendo metadatos EXIF...');

  EXIF.getData(file, function() {
    const allMetaData = EXIF.getAllTags(this);
    if (Object.keys(allMetaData).length === 0) {
      mostrarResultado(resId, 'No se encontraron metadatos EXIF.');
      return;
    }
    let output = '';
    for (const tag in allMetaData) {
      output += `${tag}: ${allMetaData[tag]}\n`;
    }
    mostrarResultado(resId, output);
  });
});