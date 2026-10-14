const cards = [
  {id:1,type:"H",season:1,series:"Awards",title:"Bonds Award",player:"Auden Mitchell",img:"cards/01.webp",fb:[87,"1B"],brk:[93,"HR"],off:[84,"HR"]},
  {id:2,type:"H",season:1,series:"Awards",title:"Judge Award",player:"Auden Mitchell",img:"cards/02.webp",fb:[96,"3B"],brk:[90,"HR"],off:[89,"HR"]},
  {id:3,type:"H",season:1,series:"Awards",title:"Gwynn Award",player:"Jarvis McGrath",img:"cards/03.webp",fb:[85,"2B"],brk:[86,"HR"],off:[81,"1B"]},
  {id:4,type:"H",season:1,series:"Awards",title:"Clutch God",player:"Jason Diaz",img:"cards/04.webp",fb:[84,"1B"],brk:[90,"HR"],off:[78,"1B"]},
  {id:5,type:"P",season:1,series:"Awards",title:"Cy Young",player:"Jarvis McGrath",img:"cards/05.webp",fb:[94,"K"],brk:[82,"K"],off:[86,"K"]},
  {id:6,type:"P",season:1,series:"Lowlights",title:"PCC Game 2",player:"Auden Mitchell",img:"cards/06.webp",fb:[74,"K"],brk:[21,"PO"],off:[80,"K"]},
  {id:7,type:"P",season:1,series:"Lowlights",title:"Auden / Jason",player:"Jason and Auden",img:"cards/07.webp",fb:[90,"GO"],brk:[80,"GO"],off:[80,"K"]},
  {id:8,type:"H",season:1,series:"Moments",title:"5 Home Runs",player:"Auden Mitchell",img:"cards/08.webp",fb:[95,"2B"],brk:[87,"HR"],off:[82,"HR"]},
  {id:9,type:"H",season:1,series:"Moments",title:"PCC Game 1 Walkoff",player:"Jarvis McGrath",img:"cards/09.webp",fb:[89,"2B"],brk:[99,"HR"],off:[81,"1B"]},
  {id:10,type:"H",season:1,series:"Moments",title:"Game 1 Walkoff",player:"Jason Diaz",img:"cards/10.webp",fb:[99,"HR"],brk:[85,"2B"],off:[73,"1B"]},
  {id:11,type:"P",season:1,series:"Moments",title:"First No-Hitter",player:"Auden Mitchell",img:"cards/11.webp",fb:[86,"K"],brk:[94,"K"],off:[85,"K"]},
  {id:12,type:"P",season:1,series:"Moments",title:"8 Strikeouts",player:"Jarvis McGrath",img:"cards/12.webp",fb:[83,"GO"],brk:[96,"GO"],off:[86,"K"]},
  {id:13,type:"H",season:1,series:"Postseason",title:"Postseason",player:"Auden Mitchell",img:"cards/13.webp",fb:[94,"HR"],brk:[83,"HR"],off:[87,"2B"]},
  {id:14,type:"H",season:1,series:"Postseason",title:"Playoffs",player:"Jarvis McGrath",img:"cards/14.webp",fb:[82,"2B"],brk:[98,"HR"],off:[90,"HR"]},
  {id:15,type:"P",season:1,series:"Postseason",title:"Postseason",player:"Jason Diaz",img:"cards/15.webp",fb:[67,"PO"],brk:[79,"GO"],off:[87,"K"]},
  {id:16,type:"H",season:1,series:"Records",title:"1.802 OPS Record",player:"Auden Mitchell",img:"cards/16.webp",fb:[93,"2B"],brk:[97,"HR"],off:[86,"1B"]},
  {id:17,type:"H",season:1,series:"Records",title:"13 HR Record",player:"Auden Mitchell",img:"cards/17.webp",fb:[84,"HR"],brk:[87,"HR"],off:[78,"HR"]},
  {id:18,type:"H",season:1,series:"Records",title:"3 Walkoff Championship",player:"Jarvis McGrath",img:"cards/18.webp",fb:[83,"HR"],brk:[89,"HR"],off:[96,"HR"]},
  {id:19,type:"H",season:1,series:"Rookie",title:"Rookie",player:"Jason Diaz",img:"cards/19.webp",fb:[71,"HR"],brk:[81,"2B"],off:[62,"1B"]},
  {id:20,type:"P",season:1,series:"Rookie",title:"Rookie",player:"Auden Mitchell",img:"cards/20.webp",fb:[84,"K"],brk:[79,"GO"],off:[74,"GO"]},
  {id:21,type:"P",season:1,series:"Rookie",title:"Rookie",player:"Coel Rioux-Jones",img:"cards/21.webp",fb:[83,"K"],brk:[69,"GO"],off:[82,"GO"]},
  {id:22,type:"P",season:1,series:"Rookie",title:"Rookie",player:"Jarvis McGrath",img:"cards/22.webp",fb:[87,"GO"],brk:[79,"K"],off:[85,"K"]},
  {id:23,type:"P",season:1,series:"Season",title:"Season 1",player:"Auden Mitchell",img:"cards/23.webp",fb:[83,"K"],brk:[75,"GO"],off:[78,"K"]},
  {id:24,type:"P",season:1,series:"Season",title:"Season 1",player:"Jason Diaz",img:"cards/24.webp",fb:[82,"K"],brk:[63,"GO"],off:[71,"K"]},
  {id:25,type:"H",season:2,series:"Awards",title:"Bonds Award",player:"Auden Mitchell",img:"cards/25.webp",fb:[89,"2B"],brk:[80,"HR"],off:[85,"3B"]},
  {id:26,type:"H",season:2,series:"Awards",title:"Clutch God Award",player:"Auden Mitchell",img:"cards/26.webp",fb:[82,"HR"],brk:[71,"2B"],off:[92,"HR"]},
  {id:27,type:"H",season:2,series:"Awards",title:"Gwynn Award",player:"Auden Mitchell",img:"cards/27.webp",fb:[81,"3B"],brk:[74,"2B"],off:[85,"HR"]},
  {id:28,type:"H",season:2,series:"Awards",title:"Gwynn Award",player:"Jarvis McGrath",img:"cards/28.webp",fb:[85,"2B"],brk:[86,"HR"],off:[81,"1B"]},
  {id:29,type:"H",season:2,series:"Awards",title:"Judge Award",player:"Najee Blackman",img:"cards/29.webp",fb:[87,"HR"],brk:[90,"HR"],off:[86,"2B"]},
  {id:30,type:"H",season:2,series:"Awards",title:"Soto Award",player:"Najee Blackman",img:"cards/30.webp",fb:[83,"HR"],brk:[89,"HR"],off:[84,"1B"]},
  {id:31,type:"P",season:2,series:"Awards",title:"Cy Young",player:"Jarvis McGrath",img:"cards/31.webp",fb:[97,"K"],brk:[84,"K"],off:[87,"K"]},
  {id:32,type:"H",season:2,series:"Lowlights",title:"PCC Game 2 No-Hit",player:"Najee and Jarvis",img:"cards/32.webp",fb:[56,"BB"],brk:[65,"BB"],off:[42,"BB"]},
  {id:33,type:"H",season:2,series:"Lowlights",title:"Playoff No-Hit",player:"Najee Blackman",img:"cards/33.webp",fb:[64,"1B"],brk:[73,"1B"],off:[70,"1B"]},
  {id:34,type:"H",season:2,series:"Milestone",title:"2× Champion",player:"Jarvis McGrath",img:"cards/34.webp",fb:[94,"HR"],brk:[97,"HR"],off:[89,"2B"]},
  {id:35,type:"P",season:2,series:"Milestone",title:"Undefeated",player:"Jarvis McGrath",img:"cards/35.webp",fb:[90,"K"],brk:[87,"K"],off:[88,"GO"]},
  {id:36,type:"H",season:2,series:"Moments",title:"5 HR vs Najee",player:"Jarvis McGrath",img:"cards/36.webp",fb:[97,"HR"],brk:[74,"HR"],off:[88,"HR"]},
  {id:37,type:"H",season:2,series:"Moments",title:"Game 6 Walkoff",player:"Jarvis McGrath",img:"cards/37.webp",fb:[85,"1B"],brk:[99,"HR"],off:[78,"1B"]},
  {id:38,type:"H",season:2,series:"Moments",title:"4 HR vs Auden",player:"Najee Blackman",img:"cards/38.webp",fb:[90,"HR"],brk:[82,"HR"],off:[95,"HR"]},
  {id:39,type:"H",season:2,series:"Moments",title:"First Career HR",player:"Najee Blackman",img:"cards/39.webp",fb:[86,"1B"],brk:[75,"2B"],off:[92,"HR"]},
  {id:40,type:"P",season:2,series:"Postseason",title:"Postseason",player:"Auden Mitchell",img:"cards/40.webp",fb:[70,"K"],brk:[72,"K"],off:[82,"K"]},
  {id:41,type:"P",season:2,series:"Postseason",title:"Postseason",player:"Jarvis McGrath",img:"cards/41.webp",fb:[93,"K"],brk:[81,"K"],off:[86,"K"]},
  {id:42,type:"P",season:2,series:"Postseason",title:"Playoffs",player:"Najee Blackman",img:"cards/42.webp",fb:[88,"K"],brk:[85,"GO"],off:[77,"K"]},
  {id:43,type:"P",season:2,series:"Records",title:"ERA Record",player:"Jarvis McGrath",img:"cards/43.webp",fb:[90,"K"],brk:[92,"K"],off:[88,"K"]},
  {id:44,type:"P",season:2,series:"Records",title:"League Leader",player:"Jarvis McGrath",img:"cards/44.webp",fb:[99,"K"],brk:[90,"K"],off:[95,"K"]},
  {id:45,type:"H",season:2,series:"Rookie",title:"Rookie",player:"Najee Blackman",img:"cards/45.webp",fb:[81,"2B"],brk:[87,"HR"],off:[75,"1B"]},
  {id:46,type:"H",season:2,series:"Season",title:"Season 2",player:"Jarvis McGrath",img:"cards/46.webp",fb:[83,"1B"],brk:[79,"1B"],off:[90,"HR"]},
  {id:47,type:"H",season:2,series:"Season",title:"Season 2",player:"Najee Blackman",img:"cards/47.webp",fb:[91,"HR"],brk:[95,"HR"],off:[80,"2B"]},
  {id:48,type:"P",season:2,series:"Season",title:"Season 2",player:"Auden Mitchell",img:"cards/48.webp",fb:[91,"K"],brk:[85,"K"],off:[76,"GO"]},
  {id:49,type:"P",season:3,series:"Lowlights",title:"15 Runs Allowed",player:"Auden Mitchell",img:"cards/49.webp",fb:[68,"GO"],brk:[58,"K"],off:[63,"GO"]},
  {id:50,type:"P",season:3,series:"Lowlights",title:"Opening Day",player:"Coel Rioux-Jones",img:"cards/50.webp",fb:[71,"K"],brk:[60,"GO"],off:[67,"GO"]},
  {id:51,type:"H",season:3,series:"Moments",title:"Grand Slam #1",player:"Auden Mitchell",img:"cards/51.webp",fb:[99,"HR"],brk:[63,"1B"],off:[84,"2B"]},
  {id:52,type:"P",season:3,series:"Moments",title:"Boston Yorkers Debut",player:"Boston Yorkers",img:"cards/52.webp",fb:[81,"GO"],brk:[75,"GO"],off:[85,"K"]},
  {id:53,type:"H",season:3,series:"Lowlights",title:"Lowlights",player:"Josef Shutovsky",img:"cards/53.webp",fb:[62,"1B"],brk:[41,"1B"],off:[37,"1B"]}
];

