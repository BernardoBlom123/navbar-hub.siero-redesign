// Roteamento por hash. Cada página se registra em window.Pages[rota] = { title, render(el) }.
// Rotas sem página própria mostram um placeholder com o título do menu.
(function () {
  const content = document.getElementById('content');

  // Títulos de rotas que não estão no menu lateral
  const extraTitles = { 'biblioteca-cct': 'Biblioteca CCT' };

  function render() {
    const route = location.hash.replace('#/', '') || 'home';
    const menuTitle = Sidebar.setActive(route);
    const page = (window.Pages || {})[route];
    const title = (page && page.title) || menuTitle || extraTitles[route] || 'Página não encontrada';

    if (page) {
      page.render(content);
    } else {
      content.innerHTML = `
        <div class="page">
          <header class="page-header">
            <div class="page-header__main">
              <h1 class="page-header__title">${title}</h1>
              <p class="page-header__subtitle">Esta seção ainda não foi redesenhada.</p>
            </div>
          </header>
        </div>`;
    }

    document.title = `${title} · Hubsiero`;
    content.scrollTop = 0;
    Sidebar.renderIcons();
  }

  window.addEventListener('hashchange', render);
  render();
})();
