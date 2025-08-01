// Busca un selector, inserta el component y elimina el selector

const insertHtml = (selector, url, cb) => {
  const target = document.querySelector(selector);
  if (!target) return;

  const activeSection = target.dataset.active;

  fetch(url)
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      Array.from(doc.body.children).forEach((node) => {
        target.parentNode.insertBefore(node, target);
      });

      target.remove();

      // Marcar como activa la tab del menú
      if (activeSection) {
        const li = document.querySelector(`li[data-link="${activeSection}"]`);

        if (li) li.classList.add('active');
      }

      if (cb) cb();
    })
    .catch((err) => console.error(`Error al cargar: ${url}`, err));
};

// Carga el script del template una vez cargado el sidebar
const loadScript = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.body.appendChild(script);
};

document.addEventListener('DOMContentLoaded', () => {
  insertHtml('#header', '/components/header.html');
  insertHtml('#sidebar-menu', '/components/sidebar.html', () =>
    loadScript('/assets/js/script.js')
  );
});
