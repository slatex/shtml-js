import tippy, { Instance, Props } from 'tippy.js'
import {SorV, TermData} from './terms'
import {definitionsMap} from './shtml'
import { WINDOW, USE_RAW } from './main'

function remote_url(name:string): string {
  return `${WINDOW.SHTML_SERVER}/${USE_RAW? "raw":""}fragment?${name}&language=${WINDOW.SHTML_LANGUAGE}`
}

/*
export class SHTMLHoverable {
  tp:SHTMLSymbolOrVar
  path:string
  elems:Element[]
  constructor(kind:Term,data:TermData) {
    switch (kind) {
      case Term.OMV:
      case Term.OMA_OMV:
      case Term.OMB_OMV:
        this.tp = SHTMLSymbolOrVar.Var
        break
      default:
        this.tp = SHTMLSymbolOrVar.Symbol
        break
    }
    this.path = data.symbolname
    this.elems = data.components
  }
}
*/

export function add_symbol_hover(data:TermData) {
  if (data.symbol === SorV.Var) {
    data.components.forEach((elem) => {
      elem.classList.add(`shtml-varcomp`)
      hover_variable(data.symbolname,data.components)
      //elem.addEventListener('mouseover',(e) => hover_variable(data.symbolname,data.components,e as MouseEvent))
    })
  } else {
    data.components.forEach((elem) => {
      elem.classList.add(`shtml-symcomp`)
      hover_symbol(data.symbolname,data.components)
      //elem.addEventListener('mouseover',(e) => hover_symbol(data.symbolname,data.components,e as MouseEvent))
    })
  }
}

function common_hover(elems:Element[],cont: () => string | Element | DocumentFragment) {
  tippy(elems,{
    content: "Loading...",
    interactive: true,
    allowHTML: true,
    appendTo:document.body,
    animateFill: false,
    animation: 'fade',
    placement: 'bottom',
    maxWidth: 600,
    delay: [0,50],
    duration:[275, 250],
    onShow: (i) => {
      i.setContent(cont())
      elems.forEach((e) => {
        e.classList.add(`shtml-on-hover`)
      })
    },
    onHide: (i) => {
      elems.forEach((elem) => {
        elem.classList.remove(`shtml-on-hover`)
      })
    }
  })
}


async function hover_symbol(name:string,elems:Element[]) {
  common_hover(elems,() => {
    const div = document.createElement('div')
    div.classList.add('shtml-hover-window')
    div.innerHTML = `Symbol ${name} (Loading...)`
    let htmlo = definitionsMap.get(name);
    if (htmlo) {
      div.innerHTML = htmlo.innerHTML
    } else {
      try {
        fetch(remote_url(name)).then((response) => {
          if (!response.ok) { throw new Error("HTTP error " + response.status) }
          response.text().then((html) => {
            div.innerHTML = html
          })
        })
      } catch (e) {
        console.error(e)
        div.innerHTML = `Symbol ${name}`
      }
    }
    return div
  })
}

function hover_variable(name:string,elems:Element[]) {
  common_hover(elems,() => {
    const div = document.createElement('div')
    div.classList.add('shtml-hover-window')
    div.innerHTML = `Variable ${name}`
    return div
  })
}

/*
function common_hover(elems:Element[],event:MouseEvent, cont:(div:HTMLDivElement) => void) {
  elems.forEach((elem) => {
    elem.classList.add(`shtml-on-hover`)
    //tippy(elem)
  })
  const z = Math.max(...elems.map(e => {
    const s = window.getComputedStyle(e).getPropertyValue('z-index')
    return (s === 'auto') ? 10 : parseInt(s,10)
  }))
  const barrier = document.createElement('div')
  barrier.classList.add('shtml-barrier')
  barrier.style.zIndex = (z+1).toString()
  const parent = document.body//shtml_nearest_non_math(elems[0])
  parent.appendChild(barrier)
  const tt = document.createElement('div')
  tt.style.zIndex = (z+2).toString()
  tt.classList.add('shtml-hover-window')
  tt.style.left = (event.pageX - 20) + 'px'
  tt.style.top = (event.pageY - 20) + 'px'
  tt.addEventListener('mouseleave',(_) => destroy_hover([tt,barrier],elems))
  cont(tt)
  parent.appendChild(tt)
}

async function hover_symbol(name:string,elems:Element[],event:MouseEvent) {
  common_hover(elems,event,async (tt) => {
    let htmlo = definitionsMap.get(name);
    if (htmlo) {
      tt.innerHTML = htmlo.innerHTML
    } else {
      try {
        const response = await fetch(`${WINDOW.SHTML_SERVER}/${USE_RAW? "raw":""}fragment?${name}`)
        if (!response.ok) { throw new Error("HTTP error " + response.status) }
        const html = await response.text()
        tt.innerHTML = html
      } catch (e) {
        console.error(e)
        tt.innerText = `Symbol ${name}`
      }
    }
  })
}

function hover_variable(name:string,elems:Element[],event:MouseEvent) {
  common_hover(elems,event,(tt) => tt.innerText = `Variable ${name}`)
}

function destroy_hover(e:Element[],elems:Element[]) {
  e.forEach(c => c.remove())
  elems.forEach((elem) => {
    elem.classList.remove(`shtml-on-hover`)
  })
}
*/



/*
function shtml_add_tooltip(elem:Element, tooltip:string,elems:Element[]) {
  const id = `shtml-tooltip-${shtml_tooltip_counter}`
  elem.addEventListener('mouseover',(e) => shtml_on_hover(id,elems,e as MouseEvent))
}

function shtml_add_tooltip_old(elem:Element, tooltip:string,elems:Element[]) {
  const id = `shtml-tooltip-${shtml_tooltip_counter}`
  if (!shtml_tooltip_created) {
    shtml_tooltip_created = true
    const toolE = document.createElement('div')
    toolE.setAttribute('id',id)
    toolE.setAttribute('class','shtml-tooltip')
    toolE.innerText = tooltip
    document.body.appendChild(toolE)
  }
  elem.addEventListener('mouseover',(e) => shtml_on_hover(id,elems,e as MouseEvent))
  elem.addEventListener('mousemove',(e) => shtml_hover_move(id,e as MouseEvent))
  elem.addEventListener('mouseout',(_) => shtml_end_hover(id,elems))
}

function shtml_on_hover(tooltip:string,elems:Element[],e:MouseEvent) {
  elems.forEach((elem) => {
    elem.classList.add(`shtml-on-hover`)
  })
  

}

function shtml_on_hover_old(tooltip:string,elems:Element[],e:MouseEvent) {
  elems.forEach((elem) => {
    elem.classList.add(`shtml-on-hover`)
  })
  const tt = document.getElementById(tooltip)
  tt.style.display = 'block'
  tt.style.left = e.pageX + 'px'
  tt.style.top = e.pageY + 'px'
}
function shtml_end_hover(tooltip:string,elems:Element[]) {
  elems.forEach((elem) => {
    elem.classList.remove(`shtml-on-hover`)
  })
  const tt = document.getElementById(tooltip)
  tt.style.display = 'none'
}
function shtml_hover_move(tooltip:string,e:MouseEvent) {
  const tt = document.getElementById(tooltip)
  tt.style.left = e.pageX + 'px'
  tt.style.top = e.pageY + 'px'
}
*/