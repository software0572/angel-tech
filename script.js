const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");

// Cargar mensajes al iniciar
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("anonPosts")) || [];
  saved.forEach(addPostToDOM);
};

// Enviar mensaje
postForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;
  const category = document.getElementById("category").value;

  const post = {
    message,
    category,
    time: new Date().toLocaleString()
  };

  savePost(post);
  addPostToDOM(post);
  postForm.reset();
});

// Guardar localmente
function savePost(post) {
  const saved = JSON.parse(localStorage.getItem("anonPosts")) || [];
  saved.push(post);
  localStorage.setItem("anonPosts", JSON.stringify(saved));
}

// Mostrar en la página
function addPostToDOM(post) {
  const div = document.createElement("div");
  div.className = "post";
  div.innerHTML = `<div class="category">[${post.category}]</div>
                   <p>${post.message}</p>
                   <small>${post.time}</small>`;
  postsContainer.prepend(div);
             }
