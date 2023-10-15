let tooltip_counter = 0
let tooltip_created = false
function shtml_tooltip_inc() {
  if (!tooltip_created) return
  tooltip_counter++
  tooltip_created = false
}

function shtml_add_tooltip(elem:Element, tooltip:string,elems:Element[]) {
  const id = `shtml-tooltip-${tooltip_counter}`
  if (!tooltip_created) {
    tooltip_created = true
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