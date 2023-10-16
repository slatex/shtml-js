import { NAMESPACES, SHTML_NS_ABBREV } from "./main"

function shtml_is_mathml(elem: Element): boolean {
  let element : Element | null = elem
  while (element) {
    if (element.namespaceURI === NAMESPACES.MATHML) return true
    if (element.namespaceURI === NAMESPACES.HTML) return false
    switch (element.nodeName) {
      case 'math':
      case 'mrow':
      case 'mfrac':
      case 'msup':
      case 'msub':
      case 'msubsup':
      case 'munder':
      case 'mover':
      case 'munderover':
      case 'mtable':
      case 'mtr':
      case 'mtd':
      case 'mstyle':
      case 'merror':
      case 'mpadded':
      case 'mphantom':
      case 'menclose':
      case 'mroot':
      case 'mfenced':
      case 'mspace':
      case 'mi':
      case 'mo':
      case 'mn':
      case 'ms':
      case 'maligngroup':
      case 'malignmark':
      case 'mglyph':
      case 'annotation':
      case 'semantics':
      case 'annotation-xml':
        return true
      default:
        return false
    }
  }
}

function shtml_nearest_non_math(elem:Element): Element {
  if (shtml_is_mathml(elem)) {
    shtml_nearest_non_math(elem.parentNode as Element)
  } else {
    return elem
  }
}