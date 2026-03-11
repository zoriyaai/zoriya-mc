import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────── */
const T = {
  bg:        "#0C0E13",
  surface:   "#111318",
  surfaceHi: "#16191F",
  border:    "rgba(255,255,255,0.06)",
  borderHi:  "rgba(255,255,255,0.11)",
  blue:      "#2563EB",
  blueLight: "#3B82F6",
  blueDim:   "rgba(37,99,235,0.15)",
  green:     "#10B981",
  amber:     "#F59E0B",
  red:       "#EF4444",
  purple:    "#8B5CF6",
  textPrimary:   "#F1F2F4",
  textSecondary: "rgba(241,242,244,0.45)",
  textMuted:     "rgba(241,242,244,0.22)",
};

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
  input, button, textarea { font-family: inherit; }
  input::placeholder, textarea::placeholder { color: ${T.textMuted}; }
  textarea { resize: none; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.6)} }
  @keyframes float   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
  @keyframes walk    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(3px)} 75%{transform:translateX(-3px)} }
  @keyframes thinking{ 0%,100%{opacity:0.3} 50%{opacity:1} }
  @keyframes typingDot{ 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
  @keyframes slideInRight{ from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }

  .nav-item { transition: background .15s, color .15s, border-color .15s; }
  .nav-item:hover { background: rgba(255,255,255,0.04) !important; color: ${T.textPrimary} !important; }
  .card { transition: border-color .15s, background .15s; }
  .card:hover { border-color: ${T.borderHi} !important; }
  .btn { transition: all .15s; cursor: pointer; }
  .btn:hover { filter: brightness(1.15); }
  .row-item { transition: background .12s; }
  .row-item:hover { background: rgba(255,255,255,0.035) !important; }
  .msg-bubble { animation: slideInRight 0.2s ease; }
`;

/* ─── DATA ───────────────────────────────────────────────────────────────── */
const AGENTS = [
  { id:"zoriya", name:"Zoriya", role:"Chief Operations Agent", status:"online", color:T.blueLight, initials:"ZA",
    skills:["Orchestration","Memory","Planning","Delegation"],
    description:"Coordinates all operations. Manages memory, task delegation, and system health across the ZORIYA AI stack.",
    tasks:8, completedToday:3, activity:"Reviewing system health", x:30, y:40 },
  { id:"vector", name:"Vector", role:"Contract Intelligence", status:"online", color:T.green, initials:"VC",
    skills:["Research","Analysis","Scoring","Contracts"],
    description:"Scans federal databases daily for high-value contract opportunities. Scores, categorizes, and surfaces the best matches.",
    tasks:4, completedToday:1, activity:"Processing contract batch", x:65, y:35 },
];

const CONTRACTS = [
  { id:1, title:"AI Infrastructure Modernization", agency:"Dept. of Defense", value:"$2.4M", score:94, status:"New", date:"2026-03-06", cat:"Technology" },
  { id:2, title:"Machine Learning Pipeline Development", agency:"NASA", value:"$890K", score:91, status:"New", date:"2026-03-06", cat:"AI/ML" },
  { id:3, title:"Autonomous Systems Research Program", agency:"DARPA", value:"$5.1M", score:88, status:"Reviewed", date:"2026-03-06", cat:"Research" },
  { id:4, title:"Data Analytics Platform Modernization", agency:"HHS", value:"$1.2M", score:85, status:"New", date:"2026-03-05", cat:"Data" },
  { id:5, title:"Cybersecurity AI Integration Suite", agency:"DHS", value:"$3.7M", score:83, status:"New", date:"2026-03-05", cat:"Security" },
  { id:6, title:"Natural Language Processing Tools", agency:"Library of Congress", value:"$450K", score:79, status:"Reviewed", date:"2026-03-05", cat:"AI/ML" },
  { id:7, title:"Cloud Migration Services", agency:"GSA", value:"$670K", score:76, status:"New", date:"2026-03-04", cat:"Cloud" },
  { id:8, title:"Predictive Analytics for Healthcare", agency:"VA", value:"$2.1M", score:74, status:"New", date:"2026-03-04", cat:"Healthcare" },
];

const TASKS = [
  { id:1, title:"Set up Vercel deployment pipeline", status:"In Progress", priority:"high", agent:"Zoriya", project:"Infrastructure" },
  { id:2, title:"Wire Contract Finds to live JSON", status:"Backlog", priority:"high", agent:"Vector", project:"Contract Finds" },
  { id:3, title:"Add Discord channel integration", status:"Backlog", priority:"medium", agent:"Zoriya", project:"Infrastructure" },
  { id:4, title:"Build weekly summary report", status:"Backlog", priority:"medium", agent:"Vector", project:"Contract Finds" },
  { id:5, title:"Memory consolidation cron setup", status:"Done", priority:"low", agent:"Zoriya", project:"Infrastructure" },
  { id:6, title:"Gateway security audit", status:"Done", priority:"high", agent:"Zoriya", project:"Infrastructure" },
];

const PROJECTS = [
  { id:1, name:"Mission Control", status:"Active", progress:45, agent:"Zoriya", priority:"high", desc:"Custom dashboard for ZORIYA AI. Real-time visibility across all agents and systems.", tasks:"4/9" },
  { id:2, name:"Contract Intelligence", status:"Active", progress:72, agent:"Vector", priority:"high", desc:"AI-powered contract scanning and scoring engine. Daily runs, categorization, match scoring.", tasks:"7/10" },
  { id:3, name:"Infrastructure Setup", status:"Active", progress:88, agent:"Zoriya", priority:"medium", desc:"Core system infrastructure — gateway, channels, cron jobs, memory, security.", tasks:"11/12" },
  { id:4, name:"Discord Integration", status:"Planning", progress:0, agent:"Zoriya", priority:"medium", desc:"Extend Zoriya to Discord for real-time alerts and command interface.", tasks:"0/6" },
];

const MEMORY_ENTRIES = [
  { id:1, date:"2026-03-06", time:"06:12 PM", title:"Vector Contract Scan Complete", body:"27 contracts found. Top match: AI Infrastructure Modernization (DoD, $2.4M, score 94). Categories: Technology, AI/ML, Research, Data, Security, Cloud, Healthcare.", agent:"Vector" },
  { id:2, date:"2026-03-06", time:"08:00 AM", title:"Morning Brief", body:"System status: all green. 2 agents online. 5 cron jobs scheduled today. Gateway uptime 14d 6h. No anomalies detected.", agent:"Zoriya" },
  { id:3, date:"2026-03-05", time:"11:00 PM", title:"Memory Consolidation", body:"Daily memory consolidated. 12 new entries archived. Long-term context updated. Token budget optimized.", agent:"Zoriya" },
  { id:4, date:"2026-03-05", time:"06:01 PM", title:"Vector Contract Scan Complete", body:"19 contracts found. Top match: Cybersecurity AI Integration Suite (DHS, $3.7M, score 83).", agent:"Vector" },
  { id:5, date:"2026-03-04", time:"08:00 AM", title:"Morning Brief", body:"System restarted after Mac mini update. All services restored. Gateway reconnected. WhatsApp, Telegram, Email active.", agent:"Zoriya" },
];

const CRON_JOBS = [
  { id:1, name:"Contract Scan", agent:"Vector", schedule:"Daily @ 6:00 PM", next:"Today 6:00 PM", color:T.green, status:"scheduled" },
  { id:2, name:"Morning Brief", agent:"Zoriya", schedule:"Daily @ 8:00 AM", next:"Tomorrow 8:00 AM", color:T.blueLight, status:"completed" },
  { id:3, name:"Health Check", agent:"Zoriya", schedule:"Every 30 min", next:"In 12 min", color:T.purple, status:"scheduled" },
  { id:4, name:"Memory Consolidation", agent:"Zoriya", schedule:"Daily @ 11:00 PM", next:"Tonight 11:00 PM", color:T.amber, status:"scheduled" },
  { id:5, name:"Weekly Summary", agent:"Vector", schedule:"Sun @ 9:00 AM", next:"Sun Mar 8", color:T.red, status:"scheduled" },
];

const INITIAL_MESSAGES = [
  { id:1, from:"Zoriya", text:"Good morning. System status is green across all services. Gateway uptime at 14 days, 6 hours.", time:"8:00 AM", type:"agent" },
  { id:2, from:"Vector", text:"Contract scan complete. Found 27 opportunities today. Top match scored 94 — AI Infrastructure Modernization at DoD, valued at $2.4M. Full report is in Contract Finds.", time:"6:12 PM", type:"agent" },
  { id:3, from:"Zoriya", text:"Noted. I've added a task to review the top 5 contracts. Memory updated. Ready for your next instruction.", time:"6:13 PM", type:"agent" },
];

/* ─── HELPERS ───────────────────────────────────────────────────────────── */
const scoreColor = s => s>=90 ? T.green : s>=80 ? T.blueLight : s>=70 ? T.amber : T.textMuted;
const priorityColor = p => p==="high" ? T.red : p==="medium" ? T.amber : T.textMuted;
const statusColor = s => {
  if(["Active","online","Done","completed"].includes(s)) return T.green;
  if(["In Progress","scheduled"].includes(s)) return T.blueLight;
  return T.textMuted;
};
const agentColor = name => AGENTS.find(a=>a.name===name)?.color ?? T.blueLight;

function Tag({ children, color = T.blueLight }) {
  return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:600, background:color+"18", border:`1px solid ${color}33`, color, letterSpacing:"0.04em", display:"inline-block" }}>{children}</span>;
}

function Dot({ color=T.green, pulse=false }) {
  return <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:color, boxShadow:`0 0 6px ${color}`, flexShrink:0, animation:pulse?"pulse 2s ease-in-out infinite":"none" }} />;
}

function SectionHeader({ label, sub }) {
  return (
    <div style={{ marginBottom:22 }}>
      <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:6, fontFamily:"'Geist Mono', monospace" }}>{label}</p>
      <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>{sub}</h1>
    </div>
  );
}

function Card({ children, style={}, className="card", onClick }) {
  return <div className={className} onClick={onClick} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, ...style }}>{children}</div>;
}

function AgentAvatar({ agent, size=32 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.28, flexShrink:0, background:`linear-gradient(135deg,${agent.color}22,${agent.color}44)`, border:`1.5px solid ${agent.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.32, fontWeight:700, color:agent.color, fontFamily:"'Geist Mono', monospace" }}>
      {agent.initials}
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
const NAV = [
  { id:"hq",      icon:"⊞",  label:"HQ" },
  { id:"office",  icon:"🏢",  label:"Virtual Office" },
  { id:"meeting", icon:"💬",  label:"Meeting Room" },
  { id:"tasks",   icon:"✓",  label:"Tasks" },
  { id:"projects",icon:"◧",  label:"Projects" },
  { id:"contracts",icon:"◈", label:"Contract Finds", badge:27 },
  { id:"cron",    icon:"◷",  label:"Cron Jobs" },
  { id:"leads",     icon:"◆",  label:"Leads" },
  { id:"capsule",   icon:"✦",  label:"Creativity Capsule" },
  { id:"broker",    icon:"▲",  label:"AI Broker" },
  { id:"memory",  icon:"◉",  label:"Memory" },
  { id:"system",  icon:"◎",  label:"System" },
];

