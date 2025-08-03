// Busca un elemento con el selector que se le pase (id, classname), inserta el component (header, sidebar)
// y elimina el elemento que encontro.

const insertHtml = (selector, url, cb) => {
  const target = document.querySelector(selector);
  if (!target) {
    if (cb) cb();
    return;
  }

  const activeSection = target.dataset.active;
  const activeHeader = target.hasAttribute('data-activeheader');

  fetch(url)
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      Array.from(doc.body.children).forEach((node) => {
        target.parentNode.insertBefore(node, target);
      });

      target.remove();

      // Marcar como activo el header para agregar un línea separatoria
      if (target.id === 'header')
        activeHeader
          ? document.querySelector(`#nheader`).classList.add('active')
          : document.querySelector(`.header-left`).classList.add('border-0');

      // Marcar como activa la tab del menú
      if (activeSection) {
        const li = document.querySelector(`[data-link="${activeSection}"]`);

        // Si el tab tiene un submenu, se marca como activo también
        if (li.hasAttribute('data-submenu')) {
          const activeSubmenu = target.dataset.submenu;
          document.querySelector(`#${activeSubmenu}`).classList.add('active');
        }

        if (li.classList.contains('subdrop')) console.log(target);
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
  // Cargar Header
  const headerLoaded = new Promise((resolve) =>
    insertHtml('#header', '/components/header.html', resolve)
  );

  // Cargar Sidebar
  const sidebarLoaded = new Promise((resolve) =>
    insertHtml('#sidebar-menu', '/components/sidebar.html', resolve)
  );

  // Cargar JS Script
  Promise.all([headerLoaded, sidebarLoaded]).then(() =>
    loadScript('/assets/js/script.js')
  );
});
