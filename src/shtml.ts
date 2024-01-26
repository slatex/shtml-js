import { NAMESPACES, SHTML_NS_ABBREV } from "./main"
import { do_term } from "./terms"
export let definitionsMap = new Map<string,Element>()

let in_definition: Element | undefined = undefined

export function do_shtml(elem: Element) {
  const recurse = () => {
    elem.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        do_shtml(node as Element);
      }
    })
  }
  for (let i = 0; i < elem.attributes.length; i++) {
    const attr = elem.attributes[i];
    if (attr.name.startsWith(SHTML_NS_ABBREV) || attr.namespaceURI === NAMESPACES.SHTML) {
      const name = attr.name.startsWith(SHTML_NS_ABBREV)? attr.name.substring(6):attr.name
      switch (name) {
        case 'visible':
          if (attr.value === 'false') { return }
        case 'definiendum':
          elem.classList.add(`shtml-definiendum`)
          if (in_definition) {
            definitionsMap.set(attr.value,in_definition)
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
          do_theory(elem)
          recurse()
          return
        case 'term':
          do_term(elem)
          return
        case 'feature-structure':
          do_mathstructure(elem)
          recurse()
          return
        case 'definition':
          do_definition(elem)
          const oldd = in_definition
          in_definition = elem
          recurse()
          in_definition = oldd
          return
        case 'paragraph':
          do_definition(elem)
          const oldp = in_definition
          in_definition = elem
          recurse()
          in_definition = oldp
          return
        default:
          console.log("SHTML attribute not implemented: ",name)
      }
    }
  }
  recurse()
}

function do_theory(theory:Element) {
  const path = theory.attributes.getNamedItem('shtml:theory')?.value
  const meta = theory.attributes.getNamedItem('shtml:metatheory')?.value
  console.log(`SHTML theory: ${path} : ${meta}`)
}

function do_mathstructure(theory:Element) {
  const path = theory.attributes.getNamedItem('shtml:feature-structure')?.value
  const macroname = theory.attributes.getNamedItem('shtml:macroname')?.value
  console.log(`SHTML mathstructure: ${path} (\\${macroname})`)
}

function do_definition(definition:Element) {
  const fors = definition.attributes.getNamedItem('shtml:fors')?.value.split(',').map(s => s.trim())
  if (fors) {
    console.log("SHTML definition for: ",fors)
    fors.forEach((sym) => {
      definitionsMap.set(sym,definition)
    })
  }
}