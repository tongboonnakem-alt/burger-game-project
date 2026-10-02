import type { Category, Ingredient, ScoreResult } from './types';

export const ART = '/quest-art/';
export const CAMP = { x: 768, y: 900 };
export const ENEMIES = [
  { id: 0, name: 'อัศวินกระเทียม', title: 'ผู้พิทักษ์ทางตะวันตก', x: 360, y: 385, hp: 86, attack: 13, xp: 40 },
  { id: 1, name: 'จอมโจรมันฝรั่ง', title: 'นักล่าแห่งทางตะวันออก', x: 1160, y: 480, hp: 112, attack: 16, xp: 60 },
  { id: 2, name: 'ราชินีมะเขือม่วง', title: 'ผู้ครองครัวเตาไฟ', x: 1240, y: 270, hp: 164, attack: 21, xp: 120 },
] as const;
export const CRYSTALS = [{ x: 650, y: 620 }, { x: 910, y: 620 }, { x: 1060, y: 550 }, { x: 470, y: 260 }, { x: 900, y: 180 }];
export type Profile = { name: string; score: ScoreResult; selected: Partial<Record<Category, Ingredient>> };
export type PathId = 'blade' | 'storm' | 'life' | 'ward';
export const PATHS = [
  { id: 'blade', icon: '⚔', name: 'คมตะหลิว', role: 'กายภาพ', color: '#efb576', skill: 'ฟันสะเทือนเตา', detail: 'ท่าโจมตีหนัก · ยิ่งอัปคมตะหลิวยิ่งรุนแรง', passive: 'คมอาวุธ', benefit: 'พลังโจมตีพื้นฐาน +4 ต่อขั้น' },
  { id: 'storm', icon: 'ϟ', name: 'พายุซอส', role: 'สายฟ้า', color: '#aacaff', skill: 'อัสนีซอสระเบิด', detail: 'สายฟ้ารุนแรงพร้อมช็อต · ลดการโจมตีสวน 30%', passive: 'ประจุสะสม', benefit: 'สกิลสายฟ้า +12% ต่อขั้น' },
  { id: 'life', icon: '✚', name: 'ครัวเยียวยา', role: 'ฮีล', color: '#ade2a0', skill: 'บุปผาคืนชีพ', detail: 'ฟื้นพลังพร้อมโจมตี · อยู่รอดได้แม้ศึกยาวนาน', passive: 'ชีพจรสวน', benefit: 'HP สูงสุด +12 และฮีล +5 ต่อขั้น' },
  { id: 'ward', icon: '◇', name: 'เกราะเตาไฟ', role: 'ป้องกัน', color: '#e6b5f1', skill: 'โล่สะท้อนเพลิง', detail: 'ทุบด้วยโล่และป้องกัน 70% ในเทิร์นเดียวกัน', passive: 'ผิวเหล็ก', benefit: 'ลดดาเมจที่ได้รับ 1 ต่อขั้น' },
] as const;
export const RARITIES = [
  { id: 'common', name: 'ธรรมดา', color: '#bbc9b6', power: 8, sell: 12 },
  { id: 'uncommon', name: 'ดีเยี่ยม', color: '#9ad698', power: 13, sell: 25 },
  { id: 'rare', name: 'แรร์', color: '#8dc4ff', power: 20, sell: 60 },
  { id: 'epic', name: 'อีปิก', color: '#d2a2ff', power: 30, sell: 140 },
  { id: 'legendary', name: 'ตำนาน', color: '#ffd278', power: 42, sell: 300 },
] as const;
export type Rarity = typeof RARITIES[number]['id'];
export type Gear = { id: string; name: string; slot: 'weapon' | 'armor'; rarity: Rarity; upgrade: number; affinity: PathId };
export type DropRates = { equipment: number; weights: number[] };
export type Progress = { hp: number; potions: number; defeated: number[]; collected: number[]; xp: number; path: PathId; gold: number; stones: number; essence: number; floor: number; bossWins: number; kills: number; skills: Record<PathId, number>; passives: Record<PathId, number>; inventory: Gear[]; weapon: string; armor: string; readyAt: number[]; rates: DropRates };
export const levelOf = (xp: number) => Math.min(20, 1 + Math.floor((Math.sqrt(10000 + 160 * Math.max(0, xp)) - 100) / 80));
export const xpForLevel = (level: number) => 40 * (level - 1) ** 2 + 100 * (level - 1);
export const tierOf = (level: number) => level >= 20 ? 'gold' : level >= 15 ? 'violet' : level >= 10 ? 'red' : level >= 5 ? 'wood' : 'plain';
export const maxHealth = (score: ScoreResult, p?: Progress) => Math.round(104 + score.balance * .5 + (p ? (levelOf(p.xp) - 1) * 8 + p.passives.life * 12 : 0));
export const attackPower = (score: ScoreResult) => Math.round(17 + score.taste * .1);
export const initialProgress = (score: ScoreResult): Progress => ({ hp: maxHealth(score), potions: 3, defeated: [], collected: [], xp: 0, path: 'blade', gold: 60, stones: 3, essence: 0, floor: 1, bossWins: 0, kills: 0, skills: { blade: 1, storm: 1, life: 1, ward: 1 }, passives: { blade: 0, storm: 0, life: 0, ward: 0 }, inventory: [{ id:'starter-weapon',name:'ตะหลิวคู่ใจ',slot:'weapon',rarity:'common',upgrade:0,affinity:'blade' },{ id:'starter-armor',name:'ผ้ากันเปื้อนนักเดินทาง',slot:'armor',rarity:'common',upgrade:0,affinity:'ward' }], weapon:'starter-weapon',armor:'starter-armor',readyAt:[0,0,0],rates:{equipment:40,weights:[55,27,13,4,1]} });
export const SAVE_KEY = 'burger-orbit-ember-garden-v2';
export const gearPower = (g?: Gear) => g ? RARITIES.find(r=>r.id===g.rarity)!.power + g.upgrade * 4 : 0;
export const equipped = (p: Progress, slot: 'weapon' | 'armor') => p.inventory.find(g=>g.id===p[slot]);
export const heroAttack = (score: ScoreResult, p: Progress) => Math.round(attackPower(score) + (levelOf(p.xp)-1)*1.5 + gearPower(equipped(p,'weapon'))*.45 + p.passives.blade*4);
export const passivePoints = (p: Progress) => levelOf(p.xp)-1-Object.values(p.passives).reduce((a,b)=>a+b,0);
export const upgradeCost = (g: Gear) => ({ gold: 25 + g.upgrade * 15, stones: 1 + Math.floor(g.upgrade / 4) });
export const skillCost = (level: number) => ({ gold: 15 * level, essence: Math.ceil(level / 2) });
export function readAdventure(): { profile: Profile; progress: Progress } | null {
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY) || localStorage.getItem('burger-orbit-ember-garden-v1') || 'null');
    const raw = data?.progress;
    const s = data?.profile?.score;
    if (!raw || !s || typeof data.profile.name !== 'string' || !data.profile.selected || !['SS+','S','A','B','C','D','F'].includes(s.rank) || typeof s.review!=='string' || !Number.isFinite(s.total) || !Number.isFinite(s.calories) || !Array.isArray(s.bonuses) || !s.bonuses.every((bonus:unknown)=>typeof bonus==='string') ||
      !['balance', 'taste', 'crispy', 'chaos'].every(k => typeof s[k] === 'number' && s[k] >= 0 && s[k] <= 100) ||
      !Number.isInteger(raw.xp) || raw.xp < 0) return null;
    const p = { ...initialProgress(s), ...raw } as Progress;
    if (!PATHS.some(c=>c.id===p.path) || !p.skills || !p.passives || !PATHS.every(c=>Number.isInteger(p.skills[c.id]) && p.skills[c.id]>=1 && p.skills[c.id]<=20 && Number.isInteger(p.passives[c.id]) && p.passives[c.id]>=0 && p.passives[c.id]<=5) || passivePoints(p)<0 ||
      !Number.isFinite(p.hp) || p.hp < 0 || p.hp > maxHealth(s,p) || !Number.isInteger(p.potions) || p.potions < 0 || p.potions > 9 ||
      ![p.gold,p.stones,p.essence,p.bossWins,p.kills].every(n=>Number.isSafeInteger(n)&&n>=0) || !Number.isInteger(p.floor) || p.floor<1 || p.floor>20 ||
      !Array.isArray(p.defeated) || !Array.isArray(p.collected) || new Set(p.defeated).size!==p.defeated.length || new Set(p.collected).size!==p.collected.length ||
      !p.defeated.every(n=>Number.isInteger(n)&&n>=0&&n<3) || !p.collected.every(n=>Number.isInteger(n)&&n>=0&&n<5) ||
      !Array.isArray(p.readyAt) || p.readyAt.length!==3 || !p.readyAt.every(n=>Number.isFinite(n)&&n>=0) ||
      !Array.isArray(p.inventory) || p.inventory.length>40 || !p.inventory.every(g=>typeof g.id==='string'&&typeof g.name==='string'&&['weapon','armor'].includes(g.slot)&&RARITIES.some(r=>r.id===g.rarity)&&Number.isInteger(g.upgrade)&&g.upgrade>=0&&g.upgrade<=20&&PATHS.some(c=>c.id===g.affinity)) ||
      new Set(p.inventory.map(g=>g.id)).size!==p.inventory.length || !equipped(p,'weapon') || equipped(p,'weapon')!.slot!=='weapon' || !equipped(p,'armor') || equipped(p,'armor')!.slot!=='armor' ||
      !p.rates || !Number.isFinite(p.rates.equipment) || p.rates.equipment<0 || p.rates.equipment>100 || !Array.isArray(p.rates.weights) || p.rates.weights.length!==5 || !p.rates.weights.every(n=>Number.isFinite(n)&&n>=0&&n<=100) || p.rates.weights.reduce((a,b)=>a+b,0)<=0) return null;
    return { profile: data.profile, progress: p };
  } catch { return null; }
}
export type Action = 'attack' | 'special' | 'guard' | 'potion';
export type Battle = {
  enemy: number; hp: number; enemyHp: number; potions: number; energy: number; round: number;
  phase: 'choose' | 'strike' | 'enemy' | 'won' | 'lost'; guard: boolean; log: string;
  damage: number; received: number; heal: number; move: Action;
  maxEnemyHp: number; enemyAttack: number; rewardXp: number; shock: boolean;
};
export function beginBattle(enemy: number, progress: Progress): Battle {
  const maxEnemyHp = Math.round(ENEMIES[enemy].hp * (1+(progress.floor-1)*.55));
  return { enemy, hp: progress.hp, enemyHp: maxEnemyHp, maxEnemyHp, enemyAttack: Math.round(ENEMIES[enemy].attack*(1+(progress.floor-1)*.28)), rewardXp: Math.round(ENEMIES[enemy].xp*(1+(progress.floor-1)*.65)), potions: progress.potions, energy: 2, round: 1,
    phase: 'choose', guard: false, shock: false, log: 'เลือกคำสั่ง แล้วเตรียมรับการโจมตีกลับ', damage: 0, received: 0, heal: 0, move: 'attack' };
}
export function playerTurn(b: Battle, action: Action, score: ScoreResult, p: Progress): Battle {
  if (b.phase !== 'choose' || (action === 'special' && b.energy < 2) || (action === 'potion' && (b.potions === 0 || b.hp === maxHealth(score,p)))) return b;
  const base = heroAttack(score,p), special = action==='special', rank = p.skills[p.path];
  const affinity = equipped(p,'weapon')?.affinity===p.path ? 1.1 : 1;
  const multiplier = p.path==='blade' ? 1.8 : p.path==='storm' ? 1.7*(1+p.passives.storm*.12) : p.path==='life' ? .85 : 1.25;
  const damage = action==='attack' ? base : special ? Math.round((base*multiplier+rank*2+score.chaos*.04)*affinity) : 0;
  const heal = Math.max(0, Math.min(maxHealth(score,p)-b.hp, action==='potion' ? Math.round(maxHealth(score,p)*.38)+p.passives.life*5 : special && p.path==='life' ? Math.round(maxHealth(score,p)*.18)+rank*3+p.passives.life*5 : 0));
  return { ...b, phase: 'strike', move: action, damage, received: 0, heal, hp: b.hp + heal, enemyHp: Math.max(0, b.enemyHp - damage),
    potions: b.potions - (action === 'potion' ? 1 : 0), guard: action==='guard'||special&&p.path==='ward', shock:special&&p.path==='storm', energy: Math.min(4, b.energy + (special ? -2 : 1)),
    log: action==='attack' ? `ฟาดตะหลิว! −${damage} HP` : special ? `${PATHS.find(c=>c.id===p.path)!.skill}! −${damage} HP${heal?` · ฟื้น ${heal} HP`:''}${p.path==='storm'?' · ช็อตลดดาเมจสวน 30%':p.path==='ward'?' · ตั้งโล่ลดดาเมจ 70%':''}` : action==='guard' ? 'ตั้งโล่ขนมปังกรอบ ลดความเสียหายเทิร์นนี้ 70%' : `ดื่มน้ำซุปอุ่น ฟื้นฟู ${heal} HP` };
}
export function enemyTurn(b: Battle, score: ScoreResult, p?: Progress): Battle {
  if (b.phase !== 'enemy') return b;
  const charged = b.round % 3 === 0;
  const armor = p ? gearPower(equipped(p,'armor'))*.12+p.passives.ward : 0;
  const damage = Math.max(2, Math.round((b.enemyAttack * (charged ? 1.8 : 1) - score.crispy * .055 - armor) * (b.guard ? .3 : 1) * (b.shock ? .7 : 1)));
  const hp = Math.max(0, b.hp - damage);
  return { ...b, hp, received: damage, heal: 0, damage: 0, guard: false, shock: false, phase: hp === 0 ? 'lost' : 'choose', round: b.round + 1,
    log: hp === 0 ? 'ไฟในตัวดับลง… กลับไปพักที่แคมป์แล้วลองใหม่ได้' : `${ENEMIES[b.enemy].name}${charged ? ' ใช้ท่าไม้ตาย' : ' โจมตี'} −${damage} HP` };
}

