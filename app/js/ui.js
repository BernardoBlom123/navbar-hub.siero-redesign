// Peças de interface compartilhadas entre as páginas
(function () {
  // Usuário de demonstração — vem da tela atual do produto
  const user = { name: 'Demonstração', login: 'demo.comercial' };

  // Barra utilitária: onde estou (esq.) · quem sou e meu acesso (dir.)
  // crumbs: [{ label, href? }] — o primeiro item ganha o ícone da casa
  function topbar(crumbs) {
    const trail = crumbs
      .map((c, i) => {
        const icon = i === 0 ? '<i data-lucide="house"></i>' : '';
        const sep = i > 0 ? '<i class="breadcrumb__sep" data-lucide="chevron-right"></i>' : '';
        const label = c.href
          ? `<a class="breadcrumb__link" href="${c.href}">${icon}${c.label}</a>`
          : `<span class="breadcrumb__current" aria-current="page">${icon}${c.label}</span>`;
        return sep + label;
      })
      .join('');

    return `
      <div class="topbar">
        <nav class="breadcrumb" aria-label="Você está em">${trail}</nav>
        <div class="topbar__actions">
          <span class="badge" title="Seu perfil tem acesso restrito a algumas seções"><i data-lucide="lock"></i>Acesso restrito</span>
          <button class="user-menu" aria-haspopup="menu">
            <span class="user-menu__avatar" aria-hidden="true">${user.name[0]}</span>
            <span class="user-menu__text">
              <span class="user-menu__name">${user.name}</span>
              <span class="user-menu__login">${user.login}</span>
            </span>
            <i class="user-menu__chevron" data-lucide="chevron-down"></i>
          </button>
        </div>
      </div>`;
  }

  // Ícone com duas faces que gira no hover do elemento "host" (ver .icon-flip em components.css)
  function iconFlip(icon, size = '') {
    return `
      <span class="icon-flip ${size ? `icon-flip--${size}` : ''}" aria-hidden="true">
        <span class="icon-flip__inner">
          <span class="icon-flip__face icon-flip__face--front"><i data-lucide="${icon}"></i></span>
          <span class="icon-flip__face icon-flip__face--back"><i data-lucide="${icon}"></i></span>
        </span>
      </span>`;
  }

  // Inclinação do ícone que acompanha o cursor sobre o host: ele "cede" na direção do toque
  function bindTilt(root, hostSelector) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const MAX_X = 14; // graus de inclinação vertical
    const MAX_Y = 18; // graus de inclinação horizontal
    root.querySelectorAll(hostSelector).forEach((host) => {
      const flip = host.querySelector('.icon-flip__inner');
      if (!flip) return;
      host.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = host.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        flip.style.setProperty('--tilt-x', `${(-py * MAX_X).toFixed(2)}deg`);
        flip.style.setProperty('--tilt-y', `${(px * MAX_Y).toFixed(2)}deg`);
      });
      host.addEventListener('pointerleave', () => {
        flip.style.setProperty('--tilt-x', '0deg');
        flip.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  window.UI = { user, topbar, iconFlip, bindTilt, escapeHtml };
})();
