import { do_shtml } from "./shtml";

export const WINDOW = window as any;

export const NAMESPACES = {
  HTML : 'http://www.w3.org/1999/xhtml',
  MATHML : 'http://www.w3.org/1998/Math/MathML',
  SHTML : 'http://kwarc.info/ns/SHTML'
}
export const USE_RAW = true;
if (!WINDOW.SHTML_SERVER) {
  WINDOW.SHTML_SERVER = 'https://stexmmt.mathhub.info/:sTeX' // 'http://localhost:8080/:sTeX' //
}
if (!WINDOW.SHTML_LANGUAGE) {
  WINDOW.SHTML_LANGUAGE = 'en'
}

export var SHTML_NS_ABBREV = "shtml"

function set_namespace_abbrev() {
  const doc = document.documentElement;
  for (let i = 0; i < doc.attributes.length; i++) {
    const attr = doc.attributes[i]
    if (attr.name.startsWith("xmlns:") && attr.value === NAMESPACES.SHTML) {
      SHTML_NS_ABBREV = attr.name.substring(6)
      return
    }
  }
}


const SHTML_LISTENER = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    //console.log("Mutation: ",mutation)
    mutation.addedNodes.forEach((node) => {
      //console.log("Here: ",node)
      if (node.nodeType === Node.ELEMENT_NODE) {
        do_shtml(node as Element)
      }
    })
  })
})

document.addEventListener('DOMContentLoaded', () => {
  SHTML_LISTENER.observe(document.body, { childList: true, subtree: true })
  initialize()
  do_shtml(document.body)
});

import {init_css} from "./css"

function initialize() {
  set_namespace_abbrev()
  init_css()
}