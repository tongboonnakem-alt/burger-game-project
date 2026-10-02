import { useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import type { ScoreResult } from './types';
import { ART, ORES, PATHS, RARITIES, SHOP, advanceExpedition, attemptEnhancement, buyGear, enhancementChance, equipped, gearPower, heroAttack, improvePassive, improveSkill, levelOf, maxHealth, passivePoints, sellGear, skillCost, tierOf, upgradeCost, xpForLevel, type Gear, type Ore, type Progress } from './questModel';

export function GearBadge({gear}:{gear?:Gear}) {
  const column=Math.max(0,PATHS.findIndex(path=>path.id===gear?.affinity));
  return <span className={`ember-gear-icon tier-${tierOf(gear?.upgrade||0)}`} style={{color:RARITIES.find(r=>r.id===gear?.rarity)?.color}}><span className="ember-equipment-art" style={{backgroundPosition:`${column*100/3}% ${gear?.slot==='armor'?100:0}%`}}/>{gear&&gear.upgrade>=5&&<i>{'★'.repeat(Math.floor(gear.upgrade/5))}</i>}</span>;
}

function OreIcon({ore}:{ore:Ore}) {
  const column=['blade','storm','life','ward','universal'].indexOf(ore.path);
  return <span className="ember-ore-icon" style={{backgroundPosition:`${column*25}% ${(ore.tier-1)*100/9}%`}}/>;
}

function ForgePanel({gear,progress,onChange,onClose}:{gear:Gear;progress:Progress;onChange:Dispatch<SetStateAction<Progress>>;onClose:()=>void}) {
  const owned=ORES.filter(ore=>(progress.ores[ore.id]||0)>0).sort((a,b)=>b.tier-a.tier||a.name.localeCompare(b.name));
  const preferred=owned.find(ore=>ore.path===gear.affinity)||owned.find(ore=>ore.path==='universal')||owned[0];
  const [oreId,setOreId]=useState(preferred?.id||'');
  const [amount,setAmount]=useState(1);
  const [phase,setPhase]=useState<'idle'|'charging'|'success'|'fail'>('idle');
  const [lastChance,setLastChance]=useState(0);
  const [lastLevel,setLastLevel]=useState(0);
  const ore=ORES.find(item=>item.id===oreId);
  const cost=upgradeCost(gear);
  const available=ore?(progress.ores[ore.id]||0):0;
  const chance=ore?enhancementChance(gear,ore,Math.min(amount,available)):0;
  const path=PATHS.find(item=>item.id===gear.affinity)!;
  const target=Math.min(20,gear.upgrade+1);
  const canTry=phase==='idle'&&gear.upgrade<20&&!!ore&&available>=amount&&progress.gold>=cost.gold;
  const attempt=()=>{
    if(!canTry||!ore)return;
    const capturedLevel=gear.upgrade+1;
    setPhase('charging');
    window.setTimeout(()=>{
      const result=attemptEnhancement(progress,gear.id,ore.id,amount);
      onChange(result.progress);
      setLastChance(result.chance);
      setLastLevel(capturedLevel);
      setPhase(result.success?'success':'fail');
      window.setTimeout(()=>setPhase('idle'),1500);
    },800);
  };
  return <section className={`ember-forge phase-${phase}`}>
    <div className="ember-forge-shade"/>
    <header className="ember-forge-head"><div><small>THE CAT KING'S FORGE</small><h2>เตาหลอมเจ้าเหมียวทมิฬ</h2><p>ปลุกพลังอุปกรณ์ถึง +20 · ล้มมอนสเตอร์เพื่อค้นพบแร่ทั้ง 100 ชนิด</p></div><button onClick={onClose} aria-label="ปิดเตาหลอม">×</button></header>
    <div className="ember-forge-main">
      <div className="ember-forge-item"><GearBadge gear={gear}/><small style={{color:path.color}}>{path.icon} {path.role} · {gear.slot==='weapon'?'อาวุธ':'เกราะ'}</small><h3>{gear.name}</h3><strong>+{gear.upgrade}</strong><span>→ +{target}</span></div>
      <div className="ember-forge-chance"><div><span>โอกาสสำเร็จ</span><b>{chance}%</b></div><div className="ember-chance-track"><i style={{width:`${chance}%`}}/></div><small>เรตพื้นฐาน +{target}: {gear.upgrade<20?`${[100,100,100,100,90,80,70,60,50,40,34,28,23,19,15,12,9,7,5,3][gear.upgrade]}%`:'MAX'} · แร่ตรงสายเพิ่มเต็มประสิทธิภาพ</small></div>
      <div className="ember-catalyst"><b>ช่องตัวเร่ง</b><div>{[0,1,2].map(index=><button key={index} className={index<amount&&ore?'filled':''} onClick={()=>setAmount(index+1)}>{index<amount&&ore?<OreIcon ore={ore}/>:<span>+</span>}</button>)}</div><small>ใช้ {amount} ก้อน · มี {available} · โบนัส {ore?ore.bonus*amount:0}% {ore&&ore.path!==gear.affinity&&ore.path!=='universal'?'(ต่างสายเหลือครึ่งหนึ่ง)':''}</small></div>
      <button className="ember-forge-button" disabled={!canTry} onClick={attempt}>{gear.upgrade>=20?'★ พลังถึงขีดสุดแล้ว':!ore?'ยังไม่มีแร่':available<amount?'แร่ไม่พอ':progress.gold<cost.gold?'เหรียญไม่พอ':`ตีบวก ${cost.gold} ◎`}</button>
      {phase!=='idle'&&<div className="ember-forge-result"><span>{phase==='charging'?'✦':phase==='success'?'★':'◇'}</span><b>{phase==='charging'?'กำลังหลอมพลัง…':phase==='success'?`สำเร็จ! พลังเพิ่มเป็น +${lastLevel}`:`ไม่สำเร็จ (${lastChance||chance}%)`}</b><small>{phase==='fail'?'อุปกรณ์ไม่เสียหาย แต่แร่และเหรียญถูกใช้แล้ว':' '}</small></div>}
      <div className="ember-forge-sparks">{Array.from({length:18},(_,i)=><i key={i} style={{'--spark':i} as CSSProperties}/>)}</div>
    </div>
    <aside className="ember-ore-vault"><header><div><b>คลังแร่</b><small>ค้นพบ {Object.values(progress.ores).filter(Boolean).length} / 100 ชนิด</small></div><span>ชั้น 1 ดรอปง่าย · ชั้น 10 หายากที่สุด</span></header><div>{owned.map(item=><button key={item.id} className={item.id===oreId?'selected':''} onClick={()=>{setOreId(item.id);setAmount(1);}}><OreIcon ore={item}/><span><b style={{color:item.color}}>{item.name}</b><small>{item.path==='universal'?'ใช้ได้ทุกสาย':PATHS.find(p=>p.id===item.path)?.role} · ระดับ {item.tier} · +{item.bonus}%</small></span><em>×{progress.ores[item.id]}</em></button>)}</div>{!owned.length&&<p>ยังไม่มีแร่ · ออกไปกำจัดมอนสเตอร์แล้วกลับมาใหม่</p>}</aside>
  </section>;
}

function BackpackOverview({progress:p,score}:{progress:Progress;score:ScoreResult}) {
  const level=levelOf(p.xp),path=PATHS.find(item=>item.id===p.path)!;
  const weapon=equipped(p,'weapon'),armor=equipped(p,'armor');
  const owned=ORES.filter(ore=>(p.ores[ore.id]||0)>0).sort((a,b)=>b.tier-a.tier||a.path.localeCompare(b.path));
  return <section className="ember-backpack-overview">
    <div className="ember-avatar-panel">
      <header><small>PROFILE</small><b>{path.icon} นักผจญภัยสาย{path.role}</b></header>
      <div className="ember-avatar-stage"><div className="ember-bag-character" style={{backgroundImage:`url(${ART}hero.png)`}}/><span className={`ember-avatar-level tier-${tierOf(level)}`}>LV.{level}</span></div>
      <div className="ember-equipped-slots"><article><GearBadge gear={weapon}/><div><small>อาวุธที่สวม</small><b>{weapon?.name||'ไม่มีอาวุธ'} +{weapon?.upgrade||0}</b><span>พลัง {gearPower(weapon)}</span></div></article><article><GearBadge gear={armor}/><div><small>เกราะที่สวม</small><b>{armor?.name||'ไม่มีเกราะ'} +{armor?.upgrade||0}</b><span>ลดดาเมจ {((gearPower(armor))*0.12).toFixed(1)}</span></div></article></div>
      <div className="ember-avatar-stats"><span>⚔ <b>{heroAttack(score,p)}</b><small>โจมตี</small></span><span>♥ <b>{maxHealth(score,p)}</b><small>HP สูงสุด</small></span><span>★ <b>{p.kills}</b><small>ชัยชนะ</small></span></div>
    </div>
    <div className="ember-material-panel">
      <header><div><small>BACKPACK</small><b>วัตถุดิบและทรัพย์สิน</b></div><span>{owned.length} / 100 แร่ที่ค้นพบ</span></header>
      <div className="ember-resource-grid"><span>◎ <b>{p.gold}</b><small>เหรียญ</small></span><span>✧ <b>{p.essence}</b><small>ผลึกสกิล</small></span><span>◆ <b>{p.stones}</b><small>หินเวท</small></span><span>♨ <b>{p.potions}</b><small>น้ำซุป</small></span></div>
      <div className="ember-material-title"><b>แร่จากมอนสเตอร์</b><small>แตะดูชื่อและจำนวน · ใช้เพิ่มโอกาสตีบวก</small></div>
      <div className="ember-material-grid">{owned.map(ore=><div key={ore.id} title={`${ore.name} · ระดับ ${ore.tier}`}><OreIcon ore={ore}/><em>×{p.ores[ore.id]}</em><small style={{color:ore.color}}>{ore.tier}</small></div>)}{!owned.length&&<p>ยังไม่มีแร่ ออกไปกำจัดมอนสเตอร์เพื่อเก็บของ</p>}</div>
    </div>
  </section>;
}
export default function EmberCamp({progress:p,score,atCamp,onChange,onClose}:{progress:Progress;score:ScoreResult;atCamp:boolean;onChange:Dispatch<SetStateAction<Progress>>;onClose:()=>void}) {
  const [tab,setTab]=useState<'gear'|'skills'|'shop'|'rates'>('gear');
  const [forgeId,setForgeId]=useState<string|null>(null);
  const [rates,setRates]=useState(()=>({equipment:p.rates.equipment,weights:[...p.rates.weights]}));
  const [rateSaved,setRateSaved]=useState(false);
  const level=levelOf(p.xp),points=passivePoints(p),path=PATHS.find(c=>c.id===p.path)!;
  const total=rates.weights.reduce((a,b)=>a+b,0);
  const forgeGear=p.inventory.find(gear=>gear.id===forgeId);
  const totalOres=Object.values(p.ores).reduce((sum,count)=>sum+count,0);
  return <div className="ember-modal-wrap ember-camp-wrap"><section className="ember-camp ember-rpg-window" role="dialog" aria-modal="true" aria-label="กระเป๋าและพัฒนาตัวละคร">
    <header className="ember-camp-heading"><div><small>WARMHEARTH ADVENTURER SERVICE</small><h2>คลังนักผจญภัย</h2></div><span className="ember-window-seal">BO</span><button onClick={onClose} aria-label="ปิดกระเป๋า">×</button></header>
    <div className="ember-wallet"><span>◎ <b>{p.gold}</b> เหรียญ</span><span>◆ <b>{totalOres}</b> แร่ตีบวก</span><span>✧ <b>{p.essence}</b> ผลึกสกิล</span><span className={`ember-level tier-${tierOf(level)}`}>LV.{level}{level===20?' ★ MAX':' / 20'}</span></div>
    <div className="ember-camp-summary"><span style={{color:path.color}}>{path.icon} {path.role} · โจมตี {heroAttack(score,p)} · HP {maxHealth(score,p)}</span><span>{level===20?'ถึงขีดสุดแล้ว':`${p.xp-xpForLevel(level)} / ${xpForLevel(level+1)-xpForLevel(level)} XP`}</span></div>
    <nav className="ember-camp-tabs" aria-label="หมวดพัฒนาตัวละคร">{([['gear','▣ กระเป๋า'],['skills','✦ สาย / สกิล'],['shop','◎ ร้านค้า'],['rates','⚙ เรตดรอป']] as const).map(([id,label])=><button key={id} aria-pressed={tab===id} onClick={()=>setTab(id)}>{label}{id==='shop'&&!atCamp?<small>แคมป์</small>:null}</button>)}</nav>
    <div className={`ember-camp-content ${forgeGear?'has-forge':''}`}>
      {forgeGear?<ForgePanel gear={forgeGear} progress={p} onChange={onChange} onClose={()=>setForgeId(null)}/>:<>
      {tab==='gear'&&<><BackpackOverview progress={p} score={score}/><div className="ember-panel-note ember-inventory-heading"><b>อุปกรณ์ในกระเป๋า {p.inventory.length} / 40</b><span>{atCamp?'สวมใส่ ขาย หรือเปิดเตาหลอมได้จากรายการด้านล่าง':'เปิดกระเป๋าและเปลี่ยนอุปกรณ์ได้ทุกที่ · การตีบวกใช้เตาหลอมที่แคมป์'}</span></div><div className="ember-tier-legend"><span className="tier-wood">+5 ไม้</span><span className="tier-red">+10 แดง</span><span className="tier-violet">+15 ม่วง</span><span className="tier-gold">+20 ทอง ★</span></div>
        <div className="ember-gear-grid">{p.inventory.map(gear=>{const wearing=p[gear.slot]===gear.id,rarity=RARITIES.find(r=>r.id===gear.rarity)!;return <article key={gear.id} className={`ember-gear-card rarity-${gear.rarity} tier-${tierOf(gear.upgrade)} ${wearing?'equipped':''}`}><GearBadge gear={gear}/><div><small style={{color:rarity.color}}>{rarity.name} · {gear.slot==='weapon'?'อาวุธ':'เกราะ'} {wearing?'· สวมใส่':''}</small><h3>{gear.name} <em>+{gear.upgrade}</em></h3><p>{gear.slot==='weapon'?`พลังอาวุธ ${gearPower(gear)} · สกิลตรงสาย +10%`:`เกราะลดดาเมจ ${(gearPower(gear)*.12).toFixed(1)}`}</p></div><div className="ember-item-actions"><button disabled={wearing} onClick={()=>onChange(current=>({...current,[gear.slot]:gear.id}))}>{wearing?'สวมอยู่':'สวมใส่'}</button><button disabled={!atCamp||gear.upgrade>=20} onClick={()=>setForgeId(gear.id)}>{gear.upgrade===20?'★ MAX':'เปิดเตาหลอม'}</button><button disabled={wearing} onClick={()=>onChange(current=>sellGear(current,gear.id))}>ขาย {rarity.sell+gear.upgrade*10} ◎</button></div></article>;})}</div>
      </>}
      {tab==='skills'&&<><div className="ember-panel-note"><b>พาสซีฟคงเหลือ {points} แต้ม</b><span>เลเวลตัวละครเพิ่ม = 1 แต้ม · เปลี่ยนสายฟรีที่แคมป์ · พาสซีฟทุกสายทำงานร่วมกัน</span></div><div className="ember-class-grid">{PATHS.map(c=>{const rank=p.skills[c.id],cost=skillCost(rank);return <article key={c.id} className={`ember-class-card ${p.path===c.id?'active':''}`} style={{'--class-color':c.color} as React.CSSProperties}><div className="ember-class-heading"><span>{c.icon}</span><div><small>{c.role}</small><h3>{c.name}</h3></div><button disabled={!atCamp||p.path===c.id} onClick={()=>onChange(current=>({...current,path:c.id}))}>{p.path===c.id?'สายปัจจุบัน':'เลือกสาย'}</button></div><div className={`ember-skill-rank tier-${tierOf(rank)}`}><b>{c.skill}</b><span>LV.{rank} {rank>=5?'★'.repeat(Math.floor(rank/5)):''}</span></div><p>{c.detail}</p><button className="ember-wide-button" disabled={rank>=20||rank>=level+4||p.gold<cost.gold||p.essence<cost.essence} onClick={()=>onChange(current=>improveSkill(current,c.id))}>{rank>=20?'★ สกิลสูงสุด':rank>=level+4?'เพิ่มเลเวลตัวละครเพื่ออัปต่อ':`อัปสกิล · ${cost.gold} ◎ + ${cost.essence} ✧`}</button><div className="ember-passive"><b>{c.passive} <span>{p.passives[c.id]} / 5</span></b><p>{c.benefit}</p><button disabled={points<=0||p.passives[c.id]>=5} onClick={()=>onChange(current=>improvePassive(current,c.id,score))}>อัปพาสซีฟ · 1 แต้ม</button></div></article>;})}</div></>}
      {tab==='shop'&&<><div className="ember-panel-note"><b>ร้านช่างหม้อ · อาวุธตรงสาย {path.role}</b><span>{atCamp?'รับเหรียญจากการต่อสู้และขายของที่ไม่ใช้':'เดินกลับแคมป์ด้านล่างแผนที่เพื่อซื้อของ'}</span></div><div className="ember-shop-grid">{SHOP.flatMap((item,index)=>(['weapon','armor'] as const).map(slot=><article className={`ember-shop-card rarity-${item.rarity}`} key={`${slot}-${index}`}><small>{slot==='weapon'?'WEAPON':'ARMOR'}</small><GearBadge gear={{id:`shop-${slot}-${index}`,name:'',slot,rarity:item.rarity,upgrade:0,affinity:p.path}}/><h3>{slot==='weapon'?path.name:'เกราะเตาไฟ'}</h3><p>{RARITIES.find(r=>r.id===item.rarity)!.name} · พลัง {RARITIES.find(r=>r.id===item.rarity)!.power}</p><button disabled={!atCamp||p.gold<item.price||p.inventory.length>=40} onClick={()=>{const id=crypto.randomUUID();onChange(current=>buyGear(current,index,slot,id));}}>ซื้อ {item.price} ◎</button></article>))}</div><div className="ember-supplies"><div><b>น้ำซุปอุ่น · 15 ◎</b><small>เติม 3 ขวดฟรีเมื่อพักที่แคมป์ หรือซื้อสำรองสูงสุด 9 ขวด</small></div><button disabled={!atCamp||p.gold<15||p.potions>=9} onClick={()=>onChange(current=>current.gold>=15&&current.potions<9?{...current,gold:current.gold-15,potions:current.potions+1}:current)}>ซื้อ 1 ขวด</button></div></>}
      {tab==='rates'&&<><div className="ember-panel-note"><b>เรตของเกมบนเครื่องนี้</b><span>ชนะทุกครั้งจะได้แร่ 1 ก้อน บอสได้ 2 ก้อน · ชั้นแร่สูงปลดตามรอบและหายากขึ้น</span></div><label className="ember-rate-row"><span>โอกาสดรอปอุปกรณ์ <b>{rates.equipment}%</b></span><input aria-label="โอกาสดรอปอุปกรณ์" type="range" min="0" max="100" value={rates.equipment} onChange={e=>{setRates({...rates,equipment:Number(e.target.value)});setRateSaved(false);}}/></label><h3 className="ember-rate-heading">สัดส่วนคุณภาพเมื่อดรอปอุปกรณ์</h3>{RARITIES.map((rarity,index)=><label className="ember-rate-row" key={rarity.id}><span style={{color:rarity.color}}>{rarity.name}<b>{total?(rates.weights[index]/total*100).toFixed(1):'0'}%</b></span><input aria-label={`น้ำหนักดรอป${rarity.name}`} type="range" min="0" max="100" value={rates.weights[index]} onChange={e=>{setRates({...rates,weights:rates.weights.map((n,i)=>i===index?Number(e.target.value):n)});setRateSaved(false);}}/></label>)}<p className="ember-rate-help">แร่ 5 ตระกูล × 10 ระดับ × 2 คุณภาพ = 100 ชนิด · แร่กายภาพ สายฟ้า ฮีล ป้องกัน และแร่สากล · ใช้แร่ตรงสายจะได้โบนัสเต็ม</p><div className="ember-rate-actions"><button className="ember-gold" disabled={!total} onClick={()=>{onChange(current=>({...current,rates:{equipment:rates.equipment,weights:[...rates.weights]}}));setRateSaved(true);}}>{rateSaved?'✓ บันทึกเรตแล้ว':'บันทึกเรต'}</button><button onClick={()=>{setRates({equipment:40,weights:[55,27,13,4,1]});setRateSaved(false);}}>คืนค่าปกติ</button></div></>}
      </>}
    </div>
    <footer className="ember-camp-footer"><span>รอบสำรวจ {p.floor} / 20 · ชนะ {p.kills} ครั้ง · บอส {p.bossWins} ครั้ง</span>{atCamp&&p.defeated.includes(2)&&<button disabled={p.floor>=20} onClick={()=>{onChange(current=>advanceExpedition(current,score));onClose();}}>เปิดรอบ {Math.min(20,p.floor+1)} · ศัตรูแกร่งขึ้น / รางวัลเพิ่ม →</button>}</footer>
  </section></div>;
}
