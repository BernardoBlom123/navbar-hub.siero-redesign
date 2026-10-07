// Upload e-Social: importação de arquivos ZIP/RAR do eSocial.
// Protótipo: a seleção e a validação são reais; o processamento é simulado no navegador.
(function () {
  const MAX_SIZE = 500 * 1024 * 1024; // 500 MB por arquivo
  const ACCEPTED = ['zip', 'rar'];

  let files = [];      // { id, file, status: 'ready' | 'invalid' | 'processing' | 'done', error, progress }
  let busy = false;    // processamento em andamento
  let finished = false;
  let nextId = 1;
  let root = null;

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString('pt-BR')} KB`;
    return `${(bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
  }

  function validate(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED.includes(ext)) return 'Formato não suportado. Envie arquivos .zip ou .rar.';
    if (file.size === 0) return 'Arquivo vazio. Exporte novamente do eSocial.';
    if (file.size > MAX_SIZE) return `Arquivo com ${formatSize(file.size)}. O limite é 500 MB.`;
    return null;
  }

  function addFiles(list) {
    if (busy) return;
    if (finished) reset();
    for (const file of list) {
      const duplicate = files.some((f) => f.file.name === file.name && f.file.size === file.size);
      if (duplicate) continue;
      const error = validate(file);
      files.push({ id: nextId++, file, status: error ? 'invalid' : 'ready', error, progress: 0, isNew: true });
    }
    update();
  }

  function removeFile(id) {
    files = files.filter((f) => f.id !== id);
    update();
  }

  function reset() {
    files = [];
    finished = false;
    update();
  }

  const validFiles = () => files.filter((f) => f.status !== 'invalid');

  // ---------- Renderização ----------
  function rowHtml(f) {
    const name = UI.escapeHtml(f.file.name);
    let icon = 'file-archive';
    let meta = `${formatSize(f.file.size)} · Pronto para processar`;
    if (f.status === 'invalid') { icon = 'circle-alert'; meta = f.error; }
    if (f.status === 'processing') meta = `${formatSize(f.file.size)} · Processando…`;
    if (f.status === 'done') { icon = 'circle-check'; meta = `${formatSize(f.file.size)} · Processado`; }

    const showProgress = f.status === 'processing' || f.status === 'done';
    const canRemove = !busy && f.status !== 'done';

    return `
      <li class="file-row file-row--${f.status} ${f.isNew ? 'is-new' : ''}" data-id="${f.id}">
        <span class="file-row__icon"><i data-lucide="${icon}"></i></span>
        <span class="file-row__body">
          <span class="file-row__name">${name}</span>
          <span class="file-row__meta">${meta}</span>
          ${showProgress ? `<span class="progress"><span class="progress__bar" style="width:${f.progress}%"></span></span>` : ''}
        </span>
        ${canRemove ? `<button class="icon-btn" data-remove="${f.id}" aria-label="Remover ${name}" title="Remover"><i data-lucide="x"></i></button>` : ''}
      </li>`;
  }

  function update() {
    // A página pode ter sido trocada durante o processamento; o estado segue e reaparece ao voltar
    if (!root || !root.querySelector('[data-counter]')) return;
    const valid = validFiles();
    const total = valid.reduce((sum, f) => sum + f.file.size, 0);

    // Contador
    const counter = root.querySelector('[data-counter]');
    counter.classList.toggle('badge--accent', valid.length > 0);
    if (finished) counter.textContent = `${valid.length} ${valid.length === 1 ? 'arquivo processado' : 'arquivos processados'}`;
    else if (valid.length) counter.textContent = `${valid.length} ${valid.length === 1 ? 'arquivo' : 'arquivos'} · ${formatSize(total)}`;
    else counter.textContent = 'Nenhum arquivo selecionado';

    // Lista
    const list = root.querySelector('[data-list]');
    list.innerHTML = files.map(rowHtml).join('');
    list.hidden = files.length === 0;
    files.forEach((f) => { f.isNew = false; });

    // Área de upload e opções
    root.querySelector('[data-dropzone]').classList.toggle('is-disabled', busy);
    root.querySelector('[data-input]').disabled = busy;
    root.querySelector('[data-incremental]').disabled = busy || finished;

    // Botão principal
    const btn = root.querySelector('[data-start]');
    btn.disabled = busy || (!finished && valid.length === 0);
    if (busy) btn.innerHTML = '<i class="spin" data-lucide="loader-circle"></i>Processando…';
    else if (finished) btn.innerHTML = '<i data-lucide="rotate-ccw"></i>Processar novos arquivos';
    else btn.innerHTML = '<i data-lucide="play"></i>Iniciar processamento';

    Sidebar.renderIcons();
  }

  // ---------- Processamento (simulado) ----------
  function animateProgress(f, duration) {
    return new Promise((resolve) => {
      const start = performance.now();
      const bar = () => root && root.querySelector(`[data-id="${f.id}"] .progress__bar`);
      (function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        f.progress = Math.round((1 - Math.pow(1 - t, 2)) * 100); // desacelera ao final
        const el = bar();
        if (el) el.style.width = `${f.progress}%`;
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      })(start);
    });
  }

  async function start() {
    if (finished) { reset(); return; }
    const queue = validFiles();
    if (!queue.length || busy) return;
    files = queue; // arquivos inválidos saem da lista ao iniciar
    busy = true;
    update();
    for (const f of queue) {
      f.status = 'processing';
      update();
      await animateProgress(f, 1200 + Math.random() * 800);
      f.status = 'done';
    }
    busy = false;
    finished = true;
    update();
  }

  // ---------- Página ----------
  function render(el) {
    root = el;
    el.innerHTML = `
      <div class="page">
        ${UI.topbar([{ label: 'Home', href: '#/home' }, { label: 'Upload e-Social' }])}

        <header class="page-header">
          <p class="page-header__eyebrow">eSocial</p>
          <h1 class="page-header__title">Importação de dados trabalhistas</h1>
          <p class="page-header__subtitle">Envie os arquivos exportados do eSocial em ZIP ou RAR. O processamento é automático.</p>
        </header>

        <section class="panel">
          <div class="panel__header">
            <h2 class="panel__title">Arquivos</h2>
            <span class="badge" data-counter aria-live="polite">Nenhum arquivo selecionado</span>
          </div>

          <div class="panel__body">
            <label class="dropzone flip-host" data-dropzone>
              <input class="sr-only" type="file" multiple accept=".zip,.rar" data-input />
              ${UI.iconFlip('cloud-upload', 'lg')}
              <span class="dropzone__title">Arraste os arquivos ZIP ou RAR aqui</span>
              <span class="dropzone__text">ou <span class="dropzone__link">clique para selecionar</span> no computador</span>
              <span class="dropzone__meta">
                <span class="chip">.zip</span>
                <span class="chip">.rar</span>
                <span class="chip">até 500 MB por arquivo</span>
              </span>
            </label>

            <ul class="file-list" data-list hidden></ul>
          </div>

          <div class="panel__footer">
            <label class="switch-field">
              <input type="checkbox" data-incremental />
              <span class="switch" aria-hidden="true"></span>
              <span class="switch-field__text">
                <span class="switch-field__label">Processamento incremental</span>
                <span class="switch-field__hint">Mantém os eventos já existentes e adiciona apenas os novos.</span>
              </span>
            </label>
            <button class="pill-btn pill-btn--primary" data-start disabled></button>
          </div>
        </section>
      </div>`;

    const dropzone = el.querySelector('[data-dropzone]');
    const input = el.querySelector('[data-input]');

    input.addEventListener('change', () => {
      addFiles(input.files);
      input.value = '';
    });

    // Arrastar e soltar: o ícone vira enquanto o arquivo está sobre a área
    let depth = 0;
    const setOver = (on) => {
      dropzone.classList.toggle('is-dragover', on);
      dropzone.classList.toggle('is-flipped', on);
    };
    dropzone.addEventListener('dragenter', (e) => { e.preventDefault(); if (busy) return; depth++; setOver(true); });
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); });
    dropzone.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; setOver(false); } });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      depth = 0;
      setOver(false);
      addFiles(e.dataTransfer.files);
    });

    el.querySelector('[data-list]').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (btn) removeFile(Number(btn.dataset.remove));
    });
    el.querySelector('[data-start]').addEventListener('click', start);

    UI.bindTilt(el, '.dropzone');
    update();
  }

  // Soltar um arquivo fora da área não deve fazer o navegador abri-lo
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());

  window.Pages = window.Pages || {};
  window.Pages['upload-esocial'] = { title: 'Upload e-Social', render };
})();