export type Loot = { gold: number; stones: number; essence: number; xp: number; gear?: Gear; sold: boolean; levelUp: boolean };
export function createGear(slot: Gear['slot'], rarity: Rarity, affinity: PathId, id: string = crypto.randomUUID()): Gear {
  const names = { blade:'ตะหลิวคมเหล็ก',storm:'คทาสายฟ้า',life:'ช้อนพฤกษา',ward:'โล่กระทะ' };
  return { id, slot, rarity, affinity, upgrade:0, name:slot==='weapon' ? names[affinity] : 'เกราะรากเตาไฟ' };
}
export function grantVictory(p: Progress, b: Battle, score: ScoreResult, rng = Math.random, now = Date.now()): { progress: Progress; loot: Loot } {
  if (b.phase!=='won') throw new Error('Rewards require victory');
  const boss = b.enemy===2, scale = 1+(p.floor-1)*.3;
  const loot: Loot = { gold:Math.round((boss?65:18+Math.floor(rng()*15))*scale),stones:boss?5:1+Math.floor(rng()*3),essence:boss?5:1+Math.floor(rng()*2),xp:b.rewardXp,sold:false,levelUp:false };
  if (rng()*100 < p.rates.equipment) {
    let roll = rng()*p.rates.weights.reduce((a,c)=>a+c,0), index=0;
    while (index<4 && roll>=p.rates.weights[index]) {roll-=p.rates.weights[index];index++;}
    loot.gear=createGear(rng()<.7?'weapon':'armor',RARITIES[index].id,PATHS[Math.floor(rng()*4)].id,`${now}-${p.kills}-${b.enemy}`);
    if (p.inventory.length>=40) {loot.sold=true;loot.gold+=RARITIES[index].sell;}
  }
  const xp=Math.min(xpForLevel(20),p.xp+loot.xp);
  loot.xp=xp-p.xp; loot.levelUp=levelOf(xp)>levelOf(p.xp);
  const next: Progress = { ...p, xp, gold:p.gold+loot.gold, stones:p.stones+loot.stones, essence:p.essence+loot.essence, kills:p.kills+1, bossWins:p.bossWins+(boss?1:0), potions:Math.min(9,b.potions+1), defeated:[...new Set([...p.defeated,b.enemy])],readyAt:p.readyAt.map((value,id)=>id===b.enemy?now+(boss?60000:25000):value),inventory:loot.gear&&!loot.sold?[...p.inventory,loot.gear]:p.inventory };
  next.hp=loot.levelUp?maxHealth(score,next):Math.min(maxHealth(score,next),b.hp+22);
  return {progress:next,loot};
}
export function improveGear(p: Progress, id: string): Progress {
  const gear=p.inventory.find(g=>g.id===id);
  if (!gear||gear.upgrade>=20) return p;
  const cost=upgradeCost(gear); if(p.gold<cost.gold||p.stones<cost.stones) return p;
  return {...p,gold:p.gold-cost.gold,stones:p.stones-cost.stones,inventory:p.inventory.map(g=>g.id===id?{...g,upgrade:g.upgrade+1}:g)};
}
export function improveSkill(p: Progress, path: PathId): Progress {
  const level=p.skills[path],cost=skillCost(level);
  if (level>=20||level>=levelOf(p.xp)+4||p.gold<cost.gold||p.essence<cost.essence) return p;
  return {...p,gold:p.gold-cost.gold,essence:p.essence-cost.essence,skills:{...p.skills,[path]:level+1}};
}
export function improvePassive(p: Progress, path: PathId, score: ScoreResult): Progress {
  if (passivePoints(p)<=0||p.passives[path]>=5) return p;
  const next={...p,passives:{...p.passives,[path]:p.passives[path]+1}};
  return {...next,hp:Math.min(maxHealth(score,next),p.hp+(path==='life'?12:0))};
}
export function sellGear(p: Progress, id: string): Progress {
  const gear=p.inventory.find(g=>g.id===id);
  if (!gear||p.weapon===id||p.armor===id) return p;
  return {...p,gold:p.gold+RARITIES.find(r=>r.id===gear.rarity)!.sell+gear.upgrade*10,inventory:p.inventory.filter(g=>g.id!==id)};
}
export const SHOP = [{rarity:'uncommon',price:90},{rarity:'rare',price:240},{rarity:'epic',price:650}] as const;
export function buyGear(p: Progress, index: number, slot: Gear['slot'], id?: string): Progress {
  const item=SHOP[index]; if (!item||p.gold<item.price||p.inventory.length>=40) return p;
  return {...p,gold:p.gold-item.price,inventory:[...p.inventory,createGear(slot,item.rarity,p.path,id)]};
}
export function advanceExpedition(p: Progress, score: ScoreResult): Progress {
  if(p.floor>=20||!p.defeated.includes(2))return p;
  return {...p,floor:p.floor+1,defeated:[],readyAt:[0,0,0],collected:[],hp:maxHealth(score,p)};
}

