let shtml_tooltip_counter = 0
let shtml_tooltip_created = false
function shtml_tooltip_inc() {
  if (!shtml_tooltip_created) return
  shtml_tooltip_counter++
  shtml_tooltip_created = false
}

enum SHTMLSymbolOrVar {Symbol,Var}
class SHTMLHoverable {
  tp:SHTMLSymbolOrVar
  path:string
  elems:Element[]
  constructor(kind:SHTMLTerm,data:SHTMLTermData) {
    switch (kind) {
      case SHTMLTerm.OMV:
      case SHTMLTerm.OMA_OMV:
      case SHTMLTerm.OMB_OMV:
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

function shtml_add_symbol_hover(hoverable:SHTMLHoverable) {
  if (hoverable.tp === SHTMLSymbolOrVar.Var) {
    hoverable.elems.forEach((elem) => {
      elem.classList.add(`shtml-varcomp`)
      elem.addEventListener('mouseover',(e) => shtml_hover_variable(hoverable.path,hoverable.elems,e as MouseEvent))
    })
  } else {
    hoverable.elems.forEach((elem) => {
      elem.classList.add(`shtml-symcomp`)
      elem.addEventListener('mouseover',(e) => shtml_hover_symbol(hoverable.path,hoverable.elems,e as MouseEvent))
    })
  }
}

function shtml_common_hover(elems:Element[],event:MouseEvent, cont:(div:HTMLDivElement) => void) {
  elems.forEach((elem) => {
    elem.classList.add(`shtml-on-hover`)
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
  tt.addEventListener('mouseleave',(_) => shtml_destroy_hover([tt,barrier],elems))
  cont(tt)
  parent.appendChild(tt)
}

async function shtml_hover_symbol(name:string,elems:Element[],event:MouseEvent) {
  shtml_common_hover(elems,event,async (tt) => {
    let htmlo = shtml_definitionsMap.get(name);
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

function shtml_hover_variable(name:string,elems:Element[],event:MouseEvent) {
  shtml_common_hover(elems,event,(tt) => tt.innerText = `Variable ${name}`)
}

function shtml_destroy_hover(e:Element[],elems:Element[]) {
  e.forEach(c => c.remove())
  elems.forEach((elem) => {
    elem.classList.remove(`shtml-on-hover`)
  })
}
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