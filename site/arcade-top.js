/* Reset the GAME PAGE to its own top on navigation without hijacking
   scrolling inside game controls, cards, dialogs, or the start overlay. */
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (_) {}
function pcblArcadeTop(){
  window.scrollTo(0, 0);
  const overlay = document.getElementById('start-overlay');
  if (overlay) overlay.scrollTop = 0;
}
window.addEventListener('pageshow', pcblArcadeTop);
window.addEventListener('load', pcblArcadeTop);
