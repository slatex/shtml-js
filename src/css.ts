
var SHTML_CSS : Element | undefined = undefined

function shtml_init_css() {
  if (SHTML_CSS) return
  SHTML_CSS = document.createElement('style')
  SHTML_CSS.setAttribute('type', 'text/css')
  if ((SHTML_CSS as any).styleSheet) {
    (SHTML_CSS as any).styleSheet.cssText = ''
  }
  document.head.appendChild(SHTML_CSS)
  const classes = shtml_get_css_classes()
  let classes_to_add = ['.shtml-varcomp','.shtml-symcomp','.shtml-definiendum','.shtml-tooltip','.shtml-on-hover']
  classes_to_add = classes_to_add.filter(c => !classes.includes(c))
  const styles = classes_to_add.map(c => {
    switch (c) {
      case '.shtml-varcomp':
        return `.shtml-varcomp { color: #828282; }`
      case '.shtml-symcomp':
        return `.shtml-symcomp { color: #0e90d2; }`
      case '.shtml-definiendum':
        return `.shtml-definiendum { color: #ed028c; }`
      case '.shtml-tooltip':
        return `.shtml-tooltip { position: absolute; display: none; background:#f9f9f9; border:1px solid #ccc }`
      case '.shtml-on-hover':
        return `.shtml-on-hover { background-color: yellow; cursor: pointer;display:inline }`
    }
  }).join('\n')
  shtml_add_style(styles)
}

function shtml_add_style(styles) {
  if (!SHTML_CSS) shtml_init_css()
  if ((SHTML_CSS as any).styleSheet) {
    (SHTML_CSS as any).styleSheet.cssText += styles
  } else {
    SHTML_CSS.appendChild(document.createTextNode(styles))
  }
}

function shtml_get_css_classes(): string[] {
  const classes = []
  for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];
    var rules: CSSRuleList = null;
    try { 
      rules = sheet.cssRules || sheet.rules;
    } catch (e) {
      console.warn("Cannot read cssRules from stylesheet; likely due to same-origin policy.",e)
      continue
    }

    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j];
      if (rule instanceof CSSStyleRule) {
        classes.push(rule.selectorText)
      }
    }

  }
  return classes
}