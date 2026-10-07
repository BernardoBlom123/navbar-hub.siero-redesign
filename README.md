# Hubsiero — Redesign de UI

Protótipo navegável do redesign da interface do Hubsiero. Ele reproduz as telas atuais do produto com uma nova linguagem visual, no estilo do [shadcn/ui](https://ui.shadcn.com): superfícies planas, bordas finas e micro-animações discretas.

## Como rodar

Não há build nem dependências: abra `app/index.html` no navegador.

Para servir localmente (opcional):

```bash
npx serve app
```

## Telas

| Tela | Rota | Situação |
| --- | --- | --- |
| Navbar lateral | — | Pronta: grupos recolhíveis, modo só ícones, ícones animados no hover |
| Home | `#/home` | Pronta: saudação, grade de atalhos com flip 3D do ícone |
| Upload e-Social | `#/upload-esocial` | Pronta: arrastar e soltar, validação de ZIP/RAR até 500 MB, processamento simulado |
| Demais seções | `#/…` | Página provisória |

## Estrutura

```
app/
├── index.html            # Casca da aplicação (navbar + área de conteúdo)
├── assets/               # Logo oficial
├── css/
│   ├── tokens.css        # Cores, tipografia, medidas e curvas de animação — comece por aqui
│   ├── layout.css        # Base da página
│   ├── sidebar.css       # Navbar lateral
│   ├── icons.css         # Micro-animações dos ícones da navbar
│   ├── components.css    # Peças compartilhadas: barra do topo, flip de ícone, botões, painel, switch
│   ├── home.css          # Home
│   └── upload.css        # Upload e-Social
└── js/
    ├── sidebar.js        # Navbar: recolher, grupos, item ativo
    ├── ui.js             # Peças de interface compartilhadas
    ├── app.js            # Roteamento por hash
    └── pages/            # Uma página por arquivo: window.Pages[rota] = { title, render }
```

### Adicionando uma tela

1. Crie `app/js/pages/<rota>.js` registrando `window.Pages['<rota>'] = { title, render(el) }`.
2. Use `UI.topbar(...)`, `.page-header` e `.panel` para manter o padrão visual.
3. Inclua o script (e o CSS, se houver) em `app/index.html`.

## Stack

- HTML, CSS e JavaScript puros
- Ícones: [Lucide](https://lucide.dev) 0.468.0, a biblioteca padrão do shadcn/ui
- Fonte: [Raleway](https://fonts.google.com/specimen/Raleway)

## Referências

- `Navbar.pdf`: layout original da navbar, usado como ponto de partida
