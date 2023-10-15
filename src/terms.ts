function shtml_do_term(elem:Element) {
  const kind = shtml_parse_term_kind(elem)
  const data = shtml_get_term_components(elem)
  data.args.forEach((arg) => {
    do_shtml(arg)
  })
  shtml_tooltip_inc()
  data.components.forEach((comp) => {
    switch (kind) {
      case SHTMLTerm.OMV:
      case SHTMLTerm.OMA_OMV:
      case SHTMLTerm.OMB_OMV:
        shtml_add_tooltip(comp,`Variable ${data.symbolname}`,data.components)
        comp.classList.add(`shtml-varcomp`)
        break
      default:
        shtml_add_tooltip(comp,`Symbol ${data.symbolname}`,data.components)
        comp.classList.add(`shtml-symcomp`)
        break
    }
  })
}

enum SHTMLTerm {
  OMID,OMV,OMA_OMID,OMA_OMV,OMB_OMID,OMB_OMV
}
function shtml_parse_term_kind(elem:Element):SHTMLTerm | undefined {
  const s = elem.attributes.getNamedItem('shtml:term')?.value
  let path = elem.attributes.getNamedItem('shtml:head')?.value
  let issym = path.split('?').length > 1
  switch (s) {
    case 'OMID': 
      if (issym) return SHTMLTerm.OMID
      return SHTMLTerm.OMV
    case 'OMV': return SHTMLTerm.OMV
    case 'OMA':
      if (issym) return SHTMLTerm.OMA_OMID
      return SHTMLTerm.OMA_OMV
    case 'OMB':
      if (issym) return SHTMLTerm.OMB_OMID
      return SHTMLTerm.OMB_OMV
  }
}

class SHTMLTermData {
  symbolname:string
  components:Element[]
  args:Element[]
}

function shtml_get_term_components(elem:Element): SHTMLTermData {
  const components:Element[] = []
  const args:Element[] = []
  const symbolname = elem.attributes.getNamedItem('shtml:head')?.value
  function iter(e:Element) {
    let isarg = e.attributes.getNamedItem('shtml:arg')
    if (isarg) {
      args.push(e)
      return
    }
    let iscomp = e.attributes.getNamedItem('shtml:comp')
    if (iscomp) {
      components.push(e)
      return
    }
    iscomp = e.attributes.getNamedItem('shtml:maincomp')
    if (iscomp) {
      components.push(e)
      return
    }
    iscomp = e.attributes.getNamedItem('shtml:varcomp')
    if (iscomp) {
      components.push(e)
      return
    }
    e.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        iter(node as Element);
      }
    })
  }
  iter(elem)
  return {components,args,symbolname}
}