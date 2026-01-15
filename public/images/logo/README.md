# Logo Assets

Estrutura de pastas para os arquivos de logo do SuggestISS.

**Tipografia da Logo:** Tenor Sans

## Estrutura

```
logo/
├── svg/          # Arquivos SVG (vetoriais, melhor opção)
├── png/          # Arquivos PNG com fundo transparente
└── favicon/      # Ícones para navegadores e dispositivos
```

## Tamanhos Necessários

### SVG (Recomendado)
- `svg/logo-full.svg` - Logo completa (usar em header, footer)
- `svg/logo-icon.svg` - Apenas ícone/símbolo

### PNG (Alternativa)
- `png/logo-header-desktop.png` - 200×60px
- `png/logo-header-mobile.png` - 150×50px
- `png/logo-footer.png` - 180×50px
- `png/logo-square.png` - 512×512px

### Favicon
- `favicon/favicon-32.png` - 32×32px
- `favicon/favicon-64.png` - 64×64px
- `favicon/apple-touch-icon.png` - 180×180px
- `favicon/android-chrome-192.png` - 192×192px
- `favicon/android-chrome-512.png` - 512×512px

### Open Graph (Redes Sociais)
- `png/og-image.png` - 1200×630px

## Uso no Código

```tsx
// SVG (melhor opção)
<img src="/images/logo/svg/logo-full.svg" alt="SuggestISS" />

// PNG
<img src="/images/logo/png/logo-header-desktop.png" alt="SuggestISS" />

// Favicon no index.html
<link rel="icon" type="image/png" sizes="32x32" href="/images/logo/favicon/favicon-32.png" />
```