function Sidebar({ active, setActive }) {
  return (
    <aside style={{ width:210, minHeight:"100vh", flexShrink:0, background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", position:"relative", zIndex:10 }}>
      {/* Wordmark — no icon */}
      <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${T.border}` }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.textPrimary, letterSpacing:"0.1em", fontFamily:"'Geist Mono', monospace" }}>ZORIYA AI</div>
          <div style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.14em", marginTop:2 }}>MISSION CONTROL</div>
        </div>
      </div>

      {/* Mission statement */}
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
        <p style={{ fontSize:10, color:T.textMuted, lineHeight:1.65, fontStyle:"italic" }}>
          "An autonomous AI system that works 24/7 to find opportunity and drive results."
        </p>
      </div>

      {/* Nav */}
      <nav style={{ padding:"10px 8px", flex:1 }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} className="nav-item" onClick={()=>setActive(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:8, marginBottom:1, background:isActive?T.blueDim:"transparent", border:`1px solid ${isActive?T.blue+"44":"transparent"}`, color:isActive?T.blueLight:T.textSecondary, cursor:"pointer", fontSize:13, textAlign:"left", fontFamily:"'Outfit', sans-serif", fontWeight:isActive?600:400 }}>
              <span style={{ fontSize:13, width:16, textAlign:"center" }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize:9, fontWeight:700, background:T.blue, color:"#fff", borderRadius:10, padding:"1px 5px", fontFamily:"'Geist Mono', monospace" }}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Agents online */}
      <div style={{ padding:"12px 12px 16px", borderTop:`1px solid ${T.border}` }}>
        <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.12em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>AGENTS ONLINE</p>
        {AGENTS.map(a => (
          <div key={a.id} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
            <Dot color={a.color} pulse />
            <span style={{ fontSize:12, color:T.textSecondary, flex:1 }}>{a.name}</span>
            <span style={{ fontSize:9, color:a.color, fontFamily:"'Geist Mono', monospace" }}>LIVE</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ─── TOP BAR ────────────────────────────────────────────────────────────── */
function TopBar({ active }) {
  const [time, setTime] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); },[]);
  const label = NAV.find(n=>n.id===active)?.label ?? "";
  return (
    <header style={{ height:52, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 24px", background:T.surface+"CC", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:9, justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>ZORIYA AI</span>
        <span style={{ fontSize:11, color:T.textMuted }}>/</span>
        <span style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{label}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 11px", borderRadius:6, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.18)" }}>
          <Dot color={T.green} pulse />
          <span style={{ fontSize:10, color:T.green, fontFamily:"'Geist Mono', monospace", letterSpacing:"0.08em" }}>ALL SYSTEMS GO</span>
        </div>
        <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>
          {time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
        </span>
      </div>
    </header>
  );
}

/* ─── HQ VIEW ────────────────────────────────────────────────────────────── */
function HQView() {
  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <SectionHeader label="ZORIYA AI · LIVE" sub="HQ — Overview" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Agents Online", val:"2", color:T.green },
          { label:"Tasks This Week", val:TASKS.length, color:T.blueLight },
          { label:"Contracts Found", val:"27", color:T.amber },
          { label:"Systems Active", val:"3", color:T.purple },
        ].map(s=>(
          <Card key={s.label} style={{ padding:"16px 18px" }}>
            <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>{s.label.toUpperCase()}</p>
            <p style={{ fontSize:28, fontWeight:700, color:s.color, fontFamily:"'Geist Mono', monospace", letterSpacing:"-0.02em" }}>{s.val}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, marginBottom:24 }}>
        {AGENTS.map(a=>(
          <Card key={a.id} style={{ padding:20 }}>
            <div style={{ display:"flex", gap:14, marginBottom:14 }}>
              <AgentAvatar agent={a} size={44} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:T.textPrimary }}>{a.name}</span>
                  <Dot color={a.color} pulse />
                </div>
                <p style={{ fontSize:12, color:T.textSecondary }}>{a.role}</p>
              </div>
            </div>
            <p style={{ fontSize:12, color:T.textMuted, lineHeight:1.65, marginBottom:12 }}>{a.description}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {a.skills.map(s=><Tag key={s} color={a.color}>{s}</Tag>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
              <div><p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:3 }}>OPEN TASKS</p><p style={{ fontSize:18, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{a.tasks}</p></div>
              <div><p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:3 }}>DONE TODAY</p><p style={{ fontSize:18, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>{a.completedToday}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:14, fontFamily:"'Geist Mono', monospace" }}>RECENT ACTIVITY</p>
        <Card style={{ padding:0, overflow:"hidden" }}>
          {MEMORY_ENTRIES.slice(0,4).map((e,i)=>(
            <div key={e.id} className="row-item" style={{ display:"flex", gap:14, padding:"14px 18px", borderBottom:i<3?`1px solid ${T.border}`:"none" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, marginTop:5, background:agentColor(e.agent), boxShadow:`0 0 6px ${agentColor(e.agent)}` }} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{e.title}</span>
                  <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{e.time}</span>
                </div>
                <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.5 }}>{e.body.slice(0,110)}…</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ─── VIRTUAL OFFICE ─────────────────────────────────────────────────────── */
const DESK_POSITIONS = [
  {x:12,y:15},{x:32,y:15},{x:52,y:15},{x:72,y:15},{x:88,y:15},
  {x:12,y:42},{x:88,y:42},
  {x:12,y:68},{x:32,y:68},{x:52,y:68},{x:72,y:68},{x:88,y:68},
];

const AGENT_ACTIVITIES = {
  zoriya: ["Reviewing task queue…","Updating memory logs…","Delegating to Vector…","Running health check…","Monitoring gateway…"],
  vector: ["Scanning SAM.gov…","Scoring contract #14…","Cross-referencing NAICS…","Compiling daily report…","Analyzing RFP documents…"],
};

function VirtualOfficeView() {
  const [selected, setSelected] = useState(null);
  const [actIdx, setActIdx] = useState({zoriya:0, vector:0});

  useEffect(()=>{
    const t = setInterval(()=>{
      setActIdx(prev=>({
        zoriya: (prev.zoriya+1) % AGENT_ACTIVITIES.zoriya.length,
        vector: (prev.vector+1) % AGENT_ACTIVITIES.vector.length,
      }));
    }, 3500);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <SectionHeader label="LIVE WORKSPACE" sub="Virtual Office" />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>
        {/* Office floor */}
        <Card style={{ padding:0, overflow:"hidden", height:480, position:"relative" }}>
          {/* Floor grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"44px 44px" }} />

          {/* Room label */}
          <div style={{ position:"absolute", top:12, left:16, fontSize:10, color:T.textMuted, letterSpacing:"0.1em", fontFamily:"'Geist Mono', monospace" }}>FLOOR 1 · OPERATIONS</div>

          {/* Status legend */}
          <div style={{ position:"absolute", top:12, right:16, display:"flex", gap:10 }}>
            {[{label:"Working",color:T.green},{label:"Thinking",color:T.amber},{label:"Idle",color:T.textMuted}].map(s=>(
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:s.color }} />
                <span style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Desks */}
          {DESK_POSITIONS.map((d,i)=>(
            <div key={i} style={{ position:"absolute", left:`${d.x}%`, top:`${d.y}%`, transform:"translate(-50%,-50%)", width:52, height:36, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:4 }}>
              {/* Monitor */}
              <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", width:22, height:14, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:2 }} />
            </div>
          ))}

          {/* Conference table */}
          <div style={{ position:"absolute", left:"50%", top:"55%", transform:"translate(-50%,-50%)", width:130, height:64, borderRadius:34, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }} />
          <div style={{ position:"absolute", left:"50%", top:"55%", transform:"translate(-50%,-50%)", fontSize:9, color:T.textMuted, letterSpacing:"0.08em", fontFamily:"'Geist Mono', monospace", textAlign:"center", pointerEvents:"none" }}>MEETING ROOM</div>

          {/* Agents */}
          {AGENTS.map(a=>(
            <div key={a.id} onClick={()=>setSelected(selected?.id===a.id?null:a)} style={{ position:"absolute", left:`${a.x}%`, top:`${a.y}%`, transform:"translate(-50%,-50%)", cursor:"pointer", animation:"float 4s ease-in-out infinite", animationDelay:a.id==="vector"?"1.8s":"0s", zIndex:2 }}>
              {/* Glow ring */}
              <div style={{ position:"absolute", inset:-6, borderRadius:"50%", background:`radial-gradient(circle, ${a.color}22 0%, transparent 70%)`, animation:"pulse 3s ease-in-out infinite" }} />
              {/* Avatar */}
              <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${a.color}22,${a.color}44)`, border:`2px solid ${a.color}66`, boxShadow:`0 0 20px ${a.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:a.color, fontFamily:"'Geist Mono', monospace", position:"relative" }}>
                {a.initials}
                {/* Status dot */}
                <div style={{ position:"absolute", bottom:2, right:2, width:8, height:8, borderRadius:"50%", background:T.green, border:`2px solid ${T.surface}`, boxShadow:`0 0 6px ${T.green}` }} />
              </div>
              {/* Name */}
              <div style={{ textAlign:"center", marginTop:7, fontSize:11, color:T.textPrimary, fontWeight:600, textShadow:"0 1px 6px rgba(0,0,0,0.9)" }}>{a.name}</div>
              {/* Activity bubble */}
              <div style={{ position:"absolute", bottom:"100%", left:"50%", transform:"translateX(-50%)", marginBottom:8, whiteSpace:"nowrap", background:T.surfaceHi, border:`1px solid ${T.border}`, borderRadius:8, padding:"4px 9px", fontSize:10, color:T.textSecondary, animation:"fadeIn .4s ease", pointerEvents:"none" }}>
                {AGENT_ACTIVITIES[a.id][actIdx[a.id]]}
              </div>
            </div>
          ))}

          {/* Empty desk placeholder */}
          <div style={{ position:"absolute", left:"50%", top:"22%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:14, border:"1.5px dashed rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:T.textMuted, margin:"0 auto" }}>+</div>
            <div style={{ fontSize:10, color:T.textMuted, marginTop:6 }}>New Agent</div>
          </div>
        </Card>

        {/* Side panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Selected agent detail */}
          {selected ? (
            <Card style={{ padding:18, border:`1px solid ${selected.color}33`, background:selected.color+"08", animation:"fadeUp .2s ease" }}>
              <div style={{ display:"flex", gap:12, marginBottom:12 }}>
                <AgentAvatar agent={selected} size={40} />
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:T.textPrimary, marginBottom:2 }}>{selected.name}</p>
                  <p style={{ fontSize:11, color:T.textSecondary }}>{selected.role}</p>
                </div>
              </div>
              <div style={{ padding:"8px 10px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}`, marginBottom:12 }}>
                <p style={{ fontSize:10, color:T.textMuted, marginBottom:3, fontFamily:"'Geist Mono', monospace" }}>NOW</p>
                <p style={{ fontSize:12, color:T.textPrimary }}>{AGENT_ACTIVITIES[selected.id][actIdx[selected.id]]}</p>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {selected.skills.map(s=><Tag key={s} color={selected.color}>{s}</Tag>)}
              </div>
            </Card>
          ) : (
            <Card style={{ padding:18 }}>
              <p style={{ fontSize:12, color:T.textMuted, lineHeight:1.6 }}>Click an agent to see what they're working on right now.</p>
            </Card>
          )}

          {/* Live status cards */}
          {AGENTS.map(a=>(
            <Card key={a.id} className="card" onClick={()=>setSelected(selected?.id===a.id?null:a)} style={{ padding:14, cursor:"pointer", border:selected?.id===a.id?`1px solid ${a.color}44`:undefined }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <Dot color={a.color} pulse />
                <span style={{ fontSize:13, fontWeight:600, color:T.textPrimary, flex:1 }}>{a.name}</span>
                <Tag color={T.green}>online</Tag>
              </div>
              <p style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace", marginBottom:10 }}>{a.role}</p>
              {/* Mini activity bar */}
              <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${a.id==="zoriya"?68:42}%`, background:a.color, borderRadius:2, transition:"width 1s ease" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                <span style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{a.id==="zoriya"?"68":"42"}% active</span>
                <span style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{a.tasks} tasks open</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MEETING ROOM ───────────────────────────────────────────────────────── */
function MeetingView() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [channel, setChannel] = useState("general");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const msgId = useRef(10);

  const CHANNELS = [
    { id:"general", label:"# general", desc:"All agents" },
    { id:"zoriya",  label:"# zoriya",  desc:"Chief Ops" },
    { id:"vector",  label:"# vector",  desc:"Contracts" },
    { id:"ops",     label:"# ops",     desc:"Operations" },
  ];

  const AGENT_RESPONSES = {
    general: [
      { from:"Zoriya", text:"Understood. I'll prioritize that and report back shortly." },
      { from:"Vector", text:"On it. I'll pull the relevant data and surface the top matches." },
      { from:"Zoriya", text:"Got it. Updating task queue now. Estimated completion in the next cycle." },
    ],
    zoriya: [
      { from:"Zoriya", text:"Understood. I'll handle this immediately and update the memory log." },
      { from:"Zoriya", text:"Task received. Delegating to the appropriate workflow now." },
      { from:"Zoriya", text:"Confirmed. I'll run the health check and report any anomalies." },
    ],
    vector: [
      { from:"Vector", text:"Running a targeted search now. I'll have results in the next Contract Finds report." },
      { from:"Vector", text:"Acknowledged. I'll refine the scoring criteria and reprocess today's batch." },
      { from:"Vector", text:"Noted. Adding that to the research queue for the next scan cycle." },
    ],
    ops: [
      { from:"Zoriya", text:"Operations update logged. All systems nominal." },
      { from:"Vector", text:"Scan pipeline running on schedule. No issues detected." },
    ],
  };

  const visibleMessages = messages.filter(m => channel === "general" || m.from.toLowerCase() === channel || m.channel === channel);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages, isTyping]);

  const send = () => {
    if(!input.trim()) return;
    const userMsg = { id:++msgId.current, from:"You", text:input.trim(), time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), type:"user", channel };
    setMessages(prev=>[...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(()=>{
      setIsTyping(false);
      const pool = AGENT_RESPONSES[channel] || AGENT_RESPONSES.general;
      const resp = pool[Math.floor(Math.random()*pool.length)];
      const agentMsg = { id:++msgId.current, from:resp.from, text:resp.text, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), type:"agent", channel };
      setMessages(prev=>[...prev, agentMsg]);
    }, 1400 + Math.random()*800);
  };

  const handleKey = e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); } };

  const channelMessages = messages.filter(m => {
    if(channel === "general") return true;
    return m.from.toLowerCase() === channel || m.channel === channel || m.type === "user";
  });

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease", height:"calc(100vh - 52px)", display:"flex", flexDirection:"column" }}>
      <SectionHeader label="TEAM COMMUNICATION" sub="Meeting Room" />

      <div style={{ flex:1, display:"grid", gridTemplateColumns:"200px 1fr", gap:16, minHeight:0 }}>
        {/* Channel list — Slack-style */}
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.14em", marginBottom:8, fontFamily:"'Geist Mono', monospace", paddingLeft:8 }}>CHANNELS</p>
          {CHANNELS.map(ch=>(
            <button key={ch.id} className="nav-item" onClick={()=>setChannel(ch.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, background:channel===ch.id?T.blueDim:"transparent", border:`1px solid ${channel===ch.id?T.blue+"44":"transparent"}`, color:channel===ch.id?T.blueLight:T.textSecondary, cursor:"pointer", fontSize:13, textAlign:"left", fontFamily:"'Outfit', sans-serif" }}>
              <span style={{ flex:1 }}>{ch.label}</span>
            </button>
          ))}

          <div style={{ marginTop:16 }}>
            <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.14em", marginBottom:8, fontFamily:"'Geist Mono', monospace", paddingLeft:8 }}>AGENTS</p>
            {AGENTS.map(a=>(
              <div key={a.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px" }}>
                <Dot color={a.color} pulse />
                <span style={{ fontSize:12, color:T.textSecondary }}>{a.name}</span>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px" }}>
              <Dot color={T.blueLight} />
              <span style={{ fontSize:12, color:T.blueLight, fontWeight:600 }}>You</span>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <Card style={{ display:"flex", flexDirection:"column", padding:0, overflow:"hidden" }}>
          {/* Chat header */}
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:14, fontWeight:600, color:T.textPrimary }}>{CHANNELS.find(c=>c.id===channel)?.label}</span>
            <span style={{ fontSize:12, color:T.textMuted }}>·</span>
            <span style={{ fontSize:12, color:T.textMuted }}>{CHANNELS.find(c=>c.id===channel)?.desc}</span>
            <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
              {AGENTS.map(a=>(
                <div key={a.id} style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 8px", borderRadius:20, background:a.color+"15", border:`1px solid ${a.color}33` }}>
                  <Dot color={a.color} />
                  <span style={{ fontSize:10, color:a.color, fontWeight:600 }}>{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:2 }}>
            {/* Day divider */}
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 12px" }}>
              <div style={{ flex:1, height:1, background:T.border }} />
              <span style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>TODAY</span>
              <div style={{ flex:1, height:1, background:T.border }} />
            </div>

            {channelMessages.map((msg, i) => {
              const isUser = msg.type === "user";
              const agent = AGENTS.find(a=>a.name===msg.from);
              const prevSame = i > 0 && channelMessages[i-1].from === msg.from;
              return (
                <div key={msg.id} className="msg-bubble" style={{ display:"flex", gap:10, marginTop:prevSame?2:10, flexDirection:isUser?"row-reverse":"row" }}>
                  {/* Avatar — show only on first of group */}
                  {!prevSame ? (
                    isUser ? (
                      <div style={{ width:32, height:32, borderRadius:10, flexShrink:0, background:`${T.blueLight}22`, border:`1.5px solid ${T.blueLight}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:T.blueLight, fontFamily:"'Geist Mono', monospace" }}>YOU</div>
                    ) : agent ? <AgentAvatar agent={agent} size={32} /> : null
                  ) : <div style={{ width:32, flexShrink:0 }} />}

                  <div style={{ maxWidth:"72%", display:"flex", flexDirection:"column", alignItems:isUser?"flex-end":"flex-start" }}>
                    {!prevSame && (
                      <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:isUser?T.blueLight:(agent?.color??T.textPrimary) }}>{msg.from}</span>
                        <span style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{msg.time}</span>
                      </div>
                    )}
                    <div style={{ padding:"9px 13px", borderRadius:isUser?"12px 4px 12px 12px":"4px 12px 12px 12px", background:isUser?`${T.blue}22`:"rgba(255,255,255,0.04)", border:`1px solid ${isUser?T.blue+"44":T.border}`, fontSize:13, color:T.textPrimary, lineHeight:1.55 }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display:"flex", gap:10, marginTop:10, animation:"fadeIn .3s ease" }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${T.green}22`, border:`1.5px solid ${T.green}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace", flexShrink:0 }}>
                  {channel==="vector"?"VC":"ZA"}
                </div>
                <div style={{ padding:"10px 16px", borderRadius:"4px 12px 12px 12px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, display:"flex", gap:4, alignItems:"center" }}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:T.textMuted, animation:`typingDot 1.2s ${i*0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
              <textarea
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Message ${CHANNELS.find(c=>c.id===channel)?.label ?? "# general"}…`}
                rows={1}
                style={{ flex:1, padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:`1px solid ${T.border}`, color:T.textPrimary, fontSize:13, outline:"none", lineHeight:1.5, maxHeight:100, overflowY:"auto" }}
              />
              <button className="btn" onClick={send} style={{ padding:"10px 18px", borderRadius:10, background:T.blue, border:"none", color:"#fff", fontSize:13, fontWeight:600, flexShrink:0 }}>
                Send
              </button>
            </div>
            <p style={{ fontSize:10, color:T.textMuted, marginTop:6, fontFamily:"'Geist Mono', monospace" }}>Enter to send · Shift+Enter for new line</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─── TASKS ──────────────────────────────────────────────────────────────── */
function TasksView() {
  const cols = ["Backlog","In Progress","Done"];
  const done = TASKS.filter(t=>t.status==="Done").length;
  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <SectionHeader label="TASK MANAGEMENT" sub="Tasks" />
      <div style={{ display:"flex", gap:24, marginBottom:24 }}>
        {[{label:"Open",val:TASKS.filter(t=>t.status!=="Done").length,color:T.blueLight},{label:"In Progress",val:TASKS.filter(t=>t.status==="In Progress").length,color:T.amber},{label:"Total",val:TASKS.length,color:T.textSecondary},{label:"Completion",val:`${Math.round(done/TASKS.length*100)}%`,color:T.green}].map(s=>(
          <div key={s.label}><span style={{ fontSize:24, fontWeight:700, color:s.color, fontFamily:"'Geist Mono', monospace" }}>{s.val} </span><span style={{ fontSize:13, color:T.textMuted }}>{s.label}</span></div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {cols.map(col=>(
          <div key={col}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <Dot color={statusColor(col)} />
              <span style={{ fontSize:12, fontWeight:600, color:T.textSecondary, letterSpacing:"0.06em" }}>{col.toUpperCase()}</span>
              <span style={{ fontSize:11, color:T.textMuted }}>{TASKS.filter(t=>t.status===col).length}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {TASKS.filter(t=>t.status===col).map(task=>(
                <Card key={task.id} style={{ padding:14 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:8, alignItems:"flex-start" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:priorityColor(task.priority), marginTop:4, flexShrink:0 }} />
                    <p style={{ fontSize:13, fontWeight:500, color:T.textPrimary, lineHeight:1.45, flex:1 }}>{task.title}</p>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <Tag color={agentColor(task.agent)}>{task.agent}</Tag>
                    <Tag color={T.textMuted}>{task.project}</Tag>
                  </div>
                </Card>
              ))}
              {TASKS.filter(t=>t.status===col).length===0 && <div style={{ padding:20, textAlign:"center", border:`1px dashed rgba(255,255,255,0.07)`, borderRadius:10 }}><p style={{ fontSize:12, color:T.textMuted }}>No tasks</p></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PROJECTS ───────────────────────────────────────────────────────────── */
function ProjectsView() {
  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <SectionHeader label="PROJECT TRACKER" sub="Projects" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
        {PROJECTS.map(p=>(
          <Card key={p.id} style={{ padding:22 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:T.textPrimary }}>{p.name}</h3>
                  <Tag color={statusColor(p.status)}>{p.status}</Tag>
                </div>
                <p style={{ fontSize:12, color:T.textMuted }}>{p.desc}</p>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:11, color:T.textMuted }}>{p.progress}% complete</span>
                <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{p.tasks} tasks</span>
              </div>
              <div style={{ height:4, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${p.progress}%`, borderRadius:2, background:p.progress>60?T.green:p.progress>30?T.blueLight:T.amber }} />
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <AgentAvatar agent={AGENTS.find(a=>a.name===p.agent)||AGENTS[0]} size={22} />
                <span style={{ fontSize:12, color:T.textSecondary }}>{p.agent}</span>
              </div>
              <Tag color={priorityColor(p.priority)}>{p.priority} priority</Tag>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── CONTRACTS ──────────────────────────────────────────────────────────── */
