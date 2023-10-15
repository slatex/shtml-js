let shtml_definitionsMap = new Map<string,Element>()

let shtml_indefinition: Element | undefined = undefined

function do_shtml(elem: Element) {
  const recurse = () => {
    elem.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        do_shtml(node as Element);
      }
    })
  }
  for (let i = 0; i < elem.attributes.length; i++) {
    const attr = elem.attributes[i];
    if (attr.name.startsWith('shtml:')) {
      const name = attr.name.substring(6)
      switch (name) {
        case 'visible':
          if (attr.value === 'false') { return }
        case 'definiendum':
          elem.classList.add(`shtml-definiendum`)
          if (shtml_indefinition) {
            shtml_definitionsMap.set(attr.value,shtml_indefinition)
          }
          break
        case 'sourceref': 
        case 'doctitle': 
        case 'sectionlevel': 
        case 'metatheory': 
        case 'language': 
        case 'signature': 
        case 'import':
        case 'id':
        case 'inline':
        case 'statementtitle':
        case 'vardef':
        case 'definiens':
        case 'notationid':
        case 'head':
        case 'fors':
        case 'argmode':
        case 'arg':
        case 'macroname':
          break
        case 'theory':
          shtml_do_theory(elem)
          recurse()
          return
        case 'term':
          shtml_do_term(elem)
          return
        case 'feature-structure':
          shtml_do_mathstructure(elem)
          recurse()
          return
        case 'definition':
          shtml_do_definition(elem)
          const old = shtml_indefinition
          shtml_indefinition = elem
          recurse()
          shtml_indefinition = old
          return
        default:
          console.log("SHTML attribute not implemented: ",name)
      }
    }
  }
  recurse()
}

function shtml_do_theory(theory:Element) {
  const path = theory.attributes.getNamedItem('shtml:theory')?.value
  const meta = theory.attributes.getNamedItem('shtml:metatheory')?.value
  console.log(`SHTML theory: ${path} : ${meta}`)
}

function shtml_do_mathstructure(theory:Element) {
  const path = theory.attributes.getNamedItem('shtml:feature-structure')?.value
  const macroname = theory.attributes.getNamedItem('shtml:macroname')?.value
  console.log(`SHTML mathstructure: ${path} (\\${macroname})`)
}

function shtml_do_definition(definition:Element) {
  const fors = definition.attributes.getNamedItem('shtml:fors')?.value.split(',').map(s => s.trim())
  if (fors) {
    console.log("SHTML definition for: ",fors)
    fors.forEach((sym) => {
      shtml_definitionsMap.set(sym,definition)
    })
  }
}