type WalkLane = { radius: number; points: number[] };
type WalkZone = { x: number; y: number; rx: number; ry: number };
// These are broad playable surfaces, not guide rails. Their widths are inset from the visible road edges
// so the hero can roam freely while still colliding with water, cliffs and dense scenery.
export const WALK_LANES: WalkLane[] = [
  { radius: 68, points: [768,900,768,820,768,730,768,640,650,620,535,585,440,525,370,455,340,385,390,320,470,265,560,205,660,175,780,180] },
  { radius: 68, points: [780,180,900,180,1010,195,1110,220,1200,250,1240,270,1250,350,1220,415,1160,480,1090,545,1000,595,900,620,768,640] },
  { radius: 29, points: [370,360,300,320,230,295,155,285] },
  { radius: 31, points: [520,590,455,625,385,650,315,650,235,625,155,615] },
  { radius: 31, points: [1010,595,1070,625,1140,650,1215,665,1290,650] },
];
export const WALK_ZONES: WalkZone[] = [
  { x:768,y:850,rx:126,ry:92 },
  { x:768,y:610,rx:330,ry:72 },
  { x:360,y:385,rx:102,ry:84 },
  { x:780,y:180,rx:215,ry:72 },
  { x:1160,y:465,rx:105,ry:92 },
  { x:1210,y:265,rx:150,ry:78 },
];
const BLOCKED_ZONES: WalkZone[] = [
  { x:768,y:390,rx:225,ry:155 },
  { x:835,y:795,rx:72,ry:43 },
  { x:690,y:792,rx:44,ry:38 },
  { x:768,y:838,rx:24,ry:20 },
];
function nearLane(x: number, y: number, lane: WalkLane): boolean {
  for (let i = 0; i < lane.points.length - 2; i += 2) {
    const ax = lane.points[i], ay = lane.points[i + 1], dx = lane.points[i + 2] - ax, dy = lane.points[i + 3] - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    if (Math.hypot(x - ax - dx * t, y - ay - dy * t) < lane.radius) return true;
  }
  return false;
}
const inZone = (x: number, y: number, zone: WalkZone) => ((x-zone.x)/zone.rx)**2 + ((y-zone.y)/zone.ry)**2 < 1;
export function canWalk(x: number, y: number): boolean {
  if (BLOCKED_ZONES.some(zone=>inZone(x,y,zone))) return false;
  return WALK_ZONES.some(zone=>inZone(x,y,zone)) || WALK_LANES.some(lane=>nearLane(x,y,lane));
}
