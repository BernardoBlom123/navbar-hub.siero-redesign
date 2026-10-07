(function () {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const links = sidebar.querySelectorAll('[data-route]');

  // Ícones Lucide: troca os <i data-lucide> por SVG (traço mais fino = visual mais refinado)
  function renderIcons() {
    lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
  }
  renderIcons();

  // Recolher / expandir a sidebar
  toggle.addEventListener('click', () => {
    const collapsed = sidebar.classList.toggle('is-collapsed');
    const label = collapsed ? 'Expandir menu' : 'Recolher menu';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.innerHTML = `<i data-lucide="${collapsed ? 'panel-left-open' : 'panel-left-close'}"></i>`;
    renderIcons();
  });

  // Abrir / fechar grupos
  sidebar.querySelectorAll('.nav__group-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.parentElement.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Tooltip com o nome do item quando recolhida
  links.forEach((link) => {
    link.title = link.querySelector('.nav__label').textContent;
  });

  // Marca o item da rota atual; devolve o título dele (ou null se a rota não está no menu)
  function setActive(route) {
    let current = null;
    links.forEach((link) => {
      const active = link.dataset.route === route;
      link.classList.toggle('is-active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
        current = link;
      } else {
        link.removeAttribute('aria-current');
      }
    });
    if (!current) return null;
    const group = current.closest('.nav__group');
    if (group && !group.classList.contains('is-open')) {
      group.querySelector('.nav__group-toggle').click();
    }
    return current.querySelector('.nav__label').textContent;
  }

  window.Sidebar = { setActive, renderIcons };
})();
