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
  let result = '';
  let i = 0;

  while (i < raw.length) {
    const braceIdx = raw.indexOf('{', i);
    if (braceIdx === -1) {
      result += raw.slice(i);
      break;
    }

    const header = raw.slice(i, braceIdx).trim();

    let depth = 1;
    let j = braceIdx + 1;
    while (j < raw.length && depth > 0) {
      if (raw[j] === '{') depth++;
      else if (raw[j] === '}') depth--;
      j++;
    }

    const inner = raw.slice(braceIdx + 1, j - 1);

    const cleanHeader = header.replace(/\/\*[\s\S]*?\*\//g, '').trim();

    if (!cleanHeader) {
      result += `{${inner}}`;
    } else if (cleanHeader.startsWith('@')) {
      const scopedInner = /^@keyframes/.test(cleanHeader) ? inner : scopeCSS(inner, scope);
      result += `${cleanHeader} {${scopedInner}}`;
    } else {
      const scoped = splitSelectors(cleanHeader).map((s) => `${scope} ${s}`).join(', ');
      result += `${scoped} {${inner}}`;
    }

    i = j;
  }

  return result;
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
