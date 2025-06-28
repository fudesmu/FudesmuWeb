document.addEventListener("DOMContentLoaded", () => {
  const basePath = "../../";
  const params = new URLSearchParams(window.location.search);
  const nombreLinea = params.get("producto");

  if (!nombreLinea) {
    document.getElementById("subproductos-container").innerHTML =
      "<p style='color:red'>Producto no especificado en la URL.</p>";
    return;
  }

  fetch(`${basePath}data/data.json`)
    .then((res) => res.json())
    .then((data) => {
      const producto = data.tarjetas.find((item) =>
        item.titulo.toLowerCase().replace(/\s+/g, "-") === nombreLinea
      );

      if (!producto) {
        document.getElementById("subproductos-container").innerHTML =
          "<p style='color:red'>Producto no encontrado.</p>";
        return;
      }

      document.getElementById("titulo-subproductos").textContent =
        "Subproductos de " + producto.titulo;

      const contenedor = document.getElementById("subproductos-container");
      const subproductos = producto.subproductos || [];

      subproductos.forEach((sub) => {
        const card = document.createElement("div");
        card.classList.add("subproducto-card");

        card.innerHTML = `
          <img src="${basePath + sub.imagen}" alt="${sub.titulo}">
          <h4>${sub.titulo}</h4>
          <p>${sub.descripcion}</p>
          <div class="precio-subproducto">$${sub.precio}</div>
        `;

        contenedor.appendChild(card);
      });
    })
    .catch((err) =>
      console.error("Error cargando datos de la línea productiva:", err)
    );
});
