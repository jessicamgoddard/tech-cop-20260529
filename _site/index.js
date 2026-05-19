function scopeCSS(raw, scope) {
  return raw.replace(/([^{};,\s][^{},]*?)\s*\{/g, (_, selector) => {
    const scoped = selector
      .trim()
      .split(',')
      .map((s) => `${scope} ${s.trim()}`)
      .join(', ');
    return `${scoped} {`;
  });
}

function initSlide(slide, index) {
  slide.dataset.slide = String(index);

  const textarea = slide.querySelector('.code > textarea');
  if (!textarea) return;

  const scope = `.slide[data-slide="${index}"] .demo`;
  const styleTag = document.createElement('style');
  document.head.appendChild(styleTag);

  const editor = CodeMirror.fromTextArea(textarea, {
    mode: 'css',
    theme: 'material-darker',
    lineNumbers: true,
    indentUnit: 2,
    tabSize: 2,
    extraKeys: {
      'Cmd-/': 'toggleComment',
      'Ctrl-/': 'toggleComment',
    },
  });

  editor.on('change', () => {
    styleTag.textContent = scopeCSS(editor.getValue(), scope);
  });

  styleTag.textContent = scopeCSS(editor.getValue(), scope);
}

document.querySelectorAll('.slide').forEach(initSlide);
