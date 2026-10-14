(() => {
  "use strict";

  const CARDS = [
    {id:1,file:"../attax/cards/01.webp",name:"Auden Mitchell \u2014 Bonds Award",season:"Season 1",category:"Award"},
    {id:2,file:"../attax/cards/02.webp",name:"Auden Mitchell \u2014 Judge Award",season:"Season 1",category:"Award"},
    {id:3,file:"../attax/cards/03.webp",name:"Jarvis McGrath \u2014 Gwynn Award",season:"Season 1",category:"Award"},
    {id:4,file:"../attax/cards/04.webp",name:"Jason Diaz \u2014 Clutch God",season:"Season 1",category:"Award"},
    {id:5,file:"../attax/cards/05.webp",name:"Jarvis McGrath \u2014 Cy Young",season:"Season 1",category:"Award"},
    {id:6,file:"../attax/cards/06.webp",name:"Auden Mitchell \u2014 PCC Game 2",season:"Season 1",category:"Lowlight"},
    {id:7,file:"../attax/cards/07.webp",name:"Jason and Auden \u2014 Auden / Jason",season:"Season 1",category:"Lowlight"},
    {id:8,file:"../attax/cards/08.webp",name:"Auden Mitchell \u2014 5 Home Runs",season:"Season 1",category:"Moment"},
    {id:9,file:"../attax/cards/09.webp",name:"Jarvis McGrath \u2014 PCC Game 1 Walkoff",season:"Season 1",category:"Moment"},
    {id:10,file:"../attax/cards/10.webp",name:"Jason Diaz \u2014 Game 1 Walkoff",season:"Season 1",category:"Moment"},
    {id:11,file:"../attax/cards/11.webp",name:"Auden Mitchell \u2014 First No-Hitter",season:"Season 1",category:"Moment"},
    {id:12,file:"../attax/cards/12.webp",name:"Jarvis McGrath \u2014 8 Strikeouts",season:"Season 1",category:"Moment"},
    {id:13,file:"../attax/cards/13.webp",name:"Auden Mitchell \u2014 Postseason",season:"Season 1",category:"Postseason"},
    {id:14,file:"../attax/cards/14.webp",name:"Jarvis McGrath \u2014 Playoffs",season:"Season 1",category:"Postseason"},
    {id:15,file:"../attax/cards/15.webp",name:"Jason Diaz \u2014 Postseason",season:"Season 1",category:"Postseason"},
    {id:16,file:"../attax/cards/16.webp",name:"Auden Mitchell \u2014 1.802 OPS Record",season:"Season 1",category:"Record"},
    {id:17,file:"../attax/cards/17.webp",name:"Auden Mitchell \u2014 13 HR Record",season:"Season 1",category:"Record"},
    {id:18,file:"../attax/cards/18.webp",name:"Jarvis McGrath \u2014 3 Walkoff Championship",season:"Season 1",category:"Record"},
    {id:19,file:"../attax/cards/19.webp",name:"Jason Diaz \u2014 Rookie",season:"Season 1",category:"Rookie"},
    {id:20,file:"../attax/cards/20.webp",name:"Auden Mitchell \u2014 Rookie",season:"Season 1",category:"Rookie"},
    {id:21,file:"../attax/cards/21.webp",name:"Coel Rioux-Jones \u2014 Rookie",season:"Season 1",category:"Rookie"},
    {id:22,file:"../attax/cards/22.webp",name:"Jarvis McGrath \u2014 Rookie",season:"Season 1",category:"Rookie"},
    {id:23,file:"../attax/cards/23.webp",name:"Auden Mitchell \u2014 Season 1",season:"Season 1",category:"Season"},
    {id:24,file:"../attax/cards/24.webp",name:"Jason Diaz \u2014 Season 1",season:"Season 1",category:"Season"},
    {id:25,file:"../attax/cards/25.webp",name:"Auden Mitchell \u2014 Bonds Award",season:"Season 2",category:"Award"},
    {id:26,file:"../attax/cards/26.webp",name:"Auden Mitchell \u2014 Clutch God Award",season:"Season 2",category:"Award"},
    {id:27,file:"../attax/cards/27.webp",name:"Auden Mitchell \u2014 Gwynn Award",season:"Season 2",category:"Award"},
    {id:28,file:"../attax/cards/28.webp",name:"Jarvis McGrath \u2014 Gwynn Award",season:"Season 2",category:"Award"},
    {id:29,file:"../attax/cards/29.webp",name:"Najee Blackman \u2014 Judge Award",season:"Season 2",category:"Award"},
    {id:30,file:"../attax/cards/30.webp",name:"Najee Blackman \u2014 Soto Award",season:"Season 2",category:"Award"},
    {id:31,file:"../attax/cards/31.webp",name:"Jarvis McGrath \u2014 Cy Young",season:"Season 2",category:"Award"},
    {id:32,file:"../attax/cards/32.webp",name:"Najee and Jarvis \u2014 PCC Game 2 No-Hit",season:"Season 2",category:"Lowlight"},
    {id:33,file:"../attax/cards/33.webp",name:"Najee Blackman \u2014 Playoff No-Hit",season:"Season 2",category:"Lowlight"},
    {id:34,file:"../attax/cards/34.webp",name:"Jarvis McGrath \u2014 2\u00d7 Champion",season:"Season 2",category:"Milestone"},
    {id:35,file:"../attax/cards/35.webp",name:"Jarvis McGrath \u2014 Undefeated",season:"Season 2",category:"Milestone"},
    {id:36,file:"../attax/cards/36.webp",name:"Jarvis McGrath \u2014 5 HR vs Najee",season:"Season 2",category:"Moment"},
    {id:37,file:"../attax/cards/37.webp",name:"Jarvis McGrath \u2014 Game 6 Walkoff",season:"Season 2",category:"Moment"},
    {id:38,file:"../attax/cards/38.webp",name:"Najee Blackman \u2014 4 HR vs Auden",season:"Season 2",category:"Moment"},
    {id:39,file:"../attax/cards/39.webp",name:"Najee Blackman \u2014 First Career HR",season:"Season 2",category:"Moment"},
    {id:40,file:"../attax/cards/40.webp",name:"Auden Mitchell \u2014 Postseason",season:"Season 2",category:"Postseason"},
    {id:41,file:"../attax/cards/41.webp",name:"Jarvis McGrath \u2014 Postseason",season:"Season 2",category:"Postseason"},
    {id:42,file:"../attax/cards/42.webp",name:"Najee Blackman \u2014 Playoffs",season:"Season 2",category:"Postseason"},
    {id:43,file:"../attax/cards/43.webp",name:"Jarvis McGrath \u2014 ERA Record",season:"Season 2",category:"Record"},
    {id:44,file:"../attax/cards/44.webp",name:"Jarvis McGrath \u2014 League Leader",season:"Season 2",category:"Record"},
    {id:45,file:"../attax/cards/45.webp",name:"Najee Blackman \u2014 Rookie",season:"Season 2",category:"Rookie"},
    {id:46,file:"../attax/cards/46.webp",name:"Jarvis McGrath \u2014 Season 2",season:"Season 2",category:"Season"},
    {id:47,file:"../attax/cards/47.webp",name:"Najee Blackman \u2014 Season 2",season:"Season 2",category:"Season"},
    {id:48,file:"../attax/cards/48.webp",name:"Auden Mitchell \u2014 Season 2",season:"Season 2",category:"Season"},
    {id:49,file:"../attax/cards/49.webp",name:"Auden Mitchell \u2014 15 Runs Allowed",season:"Season 3",category:"Lowlight"},
    {id:50,file:"../attax/cards/50.webp",name:"Coel Rioux-Jones \u2014 Opening Day",season:"Season 3",category:"Lowlight"},
    {id:51,file:"../attax/cards/51.webp",name:"Auden Mitchell \u2014 Grand Slam #1",season:"Season 3",category:"Moment"},
    {id:52,file:"../attax/cards/52.webp",name:"Boston Yorkers \u2014 Boston Yorkers Debut",season:"Season 3",category:"Moment"},
    {id:53,file:"../attax/cards/53.webp",name:"Josef Shutovsky \u2014 Lowlights",season:"Season 3",category:"Lowlight"}
  ];

  const LEVELS = {
    6:{ name:"ROOKIE",columns:4 },
    10:{ name:"ALL-STAR",columns:5 },
    15:{ name:"LEGEND",columns:6 }
  };

  const dom = {
    difficultyButtons:[...document.querySelectorAll("[data-pairs]")],
    dealButton:document.getElementById("dealButton"),
    newGameButton:document.getElementById("newGameButton"),
    board:document.getElementById("memoryBoard"),
    gameShell:document.getElementById("gameShell"),
    boardTitle:document.getElementById("boardTitle"),
    time:document.getElementById("timeValue"),
    moves:document.getElementById("movesValue"),
    matches:document.getElementById("matchesValue"),
    pairsTotal:document.getElementById("pairsTotal"),
    best:document.getElementById("bestValue"),
    status:document.getElementById("statusText"),
    progress:document.getElementById("progressBar"),
    sound:document.getElementById("soundToggle"),
    fullscreen:document.getElementById("fullscreenButton"),
    modal:document.getElementById("winModal"),
    winMessage:document.getElementById("winMessage"),
    winTime:document.getElementById("winTime"),
    winMoves:document.getElementById("winMoves"),
    winRating:document.getElementById("winRating"),
    playAgain:document.getElementById("playAgainButton"),
    changeDifficulty:document.getElementById("changeDifficultyButton"),
    confetti:document.getElementById("confetti")
  };

  const state = {
    pairs:10,
    first:null,
    second:null,
    locked:false,
    moves:0,
    matches:0,
    seconds:0,
    started:false,
    finished:false,
    timer:null,
    sound:true
  };

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i],copy[j]] = [copy[j],copy[i]];
    }
    return copy;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2,"0");
    const secs = (seconds % 60).toString().padStart(2,"0");
    return `${mins}:${secs}`;
  }

  function bestKey() { return `pcbl-attax-memory-best-${state.pairs}`; }

  function getBest() {
    try { return JSON.parse(localStorage.getItem(bestKey())); } catch (_) { return null; }
  }

  function showBest() {
    const best = getBest();
    dom.best.textContent = best ? `${best.moves} / ${formatTime(best.seconds)}` : "—";
  }

  function saveBest() {
    const current = { moves:state.moves,seconds:state.seconds };
    const previous = getBest();
    const isBetter = !previous || current.moves < previous.moves || (current.moves === previous.moves && current.seconds < previous.seconds);
    if (isBetter) {
      try { localStorage.setItem(bestKey(),JSON.stringify(current)); } catch (_) {}
    }
    return isBetter;
  }

  function cardMarkup(card,copy) {
    return `<button class="memory-card" type="button" data-card="${card.id}" data-copy="${copy}" aria-label="Face-down ATTAX card">
      <span class="card-face card-back" aria-hidden="true"></span>
      <span class="card-face card-front"><img src="${card.file}" alt="${card.name} — ${card.season} ${card.category}" draggable="false"></span>
    </button>`;
  }

  function renderPreview() {
    const samples = shuffle(CARDS).slice(0,5);
    dom.board.className = "memory-board preview";
    dom.board.style.setProperty("--columns",5);
    dom.board.innerHTML = samples.map((card,index) => cardMarkup(card,index)).join("");
    dom.board.querySelectorAll(".memory-card").forEach((card) => { card.disabled = true; });
  }

  function resetState() {
    window.clearInterval(state.timer);
    Object.assign(state,{ first:null,second:null,locked:false,moves:0,matches:0,seconds:0,started:false,finished:false,timer:null });
    dom.time.textContent = "00:00";
    dom.moves.textContent = "0";
    dom.matches.textContent = "0";
    dom.pairsTotal.textContent = `/${state.pairs}`;
    dom.progress.style.width = "0%";
  }

  function dealCards(scroll = true) {
    resetState();
    const chosen = shuffle(CARDS).slice(0,state.pairs);
    const deck = shuffle(chosen.flatMap((card) => [{ card,copy:0 },{ card,copy:1 }]));
    const level = LEVELS[state.pairs];
    dom.board.className = "memory-board";
    dom.board.dataset.pairs = state.pairs;
    dom.board.style.setProperty("--columns",level.columns);
    dom.board.innerHTML = deck.map(({card,copy}) => cardMarkup(card,copy)).join("");
    dom.boardTitle.textContent = `${level.name} DECK`;
    dom.status.textContent = "FLIP ANY TWO CARDS. THE TIMER STARTS ON YOUR FIRST MOVE.";
    dom.board.querySelectorAll(".memory-card").forEach((button) => button.addEventListener("click",() => flipCard(button)));
    showBest();
    if (scroll) dom.gameShell.scrollIntoView({ behavior:"smooth",block:"start" });
  }

  function startTimer() {
    if (state.started) return;
    state.started = true;
    state.timer = window.setInterval(() => {
      state.seconds += 1;
      dom.time.textContent = formatTime(state.seconds);
    },1000);
  }

  function flipCard(card) {
    if (state.locked || state.finished || card === state.first || card.classList.contains("matched")) return;
    startTimer();
    card.classList.add("flipped");
    card.setAttribute("aria-label",card.querySelector("img").alt);
    tone(280,.035);
    if (!state.first) {
      state.first = card;
      dom.status.textContent = "ONE CARD REVEALED — FIND ITS MATCH.";
      return;
    }
    state.second = card;
    state.moves += 1;
    dom.moves.textContent = state.moves;
    checkPair();
  }

  function checkPair() {
    const match = state.first.dataset.card === state.second.dataset.card;
    if (match) {
      state.first.classList.add("matched");
      state.second.classList.add("matched");
      state.first.disabled = true;
      state.second.disabled = true;
      state.matches += 1;
      dom.matches.textContent = state.matches;
      dom.progress.style.width = `${state.matches / state.pairs * 100}%`;
      dom.status.textContent = `MATCH FOUND — ${state.pairs - state.matches} PAIR${state.pairs - state.matches === 1 ? "" : "S"} REMAINING.`;
      tone(620,.08);
      window.setTimeout(() => tone(830,.1),85);
      clearTurn();
      if (state.matches === state.pairs) window.setTimeout(completeGame,550);
      return;
    }
    state.locked = true;
    dom.status.textContent = "NO MATCH — MEMORIZE THEM.";
    tone(155,.09);
    window.setTimeout(() => {
      state.first.classList.remove("flipped");
      state.second.classList.remove("flipped");
      state.first.setAttribute("aria-label","Face-down ATTAX card");
      state.second.setAttribute("aria-label","Face-down ATTAX card");
      clearTurn();
      dom.status.textContent = "TRY ANOTHER PAIR.";
    },850);
  }

  function clearTurn() {
    state.first = null;
    state.second = null;
    state.locked = false;
  }

  function rating() {
    const extra = state.moves - state.pairs;
    if (extra <= Math.ceil(state.pairs * .35)) return "S";
    if (extra <= state.pairs) return "A";
    if (extra <= state.pairs * 2) return "B";
    return "C";
  }

  function completeGame() {
    state.finished = true;
    window.clearInterval(state.timer);
    const personalBest = saveBest();
    showBest();
    dom.winTime.textContent = formatTime(state.seconds);
    dom.winMoves.textContent = state.moves;
    dom.winRating.textContent = rating();
    dom.winMessage.textContent = personalBest
      ? `New personal best on the ${LEVELS[state.pairs].name.toLowerCase()} deck.`
      : `You matched all ${state.pairs} cards from the ${LEVELS[state.pairs].name.toLowerCase()} deck.`;
    buildConfetti();
    dom.modal.hidden = false;
    dom.playAgain.focus();
    tone(740,.1);
    window.setTimeout(() => tone(940,.12),110);
  }

  function buildConfetti() {
    const colors = ["#fff141","#cbff87","#f2f2ec","#ff943d","#398cff","#ff414d"];
    dom.confetti.innerHTML = Array.from({length:55},(_,index) => {
      const left = Math.round(Math.random() * 100);
      const duration = (2.7 + Math.random() * 2.6).toFixed(2);
      const delay = (-Math.random() * 4).toFixed(2);
      const drift = `${Math.round((Math.random() - .5) * 190)}px`;
      return `<i style="left:${left}%;--c:${colors[index % colors.length]};--d:${duration}s;--delay:${delay}s;--drift:${drift};--r:${Math.round(Math.random()*180)}deg"></i>`;
    }).join("");
  }

  let audioContext = null;
  function tone(frequency,duration) {
    if (!state.sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.045,audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (_) {}
  }

  dom.difficultyButtons.forEach((button) => button.addEventListener("click",() => {
    state.pairs = Number(button.dataset.pairs);
    dom.difficultyButtons.forEach((item) => item.classList.toggle("active",item === button));
    dom.boardTitle.textContent = `${LEVELS[state.pairs].name} DECK`;
    dom.pairsTotal.textContent = `/${state.pairs}`;
    showBest();
  }));
  dom.dealButton.addEventListener("click",() => dealCards(true));
  dom.newGameButton.addEventListener("click",() => dealCards(false));
  dom.playAgain.addEventListener("click",() => { dom.modal.hidden = true; dealCards(false); });
  dom.changeDifficulty.addEventListener("click",() => {
    dom.modal.hidden = true;
    document.querySelector(".difficulty-panel").scrollIntoView({ behavior:"smooth",block:"start" });
  });
  dom.sound.addEventListener("click",() => {
    state.sound = !state.sound;
    dom.sound.textContent = `SOUND: ${state.sound ? "ON" : "OFF"}`;
    dom.sound.setAttribute("aria-pressed",state.sound);
    dom.sound.setAttribute("aria-label",`Turn sound ${state.sound ? "off" : "on"}`);
    if (state.sound) tone(480,.05);
  });
  dom.fullscreen.addEventListener("click",async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  });
  document.addEventListener("fullscreenchange",() => { dom.fullscreen.textContent = document.fullscreenElement ? "EXIT ×" : "EXPAND ↗"; });

  renderPreview();
  showBest();
})();