const $ = (id) => document.getElementById(id);
const els = {
  overlay: $("start-overlay"), play: $("play-button"), action: $("action-button"),
  hitterCard: $("hitter-card"), pitcherCard: $("pitcher-card"),
  hitterImage: $("hitter-image"), pitcherImage: $("pitcher-image"),
  hitterCaption: $("hitter-caption"), pitcherCaption: $("pitcher-caption"),
  batterOwner: $("batter-owner"), pitcherOwner: $("pitcher-owner"),
  awayScore: $("away-score"), homeScore: $("home-score"),
  awayName: $("away-name"), homeName: $("home-name"),
  half: $("inning-half"), inning: $("inning-number"),
  outOne: $("out-one"), outTwo: $("out-two"),
  first: $("base-first"), second: $("base-second"), third: $("base-third"),
  die: $("die"), pitch: $("pitch-label"), values: $("matchup-values"),
  banner: $("result-banner"), result: $("result-text"), status: $("status-strip"),
  log: $("log-list"), logTabs: $("log-tabs"), shareLog: $("share-log"), atBat: $("at-bat-count"),
  dialog: $("rules-dialog"),
  onlinePanel: $("online-panel"), onlineName: $("online-name"), onlineStatus: $("online-status"),
  lobbyEntry: $("lobby-entry"), lobbyShell: $("lobby-shell"), enterLobby: $("enter-lobby"), leaveLobby: $("leave-lobby"),
  lobbyList: $("lobby-list"), lobbyCount: $("lobby-count"), incomingWrap: $("incoming-wrap"), incomingChallenges: $("incoming-challenges"), cancelChallenge: $("cancel-challenge"),
  createReadyLink: $("create-ready-link"), readyShare: $("ready-share"), readyCode: $("ready-code"), readyUrl: $("ready-url"), copyReadyLink: $("copy-ready-link"),
  startModeLabel: $("start-mode-label")
};

let game = null;
let sideChoice = "random";
let playMode = "cpu";
let selectedLogInning = 1;
let localTeamKey = "player";
let onlineMatchId = null;
let onlineRole = null;
let onlineVersion = 0;
let onlineChannel = null;
let onlinePoll = null;
let lobbyPoll = null;
let lobbyHeartbeat = null;
let lobbyJoined = false;
let outgoingChallengeId = null;
let pendingInviteCode = null;
let activeReadyUpCode = (() => {
  const raw = new URLSearchParams(window.location.search).get("readyup") || "";
  const code = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,10);
  return code || null;
})();
let onlineBusy = false;
let directMode = Boolean(activeReadyUpCode);
let directPeer = null;
let directConn = null;
let directPeerRole = null;
let directRoomCode = activeReadyUpCode;
let directConnectAttempts = 0;
let publicQueueActive = false;
let publicQueueSlot = null;
let publicQueueTicket = null;
let publicQueueRetry = null;
let publicQueueMatched = false;
const PUBLIC_QUEUE_SLOTS = 48;
const PUBLIC_MATCHMAKER_ID = "pcbl-attax-public-matchmaker-v2";
let publicCoordinatorPeer = null;
let publicCoordinatorConn = null;
let publicCoordinatorElecting = false;
let publicCoordinatorQueue = [];
let publicExpectedOpponent = null;
const publicMatchmakingRequested = new URLSearchParams(window.location.search).get("matchmaking") === "public";
const draftModeRequested = new URLSearchParams(window.location.search).get("draft") === "1";
const draftOnlineRequested = draftModeRequested && new URLSearchParams(window.location.search).get("online") === "1";
function validateDraftRosterIds(raw){
  if(!Array.isArray(raw))return [];
  const ids=[...new Set(raw.map(Number).filter(Number.isFinite))];
  const roster=ids.map(id=>cards.find(c=>c.id===id)).filter(Boolean);
  if(roster.length!==12||roster.filter(c=>c.type==="H").length!==7||roster.filter(c=>c.type==="P").length!==5)return [];
  return roster.map(c=>c.id);
}
function localDraftRosterIds(){
  if(!draftModeRequested)return [];
  try{return validateDraftRosterIds(JSON.parse(localStorage.getItem("pcblDraftRoster")||"[]"));}catch(_){return []}
}
function hasLocalDraftRoster(){return localDraftRosterIds().length===12}
const onlineConfig = window.PCBL_ATTAX_ONLINE || {};
const onlineReady = Boolean(window.supabase && onlineConfig.supabaseUrl && onlineConfig.anonKey);
const sb = onlineReady ? window.supabase.createClient(onlineConfig.supabaseUrl, onlineConfig.anonKey, {auth:{persistSession:false,autoRefreshToken:false}}) : null;
let clientId = null, savedOnlineName = "PLAYER";
try { clientId = localStorage.getItem("pcblAttaxClientId"); savedOnlineName = localStorage.getItem("pcblAttaxName") || "PLAYER"; } catch (_) {}
if (!clientId) { clientId = (window.crypto?.randomUUID?.() || `pcbl-${Date.now()}-${Math.random().toString(36).slice(2)}`); try { localStorage.setItem("pcblAttaxClientId", clientId); } catch (_) {} }
if (els.onlineName) els.onlineName.value = savedOnlineName;

// Card audit: the position bubble on each card is the authority for hitter/pitcher pools.
// Special lowlight/moment cards can intentionally contain unusual outcomes (e.g. a hitter GO or pitcher hit result),
// so outcome text is not used to override the printed RHH/LHH/RHP/LHP role.
const auditedPitcherIds = new Set([5,6,7,11,12,15,20,21,22,23,24,31,35,40,41,42,43,44,48,49,50,52]);
for (const card of cards) {
  const expected = auditedPitcherIds.has(card.id) ? "P" : "H";
  if (card.type !== expected) console.warn(`ATTAX card ${card.id} role mismatch: expected ${expected}, got ${card.type}`);
  if (!card.img || !card.player || !card.title) console.warn(`ATTAX card ${card.id} is missing identifying metadata.`);
}

