'use strict';
const filterButtons=[...document.querySelectorAll('.filter')];
const cards=[...document.querySelectorAll('.game-card')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.filter;
  filterButtons.forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active))});
  cards.forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category});
}));
document.getElementById('randomGame').addEventListener('click',()=>{
  const visible=cards.filter(card=>!card.hidden);
  const pick=visible[Math.floor(Math.random()*visible.length)]||cards[0];
  const chosen=pick.querySelector('a');
  if(chosen.classList.contains('world-link'))window.open(chosen.href,'_blank','noopener,noreferrer');
  else window.location.href=chosen.getAttribute('href');
});
document.getElementById('toTop').addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:'smooth'})});

const gameSection=document.getElementById('games');
for(const link of document.querySelectorAll('a[href="#games"]'))link.addEventListener('click',event=>{
  event.preventDefault();
  gameSection.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  history.replaceState(null,'','#games');
});

// Keep every Arcade promo tied to the same 53-card ATTAX master deck.
// The cards rotate in-place so the menu art is not permanently pinned to one card.
(() => {
  const TOTAL_CARDS = 53;
  const cardSrc = id => `games/attax/cards/${String(id).padStart(2,'0')}.webp`;
  const targets = [
    ...document.querySelectorAll('.hero-card'),
    ...document.querySelectorAll('.attax-deck img'),
    ...document.querySelectorAll('.memory-deck img')
  ];
  if (!targets.length) return;

  let order = [];
  const refill = () => {
    order = Array.from({length:TOTAL_CARDS},(_,i)=>i+1);
    for (let i=order.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [order[i],order[j]]=[order[j],order[i]];
    }
  };
  const srcId = img => Number((img.getAttribute('src')||'').match(/(\d{2})\.webp$/)?.[1]||0);
  const nextId = excluded => {
    if (!order.length) refill();
    let id=order.pop();
    let guard=0;
    while (excluded.has(id) && guard++<TOTAL_CARDS) {
      order.unshift(id);
      id=order.pop();
    }
    return id;
  };
  const swap = (img, excluded=new Set()) => {
    const current=srcId(img);
    excluded.add(current);
    const id=nextId(excluded);
    img.classList.add('card-swap-out');
    window.setTimeout(() => {
      img.src=cardSrc(id);
      img.alt='PCBL ATTAX player card';
      const reveal=()=>img.classList.remove('card-swap-out');
      if (img.complete) requestAnimationFrame(reveal);
      else img.addEventListener('load',reveal,{once:true});
    },220);
  };
  refill();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Stagger the three menu groups so their cards do not all flip at once.
  const hero=[...document.querySelectorAll('.hero-card')];
  const attax=[...document.querySelectorAll('.attax-deck img')];
  const memory=[...document.querySelectorAll('.memory-deck img')];
  window.setInterval(()=>{
    const used=new Set(hero.map(srcId));
    hero.forEach((img,i)=>window.setTimeout(()=>swap(img,used),i*320));
  },3200);
  window.setTimeout(()=>window.setInterval(()=>{
    const used=new Set(attax.map(srcId));
    attax.forEach((img,i)=>window.setTimeout(()=>swap(img,used),i*300));
  },3000),850);
  window.setTimeout(()=>window.setInterval(()=>{
    memory.forEach(img=>swap(img,new Set()));
  },2700),1450);
})();

// WORLD is a separate Cloudflare Worker; do not link to suspended Netlify domains.
// The site owner can provide the exact workers.dev (or custom) URL and this
// package can be republished with the right destination for all visitors.
(function(){
  const raw=String(window.PCBL_WORLD_URL || '').trim();
  let url='';
  try{
    const parsed=new URL(raw);
    if(parsed.protocol==='https:' && /\/world\/?$/.test(parsed.pathname) &&
       !/\.netlify\.app$/i.test(parsed.hostname)) url=parsed.href;
  }catch{}
  for(const link of document.querySelectorAll('a.world-link')){
    if(url){
      link.href=url;link.target='_blank';link.rel='noopener noreferrer';
      link.title='Launch PCBL WORLD full-size in a new browser tab';
    }else{
      link.removeAttribute('target');link.href='#world-link-pending';
      link.title='PCBL WORLD is being connected to its new Cloudflare website';
      link.addEventListener('click',function(e){
        e.preventDefault();
        window.alert('PCBL WORLD is being connected to its new Cloudflare URL. The rest of the Arcade is playable now.');
      });
    }
  }
})();
