// --- Configuración Firebase ---
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  databaseURL: "https://TU_DOMINIO.firebaseio.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const postBtn = document.getElementById("postBtn");
const category = document.getElementById("category");
const message = document.getElementById("message");
const postsSection = document.getElementById("posts");

// Publicar post
postBtn.addEventListener("click", () => {
  const msg = message.value.trim();
  const cat = category.value;

  if (!msg) {
    alert("El mensaje no puede estar vacío.");
    return;
  }

  const postData = {
    category: cat,
    message: msg,
    timestamp: Date.now()
  };

  db.ref("posts").push(postData);
  message.value = "";
});

// Mostrar posts en tiempo real
db.ref("posts").on("value", snapshot => {
  postsSection.innerHTML = "";

  const posts = snapshot.val();
  if (!posts) return;

  // Convertir a array y ordenar por fecha (desc)
  const postList = Object.values(posts).sort((a, b) => b.timestamp - a.timestamp);

  postList.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="post-category">[${post.category}]</div>
      <div class="post-message">${escapeHTML(post.message)}</div>
      <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
    `;
    postsSection.appendChild(div);
  });
});

// Función para evitar inyección HTML
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}