function onlineName() {
  let value = (els.onlineName?.value || "PLAYER").trim().replace(/\s+/g," ").slice(0,18) || "PLAYER";
  if (value.toUpperCase() === "PLAYER") value = `PLAYER ${String(clientId).replace(/[^A-Za-z0-9]/g, "").slice(-4).toUpperCase()}`;
  try { localStorage.setItem("pcblAttaxName", value); } catch (_) {}
  if (els.onlineName) els.onlineName.value = value;
  return value;
}
function setOnlineStatus(message, tone="") {
  if (!els.onlineStatus) return;
  els.onlineStatus.textContent = message;
  els.onlineStatus.className = `online-status ${tone}`.trim();
}
function setLobbyEnterState(busy=false, label=null) {
  if (!els.enterLobby) return;
  els.enterLobby.disabled = Boolean(busy);
  els.enterLobby.textContent = label || "READY UP";
}
function teamDisplay(key) {
  if (!game?.online) return key === "player" ? "YOU" : "CPU";
  if (key === localTeamKey) return "YOU";
  return (game.onlineNames?.[key] || "OPPONENT").toUpperCase();
}
function ownerDisplay(key) { return key === localTeamKey ? "YOUR" : (game?.online ? "OPP" : "CPU"); }
function canLocalControl() { return !game?.online || defenseKey() === localTeamKey; }
function chooseHostHome(hostPref, guestPref) {
  if (hostPref === "home" && guestPref !== "home") return true;
  if (hostPref === "away" && guestPref !== "away") return false;
  if (guestPref === "home" && hostPref !== "home") return false;
  if (guestPref === "away" && hostPref !== "away") return true;
  return Math.random() < .5;
}
function clearOnlineTimers() {
  if (onlinePoll) { clearInterval(onlinePoll); onlinePoll = null; }
  if (onlineChannel && sb) { sb.removeChannel(onlineChannel); onlineChannel = null; }
  if (directConn) { try { directConn.close(); } catch (_) {} directConn = null; }
  if (directPeer) { try { directPeer.destroy(); } catch (_) {} directPeer = null; }
  directPeerRole = null;
}
function clearLobbyTimers() {
  if (lobbyPoll) { clearInterval(lobbyPoll); lobbyPoll = null; }
  if (lobbyHeartbeat) { clearInterval(lobbyHeartbeat); lobbyHeartbeat = null; }
}
function currentPresenceStatus() {
  if (game?.online) return "in_match";
  if (outgoingChallengeId) return "challenging";
  return "ready";
}
async function setLobbyPresence(status=currentPresenceStatus()) {
  if (!sb || !lobbyJoined) return;
  const {error} = await sb.from("attax_lobby").upsert({
    client_id: clientId,
    display_name: onlineName(),
    side_pref: sideChoice,
    status,
    last_seen: new Date().toISOString()
  }, {onConflict:"client_id"});
  if (error) throw error;
}
function lobbyStatus(status) {
  if (status === "ready" || status === "available") return {label:"READY", cls:"ready", challenge:true};
  if (status === "challenging") return {label:"CHALLENGE PENDING", cls:"pending", challenge:false};
  return {label:"IN A MATCH", cls:"match", challenge:false};
}
function renderLobbyPlayers(players=[]) {
  if (!els.lobbyList) return;
  els.lobbyList.innerHTML = "";
  els.lobbyCount.textContent = `${players.length + (lobbyJoined ? 1 : 0)} ONLINE`;
  if (!players.length) {
    const empty = document.createElement("div");
    empty.className = "lobby-empty";
    empty.textContent = "YOU ARE IN THE LOBBY · WAITING FOR ANOTHER PLAYER.";
    els.lobbyList.appendChild(empty);
    return;
  }
  players.forEach((player) => {
    const status = lobbyStatus(player.status);
    const row = document.createElement("div"); row.className = `lobby-player status-${status.cls}`;
    const main = document.createElement("div"); main.className = "lobby-player-main";
    const dot = document.createElement("span"); dot.className = `lobby-dot ${status.cls}`;
    const text = document.createElement("div");
    const nameLine = document.createElement("div"); nameLine.className = "lobby-player-line";
    const name = document.createElement("div"); name.className = "lobby-player-name"; name.textContent = player.display_name || "PLAYER";
    const badge = document.createElement("span"); badge.className = `lobby-status-badge ${status.cls}`; badge.textContent = status.label;
    nameLine.append(name,badge);
    const pref = document.createElement("span"); pref.className = "lobby-player-side"; pref.textContent = `${(player.side_pref || "random").toUpperCase()} PREFERENCE`;
    text.append(nameLine,pref); main.append(dot,text);
    const button = document.createElement("button"); button.type = "button"; button.className = "challenge-button"; button.textContent = status.challenge ? "CHALLENGE" : status.label;
    button.disabled = !status.challenge || Boolean(outgoingChallengeId || onlineBusy);
    if (status.challenge) button.addEventListener("click",()=>challengePlayer(player));
    row.append(main,button); els.lobbyList.appendChild(row);
  });
}
function renderIncoming(challenges=[]) {
  els.incomingChallenges.innerHTML = "";
  els.incomingWrap.hidden = challenges.length === 0;
  challenges.forEach((challenge) => {
    const row = document.createElement("div"); row.className = "incoming-challenge";
    const name = document.createElement("span"); name.className = "incoming-name"; name.textContent = `${(challenge.host_name || "PLAYER").toUpperCase()} CHALLENGED YOU`;
    const accept = document.createElement("button"); accept.type="button"; accept.className="challenge-accept"; accept.textContent="ACCEPT";
    const decline = document.createElement("button"); decline.type="button"; decline.className="challenge-decline"; decline.textContent="DECLINE";
    accept.disabled = onlineBusy || Boolean(outgoingChallengeId);
    decline.disabled = onlineBusy;
    accept.addEventListener("click",()=>acceptChallenge(challenge.id));
    decline.addEventListener("click",()=>declineChallenge(challenge.id));
    row.append(name,accept,decline); els.incomingChallenges.appendChild(row);
  });
}
function clearReadyShare() {
  pendingInviteCode = null;
  if (els.readyShare) els.readyShare.hidden = true;
  if (els.readyCode) els.readyCode.textContent = "—";
  if (els.readyUrl) els.readyUrl.value = "";
  if (els.createReadyLink) els.createReadyLink.textContent = "READY UP LINK";
}
function generateRoomCode(length=6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else for (let i=0;i<length;i++) bytes[i] = Math.floor(Math.random()*256);
  return Array.from(bytes,b => alphabet[b % alphabet.length]).join("");
}
function readyUpUrl(code) {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  if(hasLocalDraftRoster())url.searchParams.set("draft","1");
  url.searchParams.set("readyup", code);
  return url.toString();
}
function directHostId(code) {
  return `pcbl-attax-${String(code || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0,10)}`;
}
function directStateMessage() {
  captureView();
  onlineVersion += 1;
  return {type:"state", state:game, version:onlineVersion};
}
function applyDirectState(message) {
  if (!message?.state) return;
  const version = Number(message.version || 0);
  if (version && version < onlineVersion) return;
  onlineVersion = Math.max(onlineVersion, version);
  game = message.state;
  selectedLogInning = game.inning || 1;
  els.overlay.classList.add("hidden");
  window.scrollTo({top:0,left:0,behavior:"instant"});
  els.shareLog.hidden = !game.gameOver;
  renderLog();
  restoreView();
}
function directConnectionClosed() {
  if (!directMode || game?.gameOver) return;
  setOnlineStatus(`ROOM ${directRoomCode || ""} · OPPONENT DISCONNECTED.`, "error");
  if (game) {
    els.status.textContent = "Opponent disconnected.";
    els.action.disabled = true;
    els.die.disabled = true;
  }
}
function wireDirectConnection(conn, role) {
  if (!conn) return;
  directConn = conn;
  directPeerRole = role;
  onlineRole = role;
  localTeamKey = role === "host" ? "player" : "cpu";
  const onOpen = () => {
    setOnlineStatus(`ROOM ${directRoomCode} · ${role === "host" ? "OPPONENT CONNECTED" : "CONNECTED"} · STARTING MATCH…`, "ready");
    if (role === "guest") conn.send({type:"hello", name:onlineName(), sidePref:sideChoice, draftIds:localDraftRosterIds()});
  };
  conn.on("open", onOpen);
  if (conn.open) onOpen();
  conn.on("data", (message) => {
    if (!message || typeof message !== "object") return;
    if (message.type === "room_full") {
      setOnlineStatus(`ROOM ${directRoomCode} IS ALREADY IN A MATCH.`, "error");
      return;
    }
    if (message.type === "hello" && role === "host" && !game) {
      const guestName = String(message.name || "OPPONENT").slice(0,18);
      const hostName = onlineName();
      const hostHome = chooseHostHome(sideChoice, message.sidePref || "random");
      game = makeFreshGame(hostHome,"online",{player:hostName,cpu:guestName},{player:localDraftRosterIds(),cpu:validateDraftRosterIds(message.draftIds)});
      onlineVersion = 1;
      selectedLogInning = 1;
      els.shareLog.hidden = true;
      addLog(`Direct online match: ${hostName} vs ${guestName}.`);
      addLog(`${hostHome ? hostName : guestName} is home.`);
      addOnlineRosterLog(hostName,guestName,game);
      addLog("Top of inning 1 begins. Play ball.");
      prepareAtBat();
      captureView();
      els.overlay.classList.add("hidden");
      window.scrollTo({top:0,left:0,behavior:"instant"});
      conn.send({type:"match_start",state:game,version:onlineVersion});
      setOnlineStatus(`ROOM ${directRoomCode} · MATCH LIVE`, "ready");
      return;
    }
    if (message.type === "match_start" || message.type === "state") {
      applyDirectState(message);
      setOnlineStatus(`ROOM ${directRoomCode} · MATCH LIVE`, "ready");
    }
  });
  conn.on("close", directConnectionClosed);
  conn.on("error", () => directConnectionClosed());
}
function connectDirectGuest(hostId) {
  if (directPeer) { try { directPeer.destroy(); } catch (_) {} }
  directPeer = new Peer();
  directPeerRole = "guest";
  directPeer.on("open", () => {
    directConnectAttempts += 1;
    const conn = directPeer.connect(hostId,{reliable:true,metadata:{room:directRoomCode}});
    wireDirectConnection(conn,"guest");
  });
  directPeer.on("error", (error) => {
    const type = String(error?.type || "");
    if ((type === "peer-unavailable" || type === "network" || type === "server-error") && directConnectAttempts < 4 && !game) {
      window.setTimeout(()=>connectDirectGuest(hostId),650);
      return;
    }
    setOnlineStatus(`ROOM ${directRoomCode} · CONNECTION ERROR · ${error?.message || "TRY AGAIN"}`, "error");
  });
}
function startDirectRoom(code) {
  if (!code || directPeer || game?.online) return;
  if (typeof window.Peer !== "function") {
    setOnlineStatus("DIRECT ONLINE COULD NOT LOAD · CHECK YOUR INTERNET CONNECTION.", "error");
    return;
  }
  directMode = true;
  directRoomCode = code;
  onlineMatchId = `direct-${code}`;
  playMode = "online";
  lobbyJoined = false;
  outgoingChallengeId = null;
  if (els.lobbyEntry) els.lobbyEntry.hidden = true;
  if (els.lobbyShell) els.lobbyShell.hidden = true;
  setOnlineStatus(`ROOM ${code} · READY · WAITING FOR OPPONENT…`, "waiting");
  const hostId = directHostId(code);
  let becameHost = false;
  directPeer = new Peer(hostId);
  directPeer.on("open", () => {
    becameHost = true;
    directPeerRole = "host";
    onlineRole = "host";
    localTeamKey = "player";
    setOnlineStatus(`ROOM ${code} · READY · LINK COPIED · WAITING FOR OPPONENT…`, "waiting");
    directPeer.on("connection", (conn) => {
      if (directConn && directConn.open) {
        conn.on("open",()=>{ try { conn.send({type:"room_full"}); } catch (_) {} window.setTimeout(()=>conn.close(),100); });
        return;
      }
      wireDirectConnection(conn,"host");
    });
  });
  directPeer.on("error", (error) => {
    const type = String(error?.type || "");
    if (!becameHost && (type === "unavailable-id" || /taken|unavailable/i.test(String(error?.message || "")))) {
      try { directPeer.destroy(); } catch (_) {}
      directPeer = null;
      setOnlineStatus(`ROOM ${code} · JOINING MATCH…`, "waiting");
      connectDirectGuest(hostId);
      return;
    }
    setOnlineStatus(`ROOM ${code} · CONNECTION ERROR · ${error?.message || "TRY AGAIN"}`, "error");
  });
}
async function launchDirectReadyUp() {
  const code = generateRoomCode();
  const url = readyUpUrl(code);
  try { await navigator.clipboard.writeText(url); } catch (_) {}
  window.location.assign(url);
}
function publicQueuePeerId(index) {
  return `pcbl-attax-public-${index}`;
}
function updatePublicLiveLink() {
  const wrap = document.getElementById("matchmaking-live-wrap");
  const input = document.getElementById("matchmaking-live-url");
  if (input) input.value = window.location.href;
  if (wrap) wrap.hidden = !(publicQueueActive || publicQueueMatched || game?.online);
}
function setPublicQueueUrl({slot=null, match=null, searching=false}={}) {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  if (match) url.searchParams.set("match", match);
  else {
    url.searchParams.set("matchmaking", "public");
    if (searching) url.searchParams.set("search", publicQueueTicket || "live");
    if (slot !== null) url.searchParams.set("slot", String(Number(slot)+1));
    if (publicQueueTicket) url.searchParams.set("ticket", publicQueueTicket);
  }
  history.replaceState(null, "", url.pathname + url.search);
  updatePublicLiveLink();
}
function resetPublicQueueTransport() {
  if (publicQueueRetry) { clearTimeout(publicQueueRetry); publicQueueRetry = null; }
  if (directConn) { try { directConn.close(); } catch (_) {} directConn = null; }
  if (directPeer) { try { directPeer.destroy(); } catch (_) {} directPeer = null; }
  publicQueueSlot = null;
}
function queueMatchFoundUrl(code) {
  directRoomCode = code || generateRoomCode();
  setPublicQueueUrl({match:directRoomCode});
  document.title = `MATCH ${directRoomCode} · PCBL ATTAX`;
}
function startQueueGameAsHost(conn, request) {
  if (!publicQueueActive || publicQueueMatched || game?.online) {
    try { conn.send({type:"queue_busy"}); } catch (_) {}
    window.setTimeout(()=>{ try { conn.close(); } catch (_) {} },80);
    return;
  }
  publicQueueMatched = true;
  publicQueueActive = false;
  directMode = true;
  directConn = conn;
  directPeerRole = "host";
  onlineRole = "host";
  localTeamKey = "player";
  const guestName = String(request?.name || "OPPONENT").slice(0,18);
  const hostName = onlineName();
  const hostHome = chooseHostHome(sideChoice, request?.sidePref || "random");
  const matchCode = generateRoomCode();
  queueMatchFoundUrl(matchCode);
  game = makeFreshGame(hostHome,"online",{player:hostName,cpu:guestName},{player:localDraftRosterIds(),cpu:validateDraftRosterIds(request?.draftIds)});
  onlineVersion = 1;
  selectedLogInning = 1;
  els.shareLog.hidden = true;
  addLog(`Public online match: ${hostName} vs ${guestName}.`);
  addLog(`${hostHome ? hostName : guestName} is home.`);
  addOnlineRosterLog(hostName,guestName,game);
  addLog("Top of inning 1 begins. Play ball.");
  prepareAtBat();
  captureView();
  els.overlay.classList.add("hidden");
  window.scrollTo({top:0,left:0,behavior:"instant"});
  setOnlineStatus(`MATCH FOUND · ${hostName.toUpperCase()} VS ${guestName.toUpperCase()} · MATCH ${matchCode}`,"ready");
  try { conn.send({type:"match_start",state:game,version:onlineVersion,matchCode}); } catch (_) {}
}
function wireQueueHostConnection(conn) {
  if (!conn) return;
  if (publicQueueMatched || game?.online) {
    conn.on("open",()=>{ try { conn.send({type:"queue_busy"}); } catch (_) {} window.setTimeout(()=>{try{conn.close();}catch(_){ }},80); });
    return;
  }
  let handled = false;
  conn.on("data",(message)=>{
    if (!message || typeof message !== "object") return;
    if (message.type === "queue_probe" && !handled) {
      handled = true;
      startQueueGameAsHost(conn,message);
      return;
    }
    if (message.type === "state" && publicQueueMatched) applyDirectState(message);
  });
  conn.on("close",()=>{ if (publicQueueMatched) directConnectionClosed(); });
  conn.on("error",()=>{ if (publicQueueMatched) directConnectionClosed(); });
}
function retryQueueAt(index, delay=120) {
  if (!publicQueueActive || publicQueueMatched) return;
  resetPublicQueueTransport();
  publicQueueRetry = window.setTimeout(()=>claimOrJoinQueueSlot(index),delay);
}
function joinOccupiedQueueSlot(index) {
  if (!publicQueueActive || publicQueueMatched) return;
  setOnlineStatus(`PUBLIC MATCHMAKING · CHECKING WAITING PLAYER ${index+1}…`,"waiting");
  setPublicQueueUrl({searching:true});
  const peer = new Peer();
  directPeer = peer;
  let connected = false;
  let accepted = false;
  let timeout = null;
  let movingOn = false;
  const failToNext = ()=>{
    if (movingOn || accepted || publicQueueMatched || !publicQueueActive) return;
    movingOn = true;
    if (timeout) clearTimeout(timeout);
    retryQueueAt((index+1)%PUBLIC_QUEUE_SLOTS,100);
  };
  peer.on("open",()=>{
    const conn = peer.connect(publicQueuePeerId(index),{reliable:true,metadata:{kind:"pcbl-public-matchmaking"}});
    directConn = conn;
    timeout = window.setTimeout(failToNext,2200);
    conn.on("open",()=>{
      connected = true;
      try { conn.send({type:"queue_probe",name:onlineName(),sidePref:sideChoice,ticket:publicQueueTicket,draftIds:localDraftRosterIds()}); } catch (_) { failToNext(); }
    });
    conn.on("data",(message)=>{
      if (!message || typeof message !== "object") return;
      if (message.type === "queue_busy") { failToNext(); return; }
      if (message.type === "match_start") {
        accepted = true;
        publicQueueMatched = true;
        publicQueueActive = false;
        if (timeout) clearTimeout(timeout);
        directMode = true;
        directPeerRole = "guest";
        onlineRole = "guest";
        localTeamKey = "cpu";
        directConn = conn;
        queueMatchFoundUrl(message.matchCode || generateRoomCode());
        applyDirectState(message);
        setOnlineStatus(`MATCH FOUND · MATCH ${directRoomCode} · LIVE`,"ready");
      } else if (message.type === "state" && publicQueueMatched) {
        applyDirectState(message);
      }
    });
    conn.on("close",()=>{ if (publicQueueMatched) directConnectionClosed(); else if (connected) failToNext(); });
    conn.on("error",()=>{ if (publicQueueMatched) directConnectionClosed(); else failToNext(); });
  });
  peer.on("error",(error)=>{
    if (publicQueueMatched) return;
    const type = String(error?.type || "");
    if (type === "peer-unavailable") failToNext();
    else if (type !== "unavailable-id") {
      setOnlineStatus(`MATCHMAKING CONNECTION ERROR · ${error?.message || "TRY AGAIN"}`,"error");
      publicQueueActive = false;
      setLobbyEnterState(false,"READY UP");
    }
  });
}
function claimOrJoinQueueSlot(index=0) {
  if (!publicQueueActive || publicQueueMatched) return;
  const slot = ((Number(index)||0) % PUBLIC_QUEUE_SLOTS + PUBLIC_QUEUE_SLOTS) % PUBLIC_QUEUE_SLOTS;
  setOnlineStatus(`PUBLIC MATCHMAKING · SEARCHING FOR WAITING PLAYERS…`,"waiting");
  setPublicQueueUrl({searching:true});
  const peer = new Peer(publicQueuePeerId(slot));
  directPeer = peer;
  let claimed = false;
  peer.on("open",()=>{
    if (!publicQueueActive || publicQueueMatched) return;
    claimed = true;
    publicQueueSlot = slot;
    directPeerRole = "host";
    onlineRole = "host";
    localTeamKey = "player";
    setPublicQueueUrl({slot});
    setOnlineStatus(`READY · PUBLIC QUEUE SLOT ${slot+1} · WAITING FOR ANOTHER PLAYER…`,"waiting");
    document.title = "WAITING FOR PLAYER · PCBL ATTAX";
    peer.on("connection",wireQueueHostConnection);
  });
  peer.on("error",(error)=>{
    if (!publicQueueActive || publicQueueMatched) return;
    const type = String(error?.type || "");
    const unavailable = type === "unavailable-id" || /taken|unavailable/i.test(String(error?.message || ""));
    if (!claimed && unavailable) {
      try { peer.destroy(); } catch (_) {}
      directPeer = null;
      joinOccupiedQueueSlot(slot);
      return;
    }
    setOnlineStatus(`MATCHMAKING CONNECTION ERROR · ${error?.message || "TRY AGAIN"}`,"error");
    publicQueueActive = false;
    setLobbyEnterState(false,"READY UP");
  });
  peer.on("disconnected",()=>{
    if (claimed && publicQueueActive && !publicQueueMatched) {
      try { peer.reconnect(); } catch (_) {}
    }
  });
}
function coordinatorRemoveConnection(conn) {
  publicCoordinatorQueue = publicCoordinatorQueue.filter(entry=>entry.conn !== conn);
  coordinatorBroadcastPositions();
}
function coordinatorBroadcastPositions() {
  publicCoordinatorQueue.forEach((entry,index)=>{
    try { if (entry.conn?.open) entry.conn.send({type:"queued",position:index+1,waiting:publicCoordinatorQueue.length}); } catch (_) {}
  });
}
function coordinatorPairWaitingPlayers() {
  while (publicCoordinatorQueue.length >= 2) {
    const first = publicCoordinatorQueue.shift();
    const second = publicCoordinatorQueue.shift();
    if (!first?.conn?.open || !second?.conn?.open) continue;
    const matchCode = generateRoomCode();
    try {
      first.conn.send({
        type:"matched", role:"host", matchCode,
        opponentPeerId:second.peerId, opponentName:second.name, opponentSidePref:second.sidePref, opponentDraftIds:second.draftIds||[]
      });
      second.conn.send({
        type:"matched", role:"guest", matchCode,
        opponentPeerId:first.peerId, opponentName:first.name, opponentSidePref:first.sidePref, opponentDraftIds:first.draftIds||[]
      });
    } catch (_) {}
  }
  coordinatorBroadcastPositions();
}
function setupPublicCoordinator(peer) {
  if (!peer) return;
  peer.on("connection",(conn)=>{
    let registered = false;
    conn.on("data",(message)=>{
      if (!message || typeof message !== "object" || message.type !== "ready" || registered) return;
      const peerId = String(message.peerId || "").trim();
      if (!peerId || publicCoordinatorQueue.some(entry=>entry.peerId===peerId)) return;
      registered = true;
      publicCoordinatorQueue.push({
        conn, peerId,
        name:String(message.name || "PLAYER").slice(0,18),
        sidePref:message.sidePref || "random",
        ticket:String(message.ticket || ""),
        draftIds:validateDraftRosterIds(message.draftIds)
      });
      coordinatorBroadcastPositions();
      coordinatorPairWaitingPlayers();
    });
    conn.on("close",()=>coordinatorRemoveConnection(conn));
    conn.on("error",()=>coordinatorRemoveConnection(conn));
  });
  peer.on("close",()=>{ publicCoordinatorQueue = []; });
}
function sendReadyToCoordinator() {
  if (!publicCoordinatorConn?.open || !directPeer?.id || !publicQueueActive || publicQueueMatched) return;
  try {
    publicCoordinatorConn.send({
      type:"ready", peerId:directPeer.id, name:onlineName(), sidePref:sideChoice, ticket:publicQueueTicket, draftIds:localDraftRosterIds()
    });
  } catch (_) {}
}
function handlePublicMatchAssignment(message) {
  if (!message || message.type !== "matched" || publicQueueMatched || !directPeer) return;
  publicQueueMatched = true;
  publicQueueActive = false;
  directMode = true;
  directPeerRole = message.role === "host" ? "host" : "guest";
  onlineRole = directPeerRole;
  localTeamKey = directPeerRole === "host" ? "player" : "cpu";
  publicExpectedOpponent = {
    peerId:String(message.opponentPeerId || ""),
    name:String(message.opponentName || "OPPONENT").slice(0,18),
    sidePref:message.opponentSidePref || "random",
    draftIds:validateDraftRosterIds(message.opponentDraftIds)
  };
  if (publicCoordinatorConn) { try { publicCoordinatorConn.close(); } catch (_) {} publicCoordinatorConn = null; }
  queueMatchFoundUrl(message.matchCode || generateRoomCode());
  setLobbyEnterState(true,"MATCH FOUND");
  if (els.cancelChallenge) els.cancelChallenge.hidden = true;
  setOnlineStatus(`MATCH FOUND · ${(publicExpectedOpponent.name || "OPPONENT").toUpperCase()} · CONNECTING…`,"ready");
  if (directPeerRole === "guest") {
    const conn = directPeer.connect(publicExpectedOpponent.peerId,{reliable:true,metadata:{kind:"pcbl-attax-match",matchCode:directRoomCode}});
    wireDirectConnection(conn,"guest");
  }
}
function connectToPublicCoordinator() {
  if (!publicQueueActive || publicQueueMatched || !directPeer?.id) return;
  if (publicCoordinatorConn) { try { publicCoordinatorConn.close(); } catch (_) {} publicCoordinatorConn = null; }
  setOnlineStatus("PUBLIC MATCHMAKING · CONNECTING TO LIVE QUEUE…","waiting");
  const conn = directPeer.connect(PUBLIC_MATCHMAKER_ID,{reliable:true,metadata:{kind:"pcbl-matchmaking"}});
  publicCoordinatorConn = conn;
  let opened = false;
  const timeout = window.setTimeout(()=>{
    if (!opened && publicQueueActive && !publicQueueMatched) attemptPublicCoordinatorElection();
  },1800);
  conn.on("open",()=>{
    opened = true;
    clearTimeout(timeout);
    setPublicQueueUrl({searching:true});
    sendReadyToCoordinator();
  });
  conn.on("data",(message)=>{
    if (!message || typeof message !== "object") return;
    if (message.type === "queued") {
      const position = Math.max(1,Number(message.position)||1);
      setOnlineStatus(`READY · PUBLIC MATCHMAKING · WAITING FOR PLAYER${position>1?` · QUEUE #${position}`:""}…`,"waiting");
      document.title = "WAITING FOR PLAYER · PCBL ATTAX";
      updatePublicLiveLink();
    } else if (message.type === "matched") {
      handlePublicMatchAssignment(message);
    }
  });
  conn.on("close",()=>{
    clearTimeout(timeout);
    if (publicQueueActive && !publicQueueMatched) window.setTimeout(attemptPublicCoordinatorElection,250);
  });
  conn.on("error",()=>{
    clearTimeout(timeout);
    if (publicQueueActive && !publicQueueMatched) window.setTimeout(attemptPublicCoordinatorElection,250);
  });
}
function attemptPublicCoordinatorElection() {
  if (!publicQueueActive || publicQueueMatched || publicCoordinatorElecting) return;
  publicCoordinatorElecting = true;
  setOnlineStatus("PUBLIC MATCHMAKING · OPENING LIVE QUEUE…","waiting");
  const candidate = new Peer(PUBLIC_MATCHMAKER_ID);
  let won = false;
  candidate.on("open",()=>{
    won = true;
    publicCoordinatorElecting = false;
    if (publicCoordinatorPeer && publicCoordinatorPeer !== candidate) { try { publicCoordinatorPeer.destroy(); } catch (_) {} }
    publicCoordinatorPeer = candidate;
    publicCoordinatorQueue = [];
    setupPublicCoordinator(candidate);
    window.setTimeout(connectToPublicCoordinator,80);
  });
  candidate.on("error",(error)=>{
    publicCoordinatorElecting = false;
    const type = String(error?.type || "");
    const unavailable = type === "unavailable-id" || /taken|unavailable/i.test(String(error?.message || ""));
    if (!won && unavailable) {
      try { candidate.destroy(); } catch (_) {}
      window.setTimeout(connectToPublicCoordinator,120);
      return;
    }
    if (publicQueueActive && !publicQueueMatched) {
      setOnlineStatus(`MATCHMAKING CONNECTION ERROR · ${error?.message || "TRY AGAIN"}`,"error");
      setLobbyEnterState(false,"READY UP");
      if (els.onlineName) els.onlineName.disabled = false;
    }
  });
}
function startPublicPlayerPeer() {
  resetPublicQueueTransport();
  const peer = new Peer();
  directPeer = peer;
  peer.on("open",()=>{
    if (!publicQueueActive || publicQueueMatched) return;
    setPublicQueueUrl({searching:true});
    connectToPublicCoordinator();
  });
  peer.on("connection",(conn)=>{
    const incomingCode = String(conn.metadata?.matchCode || "");
    const isMatchConnection = conn.metadata?.kind === "pcbl-attax-match";
    if (!isMatchConnection) { conn.on("open",()=>{ try { conn.close(); } catch (_) {} }); return; }
    let checks = 0;
    const acceptWhenAssigned = ()=>{
      if (publicQueueMatched && directPeerRole === "host" && publicExpectedOpponent) {
        if (incomingCode && incomingCode !== directRoomCode) { try { conn.close(); } catch (_) {} return; }
        wireDirectConnection(conn,"host");
        return;
      }
      checks += 1;
      if (checks < 30 && (publicQueueActive || publicQueueMatched)) window.setTimeout(acceptWhenAssigned,50);
      else { try { conn.close(); } catch (_) {} }
    };
    acceptWhenAssigned();
  });
  peer.on("error",(error)=>{
    if (publicQueueMatched) {
      setOnlineStatus(`MATCH CONNECTION ERROR · ${error?.message || "TRY AGAIN"}`,"error");
      return;
    }
    const type = String(error?.type || "");
    if (publicQueueActive && type === "peer-unavailable") {
      attemptPublicCoordinatorElection();
      return;
    }
    if (publicQueueActive) setOnlineStatus(`MATCHMAKING CONNECTION ERROR · ${error?.message || "TRY AGAIN"}`,"error");
  });
}

async function startPublicMatchmaking() {
  if (publicQueueActive || publicQueueMatched || game?.online) return;
  if (typeof window.Peer !== "function") {
    setOnlineStatus("PUBLIC MATCHMAKING COULD NOT LOAD · CHECK YOUR INTERNET CONNECTION.","error");
    return;
  }
  onlineName();
  clearLobbyTimers();
  publicQueueActive = true;
  publicQueueMatched = false;
  publicQueueTicket = generateRoomCode();
  publicExpectedOpponent = null;
  directMode = true;
  directRoomCode = null;
  playMode = "online";
  setLobbyEnterState(true,"SEARCHING…");
  if (els.onlineName) els.onlineName.disabled = true;
  if (els.cancelChallenge) { els.cancelChallenge.hidden = false; els.cancelChallenge.textContent = "CANCEL READY UP"; }
  setOnlineStatus("PUBLIC MATCHMAKING · LOOKING FOR A READY PLAYER…","waiting");
  startPublicPlayerPeer();
}
async function cancelPublicMatchmaking() {
  if (!publicQueueActive || publicQueueMatched) return;
  publicQueueActive = false;
  if (publicCoordinatorConn) { try { publicCoordinatorConn.close(); } catch (_) {} publicCoordinatorConn = null; }
  resetPublicQueueTransport();
  directMode = false;
  publicQueueTicket = null;
  publicExpectedOpponent = null;
  if (els.onlineName) els.onlineName.disabled = false;
  if (els.cancelChallenge) els.cancelChallenge.hidden = true;
  setLobbyEnterState(false,"READY UP");
  const url = new URL(window.location.href); url.search = ""; history.replaceState(null,"",url.pathname);
  document.title = "PCBL ATTAX";
  updatePublicLiveLink();
  setOnlineStatus("READY UP TO ENTER PUBLIC MATCHMAKING.","ready");
}

async function refreshLobby() {
  if (!sb || !lobbyJoined || game?.online) return;
  try {
    const cutoff = new Date(Date.now() - 45000).toISOString();
    const [{data:players,error:playersError},{data:incoming,error:incomingError}] = await Promise.all([
      sb.from("attax_lobby").select("client_id,display_name,side_pref,status,last_seen").neq("client_id",clientId).gte("last_seen",cutoff).order("display_name",{ascending:true}),
      sb.from("attax_matches").select("id,host_id,host_name,host_side_pref,guest_id,guest_name,guest_side_pref,status,state,room_code,created_at").eq("guest_id",clientId).eq("status","waiting").is("state",null).order("created_at",{ascending:false})
    ]);
    if (playersError) throw playersError;
    if (incomingError) throw incomingError;
    renderLobbyPlayers(players || []);
    renderIncoming(incoming || []);

    let outgoing = null;
    if (outgoingChallengeId) {
      const {data,error} = await sb.from("attax_matches").select("*").eq("id",outgoingChallengeId).maybeSingle();
      if (error) throw error;
      outgoing = data;
      if (!outgoing) {
        outgoingChallengeId = null;
        els.cancelChallenge.hidden = true;
        clearReadyShare();
        await setLobbyPresence("ready");
        setOnlineStatus("CHALLENGE ENDED · CHOOSE ANOTHER PLAYER.","waiting");
      } else if (outgoing.status === "matched") {
        onlineBusy = true;
        setOnlineStatus(`READY · ${(outgoing.guest_name || "OPPONENT").toUpperCase()} JOINED · LOADING MATCH…`,"ready");
        await setLobbyPresence("in_match");
        await enterOnlineMatch(outgoing.id,"host");
        return;
      } else if (outgoing.room_code && !outgoing.guest_id) {
        setOnlineStatus(`READY UP LINK OPEN · ROOM ${outgoing.room_code} · WAITING FOR PLAYER…`,"waiting");
      }
    }
    if (!outgoingChallengeId && !onlineBusy) setOnlineStatus("IN LOBBY · STATUS READY · CHALLENGE A PLAYER OR CREATE A READY UP LINK.","ready");
  } catch (error) {
    setOnlineStatus(`LOBBY ERROR · ${error.message || "TRY AGAIN"}`,"error");
  }
}
async function joinLobby() {
  if (publicQueueActive || publicQueueMatched || game?.online) return;
  await startPublicMatchmaking();
  return;
  if (onlineBusy) return;
  setLobbyEnterState(true, activeReadyUpCode ? "READYING UP…" : "CONNECTING…");
  setOnlineStatus(activeReadyUpCode ? `CONNECTING TO ROOM ${activeReadyUpCode}…` : "CONNECTING TO ATTAX LOBBY…", "waiting");
  if (!onlineReady) {
    setOnlineStatus("CREATING DIRECT READY UP ROOM…", "waiting");
    await launchDirectReadyUp();
    return;
  }
  if (activeReadyUpCode) {
    try {
      await readyUpFromLink(activeReadyUpCode);
    } finally {
      if (!game?.online) setLobbyEnterState(false);
    }
    return;
  }
  onlineBusy = true;
  try {
    onlineName();
    await sb.from("attax_matches").delete().eq("host_id",clientId).eq("status","waiting");
    await sb.from("attax_matches").delete().eq("guest_id",clientId).eq("status","waiting");
    lobbyJoined = true;
    outgoingChallengeId = null;
    clearReadyShare();
    await setLobbyPresence("ready");
    els.lobbyEntry.hidden = true;
    els.lobbyShell.hidden = false;
    els.onlineName.disabled = true;
    els.cancelChallenge.hidden = true;
    setOnlineStatus("IN LOBBY · STATUS READY · CHALLENGE A PLAYER OR CREATE A READY UP LINK.","ready");
    await refreshLobby();
    clearLobbyTimers();
    lobbyPoll = setInterval(refreshLobby,1800);
    lobbyHeartbeat = setInterval(()=>setLobbyPresence(currentPresenceStatus()).catch(()=>{}),12000);
  } catch (error) {
    lobbyJoined = false;
    setOnlineStatus(`LOBBY ERROR · ${error.message || "TRY AGAIN"}`,"error");
  } finally {
    onlineBusy = false;
    if (!lobbyJoined) setLobbyEnterState(false);
  }
}
async function leaveLobby() {
  clearLobbyTimers();
  if (sb) {
    try {
      await sb.from("attax_matches").delete().eq("host_id",clientId).eq("status","waiting");
      await sb.from("attax_matches").delete().eq("guest_id",clientId).eq("status","waiting");
      await sb.from("attax_lobby").delete().eq("client_id",clientId);
    } catch (_) {}
  }
  lobbyJoined = false; outgoingChallengeId = null; onlineBusy = false;
  clearReadyShare();
  els.lobbyEntry.hidden = false; els.lobbyShell.hidden = true; els.onlineName.disabled = false; els.cancelChallenge.hidden = true;
  setLobbyEnterState(false);
  renderIncoming([]); renderLobbyPlayers([]);
  setOnlineStatus(onlineReady ? "ENTER THE LOBBY TO SEE ONLINE PLAYERS." : "READY UP CREATES A PRIVATE MATCH LINK AND OPENS IT IMMEDIATELY.", onlineReady ? "" : "ready");
}
async function challengePlayer(player) {
  if (!sb || !lobbyJoined || outgoingChallengeId || onlineBusy || !lobbyStatus(player.status).challenge) return;
  onlineBusy = true;
  try {
    clearReadyShare();
    const {data,error} = await sb.from("attax_matches").insert({
      host_id:clientId, host_name:onlineName(), host_side_pref:sideChoice,
      guest_id:player.client_id, guest_name:player.display_name || "OPPONENT", guest_side_pref:player.side_pref || "random",
      status:"waiting", state:null, version:0, updated_at:new Date().toISOString()
    }).select("id,guest_name").single();
    if (error) throw error;
    outgoingChallengeId = data.id;
    await setLobbyPresence("challenging");
    els.cancelChallenge.hidden = false;
    setOnlineStatus(`CHALLENGE SENT TO ${(data.guest_name || "OPPONENT").toUpperCase()} · WAITING…`,"waiting");
  } catch (error) {
    setOnlineStatus(`CHALLENGE ERROR · ${error.message || "TRY AGAIN"}`,"error");
  } finally { onlineBusy = false; refreshLobby(); }
}
async function createReadyUpLink() {
  if (!onlineReady) { await launchDirectReadyUp(); return; }
  if (!sb || !lobbyJoined || onlineBusy || game?.online) return;
  onlineBusy = true;
  try {
    if (outgoingChallengeId) await sb.from("attax_matches").delete().eq("id",outgoingChallengeId).eq("host_id",clientId).eq("status","waiting");
    outgoingChallengeId = null;
    clearReadyShare();
    let created = null;
    let lastError = null;
    for (let attempt=0; attempt<5 && !created; attempt++) {
      const code = generateRoomCode();
      const {data,error} = await sb.from("attax_matches").insert({
        room_code:code,
        host_id:clientId, host_name:onlineName(), host_side_pref:sideChoice,
        guest_id:null, guest_name:null, guest_side_pref:null,
        status:"waiting", state:null, version:0, updated_at:new Date().toISOString()
      }).select("id,room_code").single();
      if (!error) created = data;
      else lastError = error;
    }
    if (!created) throw lastError || new Error("Could not create room code.");
    outgoingChallengeId = created.id;
    pendingInviteCode = created.room_code;
    await setLobbyPresence("challenging");
    els.readyCode.textContent = pendingInviteCode;
    els.readyUrl.value = readyUpUrl(pendingInviteCode);
    els.readyShare.hidden = false;
    els.createReadyLink.textContent = "NEW READY UP LINK";
    els.cancelChallenge.hidden = false;
    setOnlineStatus(`READY UP LINK CREATED · ROOM ${pendingInviteCode} · WAITING FOR PLAYER…`,"waiting");
  } catch (error) {
    setOnlineStatus(`READY UP LINK ERROR · ${error.message || "TRY AGAIN"}`,"error");
  } finally { onlineBusy = false; refreshLobby(); }
}
async function copyReadyUpLink() {
  const value = els.readyUrl?.value || "";
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    setOnlineStatus(`READY UP LINK COPIED · ROOM ${pendingInviteCode || ""}`,"ready");
  } catch (_) {
    els.readyUrl.focus(); els.readyUrl.select();
    document.execCommand?.("copy");
    setOnlineStatus(`READY UP LINK COPIED · ROOM ${pendingInviteCode || ""}`,"ready");
  }
}
async function cancelChallenge() {
  if (publicQueueActive && !publicQueueMatched) { await cancelPublicMatchmaking(); return; }
  if (!sb || !outgoingChallengeId || onlineBusy) return;
  onlineBusy = true;
  const id = outgoingChallengeId;
  try {
    await sb.from("attax_matches").delete().eq("id",id).eq("host_id",clientId).eq("status","waiting");
    outgoingChallengeId = null;
    els.cancelChallenge.hidden = true;
    clearReadyShare();
    await setLobbyPresence("ready");
    setOnlineStatus("CHALLENGE / READY UP LINK CANCELLED · STATUS READY.","ready");
  } catch (error) { setOnlineStatus(`CANCEL ERROR · ${error.message || "TRY AGAIN"}`,"error"); }
  finally { onlineBusy = false; refreshLobby(); }
}
async function acceptChallenge(matchId) {
  if (!sb || !lobbyJoined || onlineBusy || outgoingChallengeId) return;
  onlineBusy = true;
  try {
    const {data:row,error:fetchError} = await sb.from("attax_matches").select("*").eq("id",matchId).eq("guest_id",clientId).eq("status","waiting").maybeSingle();
    if (fetchError) throw fetchError;
    if (!row) throw new Error("Challenge is no longer available.");
    await setLobbyPresence("in_match");
    const {error} = await sb.from("attax_matches").update({status:"matched",updated_at:new Date().toISOString()}).eq("id",matchId).eq("status","waiting");
    if (error) throw error;
    await sb.from("attax_matches").delete().eq("guest_id",clientId).eq("status","waiting").neq("id",matchId);
    setOnlineStatus(`MATCH ACCEPTED · ${(row.host_name || "OPPONENT").toUpperCase()} VS ${onlineName().toUpperCase()}`,"ready");
    await enterOnlineMatch(matchId,"guest");
  } catch (error) {
    onlineBusy = false;
    await setLobbyPresence("ready").catch(()=>{});
    setOnlineStatus(`ACCEPT ERROR · ${error.message || "TRY AGAIN"}`,"error");
    refreshLobby();
  }
}
async function readyUpFromLink(code) {
  if (!code || onlineBusy) return;
  if (!onlineReady) { startDirectRoom(code); return; }
  onlineBusy = true;
  try {
    const name = onlineName();
    const {data:row,error:fetchError} = await sb.from("attax_matches").select("*").eq("room_code",code).eq("status","waiting").is("guest_id",null).maybeSingle();
    if (fetchError) throw fetchError;
    if (!row) throw new Error("This READY UP link expired or was already used.");
    if (row.host_id === clientId) throw new Error("This is your own READY UP link. Share it with another player.");
    const cutoff = new Date(Date.now() - 45000).toISOString();
    const {data:hostPresence} = await sb.from("attax_lobby").select("last_seen").eq("client_id",row.host_id).gte("last_seen",cutoff).maybeSingle();
    if (!hostPresence) throw new Error("The host is no longer online.");
    lobbyJoined = true;
    await setLobbyPresence("in_match");
    const {data:matched,error:updateError} = await sb.from("attax_matches").update({
      guest_id:clientId, guest_name:name, guest_side_pref:sideChoice, status:"matched", updated_at:new Date().toISOString()
    }).eq("id",row.id).eq("status","waiting").is("guest_id",null).select("id").maybeSingle();
    if (updateError) throw updateError;
    if (!matched) throw new Error("Another player already used this READY UP link.");
    activeReadyUpCode = null;
    const clean = new URL(window.location.href); clean.searchParams.delete("readyup");
    history.replaceState(null,"",clean.pathname + clean.search + clean.hash);
    els.enterLobby.textContent = "ENTER LOBBY";
    setOnlineStatus(`READY · JOINING ${(row.host_name || "HOST").toUpperCase()}…`,"ready");
    await enterOnlineMatch(row.id,"guest");
  } catch (error) {
    if (sb && lobbyJoined && !game?.online) {
      try { await sb.from("attax_lobby").delete().eq("client_id",clientId); } catch (_) {}
    }
    lobbyJoined = false;
    setOnlineStatus(`READY UP ERROR · ${error.message || "TRY AGAIN"}`,"error");
  } finally { onlineBusy = false; }
}
async function declineChallenge(matchId) {
  if (!sb || onlineBusy) return;
  try {
    await sb.from("attax_matches").delete().eq("id",matchId).eq("guest_id",clientId).eq("status","waiting");
    setOnlineStatus("CHALLENGE DECLINED.","ready");
    refreshLobby();
  } catch (error) { setOnlineStatus(`DECLINE ERROR · ${error.message || "TRY AGAIN"}`,"error"); }
}
function captureView(hitter=null,pitcher=null) {
  if (!game) return;
  game.view = {
    hitterId: hitter?.id ?? game.view?.hitterId ?? currentCards().hitter.id,
    pitcherId: pitcher?.id ?? game.view?.pitcherId ?? currentCards().pitcher.id,
    revealed: game.phase === "result" || game.gameOver,
    die: els.die.textContent,
    pitch: els.pitch.textContent,
    values: els.values.textContent,
    banner: els.banner.querySelector("span").textContent,
    result: els.result.textContent,
    status: els.status.textContent,
    action: els.action.textContent
  };
}
function restoreView() {
  if (!game) return;
  const v = game.view || {};
  const hitter = cards.find(c=>c.id===v.hitterId) || currentCards().hitter;
  const pitcher = cards.find(c=>c.id===v.pitcherId) || currentCards().pitcher;
  els.hitterImage.src = hitter.img; els.pitcherImage.src = pitcher.img;
  els.hitterImage.alt = `${hitter.player} — ${hitter.title} hitter card`;
  els.pitcherImage.alt = `${pitcher.player} — ${pitcher.title} pitcher card`;
  els.hitterCard.classList.toggle("revealed", Boolean(v.revealed));
  els.pitcherCard.classList.toggle("revealed", Boolean(v.revealed));
  els.hitterCaption.textContent = v.revealed ? `${hitter.player} · S${hitter.season} ${hitter.series}` : "Hidden card";
  els.pitcherCaption.textContent = v.revealed ? `${pitcher.player} · S${pitcher.season} ${pitcher.series}` : "Hidden card";
  els.die.textContent = v.die ?? "—"; els.pitch.textContent = v.pitch ?? "PITCH TYPE"; els.values.textContent = v.values ?? "—";
  els.banner.querySelector("span").textContent = v.banner ?? (game.half === "top" ? "TOP HALF" : "BOTTOM HALF");
  els.result.textContent = v.result ?? "READY"; els.status.textContent = v.status ?? "Ready.";
  els.action.textContent = v.action ?? (game.phase === "pitch" ? "ROLL DICE" : "NEXT BATTER");
  const control = canLocalControl();
  els.action.disabled = game.gameOver ? false : !control;
  els.die.disabled = game.gameOver || game.phase !== "pitch" || !control;
  if (game.online && game.gameOver) {
    const otherKey = localTeamKey === "player" ? "cpu" : "player";
    const localScore = game.score[localTeamKey], otherScore = game.score[otherKey];
    els.result.textContent = localScore > otherScore ? "YOU WIN" : localScore < otherScore ? `${teamDisplay(otherKey)} WINS` : "TIE";
    els.status.textContent = `Final score: You ${localScore}, ${teamDisplay(otherKey)} ${otherScore}.`;
    els.action.textContent = directMode ? "NEW READY UP" : "BACK TO LOBBY";
  } else if (game.online && game.phase === "pitch") {
    els.status.textContent = `${teamDisplay(offenseKey())} batting · ${teamDisplay(defenseKey())} controls the pitch.`;
    if (!control) els.action.textContent = "WAITING FOR OPPONENT";
  } else if (game.online && !control) {
    els.status.textContent = `${teamDisplay(defenseKey())} controls this at-bat.`;
  }
  render();
}
async function publishOnline() {
  if (!game?.online) return;
  if (directMode) {
    if (directConn?.open) directConn.send(directStateMessage());
    return;
  }
  if (!sb || !onlineMatchId) return;
  captureView();
  const nextVersion = onlineVersion + 1;
  const {error} = await sb.from("attax_matches").update({state:game,version:nextVersion,updated_at:new Date().toISOString(),status:game.gameOver?"finished":"matched"}).eq("id",onlineMatchId);
  if (!error) onlineVersion = nextVersion; else setOnlineStatus("MATCH SYNC ERROR · TRY AGAIN", "error");
}
function applyRemoteState(row) {
  if (!row?.state || Number(row.version||0) < onlineVersion) return;
  onlineVersion = Number(row.version||0);
  game = row.state;
  selectedLogInning = game.inning || 1;
  els.overlay.classList.add("hidden");
  window.scrollTo({top:0,left:0,behavior:"instant"});
  els.shareLog.hidden = !game.gameOver;
  renderLog();
  restoreView();
}
function subscribeMatch(matchId) {
  if (!sb) return;
  if (onlineChannel) sb.removeChannel(onlineChannel);
  onlineChannel = sb.channel(`attax-${matchId}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"attax_matches",filter:`id=eq.${matchId}`},payload=>applyRemoteState(payload.new)).subscribe();
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeTeam(hitters, pitchers) {
  return {
    hitters: shuffle(hitters),
    pitchers: shuffle(pitchers),
    hitterIndex: 0,
    pitcherIndex: 0,
    pitcherBF: 0
  };
}

function rosterCardsFromIds(ids){return validateDraftRosterIds(ids).map(id=>cards.find(c=>c.id===id)).filter(Boolean)}
function randomRosterExcluding(excludedIds=[]){
  const excluded=new Set(excludedIds);
  const hitters=shuffle(cards.filter(c=>c.type==="H"&&!excluded.has(c.id))).slice(0,7);
  const pitchers=shuffle(cards.filter(c=>c.type==="P"&&!excluded.has(c.id))).slice(0,5);
  return [...hitters,...pitchers];
}
function rosterTeam(cardsForTeam){
  return makeTeam(cardsForTeam.filter(c=>c.type==="H"),cardsForTeam.filter(c=>c.type==="P"));
}
function makeFreshGame(playerHome, mode="cpu", onlineNames=null, onlineRosters=null) {
  const localIds=localDraftRosterIds();
  const playerDraftIds=mode==="online"?validateDraftRosterIds(onlineRosters?.player):localIds;
  const opponentDraftIds=mode==="online"?validateDraftRosterIds(onlineRosters?.cpu):[];
  let playerRoster=rosterCardsFromIds(playerDraftIds), opponentRoster=rosterCardsFromIds(opponentDraftIds);
  if(playerRoster.length!==12){
    const exclude=opponentRoster.map(c=>c.id);
    playerRoster=randomRosterExcluding(exclude);
  }
  if(opponentRoster.length!==12){
    const exclude=playerRoster.map(c=>c.id);
    opponentRoster=randomRosterExcluding(exclude);
  }
  return {
    player: rosterTeam(playerRoster),
    cpu: rosterTeam(opponentRoster),
    playerHome,
    online: mode === "online",
    onlineNames,
    rosterSource:{player:playerDraftIds.length===12?"draft":"random",cpu:opponentDraftIds.length===12?"draft":"random"},
    inning: 1,
    half: "top",
    outs: 0,
    bases: [false, false, false],
    score: {player: 0, cpu: 0},
    phase: "pitch",
    atBats: 1,
    logs: [],
    gameOver: false,
    pendingEnd: false,
    view: null
  };
}
function addOnlineRosterLog(hostName,guestName,state=game){
  if(!state)return;
  const hs=state.rosterSource?.player==="draft",gs=state.rosterSource?.cpu==="draft";
  if(hs)addLog(`${hostName} brought a PCBL Draft roster: 7 hitters + 5 pitchers.`);
  else addLog(`${hostName} is using a random 7-hitter / 5-pitcher roster.`);
  if(gs)addLog(`${guestName} brought a PCBL Draft roster: 7 hitters + 5 pitchers.`);
  else addLog(`${guestName} is using a random 7-hitter / 5-pitcher roster.`);
}
function newCpuGame() {
  clearOnlineTimers(); clearLobbyTimers(); onlineMatchId=null; onlineRole=null; onlineVersion=0; localTeamKey="player";
  const playerHome = sideChoice === "home" ? true : sideChoice === "away" ? false : Math.random() < .5;
  game = makeFreshGame(playerHome,"cpu",null);
  els.overlay.classList.add("hidden");
  window.scrollTo({top:0,left:0,behavior:"instant"});
  selectedLogInning = 1;
  els.shareLog.hidden = true;
  addLog(sideChoice === "random"
    ? `Random side selection: You are the ${playerHome ? "home" : "away"} team.`
    : `You selected the ${playerHome ? "home" : "away"} team.`);
  addLog(hasLocalDraftRoster() ? "Drafted roster loaded: 7 hitters + 5 pitchers." : "Random cards drawn in fixed order.");
  addLog("Top of inning 1 begins. Play ball.");
  prepareAtBat();
}
function newGame() {
  if (playMode === "online") { setOnlineStatus("ENTER THE LOBBY, THEN CHALLENGE A PLAYER.", "waiting"); return; }
  newCpuGame();
}

async function fetchMatch(matchId) {
  if (!sb) return null;
  const {data,error} = await sb.from("attax_matches").select("*").eq("id",matchId).maybeSingle();
  if (error) throw error;
  return data;
}
async function initializeOnlineMatch(row) {
  if (!row || row.state || onlineRole !== "host") return;
  const hostHome = chooseHostHome(row.host_side_pref || "random", row.guest_side_pref || "random");
  localTeamKey = "player";
  game = makeFreshGame(hostHome,"online",{player:row.host_name||"HOST",cpu:row.guest_name||"GUEST"},{player:localDraftRosterIds(),cpu:[]});
  selectedLogInning = 1; els.shareLog.hidden = true;
  addLog(`Online match: ${row.host_name || "Host"} vs ${row.guest_name || "Guest"}.`);
  addLog(`${hostHome ? row.host_name : row.guest_name} is home.`);
  addOnlineRosterLog(row.host_name||"HOST",row.guest_name||"GUEST",game);
  addLog("Top of inning 1 begins. Play ball.");
  prepareAtBat();
  captureView();
  const {data,error} = await sb.from("attax_matches").update({state:game,version:1,updated_at:new Date().toISOString()}).eq("id",row.id).select("*").single();
  if (error) throw error;
  onlineVersion = Number(data.version||1);
  applyRemoteState(data);
}
async function enterOnlineMatch(matchId, role) {
  clearOnlineTimers(); clearLobbyTimers();
  lobbyJoined = true;
  onlineMatchId = matchId; onlineRole = role; localTeamKey = role === "host" ? "player" : "cpu"; onlineVersion = 0;
  await setLobbyPresence("in_match").catch(()=>{});
  lobbyHeartbeat = setInterval(()=>setLobbyPresence("in_match").catch(()=>{}),12000);
  setOnlineStatus("MATCH FOUND · LOADING…", "ready");
  subscribeMatch(matchId);
  const row = await fetchMatch(matchId);
  if (!row) throw new Error("Match could not be loaded.");
  if (role === "host" && !row.state && row.guest_id) await initializeOnlineMatch(row);
  else if (row.state) applyRemoteState(row);
  else {
    onlinePoll = setInterval(async()=>{
      try {
        const current = await fetchMatch(matchId);
        if (!current) return;
        if (onlineRole === "host" && current.guest_id && !current.state) await initializeOnlineMatch(current);
        else if (current.state) { clearInterval(onlinePoll); onlinePoll=null; applyRemoteState(current); }
      } catch(_) {}
    },700);
  }
  onlineBusy = false;
}

function offenseKey() {
  if (game.half === "top") return game.playerHome ? "cpu" : "player";
  return game.playerHome ? "player" : "cpu";
}

function defenseKey() {
  return offenseKey() === "player" ? "cpu" : "player";
}

function currentCards() {
  const offense = game[offenseKey()];
  const defense = game[defenseKey()];
  return {
    hitter: offense.hitters[offense.hitterIndex],
    pitcher: defense.pitchers[defense.pitcherIndex]
  };
}

function prepareAtBat() {
  game.phase = "pitch";
  game.pendingEnd = false;
  const {hitter, pitcher} = currentCards();
  els.hitterCard.classList.remove("revealed");
  els.pitcherCard.classList.remove("revealed");
  els.hitterImage.src = hitter.img;
  els.pitcherImage.src = pitcher.img;
  els.hitterImage.alt = `${hitter.player} — ${hitter.title} hitter card`;
  els.pitcherImage.alt = `${pitcher.player} — ${pitcher.title} pitcher card`;
  els.hitterCaption.textContent = "Hidden card";
  els.pitcherCaption.textContent = "Hidden card";
  els.die.textContent = "—";
  els.pitch.textContent = "PITCH TYPE";
  els.values.textContent = "—";
  els.banner.querySelector("span").textContent = game.half === "top" ? "TOP HALF" : "BOTTOM HALF";
  els.result.textContent = "READY";
  const offense = teamDisplay(offenseKey()), defense = teamDisplay(defenseKey());
  els.status.textContent = game.online
    ? `${offense} batting · ${defense} controls the pitch.`
    : `${offenseKey() === "player" ? "You are" : "CPU is"} batting. ${defenseKey() === "player" ? "You roll" : "CPU rolls"} the pitch.`;
  els.action.textContent = canLocalControl() ? "ROLL DICE" : "WAITING FOR OPPONENT";
  els.action.disabled = !canLocalControl();
  els.die.disabled = !canLocalControl();
  render();
  captureView(hitter,pitcher);
}

async function handleAction() {
  if (!game) return;
  if (game.gameOver) {
    if (game.online) {
      const wasDirect = directMode;
      clearOnlineTimers(); game=null; onlineMatchId=null; onlineRole=null; onlineVersion=0; localTeamKey="player";
      els.overlay.classList.remove("hidden"); window.scrollTo({top:0,left:0,behavior:"instant"});
      els.lobbyEntry.hidden = false; els.lobbyShell.hidden = true; els.onlineName.disabled = false;
      if (wasDirect) { directMode = false; activeReadyUpCode = null; publicQueueMatched = false; await startPublicMatchmaking(); }
      else await joinLobby();
    } else newCpuGame();
    return;
  }
  if (game.online && !canLocalControl()) return;
  if (game.phase === "pitch") resolvePitch();
  else { advanceGame(); if (game.online) publishOnline(); }
}

function resolvePitch() {
  game.phase = "rolling";
  els.action.disabled = true;
  els.die.disabled = true;
  els.die.classList.add("rolling");
  const roll = Math.floor(Math.random() * 6) + 1;
  const key = roll <= 2 ? "fb" : roll <= 4 ? "brk" : "off";
  const pitchName = key === "fb" ? "FASTBALL" : key === "brk" ? "BREAKING BALL" : "OFF-SPEED";

  window.setTimeout(() => {
    const {hitter, pitcher} = currentCards();
    const hitRating = hitter[key][0];
    const pitchRating = pitcher[key][0];
    let outcome;
    let winner;
    if (hitRating === pitchRating) {
      outcome = "BB";
      winner = "tie";
    } else if (hitRating > pitchRating) {
      outcome = hitter[key][1];
      winner = "hitter";
    } else {
      outcome = pitcher[key][1];
      winner = "pitcher";
    }

    els.die.classList.remove("rolling");
    els.die.textContent = roll;
    els.pitch.textContent = pitchName;
    els.values.textContent = `${hitRating}  VS  ${pitchRating}`;
    els.hitterCard.classList.add("revealed");
    els.pitcherCard.classList.add("revealed");
    els.hitterCaption.textContent = `${hitter.player} · S${hitter.season} ${hitter.series}`;
    els.pitcherCaption.textContent = `${pitcher.player} · S${pitcher.season} ${pitcher.series}`;

    const runs = applyOutcome(outcome);
    rotateCards();
    const label = outcomeLabel(outcome);
    const explanation = winner === "tie"
      ? `Ratings tied at ${hitRating}. Automatic walk.`
      : winner === "hitter"
        ? `${hitter.player} wins ${hitRating}–${pitchRating}.`
        : `${pitcher.player} wins ${pitchRating}–${hitRating}.`;
    els.banner.querySelector("span").textContent = runs ? `${runs} RUN${runs > 1 ? "S" : ""} SCORED` : explanation;
    els.result.textContent = label;
    els.status.textContent = explanation;
    addLog(`${pitchName}: ${hitter.player} ${hitRating} vs ${pitcher.player} ${pitchRating} — ${label}${runs ? `, ${runs} run${runs > 1 ? "s" : ""}` : ""}.`);

    game.phase = "result";
    game.atBats += 1;
    checkGameState();
    els.action.disabled = game.online ? !canLocalControl() : false;
    els.action.textContent = game.gameOver ? (game.online ? "BACK TO LOBBY" : "PLAY AGAIN") : game.pendingEnd ? "CONTINUE" : "NEXT BATTER";
    render();
    captureView(hitter,pitcher);
    if (game.online) publishOnline();
  }, 520);
}

function applyOutcome(outcome) {
  if (["K", "GO", "FO", "PO", "LO", "OUT"].includes(outcome)) {
    game.outs += 1;
    return 0;
  }
  if (outcome === "BB") return walkRunner();
  const bases = {"1B": 1, "2B": 2, "3B": 3, "HR": 4}[outcome];
  if (!bases) {
    game.outs += 1;
    return 0;
  }
  return advanceRunners(bases);
}

function scoreRuns(count) {
  game.score[offenseKey()] += count;
  return count;
}

function advanceRunners(distance) {
  let runs = 0;
  if (distance === 4) {
    runs = game.bases.filter(Boolean).length + 1;
    game.bases = [false, false, false];
    return scoreRuns(runs);
  }
  const next = [false, false, false];
  for (let i = 2; i >= 0; i--) {
    if (!game.bases[i]) continue;
    const destination = i + distance;
    if (destination >= 3) runs += 1;
    else next[destination] = true;
  }
  const batterBase = distance - 1;
  if (batterBase >= 3) runs += 1;
  else next[batterBase] = true;
  game.bases = next;
  scoreRuns(runs);
  return runs;
}

function walkRunner() {
  let runs = 0;
  if (game.bases[0]) {
    if (game.bases[1]) {
      if (game.bases[2]) runs = 1;
      game.bases[2] = true;
    }
    game.bases[1] = true;
  }
  game.bases[0] = true;
  scoreRuns(runs);
  return runs;
}

function rotateCards() {
  const offense = game[offenseKey()];
  const defense = game[defenseKey()];
  offense.hitterIndex += 1;
  if (offense.hitterIndex >= offense.hitters.length) {
    offense.hitterIndex = 0;
  }
  defense.pitcherBF += 1;
  if (defense.pitcherBF >= 1) {
    defense.pitcherBF = 0;
    defense.pitcherIndex += 1;
    if (defense.pitcherIndex >= defense.pitchers.length) {
      defense.pitcherIndex = 0;
    }
  }
}

function checkGameState() {
  const home = game.playerHome ? "player" : "cpu";
  const away = home === "player" ? "cpu" : "player";

  if (game.half === "bottom" && game.inning >= 3 && game.score[home] > game.score[away]) {
    finishGame("WALK-OFF");
    return;
  }

  if (game.outs < 2) return;
  game.pendingEnd = true;
  game.bases = [false, false, false];

  if (game.half === "top" && game.inning >= 3 && game.score[home] > game.score[away]) {
    finishGame("FINAL");
    return;
  }

  if (game.half === "bottom" && game.inning >= 3 && game.score.player !== game.score.cpu) {
    finishGame("FINAL");
  }
}

function advanceGame() {
  if (game.pendingEnd) {
    if (game.half === "top") {
      game.half = "bottom";
      addLog(`Bottom of inning ${game.inning} begins.`);
    } else {
      game.half = "top";
      game.inning += 1;
      selectedLogInning = game.inning;
      addLog(game.inning > 3
        ? `Extra inning ${game.inning} begins.`
        : `Top of inning ${game.inning} begins.`);
    }
    game.outs = 0;
    game.bases = [false, false, false];
  }
  prepareAtBat();
}

function finishGame(tag) {
  game.gameOver = true;
  game.pendingEnd = false;
  const otherKey = localTeamKey === "player" ? "cpu" : "player";
  const localScore = game.score[localTeamKey], otherScore = game.score[otherKey];
  const winner = localScore > otherScore ? "YOU WIN" : localScore < otherScore ? `${teamDisplay(otherKey)} WINS` : "TIE";
  els.banner.querySelector("span").textContent = tag;
  els.result.textContent = winner;
  els.status.textContent = `Final score: You ${localScore}, ${teamDisplay(otherKey)} ${otherScore}.`;
  addLog(`Final: ${teamDisplay(localTeamKey)} ${localScore}, ${teamDisplay(otherKey)} ${otherScore}. ${winner}.`);
  els.shareLog.hidden = false;
}

function outcomeLabel(outcome) {
  return ({
    "1B": "SINGLE",
    "2B": "DOUBLE",
    "3B": "TRIPLE",
    "HR": "HOME RUN",
    "BB": "WALK",
    "K": "STRIKEOUT",
    "GO": "GROUND OUT",
    "FO": "FLY OUT",
    "PO": "POP OUT",
    "LO": "LINE OUT",
    "OUT": "OUT"
  })[outcome] || outcome;
}

function addLog(message) {
  if (!game) return;
  game.logs.push({
    number: game.logs.length + 1,
    inning: game.inning,
    half: game.half,
    message
  });
  renderLog();
}

function renderLog() {
  if (!game) return;
  const innings = [...new Set(game.logs.map(entry => entry.inning))];
  if (!innings.includes(selectedLogInning)) selectedLogInning = innings[innings.length - 1] || 1;

  els.logTabs.innerHTML = "";
  innings.forEach((inning) => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "tab";
    button.textContent = `INN ${inning}`;
    button.setAttribute("aria-selected", inning === selectedLogInning ? "true" : "false");
    button.addEventListener("click", () => {
      selectedLogInning = inning;
      renderLog();
    });
    els.logTabs.appendChild(button);
  });

  els.log.innerHTML = "";
  game.logs
    .filter(entry => entry.inning === selectedLogInning)
    .forEach((entry) => {
      const item = document.createElement("li");
      const half = entry.half === "top" ? "TOP" : "BOT";
      item.value = entry.number;
      item.textContent = `${half} — ${entry.message}`;
      els.log.appendChild(item);
    });
  els.log.scrollTop = els.log.scrollHeight;
}

function buildGameLogText() {
  const awayKey = game.playerHome ? "cpu" : "player";
  const homeKey = game.playerHome ? "player" : "cpu";
  const otherKey = localTeamKey === "player" ? "cpu" : "player";
  const lines = [
    "PCBL ATTAX — FULL GAME LOG",
    "",
    `AWAY: ${teamDisplay(awayKey)}`,
    `HOME: ${teamDisplay(homeKey)}`,
    `FINAL SCORE: YOU ${game.score[localTeamKey]} — ${teamDisplay(otherKey)} ${game.score[otherKey]}`,
    ""
  ];
  const innings = [...new Set(game.logs.map(entry => entry.inning))];
  innings.forEach((inning) => {
    lines.push(`INNING ${inning}`);
    game.logs
      .filter(entry => entry.inning === inning)
      .forEach((entry) => {
        const half = entry.half === "top" ? "TOP" : "BOTTOM";
        lines.push(`${entry.number}. ${half} — ${entry.message}`);
      });
    lines.push("");
  });
  return lines.join("\n");
}

async function shareGameLog() {
  if (!game || !game.gameOver) return;
  const text = buildGameLogText();
  const file = new File([text], "PCBL_ATTAX_GAME_LOG.txt", {type: "text/plain"});
  try {
    if (navigator.share && navigator.canShare && navigator.canShare({files: [file]})) {
      await navigator.share({title: "PCBL ATTAX Game Log", files: [file]});
      return;
    }
  } catch (error) {
    if (error && error.name === "AbortError") return;
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function render() {
  if (!game) return;
  const awayKey = game.playerHome ? "cpu" : "player";
  const homeKey = game.playerHome ? "player" : "cpu";
  els.awayScore.textContent = game.score[awayKey];
  els.homeScore.textContent = game.score[homeKey];
  els.awayName.textContent = teamDisplay(awayKey);
  els.homeName.textContent = teamDisplay(homeKey);
  els.awayName.classList.toggle("user-team", awayKey === localTeamKey);
  els.homeName.classList.toggle("user-team", homeKey === localTeamKey);
  els.half.textContent = game.half === "top" ? "TOP" : "BOT";
  els.inning.textContent = game.inning;
  els.outOne.classList.toggle("active", game.outs >= 1);
  els.outTwo.classList.toggle("active", game.outs >= 2);
  els.first.classList.toggle("active", game.bases[0]);
  els.second.classList.toggle("active", game.bases[1]);
  els.third.classList.toggle("active", game.bases[2]);
  els.batterOwner.textContent = ownerDisplay(offenseKey());
  els.pitcherOwner.textContent = ownerDisplay(defenseKey());
  els.atBat.textContent = `AT BAT ${game.atBats}`;
}

function openRules() { els.dialog.showModal(); }

els.play.addEventListener("click", newGame);
els.action.addEventListener("click", handleAction);
els.shareLog.addEventListener("click", shareGameLog);
els.die.addEventListener("click", () => {
  if (game && game.phase === "pitch" && (!game.online || canLocalControl())) resolvePitch();
});
document.querySelectorAll("[data-side]").forEach((button) => {
  button.addEventListener("click", () => {
    sideChoice = button.dataset.side;
    document.querySelectorAll("[data-side]").forEach((option) => {
      const selected = option === button;
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    if (lobbyJoined) setLobbyPresence(currentPresenceStatus()).catch(()=>{});
  });
});
document.querySelectorAll("[data-mode]").forEach((button)=>button.addEventListener("click",async()=>{
  if (playMode === "online" && button.dataset.mode !== "online" && publicQueueActive) await cancelPublicMatchmaking();
  if (playMode === "online" && button.dataset.mode !== "online" && lobbyJoined) await leaveLobby();
  playMode=button.dataset.mode;
  document.querySelectorAll("[data-mode]").forEach(option=>{const selected=option===button;option.classList.toggle("selected",selected);option.setAttribute("aria-pressed",selected?"true":"false")});
  const online=playMode==="online";
  els.onlinePanel.hidden=!online;
  els.play.hidden=online;
  els.startModeLabel.textContent=online?(hasLocalDraftRoster()?"DRAFT ROSTER · PLAYER VS PLAYER":"CLASSIC · PLAYER VS PLAYER"):(hasLocalDraftRoster()?"DRAFT ROSTER · PLAYER VS CPU":"CLASSIC · PLAYER VS CPU");
  if (els.lobbyEntry) els.lobbyEntry.classList.remove("direct-only");
  const nameLabel = els.onlineName?.closest(".online-name");
  if (nameLabel) nameLabel.hidden = false;
  if(online){ setLobbyEnterState(false,"READY UP"); setOnlineStatus("READY UP TO ENTER PUBLIC MATCHMAKING.","ready"); }
}));
els.enterLobby?.addEventListener("click",joinLobby);
els.leaveLobby?.addEventListener("click",leaveLobby);
els.cancelChallenge?.addEventListener("click",cancelChallenge);
els.createReadyLink?.addEventListener("click",createReadyUpLink);
els.copyReadyLink?.addEventListener("click",copyReadyUpLink);
$("rules-button").addEventListener("click", openRules);
$("start-rules-button").addEventListener("click", openRules);
$("close-rules").addEventListener("click", () => els.dialog.close());
$("new-game-logo").addEventListener("click", async () => {
  if (!game || window.confirm("Leave this game and return to the start screen?")) {
    const wasOnline = Boolean(game?.online);
    if(wasOnline)clearOnlineTimers();
    game=null;onlineMatchId=null;onlineRole=null;onlineVersion=0;localTeamKey="player";
    els.overlay.classList.remove("hidden");window.scrollTo({top:0,left:0,behavior:"instant"});
    if (wasOnline && playMode === "online") {
      els.lobbyEntry.hidden = false; els.lobbyShell.hidden = true; els.onlineName.disabled = false;
      if (directMode) { directMode = false; activeReadyUpCode = null; publicQueueMatched = false; await startPublicMatchmaking(); }
      else await joinLobby();
    }
  }
});
els.dialog.addEventListener("click", (event) => {
  if (event.target === els.dialog) els.dialog.close();
});
window.addEventListener("beforeunload",()=>{
  clearOnlineTimers(); clearLobbyTimers();
  if (publicCoordinatorConn) { try { publicCoordinatorConn.close(); } catch (_) {} }
  if (publicCoordinatorPeer) { try { publicCoordinatorPeer.destroy(); } catch (_) {} }
});
window.scrollTo({top:0,left:0,behavior:"instant"});
if (activeReadyUpCode) {
  playMode = "online";
  document.querySelectorAll("[data-mode]").forEach(option=>{
    const selected = option.dataset.mode === "online";
    option.classList.toggle("selected", selected);
    option.setAttribute("aria-pressed",selected?"true":"false");
  });
  els.onlinePanel.hidden = false;
  els.play.hidden = true;
  els.startModeLabel.textContent = `READY UP · ROOM ${activeReadyUpCode}`;
  els.lobbyEntry.hidden = true;
  els.lobbyShell.hidden = true;
  setOnlineStatus(`ROOM ${activeReadyUpCode} · CONNECTING DIRECTLY…`, "waiting");
  window.setTimeout(()=>startDirectRoom(activeReadyUpCode),0);
} else {
  if (els.lobbyEntry) els.lobbyEntry.classList.remove("direct-only");
  const nameLabel = els.onlineName?.closest(".online-name");
  if (nameLabel) nameLabel.hidden = false;
  setLobbyEnterState(false,"READY UP");
  setOnlineStatus(hasLocalDraftRoster()?"DRAFT ROSTER READY · READY UP TO ENTER PUBLIC MATCHMAKING.":"READY UP TO ENTER PUBLIC MATCHMAKING.","ready");
  if (draftOnlineRequested && !publicMatchmakingRequested) {
    playMode = "online";
    document.querySelectorAll("[data-mode]").forEach(option=>{
      const selected = option.dataset.mode === "online";
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-pressed",selected?"true":"false");
    });
    els.onlinePanel.hidden = false; els.play.hidden = true; els.startModeLabel.textContent = "DRAFT ROSTER · PLAYER VS PLAYER";
  }
  if (publicMatchmakingRequested) {
    playMode = "online";
    document.querySelectorAll("[data-mode]").forEach(option=>{
      const selected = option.dataset.mode === "online";
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-pressed",selected?"true":"false");
    });
    els.onlinePanel.hidden = false; els.play.hidden = true; els.startModeLabel.textContent = hasLocalDraftRoster()?"DRAFT ROSTER · PUBLIC MATCHMAKING":"CLASSIC · PUBLIC MATCHMAKING";
    window.setTimeout(()=>startPublicMatchmaking(),0);
  }
}
