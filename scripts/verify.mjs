import fs from 'node:fs';
import assert from 'node:assert/strict';
assert.equal(JSON.parse(fs.readFileSync('wrangler.jsonc','utf8')).name,'pcblarcade');
for(const path of ['site/index.html','site/app.js','site/world-url.js','site/games/attax/index.html','site/games/versus/index.html']) assert(fs.existsSync(path),`Missing ${path}`);
const html=fs.readFileSync('site/index.html','utf8');
for(const tag of ['LIVE OPEN WORLD (STUY TOWN)','CUSTOM CAREER MODE','PCBL VERSUS','PCBA PICKUP','HORROR GAMES','RACING GAMES','AVOID MURPHY AND THE HOMELESS','COLLECT ATTAX CARDS','PLAY WITH FRIENDS','AND MORE']) assert(html.includes(tag),`Missing: ${tag}`);
console.log('Arcade files, deployment target, and all ten feature tags verified.');
