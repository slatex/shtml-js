function shtml_is_mathml(elem: Element): boolean {
  let element : Element | null = elem
  while (element) {
    if (element.namespaceURI === MATHML_NS) return true
    if (element.namespaceURI === HTML_NS) return false
    element = element.parentNode as Element
  }
}

function shtml_nearest_non_math(elem:Element): Element {
  if (shtml_is_mathml(elem)) {
    shtml_nearest_non_math(elem.parentNode as Element)
  } else {
    return elem
  }
}