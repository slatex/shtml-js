const WINDOW = window as any;

const HTML_NS = 'http://www.w3.org/1999/xhtml';
const MATHML_NS = 'http://www.w3.org/1998/Math/MathML';
const SHTML_NS = 'http://kwarc.info/ns/SHTML';

if (!WINDOW.SHTML_SERVER) {
  WINDOW.SHTML_SERVER = 'https://stexmmt.mathhub.info/:sTeX' // 'http://localhost:8080/:sTeX' //
}
const USE_RAW = false;

const SHTML_LISTENER = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    //console.log("Mutation: ",mutation)
    mutation.addedNodes.forEach((node) => {
      //console.log("Here: ",node)
      if (node.nodeType === Node.ELEMENT_NODE) {
        do_shtml(node as Element);
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  SHTML_LISTENER.observe(document.body, { childList: true, subtree: true });
  shtml_initialize();
  do_shtml(document.body);
});

function shtml_initialize() {
  shtml_init_css();
}