import {add_symbol_hover as add_symbol_hover  } from './tooltip'
import {do_shtml} from './shtml'

export function do_term(elem:Element) {
  const data = get_term_components(elem)
  data.args.forEach((arg) => {
    do_shtml(arg)
  })
  add_symbol_hover(data)
/*

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
  */
}

export enum SorV {Symbol,Var}
export enum Term { OMID,OMA,OMB }

export class TermData {
  kind:Term
  symbol:SorV
  symbolname:string
  components:Element[]
  args:Element[]
}

function get_term_components(elem:Element): TermData {

  var kind = Term.OMID
  var symbol = SorV.Symbol
  const s = elem.attributes.getNamedItem('shtml:term')?.value
  let path = elem.attributes.getNamedItem('shtml:head')?.value
  let issym = path.split('?').length > 1
  switch (s) {
    case 'OMID': 
      if (!issym) symbol = SorV.Var
      break
    case 'OMV':
      symbol = SorV.Var
      break
    case 'OMA':
      if (!issym) symbol = SorV.Var
      kind = Term.OMA
      break
    case 'OMB':
      if (!issym) symbol = SorV.Var
      kind = Term.OMB
      break
  }

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
  return {components,args,symbolname,kind,symbol}
}