function ContractsView() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const cats = ["All",...Array.from(new Set(CONTRACTS.map(c=>c.cat)))];
  const filtered = CONTRACTS.filter(c=>(filter==="All"||c.cat===filter)&&(!search||c.title.toLowerCase().includes(search.toLowerCase())||c.agency.toLowerCase().includes(search.toLowerCase())));
  const grouped = {};
  filtered.forEach(c=>{ if(!grouped[c.date]) grouped[c.date]=[]; grouped[c.date].push(c); });
  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22 }}>
        <div>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>VECTOR · LAST RUN TODAY 6:00 PM</p>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>Contract Finds</h1>
        </div>
        <div style={{ display:"flex", gap:20 }}>
          {[{l:"Total",v:"27"},{l:"Today",v:"8"},{l:"Avg Score",v:"84"}].map(s=>(
            <div key={s.l} style={{ textAlign:"right" }}>
              <p style={{ fontSize:22, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{s.v}</p>
              <p style={{ fontSize:10, color:T.textMuted, marginTop:3 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:22, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title or agency…" style={{ flex:1, minWidth:220, padding:"8px 14px", borderRadius:8, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, color:T.textPrimary, fontSize:13, outline:"none" }} />
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {cats.map(c=><button key={c} className="btn" onClick={()=>setFilter(c)} style={{ padding:"7px 12px", borderRadius:8, fontSize:12, cursor:"pointer", background:filter===c?T.blueDim:"rgba(255,255,255,0.04)", border:`1px solid ${filter===c?T.blue+"55":T.border}`, color:filter===c?T.blueLight:T.textSecondary }}>{c}</button>)}
        </div>
      </div>
      {Object.entries(grouped).sort(([a],[b])=>b.localeCompare(a)).map(([date,items])=>(
        <div key={date} style={{ marginBottom:26 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", whiteSpace:"nowrap", fontFamily:"'Geist Mono', monospace" }}>{new Date(date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase()}</p>
            <div style={{ flex:1, height:1, background:T.border }} />
            <p style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{items.length} FINDS</p>
          </div>
          <Card style={{ padding:0, overflow:"hidden" }}>
            {items.map((c,i)=>(
              <div key={c.id} className="row-item" style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 18px", borderBottom:i<items.length-1?`1px solid ${T.border}`:"none", cursor:"pointer" }}>
                <div style={{ width:46, height:46, borderRadius:10, flexShrink:0, background:`${scoreColor(c.score)}12`, border:`1px solid ${scoreColor(c.score)}33`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:15, fontWeight:700, color:scoreColor(c.score), fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{c.score}</span>
                  <span style={{ fontSize:8, color:T.textMuted, letterSpacing:"0.06em" }}>SCORE</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:T.textPrimary, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.title}</p>
                  <p style={{ fontSize:12, color:T.textSecondary }}>{c.agency}</p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <Tag color={T.textMuted}>{c.cat}</Tag>
                  <span style={{ fontSize:14, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{c.value}</span>
                  <Tag color={c.status==="New"?T.blueLight:T.textMuted}>{c.status}</Tag>
                </div>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

/* ─── CRON ───────────────────────────────────────────────────────────────── */
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function CronView() {
  const today = new Date().getDay();
  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <SectionHeader label="AUTOMATED ROUTINES" sub="Cron Jobs" />
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:10, fontFamily:"'Geist Mono', monospace", display:"flex", alignItems:"center", gap:6 }}><Dot color={T.green} pulse /> ALWAYS RUNNING</p>
        <div style={{ padding:"6px 13px", borderRadius:8, background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.25)", fontSize:12, color:"#A78BFA", display:"inline-block" }}>Health Check · Every 30 min</div>
      </div>
      <Card style={{ marginBottom:20, overflow:"hidden", padding:0 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:`1px solid ${T.border}` }}>
          {DAYS.map((d,i)=><div key={d} style={{ padding:"10px 0", textAlign:"center", fontSize:11, color:i===today?T.blueLight:T.textMuted, fontWeight:i===today?700:400, borderRight:i<6?`1px solid ${T.border}`:"none", background:i===today?T.blueDim:"transparent", letterSpacing:"0.08em", fontFamily:"'Geist Mono', monospace" }}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", padding:"12px 0", minHeight:100 }}>
          {DAYS.map((d,i)=>(
            <div key={d} style={{ padding:"0 6px", borderRight:i<6?`1px solid ${T.border}`:"none" }}>
              {CRON_JOBS.map(j=><div key={j.id} style={{ marginBottom:4, padding:"4px 7px", borderRadius:5, fontSize:10, background:`${j.color}15`, color:j.color, border:`1px solid ${j.color}28`, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{j.name}</div>)}
            </div>
          ))}
        </div>
      </Card>
      <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:12, fontFamily:"'Geist Mono', monospace" }}>QUEUE</p>
      <Card style={{ padding:0, overflow:"hidden" }}>
        {CRON_JOBS.map((j,i)=>(
          <div key={j.id} className="row-item" style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px", borderBottom:i<CRON_JOBS.length-1?`1px solid ${T.border}`:"none" }}>
            <Dot color={j.color} />
            <div style={{ flex:1 }}><span style={{ fontSize:13, fontWeight:600, color:j.color }}>{j.name}</span><span style={{ fontSize:12, color:T.textMuted, marginLeft:8 }}>— {j.agent}</span></div>
            <span style={{ fontSize:11, color:T.textMuted }}>{j.schedule}</span>
            <Tag color={j.status==="completed"?T.green:T.blueLight}>{j.status==="completed"?"Done":"Scheduled"}</Tag>
            <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace", minWidth:120, textAlign:"right" }}>{j.next}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ─── MEMORY ─────────────────────────────────────────────────────────────── */
function MemoryView() {
  const [selected, setSelected] = useState(MEMORY_ENTRIES[0]);
  const grouped = {};
  MEMORY_ENTRIES.forEach(e=>{ if(!grouped[e.date]) grouped[e.date]=[]; grouped[e.date].push(e); });
  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <SectionHeader label="AGENT MEMORY" sub="Memory & Logs" />
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:16 }}>
        <Card style={{ padding:0, overflow:"hidden", height:"fit-content" }}>
          <div style={{ padding:"12px 14px", borderBottom:`1px solid ${T.border}` }}>
            <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.12em", fontFamily:"'Geist Mono', monospace" }}>DAILY JOURNAL · {MEMORY_ENTRIES.length} ENTRIES</p>
          </div>
          {Object.entries(grouped).sort(([a],[b])=>b.localeCompare(a)).map(([date,entries])=>(
            <div key={date}>
              <div style={{ padding:"8px 14px", background:"rgba(255,255,255,0.02)", borderBottom:`1px solid ${T.border}` }}>
                <p style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{new Date(date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</p>
              </div>
              {entries.map(e=>(
                <div key={e.id} className="row-item" onClick={()=>setSelected(e)} style={{ padding:"11px 14px", cursor:"pointer", borderBottom:`1px solid ${T.border}`, background:selected?.id===e.id?T.blueDim:"transparent", borderLeft:selected?.id===e.id?`2px solid ${T.blue}`:"2px solid transparent" }}>
                  <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:3 }}>
                    <Dot color={agentColor(e.agent)} />
                    <span style={{ fontSize:12, fontWeight:500, color:selected?.id===e.id?T.blueLight:T.textPrimary }}>{e.title}</span>
                  </div>
                  <p style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace", marginLeft:13 }}>{e.time}</p>
                </div>
              ))}
            </div>
          ))}
        </Card>
        {selected && (
          <Card style={{ padding:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <p style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{new Date(selected.date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p>
              <span style={{ color:T.textMuted }}>·</span>
              <p style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{selected.time}</p>
            </div>
            <h2 style={{ fontSize:20, fontWeight:700, color:T.textPrimary, marginBottom:10, letterSpacing:"-0.01em" }}>{selected.title}</h2>
            <div style={{ display:"flex", gap:8, marginBottom:18 }}><Tag color={agentColor(selected.agent)}>{selected.agent}</Tag></div>
            <div style={{ height:1, background:T.border, marginBottom:18 }} />
            <p style={{ fontSize:14, color:T.textSecondary, lineHeight:1.75 }}>{selected.body}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ─── SYSTEM ─────────────────────────────────────────────────────────────── */
function SystemView() {
  const metrics = [
    {label:"Gateway",value:"Online",color:T.green},{label:"Uptime",value:"14d 6h",color:T.green},
    {label:"API Latency",value:"142ms",color:T.green},{label:"Memory Usage",value:"68%",color:T.amber},
    {label:"Sessions",value:"2 active",color:T.blueLight},{label:"Heartbeat",value:"12s ago",color:T.green},
  ];
  const channels = [
    {name:"WhatsApp",status:"connected",icon:"📱"},{name:"Telegram",status:"connected",icon:"✈️"},
    {name:"Email",status:"connected",icon:"📧"},{name:"Slack",status:"disconnected",icon:"💬"},
    {name:"Discord",status:"disconnected",icon:"🎮"},
  ];
  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <SectionHeader label="INFRASTRUCTURE" sub="System" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {metrics.map(m=><Card key={m.label} style={{ padding:"18px 20px" }}><p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.12em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>{m.label.toUpperCase()}</p><p style={{ fontSize:20, fontWeight:700, color:m.color, fontFamily:"'Geist Mono', monospace" }}>{m.value}</p></Card>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card style={{ padding:20 }}>
          <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:16 }}>Connected Channels</p>
          {channels.map((ch,i)=>(
            <div key={ch.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<channels.length-1?`1px solid ${T.border}`:"none" }}>
              <span style={{ fontSize:17 }}>{ch.icon}</span>
              <span style={{ fontSize:13, color:T.textPrimary, flex:1 }}>{ch.name}</span>
              <Tag color={ch.status==="connected"?T.green:T.textMuted}>{ch.status}</Tag>
            </div>
          ))}
        </Card>
        <Card style={{ padding:20 }}>
          <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:16 }}>Agent Runtime</p>
          {AGENTS.map((a,i)=>(
            <div key={a.id} style={{ marginBottom:i<AGENTS.length-1?16:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}><Dot color={a.color} pulse /><span style={{ fontSize:13, color:T.textPrimary, fontWeight:500 }}>{a.name}</span></div>
                <Tag color={T.green}>online</Tag>
              </div>
              <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}><div style={{ height:"100%", width:`${a.id==="zoriya"?68:42}%`, background:a.color, borderRadius:2 }} /></div>
              <p style={{ fontSize:10, color:T.textMuted, marginTop:4, fontFamily:"'Geist Mono', monospace" }}>{a.id==="zoriya"?"68":"42"}% CPU · {a.tasks} tasks open</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ─── LEADS VIEW ─────────────────────────────────────────────────────────── */
const LEADS_DATA = [
  { id:1, company:"NovaTech Solutions", industry:"Healthcare", size:"Mid-Market", need:"AI-powered patient data analytics and workflow automation", score:96, value:"$80K–120K", status:"Hot", contact:"Sarah Chen · CTO", tags:["AI/ML","Healthcare","Automation"], added:"2026-03-06" },
  { id:2, company:"Meridian Financial", industry:"Finance", size:"Enterprise", need:"Intelligent document processing and fraud detection AI", score:91, value:"$150K–250K", status:"Hot", contact:"James Porter · VP Ops", tags:["AI/ML","Finance","Compliance"], added:"2026-03-06" },
  { id:3, company:"Apex Logistics", industry:"Logistics", size:"Mid-Market", need:"Route optimization AI and predictive maintenance system", score:87, value:"$60K–90K", status:"Warm", contact:"Priya Sharma · COO", tags:["AI","Logistics","IoT"], added:"2026-03-05" },
  { id:4, company:"Greenfield Properties", industry:"Real Estate", size:"SMB", need:"AI listing description generator and lead scoring tool", score:82, value:"$25K–45K", status:"Warm", contact:"Marcus Webb · CEO", tags:["AI","Real Estate","Automation"], added:"2026-03-05" },
  { id:5, company:"Pinnacle Law Group", industry:"Legal", size:"Mid-Market", need:"Contract analysis AI and document review automation", score:79, value:"$70K–110K", status:"Warm", contact:"Elena Voss · Managing Partner", tags:["AI/ML","Legal","NLP"], added:"2026-03-04" },
  { id:6, company:"RetailEdge Corp", industry:"Retail", size:"Enterprise", need:"Customer behavior AI and inventory demand forecasting", score:75, value:"$120K–180K", status:"Cold", contact:"David Kim · CDO", tags:["AI","Retail","Analytics"], added:"2026-03-04" },
  { id:7, company:"ClearPath Education", industry:"EdTech", size:"SMB", need:"Personalized learning AI and student performance analytics", score:71, value:"$30K–50K", status:"New", contact:"Aisha Thompson · Product Lead", tags:["AI","EdTech","Analytics"], added:"2026-03-03" },
];

const LEAD_SERVICES = [
  { label:"AI Strategy & Consulting", color:"#8B5CF6", icon:"◈" },
  { label:"Custom AI Development", color:T.blueLight, icon:"◆" },
  { label:"AI Integration & Automation", color:T.green, icon:"◎" },
  { label:"Traditional IT Modernization", color:T.amber, icon:"◧" },
  { label:"Data Infrastructure", color:"#EC4899", icon:"◉" },
];

function LeadsView() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const statuses = ["All","Hot","Warm","Cold","New"];
  const statusClr = s => s==="Hot"?T.red:s==="Warm"?T.amber:s==="Cold"?T.blueLight:T.textMuted;
  const filtered = filter==="All"?LEADS_DATA:LEADS_DATA.filter(l=>l.status===filter);

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22 }}>
        <div>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>ZORIYA AI · BUSINESS DEVELOPMENT</p>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>Leads</h1>
        </div>
        <div style={{ display:"flex", gap:16 }}>
          {[{l:"Total",v:LEADS_DATA.length},{l:"Hot",v:LEADS_DATA.filter(l=>l.status==="Hot").length},{l:"Pipeline Value",v:"$605K+"}].map(s=>(
            <div key={s.l} style={{ textAlign:"right" }}>
              <p style={{ fontSize:22, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{s.v}</p>
              <p style={{ fontSize:10, color:T.textMuted, marginTop:3 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services we offer */}
      <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
        {LEAD_SERVICES.map(s=>(
          <div key={s.label} style={{ padding:"5px 12px", borderRadius:20, background:s.color+"15", border:`1px solid ${s.color}33`, fontSize:11, color:s.color, display:"flex", alignItems:"center", gap:5 }}>
            <span>{s.icon}</span><span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {statuses.map(s=>(
          <button key={s} className="btn" onClick={()=>setFilter(s)} style={{ padding:"6px 14px", borderRadius:8, fontSize:12, background:filter===s?T.blueDim:"rgba(255,255,255,0.04)", border:`1px solid ${filter===s?T.blue+"55":T.border}`, color:filter===s?T.blueLight:T.textSecondary }}>
            {s} {s!=="All" && <span style={{ fontSize:10, color:statusClr(s), marginLeft:4 }}>●</span>}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16 }}>
        {/* Leads list */}
        <Card style={{ padding:0, overflow:"hidden" }}>
          {filtered.map((lead,i)=>(
            <div key={lead.id} className="row-item" onClick={()=>setSelected(selected?.id===lead.id?null:lead)} style={{ padding:"16px 18px", borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none", cursor:"pointer", background:selected?.id===lead.id?T.blueDim:"transparent", borderLeft:selected?.id===lead.id?`2px solid ${T.blue}`:"2px solid transparent" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                {/* Score */}
                <div style={{ width:46, height:46, borderRadius:10, flexShrink:0, background:`${lead.score>=90?T.green:lead.score>=80?T.blueLight:T.amber}12`, border:`1px solid ${lead.score>=90?T.green:lead.score>=80?T.blueLight:T.amber}33`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:15, fontWeight:700, color:lead.score>=90?T.green:lead.score>=80?T.blueLight:T.amber, fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{lead.score}</span>
                  <span style={{ fontSize:8, color:T.textMuted }}>FIT</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:T.textPrimary }}>{lead.company}</span>
                    <Tag color={statusClr(lead.status)}>{lead.status}</Tag>
                    <span style={{ marginLeft:"auto", fontSize:13, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{lead.value}</span>
                  </div>
                  <p style={{ fontSize:12, color:T.textSecondary, marginBottom:8, lineHeight:1.5 }}>{lead.need}</p>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <Tag color={T.textMuted}>{lead.industry}</Tag>
                    <Tag color={T.textMuted}>{lead.size}</Tag>
                    {lead.tags.map(t=><Tag key={t} color={T.purple}>{t}</Tag>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Detail panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {selected ? (
            <Card style={{ padding:20, animation:"fadeUp .2s ease" }}>
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:T.textPrimary }}>{selected.company}</h3>
                  <Tag color={statusClr(selected.status)}>{selected.status}</Tag>
                </div>
                <p style={{ fontSize:11, color:T.textMuted }}>{selected.contact}</p>
              </div>
              <div style={{ height:1, background:T.border, marginBottom:14 }} />
              <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:6, fontFamily:"'Geist Mono', monospace" }}>OPPORTUNITY</p>
              <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.65, marginBottom:14 }}>{selected.need}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                <div style={{ padding:"10px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                  <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:4, fontFamily:"'Geist Mono', monospace" }}>EST. VALUE</p>
                  <p style={{ fontSize:14, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>{selected.value}</p>
                </div>
                <div style={{ padding:"10px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                  <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:4, fontFamily:"'Geist Mono', monospace" }}>FIT SCORE</p>
                  <p style={{ fontSize:14, fontWeight:700, color:selected.score>=90?T.green:T.blueLight, fontFamily:"'Geist Mono', monospace" }}>{selected.score}/100</p>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {selected.tags.map(t=><Tag key={t} color={T.purple}>{t}</Tag>)}
              </div>
            </Card>
          ) : (
            <Card style={{ padding:20 }}>
              <p style={{ fontSize:12, color:T.textMuted, lineHeight:1.6 }}>Select a lead to view full details and contact info.</p>
            </Card>
          )}

          {/* Pipeline summary */}
          <Card style={{ padding:18 }}>
            <p style={{ fontSize:12, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Pipeline by Status</p>
            {["Hot","Warm","Cold","New"].map(s=>{
              const count = LEADS_DATA.filter(l=>l.status===s).length;
              return (
                <div key={s} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:statusClr(s) }}>{s}</span>
                    <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{count}</span>
                  </div>
                  <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.06)" }}>
                    <div style={{ height:"100%", width:`${(count/LEADS_DATA.length)*100}%`, background:statusClr(s), borderRadius:2 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── CREATIVITY CAPSULE ─────────────────────────────────────────────────── */
const IDEAS = [
  { id:1, title:"AI-Powered RFP Auto-Responder", category:"Product", energy:"🔥", agent:"Zoriya", date:"2026-03-06", summary:"Build a tool that auto-generates proposal responses for federal RFPs using contract data from Vector. Could become a standalone SaaS product targeting small GovCon firms.", tags:["GovCon","SaaS","Automation"], status:"Explore", votes:8 },
  { id:2, title:"Weekly AI Opportunity Digest Newsletter", category:"Content", energy:"⚡", agent:"Vector", date:"2026-03-06", summary:"Package Vector's contract findings + AI broker picks into a weekly email digest. Position as the #1 AI-driven opportunity newsletter for entrepreneurs and investors.", tags:["Newsletter","Brand","Growth"], status:"Pursue", votes:12 },
  { id:3, title:"Zoriya White-Label Offering", category:"Business", energy:"🚀", agent:"Zoriya", date:"2026-03-05", summary:"License the Zoriya AI stack to other agencies and consultants. They run their own branded AI agent org under the hood powered by our infrastructure. Revenue share model.", tags:["SaaS","B2B","Revenue"], status:"Explore", votes:9 },
  { id:4, title:"AI Readiness Assessment Tool", category:"Product", energy:"💡", agent:"Zoriya", date:"2026-03-05", summary:"A free 10-minute assessment that scores a business's AI readiness. Viral lead gen tool — outputs a personalized report and funnels hot leads into our pipeline automatically.", tags:["Lead Gen","Tool","Viral"], status:"Build", votes:15 },
  { id:5, title:"AI Company Due Diligence Agent", category:"Research", energy:"⚡", agent:"Vector", date:"2026-03-04", summary:"An agent that generates full due diligence reports on any AI company in minutes — financials, team, tech stack, market position, risks. Sell as a premium research service.", tags:["Finance","Research","B2B"], status:"Explore", votes:6 },
  { id:6, title:"Government AI Compliance Checker", category:"Product", energy:"💡", agent:"Zoriya", date:"2026-03-04", summary:"AI tool that checks government contractors for AI compliance requirements (OMB memos, NIST AI RMF). Growing regulatory need, almost zero competition right now.", tags:["GovCon","Compliance","Niche"], status:"Explore", votes:7 },
];

function CapsuleView() {
  const [selected, setSelected] = useState(IDEAS[0]);
  const [votes, setVotes] = useState(Object.fromEntries(IDEAS.map(i=>[i.id,i.votes])));
  const statusClr = s => s==="Build"?T.green:s==="Pursue"?T.blueLight:T.amber;
  const catClr = c => c==="Product"?T.blueLight:c==="Business"?T.green:c==="Content"?"#EC4899":T.amber;

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <div style={{ marginBottom:22 }}>
        <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>AGENT-GENERATED · UPDATED DAILY</p>
        <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>Creativity Capsule</h1>
        <p style={{ fontSize:13, color:T.textSecondary, marginTop:6 }}>Ideas surfaced by your agents. Vote on the ones worth pursuing.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20 }}>
        {/* Ideas grid */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {IDEAS.map(idea=>(
            <Card key={idea.id} className="card" onClick={()=>setSelected(idea)} style={{ padding:18, cursor:"pointer", border:selected?.id===idea.id?`1px solid ${T.blue}44`:undefined, background:selected?.id===idea.id?T.blueDim:undefined }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ fontSize:24, flexShrink:0, marginTop:2 }}>{idea.energy}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:T.textPrimary }}>{idea.title}</span>
                    <Tag color={statusClr(idea.status)}>{idea.status}</Tag>
                    <Tag color={catClr(idea.category)}>{idea.category}</Tag>
                  </div>
                  <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.6, marginBottom:10 }}>{idea.summary.slice(0,120)}…</p>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    {idea.tags.map(t=><Tag key={t} color={T.textMuted}>{t}</Tag>)}
                    <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>from</span>
                      <Dot color={agentColor(idea.agent)} />
                      <span style={{ fontSize:11, color:agentColor(idea.agent), fontWeight:600 }}>{idea.agent}</span>
                    </div>
                  </div>
                </div>
                {/* Vote */}
                <div onClick={e=>{e.stopPropagation();setVotes(v=>({...v,[idea.id]:v[idea.id]+1}));}} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 10px", borderRadius:8, border:`1px solid ${T.border}`, cursor:"pointer", flexShrink:0, transition:"all .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.blueLight+"55";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;}}>
                  <span style={{ fontSize:14, color:T.blueLight }}>▲</span>
                  <span style={{ fontSize:13, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{votes[idea.id]}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail */}
        <div>
          {selected && (
            <Card style={{ padding:22, position:"sticky", top:20, animation:"fadeUp .2s ease" }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{selected.energy}</div>
              <h3 style={{ fontSize:17, fontWeight:700, color:T.textPrimary, marginBottom:6, letterSpacing:"-0.01em" }}>{selected.title}</h3>
              <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
                <Tag color={statusClr(selected.status)}>{selected.status}</Tag>
                <Tag color={catClr(selected.category)}>{selected.category}</Tag>
              </div>
              <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.75, marginBottom:18 }}>{selected.summary}</p>
              <div style={{ height:1, background:T.border, marginBottom:16 }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Dot color={agentColor(selected.agent)} />
                  <span style={{ fontSize:12, color:agentColor(selected.agent), fontWeight:600 }}>{selected.agent}</span>
                  <span style={{ fontSize:11, color:T.textMuted }}>· {selected.date}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:20, color:T.blueLight }}>▲</span>
                  <span style={{ fontSize:18, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{votes[selected.id]}</span>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {selected.tags.map(t=><Tag key={t} color={T.textMuted}>{t}</Tag>)}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── AI BROKER ──────────────────────────────────────────────────────────── */
const STOCKS = [
  { id:1, ticker:"NVDA", name:"NVIDIA Corporation", exchange:"NASDAQ", country:"🇺🇸", price:924.18, change:+2.84, changePct:+0.31, mktCap:"$2.27T", sector:"Semiconductors", signal:"Strong Buy", agent:"Vector", reason:"Dominant GPU position in AI training. Data center revenue up 409% YoY. Blackwell architecture next catalyst.", chart:[820,855,840,880,910,895,924], ipo:false },
  { id:2, ticker:"TSM", name:"Taiwan Semiconductor", exchange:"NYSE", country:"🇹🇼", price:175.42, change:+3.21, changePct:+1.86, mktCap:"$910B", sector:"Semiconductors", signal:"Buy", agent:"Vector", reason:"Foundry for every major AI chip. TSMC makes NVIDIA, Apple, AMD chips. 3nm process node competitive moat.", chart:[155,162,158,168,171,174,175], ipo:false },
  { id:3, ticker:"PLTR", name:"Palantir Technologies", exchange:"NYSE", country:"🇺🇸", price:82.47, change:-1.23, changePct:-1.47, mktCap:"$188B", sector:"AI Software", signal:"Buy", agent:"Vector", reason:"AIP platform winning enterprise AI adoption. Government contracts growing. Rule of 40 positive.", chart:[68,72,75,80,84,83,82], ipo:false },
  { id:4, ticker:"ARM", name:"ARM Holdings", exchange:"NASDAQ", country:"🇬🇧", price:148.33, change:+4.67, changePct:+3.25, mktCap:"$154B", sector:"Semiconductors", signal:"Buy", agent:"Vector", reason:"Every mobile AI chip runs on ARM architecture. Royalty model scales with AI device proliferation.", chart:[120,128,135,140,143,145,148], ipo:false },
  { id:5, ticker:"SOUN", name:"SoundHound AI", exchange:"NASDAQ", country:"🇺🇸", price:9.82, change:+0.54, changePct:+5.82, mktCap:"$3.8B", sector:"Voice AI", signal:"Speculative", agent:"Vector", reason:"Rising star in voice AI. Partnership with NVIDIA confirmed. Automotive AI voice growing fast.", chart:[6.2,7.1,7.8,8.4,9.0,9.3,9.82], ipo:false },
  { id:6, ticker:"UPCOMING", name:"CoreWeave Inc.", exchange:"NASDAQ IPO", country:"🇺🇸", price:"TBD", change:null, changePct:null, mktCap:"~$23B", sector:"AI Cloud", signal:"Watch", agent:"Vector", reason:"Largest independent AI cloud provider. NVIDIA-backed. Filed for IPO March 2026. Massive GPU cluster operator.", chart:null, ipo:true, ipoDate:"Q1 2026" },
  { id:7, ticker:"2330", name:"TSMC (Taiwan)", exchange:"TWSE", country:"🇹🇼", price:"NT$1,025", change:null, changePct:+1.2, mktCap:"$910B", sector:"Semiconductors", signal:"Buy", agent:"Vector", reason:"Primary listing on Taiwan exchange. Strong institutional buying ahead of AI capex cycle.", chart:[900,940,960,980,1000,1010,1025], ipo:false },
];

const MARKET_SESSIONS = [
  { market:"NYSE/NASDAQ", tz:"EST", hours:"9:30 AM – 4:00 PM", status:"open", flag:"🇺🇸" },
  { market:"London (LSE)", tz:"GMT", hours:"8:00 AM – 4:30 PM", status:"closed", flag:"🇬🇧" },
  { market:"Tokyo (TSE)", tz:"JST", hours:"9:00 AM – 3:30 PM", status:"closed", flag:"🇯🇵" },
  { market:"Hong Kong (HKEX)", tz:"HKT", hours:"9:30 AM – 4:00 PM", status:"closed", flag:"🇭🇰" },
  { market:"TWSE", tz:"CST", hours:"9:00 AM – 1:30 PM", status:"closed", flag:"🇹🇼" },
];

function MiniChart({ data, positive }) {
  if(!data) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const norm = data.map(v=>((v-min)/(max-min||1))*36);
  const pts = data.map((v,i)=>`${(i/(data.length-1))*88},${38-norm[i]}`).join(" ");
  const color = positive ? T.green : T.red;
  return (
    <svg width="90" height="40" style={{ display:"block" }}>
      <defs>
        <linearGradient id={`g${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,40 ${pts} 88,40`} fill={`url(#g${positive})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BrokerView() {
  const [selected, setSelected] = useState(STOCKS[0]);
  const [tab, setTab] = useState("picks");

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22 }}>
        <div>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>VECTOR · AI MARKET INTELLIGENCE</p>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>AI Broker</h1>
          <p style={{ fontSize:13, color:T.textSecondary, marginTop:5 }}>Global AI investment opportunities tracked by Vector</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["picks","ipo","markets"].map(t=>(
            <button key={t} className="btn" onClick={()=>setTab(t)} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, background:tab===t?T.blueDim:"rgba(255,255,255,0.04)", border:`1px solid ${tab===t?T.blue+"55":T.border}`, color:tab===t?T.blueLight:T.textSecondary }}>
              {t==="picks"?"Stock Picks":t==="ipo"?"IPO Watch":"Markets"}
            </button>
          ))}
        </div>
      </div>

      {/* Market sessions bar */}
      <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
        {MARKET_SESSIONS.map(m=>(
          <div key={m.market} style={{ padding:"6px 12px", borderRadius:8, background:m.status==="open"?"rgba(16,185,129,0.1)":"rgba(255,255,255,0.03)", border:`1px solid ${m.status==="open"?"rgba(16,185,129,0.25)":T.border}`, display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ fontSize:13 }}>{m.flag}</span>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:11, fontWeight:600, color:m.status==="open"?T.green:T.textMuted }}>{m.market}</span>
                <div style={{ width:5, height:5, borderRadius:"50%", background:m.status==="open"?T.green:T.textMuted, animation:m.status==="open"?"pulse 2s ease-in-out infinite":"none" }} />
              </div>
              <span style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{m.tz} · {m.hours}</span>
            </div>
          </div>
        ))}
      </div>

      {tab === "markets" ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {MARKET_SESSIONS.map(m=>(
            <Card key={m.market} style={{ padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:24 }}>{m.flag}</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{m.market}</p>
                  <p style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{m.tz}</p>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <p style={{ fontSize:11, color:T.textMuted }}>{m.hours}</p>
                <Tag color={m.status==="open"?T.green:T.textMuted}>{m.status}</Tag>
              </div>
            </Card>
          ))}
        </div>
      ) : tab === "ipo" ? (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {STOCKS.filter(s=>s.ipo).map(s=>(
            <Card key={s.id} style={{ padding:20 }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
                <div style={{ padding:"8px 12px", borderRadius:10, background:`${T.amber}15`, border:`1px solid ${T.amber}33`, textAlign:"center", flexShrink:0 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>IPO</p>
                  <p style={{ fontSize:9, color:T.textMuted }}>{s.ipoDate}</p>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:T.textPrimary }}>{s.name}</span>
                    <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{s.exchange}</span>
                    <span style={{ fontSize:16 }}>{s.country}</span>
                    <Tag color={T.amber}>{s.signal}</Tag>
                  </div>
                  <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.6, marginBottom:8 }}>{s.reason}</p>
                  <div style={{ display:"flex", gap:8 }}>
                    <Tag color={T.textMuted}>{s.sector}</Tag>
                    <Tag color={T.textMuted}>Est. {s.mktCap}</Tag>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:16 }}>
          {/* Stock list */}
          <Card style={{ padding:0, overflow:"hidden" }}>
            {/* Header */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 90px 110px 100px 80px", gap:8, padding:"10px 18px", borderBottom:`1px solid ${T.border}`, fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace", letterSpacing:"0.08em" }}>
              <span>COMPANY</span><span style={{ textAlign:"right" }}>CHART</span><span style={{ textAlign:"right" }}>PRICE</span><span style={{ textAlign:"right" }}>CHANGE</span><span style={{ textAlign:"right" }}>SIGNAL</span>
            </div>
            {STOCKS.filter(s=>!s.ipo).map((s,i)=>{
              const pos = s.changePct >= 0;
              const signalClr = s.signal==="Strong Buy"?T.green:s.signal==="Buy"?T.blueLight:s.signal==="Speculative"?T.amber:T.textMuted;
              return (
                <div key={s.id} className="row-item" onClick={()=>setSelected(s)} style={{ display:"grid", gridTemplateColumns:"1fr 90px 110px 100px 80px", gap:8, padding:"12px 18px", borderBottom:i<STOCKS.filter(x=>!x.ipo).length-1?`1px solid ${T.border}`:"none", cursor:"pointer", alignItems:"center", background:selected?.id===s.id?T.blueDim:"transparent" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{s.ticker}</span>
                      <span style={{ fontSize:16 }}>{s.country}</span>
                    </div>
                    <span style={{ fontSize:11, color:T.textSecondary }}>{s.name}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"flex-end" }}><MiniChart data={s.chart} positive={pos} /></div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:14, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{typeof s.price==="number"?`$${s.price.toFixed(2)}`:s.price}</p>
                    <p style={{ fontSize:10, color:T.textMuted }}>{s.mktCap}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    {s.changePct!==null && <p style={{ fontSize:13, fontWeight:700, color:pos?T.green:T.red, fontFamily:"'Geist Mono', monospace" }}>{pos?"+":""}{s.changePct?.toFixed(2)}%</p>}
                  </div>
                  <div style={{ textAlign:"right" }}><Tag color={signalClr}>{s.signal}</Tag></div>
                </div>
              );
            })}
          </Card>

          {/* Detail panel */}
          {selected && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Card style={{ padding:20, animation:"fadeUp .2s ease" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <h3 style={{ fontSize:22, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{selected.ticker}</h3>
                      <span style={{ fontSize:20 }}>{selected.country}</span>
                    </div>
                    <p style={{ fontSize:12, color:T.textSecondary }}>{selected.name}</p>
                  </div>
                  <Tag color={selected.signal==="Strong Buy"?T.green:selected.signal==="Buy"?T.blueLight:T.amber}>{selected.signal}</Tag>
                </div>

                {/* Big chart */}
                {selected.chart && (
                  <div style={{ marginBottom:16 }}>
                    {(() => {
                      const d = selected.chart;
                      const min=Math.min(...d), max=Math.max(...d);
                      const norm=d.map(v=>((v-min)/(max-min||1))*80);
                      const pts=d.map((v,i)=>`${(i/(d.length-1))*310},${82-norm[i]}`).join(" ");
                      const pos=selected.changePct>=0;
                      const color=pos?T.green:T.red;
                      return (
                        <svg width="100%" height="90" viewBox="0 0 320 90" style={{ display:"block" }}>
                          <defs>
                            <linearGradient id="bigChart" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
                              <stop offset="100%" stopColor={color} stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <polygon points={`0,90 ${pts} 310,90`} fill="url(#bigChart)"/>
                          <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                      );
                    })()}
                  </div>
                )}

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                  {[{l:"Price",v:typeof selected.price==="number"?`$${selected.price.toFixed(2)}`:selected.price,c:T.textPrimary},{l:"Market Cap",v:selected.mktCap,c:T.textPrimary},{l:"Change",v:selected.changePct!==null?(selected.changePct>=0?"+":"")+selected.changePct?.toFixed(2)+"%":"—",c:selected.changePct>=0?T.green:T.red},{l:"Exchange",v:selected.exchange,c:T.textMuted}].map(m=>(
                    <div key={m.l} style={{ padding:"10px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                      <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:4, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                      <p style={{ fontSize:14, fontWeight:700, color:m.c, fontFamily:"'Geist Mono', monospace" }}>{m.v}</p>
                    </div>
                  ))}
                </div>

                <div style={{ height:1, background:T.border, marginBottom:14 }} />
                <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>VECTOR'S THESIS</p>
                <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.7 }}>{selected.reason}</p>
                <div style={{ display:"flex", gap:6, marginTop:14 }}>
                  <Tag color={T.purple}>{selected.sector}</Tag>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("hq");

  const VIEWS = {
    hq:        <HQView />,
    office:    <VirtualOfficeView />,
    meeting:   <MeetingView />,
    tasks:     <TasksView />,
    projects:  <ProjectsView />,
    contracts: <ContractsView />,
    cron:      <CronView />,
    leads:     <LeadsView />,
    capsule:   <CapsuleView />,
    broker:    <BrokerView />,
    memory:    <MemoryView />,
    system:    <SystemView />,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg, fontFamily:"'Outfit', sans-serif", color:T.textPrimary }}>
      <style>{GLOBAL_CSS}</style>
      {/* Noise overlay */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, opacity:0.015, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:"128px" }} />
      {/* Stars */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        {Array.from({length:70},(_,i)=>{ const x=Math.random()*100,y=Math.random()*100,s=Math.random()*1.1+0.3,o=Math.random()*0.3+0.07,d=Math.random()*5+2; return <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`, width:s, height:s, borderRadius:"50%", background:"#fff", opacity:o, animation:`fadeIn ${d}s ease-in-out infinite alternate` }} />; })}
      </div>

      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", position:"relative", zIndex:1, minWidth:0 }}>
        <TopBar active={active} />
        <main style={{ flex:1, overflowY:"auto" }} key={active}>
          {VIEWS[active]}
        </main>
      </div>
    </div>
  );
}
