document.addEventListener("DOMContentLoaded", () => {
  const basePath = (() => {
    const path = location.pathname;
    const isGitHubPages = location.hostname === "juanzarta.github.io";
    const repoName = "/Fudesmud/";

    if (isGitHubPages) return repoName;
    if (path.includes("/page/lineas/")) return "../../";
    if (path.includes("/page/")) return "../";
    return "./";
  })();

// Cargar navbar
fetch(`${basePath}page/navbar.html`)
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar-placeholder").innerHTML = html;

    // ✅ ACTIVA el botón hamburguesa DESPUÉS de insertar el navbar
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (toggle && navLinks) {
      toggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }

    // ✅ Luego carga el submenú
    fetch(`${basePath}data/data.json`)
      .then((res) => res.json())
      .then((data) => {
        cargarSubmenuLineas(data, basePath);
      });
  });

  // Cargar contacto
  fetch(`${basePath}page/contacto.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("contacto-placeholder").innerHTML = html;
    });

  // Cargar tarjetas, logos y carrusel si corresponde
  fetch(`${basePath}data/data.json`)
    .then((res) => res.json())
    .then((data) => {
      if (document.getElementById("carrusel-container")) {
        cargarLogos(data, basePath);
        cargarTarjetas(data, basePath);
        cargarCarrusel(data, basePath);
      }
    });

  // Preparar modal
  prepararModal(basePath);
});


// ====================== FUNCIONES ======================

function cargarLogos(data, basePath) {
  const leftLogo = document.getElementById("logo-left");
  const rightLogo = document.getElementById("logo-right");
  if (!leftLogo || !rightLogo || !data.logos) return;

  leftLogo.src = `${basePath}${data.logos.izquierdo}`;
  rightLogo.src = `${basePath}${data.logos.derecho}`;
}

function cargarTarjetas(data, basePath) {
  const container = document.getElementById("tarjetas-container");
  if (!container || !data.tarjetas) return;

  data.tarjetas.forEach((item) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    const slug = item.titulo.toLowerCase().replace(/\s+/g, "-");

    tarjeta.innerHTML = `
      <h3>${item.titulo}</h3>
      <p>${item.frase}</p>
      <img src="${basePath}${item.imagen}" alt="${item.titulo}">
      <a href="${basePath}page/lineas/lineas.html?producto=${slug}">
        <button>Ver más</button>
      </a>
    `;
    container.appendChild(tarjeta);
  });
}

function cargarSubmenuLineas(data, basePath) {
  const submenu = document.getElementById("submenu-lineas");
  if (!submenu || !data.tarjetas) return;

  data.tarjetas.forEach((item) => {
    const slug = item.titulo.toLowerCase().replace(/\s+/g, "-");
    const li = document.createElement("li");
    li.innerHTML = `<a href="${basePath}page/lineas/lineas.html?producto=${slug}">${item.titulo}</a>`;
    submenu.appendChild(li);
  });
}

function cargarCarrusel(data, basePath) {
  const contenedor = document.getElementById("carrusel-container");
  if (!contenedor || !data.inicio) return;

  data.inicio.forEach((item, index) => {
    const img = document.createElement("img");
    img.src = `${basePath}${item.carrusel}`;
    img.alt = `Imagen carrusel ${index + 1}`;
    if (index === 0) img.classList.add("active");
    contenedor.appendChild(img);
  });

  iniciarCarrusel();
}

function iniciarCarrusel() {
  const carruselImgs = document.querySelectorAll(".carrusel img");
  if (carruselImgs.length === 0) return;

  let index = 0;
  function rotarImagenes() {
    carruselImgs.forEach((img) => img.classList.remove("active"));
    carruselImgs[index].classList.add("active");
    index = (index + 1) % carruselImgs.length;
  }
  rotarImagenes();
  setInterval(rotarImagenes, 5000);
}

function prepararModal(basePath) {
  const modal = document.getElementById("modal-info");
  const titulo = document.getElementById("modal-titulo");
  const imagen = document.getElementById("modal-imagen");
  const texto = document.getElementById("modal-texto");

  if (!modal || !titulo || !imagen || !texto) return;

  const contenidoModales = {
    proyectos: {
      titulo: "Nuestros Proyectos",
      imagen: `${basePath}assets/img/nosotros/proyectos.jpg`,
      texto:
        "Descubre las iniciativas que estamos llevando a cabo para mejorar las condiciones de vida de nuestras comunidades rurales.",
    },
    causa: {
      titulo: "Únete a FUDESMU",
      imagen: `${basePath}assets/img/nosotros/liderazgo.jpg`,
      texto:
        "Forma parte del cambio social apoyando nuestros programas de impacto sostenible y desarrollo comunitario.",
    },
  };

  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tipo = btn.getAttribute("data-modal");
      if (!contenidoModales[tipo]) return;
      const { titulo: t, imagen: i, texto: tx } = contenidoModales[tipo];

      titulo.textContent = t;
      imagen.src = i;
      texto.textContent = tx;

      modal.style.display = "flex";
      modal.classList.add("modalFadeIn");
    });
  });

  document
    .querySelector(".modal-close")
    ?.addEventListener("click", cerrarModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  function cerrarModal() {
    modal.classList.remove("modalFadeIn");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}
let dataCache = null;

function obtenerDataJson(basePath, callback) {
  if (dataCache) return callback(dataCache);

  fetch(`${basePath}data/data.json`)
    .then((res) => res.json())
    .then((data) => {
      dataCache = data;
      callback(data);
    })
    .catch((err) => console.error("Error cargando JSON:", err));
}
