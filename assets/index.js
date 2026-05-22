function splitSelectors(selector) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of selector) {
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function scopeCSS(raw, scope) {
  return raw.replace(/([^{};][^{}]*?)\s*\{/g, (_, selector) => {
    const trimmed = selector.trim();
    if (trimmed.startsWith('@')) return `${trimmed} {`;
    const scoped = splitSelectors(trimmed)
      .map((s) => `${scope} ${s}`)
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
