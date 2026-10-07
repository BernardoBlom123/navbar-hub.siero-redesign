(function () {
  const shortcuts = [
    { route: 'auditoria', icon: 'scan-eye', title: 'Auditoria', text: 'Revise as divergências apuradas na folha do mês.' },
    { route: 'catalogo-rubricas', icon: 'tags', title: 'Catálogo de Rubricas', text: 'Consulte e decida a configuração das suas rubricas.' },
    { route: 'visao-financeira', icon: 'chart-no-axes-combined', title: 'Visão Financeira', text: 'Acompanhe a apuração de créditos e o andamento dela.' },
    { route: 'conferencia-dirf', icon: 'link-2', title: 'Conferência DIRF', text: 'Confira a DIRF declarada contra a folha do período.' },
    { route: 'biblioteca-cct', icon: 'book-open-text', title: 'Biblioteca CCT', text: 'Consulte as convenções coletivas que valem para a sua folha.' },
  ];

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  // "Sexta-feira, 2 de outubro"
  function today() {
    const s = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // O ícone tem duas faces: no hover do card ele gira e revela o verso (fundo navy, ícone branco)
  function card(item, i) {
    return `
      <a class="feature-card flip-host" href="#/${item.route}" style="--i:${i}">
        <span class="feature-card__top">
          ${UI.iconFlip(item.icon)}
          <span class="feature-card__index">${String(i + 1).padStart(2, '0')}</span>
        </span>
        <span class="feature-card__title">${item.title}</span>
        <span class="feature-card__text">${item.text}</span>
        <span class="pill-btn">Acessar <i data-lucide="arrow-right"></i></span>
      </a>`;
  }

  // Última célula da grade: chamada para o Apoio
  function helpCard(i) {
    return `
      <div class="feature-card feature-card--cta" style="--i:${i}">
        <span class="feature-card__title">Não sabe por onde começar?</span>
        <span class="feature-card__text">Fale com o time de Apoio e receba orientação sobre a sua folha.</span>
        <a class="pill-btn pill-btn--light" href="#/apoio">Falar com o Apoio <i data-lucide="arrow-right"></i></a>
      </div>`;
  }

  function render(el) {
    el.innerHTML = `
      <div class="page">
        ${UI.topbar([{ label: 'Home' }])}

        <header class="page-header">
          <p class="page-header__eyebrow">${today()}</p>
          <h1 class="page-header__title">${greeting()}, ${UI.user.name}</h1>
          <p class="page-header__subtitle">Escolha por onde começar.</p>
        </header>

        <section class="feature-grid" aria-label="Atalhos">
          ${shortcuts.map(card).join('')}
          ${helpCard(shortcuts.length)}
        </section>
      </div>`;

    UI.bindTilt(el, 'a.feature-card');
  }

  window.Pages = window.Pages || {};
  window.Pages.home = { title: 'Home', render };
})();
