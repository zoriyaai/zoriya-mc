import { useState, useEffect, useRef } from "react";

/* ─── SUPABASE CONFIG ────────────────────────────────────────────────────── */
const SB_URL = "https://tlfyafwlducwgqvxbgll.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZnlhZndsZHVjd2dxdnhiZ2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDUxNDMsImV4cCI6MjA4ODMyMTE0M30.WtYRUgXyh6I_3Ua38LuJElyK8fZWmMDMppa7GyDXgD8";

const sbFetch = async (table, params="") => {
  try {
    const r = await fetch(SB_URL+"/rest/v1/"+table+params, {
      headers:{ apikey:SB_KEY, Authorization:"Bearer "+SB_KEY, "Content-Type":"application/json" }
    });
    return r.ok ? r.json() : [];
  } catch { return []; }
};

const sbInsert = async (table, data) => {
  try {
    const r = await fetch(SB_URL+"/rest/v1/"+table, {
      method:"POST",
      headers:{ apikey:SB_KEY, Authorization:"Bearer "+SB_KEY, "Content-Type":"application/json", Prefer:"return=minimal" },
      body: JSON.stringify(data)
    });
    return r.ok;
  } catch { return false; }
};

const useLiveData = () => {
  const [agents, setAgents] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    const [a,c,s,act] = await Promise.all([
      sbFetch("agents","?order=name.asc"),
      sbFetch("contracts","?order=match_pct.desc&limit=50"),
      sbFetch("stats","?limit=1"),
      sbFetch("activity","?order=created_at.desc&limit=20"),
    ]);
    if(a.length) setAgents(a);
    if(c.length) setContracts(c);
    if(s.length) setStats(s[0]);
    if(act.length) setActivity(act);
    setLoading(false);
  };
  useEffect(()=>{ refresh(); const iv=setInterval(refresh,30000); return ()=>clearInterval(iv); },[]);
  const sendCommand = async (command,target="system") => sbInsert("commands",{command,target,status:"pending"});
  return { agents, contracts, stats, activity, loading, refresh, sendCommand };
};

/* ─── AUTH ───────────────────────────────────────────────────────────────── */
const ZORIYA_PASSWORD = "zoriya2026";
function LoginView({ onLogin }) {
  const [pw,setPw] = useState("");
  const [err,setErr] = useState(false);
  const [show,setShow] = useState(false);
  const attempt = () => { if(pw===ZORIYA_PASSWORD){onLogin();}else{setErr(true);setTimeout(()=>setErr(false),2000);} };
  return (
    <div style={{ minHeight:"100vh", width:"100vw", background:"#0C0E13", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Outfit,sans-serif", position:"fixed", inset:0 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;600&family=Outfit:wght@300;400;600;700&display=swap');`}</style>
      <div style={{ width:380, padding:40, borderRadius:20, background:"#111318", border:"1px solid rgba(255,255,255,0.06)", textAlign:"center" }}>
        <div style={{ width:56, height:56, borderRadius:16, background:"rgba(37,99,235,0.15)", border:"1.5px solid rgba(37,99,235,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:11, fontWeight:700, color:"#3B82F6", fontFamily:"Geist Mono,monospace" }}>ZAI</div>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#F1F2F4", marginBottom:6 }}>ZORIYA AI</h1>
        <p style={{ fontSize:12, color:"rgba(241,242,244,0.25)", marginBottom:28, letterSpacing:"0.1em", fontFamily:"Geist Mono,monospace" }}>MISSION CONTROL</p>
        <div style={{ position:"relative", marginBottom:16 }}>
          <input type={show?"text":"password"} placeholder="Enter access code" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()} style={{ width:"100%", padding:"12px 52px 12px 16px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid "+(err?"#EF4444":"rgba(255,255,255,0.08)"), color:"#F1F2F4", fontSize:14, outline:"none", fontFamily:"Geist Mono,monospace", letterSpacing:"0.12em" }} />
          <button onClick={()=>setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(241,242,244,0.3)", cursor:"pointer", fontSize:10 }}>{show?"HIDE":"SHOW"}</button>
        </div>
        {err && <p style={{ fontSize:11, color:"#EF4444", marginBottom:12 }}>ACCESS DENIED</p>}
        <button onClick={attempt} style={{ width:"100%", padding:12, borderRadius:10, background:"#2563EB", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>ENTER MISSION CONTROL</button>
        <p style={{ fontSize:10, color:"rgba(241,242,244,0.2)", marginTop:16 }}>ZORIYA AI · Secure Access</p>
      </div>
    </div>
  );
}



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
/* SVG icon components — 16x16 outline style */
const Icons = {
  hq: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="7" width="14" height="8" rx="1"/><polyline points="1,7 8,1 15,7"/><rect x="6" y="11" width="4" height="4"/>
    </svg>
  ),
  office: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="2" width="14" height="12" rx="1"/>
      <line x1="1" y1="6" x2="15" y2="6"/>
      <line x1="6" y1="2" x2="6" y2="14"/>
      <rect x="8" y="9" width="3" height="5"/>
      <rect x="2.5" y="8" width="2" height="2"/>
      <rect x="2.5" y="3" width="2" height="2"/>
      <rect x="8" y="3" width="3" height="2"/>
    </svg>
  ),
  meeting: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 3V3a1 1 0 0 1 1-1z"/>
      <line x1="5" y1="6" x2="11" y2="6"/>
      <line x1="5" y1="8.5" x2="9" y2="8.5"/>
    </svg>
  ),
  tasks: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,4 4,6 7,3"/><line x1="9" y1="4.5" x2="14" y2="4.5"/>
      <polyline points="2,9 4,11 7,8"/><line x1="9" y1="9.5" x2="14" y2="9.5"/>
      <polyline points="2,13.5 4,13.5"/><line x1="6" y1="13.5" x2="14" y2="13.5"/>
    </svg>
  ),
  projects: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
      <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  ),
  contracts: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z"/>
      <polyline points="9,1 9,7 15,7"/>
      <line x1="5" y1="10" x2="11" y2="10"/><line x1="5" y1="12.5" x2="9" y2="12.5"/>
    </svg>
  ),
  cron: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5"/><polyline points="8,4 8,8 11,10"/>
    </svg>
  ),
  leads: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5" r="2.5"/><path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5"/>
      <line x1="11" y1="4" x2="15" y2="4"/><line x1="13" y1="2" x2="13" y2="6"/>
      <line x1="11" y1="9" x2="15" y2="9"/><line x1="11" y1="11.5" x2="15" y2="11.5"/>
    </svg>
  ),
  capsule: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5 L10.5 6 L15.5 6.8 L11.75 10.45 L12.7 15.4 L8 12.9 L3.3 15.4 L4.25 10.45 L0.5 6.8 L5.5 6 Z"/>
    </svg>
  ),
  broker: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1,12 5,7 8,9 12,4 15,6"/>
      <polyline points="12,4 15,4 15,7"/>
      <line x1="1" y1="14.5" x2="15" y2="14.5"/>
    </svg>
  ),
  lab: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1v5.5L2.5 13a1.8 1.8 0 0 0 1.6 2.7h7.8a1.8 1.8 0 0 0 1.6-2.7L10 6.5V1"/>
      <line x1="5" y1="1" x2="11" y2="1"/>
      <line x1="4" y1="11" x2="12" y2="11"/>
      <circle cx="6.5" cy="13" r="0.6" fill="currentColor"/>
      <circle cx="9.5" cy="12" r="0.6" fill="currentColor"/>
    </svg>
  ),
  memory: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="8" cy="5" rx="6" ry="2.5"/>
      <path d="M2 5v3c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V5"/>
      <path d="M2 8v3c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V8"/>
    </svg>
  ),
  system: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2.2"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
    </svg>
  ),
  ecommerce: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1h2.5l1.6 7h7.4l1.5-5H4.5"/>
      <circle cx="6.5" cy="13.5" r="1.2"/>
      <circle cx="11.5" cy="13.5" r="1.2"/>
    </svg>
  ),
  arbitrage: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8h14"/><polyline points="10,4 14,8 10,12"/><polyline points="6,4 2,8 6,12"/>
      <circle cx="8" cy="5" r="1.3"/><circle cx="8" cy="11" r="1.3"/>
    </svg>
  ),
  marketing: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 11V5l9-3v12L2 11z"/>
      <path d="M2 11c0 1.66 1.12 3 2.5 3S7 12.66 7 11"/>
      <line x1="11" y1="5.5" x2="14" y2="4.5"/>
      <line x1="11" y1="8" x2="14" y2="8"/>
      <line x1="11" y1="10.5" x2="14" y2="11.5"/>
    </svg>
  ),
  docgen: ()=>(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6z"/>
      <polyline points="9,1 9,6 14,6"/>
      <line x1="5" y1="9" x2="11" y2="9"/>
      <line x1="5" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const NAV = [
  { id:"hq",        Icon:Icons.hq,        label:"HQ" },
  { id:"office",    Icon:Icons.office,    label:"Virtual Office" },
  { id:"meeting",   Icon:Icons.meeting,   label:"Meeting Room" },
  { id:"tasks",     Icon:Icons.tasks,     label:"Tasks" },
  { id:"projects",  Icon:Icons.projects,  label:"Projects" },
  { id:"contracts", Icon:Icons.contracts, label:"Contract Finds", badge:27 },
  { id:"cron",      Icon:Icons.cron,      label:"Cron Jobs" },
  { id:"leads",     Icon:Icons.leads,     label:"Leads" },
  { id:"capsule",   Icon:Icons.capsule,   label:"Creativity Capsule" },
  { id:"broker",    Icon:Icons.broker,    label:"AI Broker" },
  { id:"lab",       Icon:Icons.lab,       label:"The Lab" },
  { id:"ecommerce", Icon:Icons.ecommerce, label:"E-Commerce" },
  { id:"arbitrage", Icon:Icons.arbitrage, label:"Arbitrage" },
  { id:"marketing", Icon:Icons.marketing, label:"Marketing" },
  { id:"docgen",    Icon:Icons.docgen,    label:"Contract Gen" },
  { id:"memory",    Icon:Icons.memory,    label:"Memory" },
  { id:"system",    Icon:Icons.system,    label:"System" },
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
              <span style={{ width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, opacity:isActive?1:0.6 }}><item.Icon /></span>
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
  const live = useLiveData();
  const onlineAgents = live.agents.filter(a=>a.status==="online").length;
  const contractCount = live.contracts.length;
  const [cmdSent, setCmdSent] = useState("");

  const triggerVector = async () => {
    const ok = await live.sendCommand("run_vector","vector");
    setCmdSent(ok?"Vector scan triggered! Check back in 2 mins.":"Command failed — is the bridge running?");
    setTimeout(()=>setCmdSent(""),5000);
  };

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <SectionHeader label="ZORIYA AI · LIVE" sub="HQ — Overview" />
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {cmdSent && <span style={{ fontSize:11, color:T.green, fontFamily:"'Geist Mono',monospace" }}>{cmdSent}</span>}
          <button onClick={triggerVector} style={{ padding:"8px 14px", borderRadius:8, background:`${T.amber}18`, border:`1px solid ${T.amber}33`, color:T.amber, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Geist Mono',monospace", letterSpacing:"0.08em" }}>▶ RUN VECTOR</button>
          <button onClick={live.refresh} style={{ padding:"8px 14px", borderRadius:8, background:`${T.blue}18`, border:`1px solid ${T.blue}33`, color:T.blueLight, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Geist Mono',monospace", letterSpacing:"0.08em" }}>↻ REFRESH</button>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Agents Online",   val: live.loading?"…":onlineAgents,              color:T.green },
          { label:"Tasks This Week",  val: live.stats?.tasks_this_week ?? TASKS.length, color:T.blueLight },
          { label:"Contracts Found",  val: live.loading?"…":contractCount,             color:T.amber },
          { label:"Systems Active",   val: live.stats?.systems_active ?? 3,             color:T.purple },
        ].map(s=>(
          <Card key={s.label} style={{ padding:"16px 18px" }}>
            <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>{s.label.toUpperCase()}</p>
            <p style={{ fontSize:28, fontWeight:700, color:s.color, fontFamily:"'Geist Mono', monospace", letterSpacing:"-0.02em" }}>{s.val}</p>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, marginBottom:24 }}>
        {(live.agents.length ? live.agents : AGENTS).map((a,i)=>{
          const isLive = !!live.agents.length;
          const statusColor = a.status==="online" ? T.green : T.red;
          return (
            <Card key={a.id||a.name} style={{ padding:20 }}>
              <div style={{ display:"flex", gap:14, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${statusColor}18`, border:`1.5px solid ${statusColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:statusColor, fontFamily:"'Geist Mono',monospace" }}>{(a.name||"A").slice(0,2).toUpperCase()}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:T.textPrimary }}>{a.name}</span>
                    <Dot color={statusColor} pulse={a.status==="online"} />
                    <span style={{ fontSize:9, fontFamily:"'Geist Mono',monospace", color:statusColor, letterSpacing:"0.1em" }}>{(a.status||"offline").toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize:12, color:T.textSecondary }}>{a.role}</p>
                </div>
              </div>
              {isLive && a.last_seen && <p style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono',monospace", marginBottom:8 }}>Last seen: {new Date(a.last_seen).toLocaleTimeString()}</p>}
              {!isLive && <><p style={{ fontSize:12, color:T.textMuted, lineHeight:1.65, marginBottom:12 }}>{a.description}</p><div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>{a.skills?.map(s=><Tag key={s} color={a.color}>{s}</Tag>)}</div></>}
            </Card>
          );
        })}
      </div>

      <div>
        <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:14, fontFamily:"'Geist Mono', monospace" }}>RECENT ACTIVITY</p>
        <Card style={{ padding:0, overflow:"hidden" }}>
          {(live.activity.length ? live.activity : MEMORY_ENTRIES.slice(0,4)).map((e,i,arr)=>(
            <div key={e.id} className="row-item" style={{ display:"flex", gap:14, padding:"14px 18px", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, marginTop:5, background:e.type==="error"?T.red:T.green, boxShadow:`0 0 6px ${e.type==="error"?T.red:T.green}` }} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{e.title||e.message?.slice(0,60)||"Activity"}</span>
                  <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{e.time || new Date(e.created_at).toLocaleTimeString()}</span>
                </div>
                <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.5 }}>{e.body||e.message||""}</p>
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
const CHANNELS_DATA = [
  { id:"general", label:"general",  desc:"All agents · team-wide", icon:"◈" },
  { id:"zoriya",  label:"zoriya",   desc:"Chief Operations Agent", icon:"◎" },
  { id:"vector",  label:"vector",   desc:"Contract Intelligence",  icon:"◆" },
  { id:"ops",     label:"ops",      desc:"Operations & system updates", icon:"◧" },
];

const AGENT_RESPONSES = {
  general:[
    { from:"Zoriya", text:"Understood. I'll prioritize that and update the task queue. You'll have a status report in the next cycle." },
    { from:"Vector", text:"On it. I'll run a targeted scan and surface the most relevant matches for you." },
    { from:"Zoriya", text:"Got it. Delegating now and logging this to memory. I'll flag anything that needs your attention." },
    { from:"Vector", text:"Noted. I'll add that to the next contract batch and refine the scoring criteria accordingly." },
  ],
  zoriya:[
    { from:"Zoriya", text:"Understood. I'll handle this immediately and log it to memory." },
    { from:"Zoriya", text:"Task received. Delegating to the right workflow now — I'll report back shortly." },
    { from:"Zoriya", text:"Confirmed. Running the check now. I'll flag anything that looks off." },
    { from:"Zoriya", text:"On it. I've updated the priority queue. Estimated completion next cycle." },
  ],
  vector:[
    { from:"Vector", text:"Running that search now. Results will be in the next Contract Finds report." },
    { from:"Vector", text:"Acknowledged. I'll refine the scoring criteria and reprocess today's batch." },
    { from:"Vector", text:"Noted — added to the research queue. I'll flag the top matches when I surface them." },
    { from:"Vector", text:"On it. Cross-referencing with NAICS codes and agency spending patterns now." },
  ],
  ops:[
    { from:"Zoriya", text:"Operations update logged. All pipelines nominal." },
    { from:"Vector", text:"Scan pipeline running on schedule. No anomalies detected." },
  ],
};

function MeetingView() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [channel, setChannel] = useState("general");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const msgId = useRef(10);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages, isTyping]);

  const send = () => {
    if(!input.trim()) return;
    const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    setMessages(prev=>[...prev,{ id:++msgId.current, from:"You", text:input.trim(), time:now, type:"user", channel }]);
    setInput("");
    setIsTyping(true);
    setTimeout(()=>{
      setIsTyping(false);
      const pool = AGENT_RESPONSES[channel]||AGENT_RESPONSES.general;
      const resp = pool[Math.floor(Math.random()*pool.length)];
      setMessages(prev=>[...prev,{ id:++msgId.current, from:resp.from, text:resp.text, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), type:"agent", channel }]);
    }, 1200+Math.random()*900);
  };

  const handleKey = e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };

  const channelMsgs = messages.filter(m=>
    channel==="general" || m.from.toLowerCase()===channel || m.type==="user"
  );

  const activeCh = CHANNELS_DATA.find(c=>c.id===channel);

  return (
    <div style={{ height:"calc(100vh - 52px)", display:"flex", overflow:"hidden", animation:"fadeUp .3s ease" }}>

      {/* ── Left sidebar ── */}
      <div style={{ width:220, flexShrink:0, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", background:T.surface, padding:"20px 0" }}>
        {/* Workspace header */}
        <div style={{ padding:"0 16px 16px", borderBottom:`1px solid ${T.border}`, marginBottom:16 }}>
          <p style={{ fontSize:12, fontWeight:700, color:T.textPrimary, letterSpacing:"0.02em" }}>ZORIYA AI</p>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:T.green, boxShadow:`0 0 6px ${T.green}` }} />
            <p style={{ fontSize:10, color:T.green, fontFamily:"'Geist Mono', monospace" }}>2 agents online</p>
          </div>
        </div>

        {/* Channels */}
        <div style={{ padding:"0 10px", marginBottom:20 }}>
          <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.14em", marginBottom:8, paddingLeft:6, fontFamily:"'Geist Mono', monospace" }}>CHANNELS</p>
          {CHANNELS_DATA.map(ch=>{
            const active = channel===ch.id;
            return (
              <button key={ch.id} onClick={()=>setChannel(ch.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:7, marginBottom:1, background:active?T.blueDim:"transparent", border:`1px solid ${active?T.blue+"44":"transparent"}`, cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontSize:12, color:active?T.blueLight:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>#</span>
                <span style={{ fontSize:13, color:active?T.blueLight:T.textSecondary, fontWeight:active?600:400, fontFamily:"'Outfit', sans-serif" }}>{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* Direct — agents */}
        <div style={{ padding:"0 10px" }}>
          <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.14em", marginBottom:8, paddingLeft:6, fontFamily:"'Geist Mono', monospace" }}>DIRECT</p>
          {AGENTS.map(a=>(
            <button key={a.id} onClick={()=>setChannel(a.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:7, marginBottom:1, background:channel===a.id?T.blueDim:"transparent", border:`1px solid ${channel===a.id?T.blue+"44":"transparent"}`, cursor:"pointer", textAlign:"left" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:a.color, boxShadow:`0 0 5px ${a.color}`, flexShrink:0 }} />
              <span style={{ fontSize:13, color:channel===a.id?T.blueLight:T.textSecondary, fontWeight:channel===a.id?600:400, fontFamily:"'Outfit', sans-serif", flex:1 }}>{a.name}</span>
              <span style={{ fontSize:9, color:a.color, fontFamily:"'Geist Mono', monospace" }}>●</span>
            </button>
          ))}
          {/* You */}
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:T.blueLight, flexShrink:0 }} />
            <span style={{ fontSize:13, color:T.blueLight, fontWeight:600, fontFamily:"'Outfit', sans-serif" }}>You</span>
          </div>
        </div>
      </div>

      {/* ── Main chat area ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Channel topbar */}
        <div style={{ height:52, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:10, flexShrink:0, background:T.surface+"99", backdropFilter:"blur(8px)" }}>
          <span style={{ fontSize:15, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>#</span>
          <span style={{ fontSize:14, fontWeight:700, color:T.textPrimary }}>{activeCh?.label}</span>
          <div style={{ width:1, height:16, background:T.border, margin:"0 4px" }} />
          <span style={{ fontSize:12, color:T.textMuted }}>{activeCh?.desc}</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            {AGENTS.map(a=>(
              <div key={a.id} style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, background:a.color+"10", border:`1px solid ${a.color}25` }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:a.color, boxShadow:`0 0 5px ${a.color}` }} />
                <span style={{ fontSize:10, color:a.color, fontWeight:600, fontFamily:"'Geist Mono', monospace" }}>{a.initials}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 24px 8px" }}>
          {/* Date divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:T.border }} />
            <span style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", fontFamily:"'Geist Mono', monospace", padding:"2px 10px", border:`1px solid ${T.border}`, borderRadius:10 }}>TODAY</span>
            <div style={{ flex:1, height:1, background:T.border }} />
          </div>

          {channelMsgs.map((msg,i)=>{
            const isUser = msg.type==="user";
            const agent = AGENTS.find(a=>a.name===msg.from);
            const prevSame = i>0 && channelMsgs[i-1].from===msg.from;
            const senderColor = isUser?T.blueLight:(agent?.color??T.textPrimary);

            return (
              <div key={msg.id} className="msg-bubble" style={{ display:"flex", gap:12, marginBottom:prevSame?3:14, paddingLeft:isUser?0:0 }}>
                {/* Avatar column */}
                <div style={{ width:36, flexShrink:0, display:"flex", justifyContent:"center", paddingTop:2 }}>
                  {!prevSame ? (
                    isUser ? (
                      <div style={{ width:34, height:34, borderRadius:10, background:`${T.blue}28`, border:`1.5px solid ${T.blue}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:T.blueLight, fontFamily:"'Geist Mono', monospace" }}>YOU</div>
                    ) : agent ? <AgentAvatar agent={agent} size={34} /> : null
                  ) : null}
                </div>

                {/* Bubble */}
                <div style={{ flex:1, maxWidth:680 }}>
                  {!prevSame && (
                    <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:5 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:senderColor }}>{msg.from}</span>
                      <span style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{msg.time}</span>
                    </div>
                  )}
                  <div style={{
                    display:"inline-block", padding:"10px 14px",
                    borderRadius: prevSame ? 10 : isUser ? "3px 12px 12px 12px" : "12px 12px 12px 3px",
                    background: isUser ? `linear-gradient(135deg, ${T.blue}20, ${T.blue}12)` : "rgba(255,255,255,0.04)",
                    border:`1px solid ${isUser?T.blue+"35":T.border}`,
                    fontSize:13, color:T.textPrimary, lineHeight:1.6,
                    maxWidth:"100%",
                  }}>{msg.text}</div>
                </div>
              </div>
            );
          })}

          {/* Typing */}
          {isTyping && (
            <div style={{ display:"flex", gap:12, marginBottom:14, animation:"fadeIn .25s ease" }}>
              <div style={{ width:36, flexShrink:0, display:"flex", justifyContent:"center", paddingTop:2 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:`${T.green}20`, border:`1.5px solid ${T.green}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>
                  {channel==="vector"?"VC":"ZA"}
                </div>
              </div>
              <div>
                <div style={{ fontSize:11, color:T.textMuted, marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>typing…</div>
                <div style={{ padding:"12px 16px", borderRadius:"12px 12px 12px 3px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, display:"flex", gap:5, alignItems:"center" }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:T.textMuted, animation:`typingDot 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding:"12px 24px 20px", flexShrink:0 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-end", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.borderHi}`, borderRadius:12, padding:"10px 14px" }}>
            <textarea
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message #${activeCh?.label ?? "general"} …`}
              rows={1}
              style={{ flex:1, background:"transparent", border:"none", color:T.textPrimary, fontSize:13, outline:"none", lineHeight:1.55, maxHeight:120, overflowY:"auto", paddingTop:2 }}
            />
            <button onClick={send} style={{ padding:"7px 16px", borderRadius:8, background:T.blue, border:"none", color:"#fff", fontSize:12, fontWeight:600, flexShrink:0, cursor:"pointer", letterSpacing:"0.02em" }}>
              Send
            </button>
          </div>
          <p style={{ fontSize:9, color:T.textMuted, marginTop:7, fontFamily:"'Geist Mono', monospace', paddingLeft:2" }}>↵ send · ⇧↵ new line</p>
        </div>
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

/* ─── THE LAB ────────────────────────────────────────────────────────────── */
const LAB_PROJECTS = [
  {
    id:1, name:"Mission Control", type:"Web App", status:"Live", tag:"Internal",
    desc:"ZORIYA AI's own operations dashboard. Built with React, deployed on Vercel. The dashboard you're looking at right now.",
    tech:["React","Vercel","Recharts"], url:"#", color:T.blueLight, lastUpdated:"Today",
    preview:"dashboard",
  },
  {
    id:2, name:"Contract Intelligence API", type:"API / Backend", status:"In Dev", tag:"Core",
    desc:"Vector's contract scanning engine exposed as a REST API. Accepts agency filters, returns scored and categorized opportunities.",
    tech:["Node.js","Python","OpenClaw"], url:"#", color:T.green, lastUpdated:"2 days ago",
    preview:"api",
  },
  {
    id:3, name:"AI Readiness Scorecard", type:"Web Tool", status:"Prototype", tag:"Product",
    desc:"10-minute assessment tool that scores a business's AI readiness across 6 dimensions and outputs a personalized report. Lead gen machine.",
    tech:["React","Claude API","PDF Export"], url:"#", color:T.amber, lastUpdated:"3 days ago",
    preview:"tool",
  },
  {
    id:4, name:"RFP Auto-Responder", type:"AI Agent", status:"Concept", tag:"GovCon",
    desc:"Ingests a federal RFP document and auto-generates a compliant proposal draft using contract history and company capabilities.",
    tech:["Claude API","Vector","Python"], url:"#", color:T.purple, lastUpdated:"1 week ago",
    preview:"agent",
  },
  {
    id:5, name:"Weekly Opportunity Digest", type:"Newsletter", status:"Prototype", tag:"Content",
    desc:"Auto-generated weekly email digest packaging Vector's contract finds + AI broker picks into a clean, branded newsletter.",
    tech:["Node.js","Resend","Handlebars"], url:"#", color:"#EC4899", lastUpdated:"4 days ago",
    preview:"newsletter",
  },
  {
    id:6, name:"Zoriya Chrome Extension", type:"Browser Extension", status:"Concept", tag:"Product",
    desc:"One-click access to Zoriya from any webpage. Highlight text to research, draft emails, summarize pages, or log leads directly from the browser.",
    tech:["Chrome API","React","Claude"], url:"#", color:T.red, lastUpdated:"5 days ago",
    preview:"extension",
  },
];

const STATUS_CLR = s => s==="Live"?T.green:s==="In Dev"?T.blueLight:s==="Prototype"?T.amber:T.textMuted;

function PreviewCard({ type, color }) {
  const styles = { width:"100%", height:80, borderRadius:8, background:`${color}08`, border:`1px solid ${color}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, overflow:"hidden", position:"relative" };
  const previews = {
    dashboard: (
      <div style={styles}>
        <div style={{ display:"flex", gap:4, padding:"0 12px", width:"100%" }}>
          {[40,65,50,75,45].map((h,i)=><div key={i} style={{ flex:1, height:h*0.6, background:color, opacity:0.3+i*0.1, borderRadius:"3px 3px 0 0", alignSelf:"flex-end" }} />)}
        </div>
      </div>
    ),
    api: (
      <div style={{ ...styles, flexDirection:"column", gap:5, padding:10 }}>
        {["GET  /contracts","POST /scan","GET  /leads"].map((l,i)=><div key={i} style={{ fontSize:9, color:color, fontFamily:"'Geist Mono', monospace", opacity:0.5+i*0.2, alignSelf:"flex-start", paddingLeft:8 }}>{l}</div>)}
      </div>
    ),
    tool: (
      <div style={{ ...styles, flexDirection:"column", gap:6, padding:14 }}>
        {[70,85,55,90].map((w,i)=><div key={i} style={{ height:4, width:`${w}%`, background:color, opacity:0.25+i*0.15, borderRadius:2 }} />)}
      </div>
    ),
    agent: (
      <div style={{ ...styles, gap:8 }}>
        {["◈","→","◆","→","◎"].map((s,i)=><span key={i} style={{ fontSize:i%2?10:14, color:color, opacity:i%2?0.3:0.7, fontFamily:"'Geist Mono', monospace" }}>{s}</span>)}
      </div>
    ),
    newsletter: (
      <div style={{ ...styles, flexDirection:"column", gap:4, padding:"10px 14px" }}>
        <div style={{ height:5, width:"60%", background:color, opacity:0.5, borderRadius:2 }} />
        <div style={{ height:3, width:"90%", background:color, opacity:0.2, borderRadius:2 }} />
        <div style={{ height:3, width:"80%", background:color, opacity:0.2, borderRadius:2 }} />
        <div style={{ height:3, width:"70%", background:color, opacity:0.2, borderRadius:2 }} />
      </div>
    ),
    extension: (
      <div style={{ ...styles, gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:`${color}25`, border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color }}>Z</div>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {[50,35].map((w,i)=><div key={i} style={{ height:3, width:w, background:color, opacity:0.3, borderRadius:2 }} />)}
        </div>
      </div>
    ),
  };
  return previews[type] || <div style={styles} />;
}

function LabView() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const types = ["All",...Array.from(new Set(LAB_PROJECTS.map(p=>p.type)))];
  const filtered = filter==="All"?LAB_PROJECTS:LAB_PROJECTS.filter(p=>p.type===filter);

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22 }}>
        <div>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>ZORIYA AI · DEV WORKSPACE</p>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>The Lab</h1>
          <p style={{ fontSize:13, color:T.textSecondary, marginTop:5 }}>Projects, demos, prototypes and experiments built by ZORIYA AI.</p>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {[{l:"Projects",v:LAB_PROJECTS.length},{l:"Live",v:LAB_PROJECTS.filter(p=>p.status==="Live").length},{l:"In Dev",v:LAB_PROJECTS.filter(p=>p.status==="In Dev").length}].map(s=>(
            <div key={s.l} style={{ textAlign:"right" }}>
              <p style={{ fontSize:22, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{s.v}</p>
              <p style={{ fontSize:10, color:T.textMuted, marginTop:3 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div style={{ display:"flex", gap:6, marginBottom:24, flexWrap:"wrap" }}>
        {types.map(t=>(
          <button key={t} className="btn" onClick={()=>setFilter(t)} style={{ padding:"6px 14px", borderRadius:8, fontSize:12, background:filter===t?T.blueDim:"rgba(255,255,255,0.04)", border:`1px solid ${filter===t?T.blue+"55":T.border}`, color:filter===t?T.blueLight:T.textSecondary }}>
            {t}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {filtered.map(p=>(
          <Card key={p.id} className="card" onClick={()=>setSelected(selected?.id===p.id?null:p)} style={{ padding:18, cursor:"pointer", border:selected?.id===p.id?`1px solid ${p.color}44`:undefined, background:selected?.id===p.id?p.color+"06":undefined }}>
            <PreviewCard type={p.preview} color={p.color} />
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:8 }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.01em" }}>{p.name}</h3>
              <Tag color={STATUS_CLR(p.status)}>{p.status}</Tag>
            </div>
            <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.6, marginBottom:12 }}>{p.desc.slice(0,90)}…</p>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
              {p.tech.map(t=>(
                <span key={t} style={{ fontSize:9, padding:"2px 7px", borderRadius:4, background:"rgba(255,255,255,0.05)", border:`1px solid ${T.border}`, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{t}</span>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${T.border}`, paddingTop:10 }}>
              <Tag color={p.color}>{p.tag}</Tag>
              <span style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>Updated {p.lastUpdated}</span>
            </div>
          </Card>
        ))}

        {/* Add new project slot */}
        <div style={{ border:`1px dashed rgba(255,255,255,0.08)`, borderRadius:12, padding:18, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, minHeight:200, cursor:"pointer", transition:"border-color .15s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
          <div style={{ width:40, height:40, borderRadius:10, border:`1px dashed rgba(255,255,255,0.15)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:T.textMuted }}>+</div>
          <p style={{ fontSize:13, color:T.textMuted, fontWeight:500 }}>New Project</p>
          <p style={{ fontSize:11, color:T.textMuted, opacity:0.6, textAlign:"center" }}>Add a demo, prototype, or experiment to the lab</p>
        </div>
      </div>

      {/* Expanded detail drawer */}
      {selected && (
        <div style={{ marginTop:20, animation:"fadeUp .2s ease" }}>
          <Card style={{ padding:24 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <h2 style={{ fontSize:20, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.01em" }}>{selected.name}</h2>
                  <Tag color={STATUS_CLR(selected.status)}>{selected.status}</Tag>
                  <Tag color={selected.color}>{selected.tag}</Tag>
                </div>
                <p style={{ fontSize:12, color:T.textMuted, marginBottom:14, fontFamily:"'Geist Mono', monospace" }}>{selected.type} · Updated {selected.lastUpdated}</p>
                <p style={{ fontSize:14, color:T.textSecondary, lineHeight:1.75, marginBottom:18 }}>{selected.desc}</p>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {selected.tech.map(t=>(
                    <span key={t} style={{ fontSize:10, padding:"3px 9px", borderRadius:5, background:"rgba(255,255,255,0.05)", border:`1px solid ${T.border}`, color:T.textSecondary, fontFamily:"'Geist Mono', monospace" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ flex:1, padding:"10px 0", borderRadius:10, background:selected.color, border:"none", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", opacity:selected.status==="Live"?1:0.5 }}>
                  {selected.status==="Live"?"Open Demo":"Coming Soon"}
                </button>
                <button style={{ padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:`1px solid ${T.border}`, color:T.textSecondary, fontSize:13, cursor:"pointer" }}>
                  View Code
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ─── BETTER MADE STORE — E-COMMERCE HUB ────────────────────────────────── */

const EC_PINK   = "#EC4899";
const EC_CORAL  = "#F97316";
const EC_TEAL   = "#14B8A6";

const STORE_STATS = [
  { label:"Monthly Revenue",  val:"$12,840",  change:"+18%",  up:true,  color:T.green },
  { label:"Orders This Month",val:"347",       change:"+24%",  up:true,  color:T.blueLight },
  { label:"Avg Order Value",  val:"$37.00",    change:"+4%",   up:true,  color:EC_TEAL },
  { label:"Ad Spend",         val:"$1,920",    change:"-8%",   up:false, color:T.amber },
  { label:"ROAS",             val:"6.7×",      change:"+0.8×", up:true,  color:T.green },
  { label:"Conversion Rate",  val:"3.2%",      change:"+0.4%", up:true,  color:EC_PINK },
];

const PRODUCTS = [
  { id:1, name:"Bamboo Cutting Board Set", sku:"BMB-001", cogs:8.40,  price:34.99, inventory:214, sales:89,  status:"Active",  image:"🪵", category:"Kitchen",    trend:"rising",   aria_note:"Top converter this week. Consider bundling with knife set." },
  { id:2, name:"Ceramic Pour-Over Coffee Set", sku:"CPO-002", cogs:12.50, price:49.99, inventory:88,  sales:62,  status:"Active",  image:"☕", category:"Kitchen",    trend:"hot",      aria_note:"Trending on TikTok. Increase ad budget 20% this week." },
  { id:3, name:"Linen Kitchen Towel 3-Pack", sku:"LKT-003", cogs:4.20,  price:18.99, inventory:430, sales:134, status:"Active",  image:"🧺", category:"Kitchen",    trend:"steady",   aria_note:"High volume, reliable margin. Good upsell candidate." },
  { id:4, name:"Stainless Steel Spice Rack", sku:"SSR-004", cogs:11.00, price:39.99, inventory:52,  sales:28,  status:"Active",  image:"🧂", category:"Kitchen",    trend:"slow",     aria_note:"Slow mover. Test new hero image and lifestyle shot." },
  { id:5, name:"Beeswax Food Wraps Set",   sku:"BWX-005", cogs:5.80,  price:24.99, inventory:167, sales:71,  status:"Active",  image:"🍯", category:"Eco",        trend:"rising",   aria_note:"Eco niche growing fast. Great candidate for green campaign." },
  { id:6, name:"Silicone Stretch Lids 6pk",sku:"SSL-006", cogs:3.10,  price:14.99, inventory:0,   sales:0,   status:"Restocking",image:"🫙",category:"Kitchen",    trend:"hot",      aria_note:"Out of stock — costing sales. Reorder immediately." },
];

const TRENDS = [
  { id:1, name:"Aesthetic Kitchen Organizers", score:94, velocity:"↑↑", competition:"Medium", demand:"Very High", platform:"TikTok + Pinterest", category:"Kitchen", cogs_est:"$6–14", sell_est:"$28–55", margin_est:"65–75%", aria_note:"'Clean kitchen aesthetic' has 2.1B TikTok views. Bamboo, white ceramic, and neutral tones dominate. Perfect fit for Better Made.", tags:["Trending","TikTok","High Margin"] },
  { id:2, name:"Eco-Friendly Food Storage", score:91, velocity:"↑↑", competition:"Low",    demand:"High",      platform:"Instagram + Pinterest", category:"Eco", cogs_est:"$4–10", sell_est:"$22–45", margin_est:"68–78%", aria_note:"Sustainability content up 340% YoY. Beeswax wraps, glass containers, silicone bags. Low competition window still open.", tags:["Eco","Instagram","Low Competition"] },
  { id:3, name:"Coffee Bar Accessories", score:88, velocity:"↑",  competition:"Medium", demand:"Very High", platform:"TikTok + YouTube",      category:"Coffee", cogs_est:"$8–18", sell_est:"$35–75", margin_est:"60–70%", aria_note:"Home coffee culture exploding post-2024. Pour-over, aeropress accessories, and coffee storage doing huge numbers.", tags:["Trending","Coffee","Lifestyle"] },
  { id:4, name:"Minimalist Desk Organization", score:84, velocity:"↑",  competition:"High",   demand:"High",      platform:"Pinterest + YouTube",   category:"Home Office", cogs_est:"$7–15", sell_est:"$30–60", margin_est:"58–68%", aria_note:"WFH aesthetic content still dominant. Cable management, desk trays, and monitor risers are consistent performers.", tags:["WFH","Pinterest","Steady"] },
  { id:5, name:"Herb & Garden Starter Kits", score:79, velocity:"→",  competition:"Low",    demand:"Medium",    platform:"TikTok + Instagram",    category:"Garden", cogs_est:"$5–12", sell_est:"$24–48", margin_est:"62–72%", aria_note:"Spring seasonality approaching. Indoor herb kits and grow-your-own content spikes Feb–May every year.", tags:["Seasonal","Spring","Niche"] },
];

const CAMPAIGNS = [
  { id:1, product:"Ceramic Pour-Over Coffee Set", type:"UGC Video Ad", platform:"TikTok", status:"Ready", budget:"$400/wk", hook:"POV: Your morning coffee routine just got an upgrade ☕", angle:"Lifestyle / Morning routine aesthetic", cta:"Shop the set — link in bio", aria_strategy:"Target 25–40F, interest in coffee, home décor, minimalism. Run 3 creative variants. Hook test first 3 days then scale winner.", assets:["Product video (15s)","Lifestyle b-roll","Voiceover script"] },
  { id:2, product:"Bamboo Cutting Board Set", type:"Carousel Ad",   platform:"Instagram", status:"Draft", budget:"$250/wk", hook:"The last cutting board you'll ever need.", angle:"Quality / craftsmanship", cta:"Shop now — free shipping", aria_strategy:"Retargeting warm audiences from website visitors. Carousel: product → lifestyle → reviews → CTA. Pair with email sequence.", assets:["5 product photos","2 lifestyle images","Review screenshots"] },
  { id:3, product:"Beeswax Food Wraps Set",    type:"Organic Post",  platform:"Pinterest", status:"Scheduled", budget:"—", hook:"Ditch the plastic wrap for good 🌿", angle:"Eco / sustainability", cta:"Save this for later", aria_strategy:"SEO-optimized pins targeting 'eco kitchen' and 'sustainable food storage'. Link to product page. Board: Eco Kitchen Essentials.", assets:["3 styled flat lays","Infographic"] },
];

const AI_TOOLS = [
  { id:1, label:"Generate Product Images",   icon:"🖼",  desc:"Create lifestyle and hero shots for any product",   type:"image",   status:"ready" },
  { id:2, label:"Generate Ad Video Script",  icon:"🎬",  desc:"Write TikTok/Reels scripts with hooks and CTAs",     type:"script",  status:"ready" },
  { id:3, label:"Create Marketing Copy",     icon:"✍️",  desc:"Headlines, descriptions, email sequences",           type:"copy",    status:"ready" },
  { id:4, label:"Build Campaign Brief",      icon:"📋",  desc:"Full campaign strategy from product and goal",       type:"brief",   status:"ready" },
  { id:5, label:"Generate Video Ad Concept", icon:"🎥",  desc:"Storyboard and concept for video ad creative",       type:"video",   status:"coming" },
  { id:6, label:"Trend Report",              icon:"📊",  desc:"Deep-dive report on any product niche",              type:"report",  status:"ready" },
];

function MarginBadge({ cogs, price }) {
  const margin = Math.round(((price - cogs) / price) * 100);
  const color = margin >= 70 ? T.green : margin >= 55 ? T.blueLight : T.amber;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:46, height:46, borderRadius:10, background:`${color}12`, border:`1px solid ${color}28`, flexShrink:0 }}>
      <span style={{ fontSize:13, fontWeight:700, color, fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{margin}%</span>
      <span style={{ fontSize:8, color:T.textMuted }}>MARGIN</span>
    </div>
  );
}

function TrendBar({ score }) {
  const color = score>=90?T.green:score>=80?T.blueLight:score>=70?T.amber:T.textMuted;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:4, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score}%`, background:color, borderRadius:2, transition:"width .6s ease" }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, color, fontFamily:"'Geist Mono', monospace", minWidth:24 }}>{score}</span>
    </div>
  );
}

function EcommerceView() {
  const [sub, setSub] = useState("overview");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [generatingTool, setGeneratingTool] = useState(null);
  const [generatedContent, setGeneratedContent] = useState({});

  const SUBS = [
    { id:"overview",  label:"Overview" },
    { id:"trends",    label:"Trend Intel" },
    { id:"products",  label:"Products" },
    { id:"campaigns", label:"Campaign Studio" },
    { id:"analytics", label:"Analytics" },
  ];

  const handleGenerate = (tool) => {
    setGeneratingTool(tool.id);
    setTimeout(() => {
      setGeneratingTool(null);
      setGeneratedContent(prev => ({...prev, [tool.id]: true}));
    }, 2000);
  };

  const agentColor = EC_PINK;

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>E-COMMERCE · POWERED BY ARIA</p>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>E-Commerce Hub</h1>
        </div>
        {/* Aria agent chip */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:10, background:`${EC_PINK}10`, border:`1px solid ${EC_PINK}28` }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`${EC_PINK}22`, border:`1.5px solid ${EC_PINK}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:EC_PINK, fontFamily:"'Geist Mono', monospace" }}>AR</div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:13, fontWeight:700, color:T.textPrimary }}>Aria</span>
              <Dot color={EC_PINK} pulse />
            </div>
            <span style={{ fontSize:10, color:T.textMuted }}>E-Commerce Intelligence Agent</span>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ display:"flex", gap:2, marginBottom:24, borderBottom:`1px solid ${T.border}`, paddingBottom:0 }}>
        {SUBS.map(s=>(
          <button key={s.id} onClick={()=>setSub(s.id)} style={{ padding:"9px 16px", background:"transparent", border:"none", borderBottom:`2px solid ${sub===s.id?EC_PINK:"transparent"}`, color:sub===s.id?T.textPrimary:T.textSecondary, fontSize:13, fontWeight:sub===s.id?600:400, cursor:"pointer", fontFamily:"'Outfit', sans-serif", marginBottom:-1, transition:"all .15s" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {sub==="overview" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          {/* Stats grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:24 }}>
            {STORE_STATS.map(s=>(
              <Card key={s.label} style={{ padding:"14px 16px" }}>
                <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>{s.label.toUpperCase()}</p>
                <p style={{ fontSize:20, fontWeight:700, color:s.color, fontFamily:"'Geist Mono', monospace", lineHeight:1, marginBottom:4 }}>{s.val}</p>
                <p style={{ fontSize:10, color:s.up?T.green:T.red, fontFamily:"'Geist Mono', monospace" }}>{s.change} vs last month</p>
              </Card>
            ))}
          </div>

          {/* Revenue chart placeholder + Aria feed */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, marginBottom:20 }}>
            <Card style={{ padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>Revenue — Last 30 Days</p>
                <Tag color={T.green}>+18% MoM</Tag>
              </div>
              {/* SVG chart */}
              <svg width="100%" height="120" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={EC_PINK} stopOpacity="0.25"/>
                    <stop offset="100%" stopColor={EC_PINK} stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {(() => {
                  const vals = [280,320,295,340,380,360,420,400,450,430,480,460,510,490,540,520,560,580,550,600,580,620,640,610,660,680,650,700,720,750];
                  const min=Math.min(...vals), max=Math.max(...vals);
                  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*398},${118-((v-min)/(max-min))*108}`).join(" ");
                  const area = `0,120 ${pts} 398,120`;
                  return <>
                    <polygon points={area} fill="url(#revGrad)"/>
                    <polyline points={pts} fill="none" stroke={EC_PINK} strokeWidth="2" strokeLinejoin="round"/>
                  </>;
                })()}
              </svg>
            </Card>

            {/* Aria activity */}
            <Card style={{ padding:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <Dot color={EC_PINK} pulse />
                <span style={{ fontSize:12, fontWeight:600, color:T.textPrimary }}>Aria's Latest Insights</span>
              </div>
              {[
                { text:"Ceramic Pour-Over trending +340% on TikTok this week. Recommend 20% budget increase.", time:"2h ago", urgent:true },
                { text:"Silicone Stretch Lids are out of stock — estimated $420 in lost daily revenue. Reorder now.", time:"4h ago", urgent:true },
                { text:"Eco-friendly food storage niche showing low competition window. New product opportunity.", time:"8h ago", urgent:false },
                { text:"Spring seasonal trend window opens in 3 weeks. Herb kit campaign brief is ready.", time:"Yesterday", urgent:false },
              ].map((n,i)=>(
                <div key={i} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:i<3?`1px solid ${T.border}`:"none" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:n.urgent?EC_PINK:T.textMuted, marginTop:4, flexShrink:0, boxShadow:n.urgent?`0 0 6px ${EC_PINK}`:undefined }} />
                  <div>
                    <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.55, marginBottom:3 }}>{n.text}</p>
                    <p style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Top products quick view */}
          <Card style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>Top Products</p>
              <button onClick={()=>setSub("products")} style={{ fontSize:11, color:T.blueLight, background:"none", border:"none", cursor:"pointer" }}>View all →</button>
            </div>
            {PRODUCTS.slice(0,4).map((p,i)=>(
              <div key={p.id} className="row-item" style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px", borderBottom:i<3?`1px solid ${T.border}`:"none" }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{p.image}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{p.name}</p>
                  <p style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{p.sku}</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:13, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>${p.price}</p>
                  <p style={{ fontSize:10, color:T.textMuted }}>COGS ${p.cogs}</p>
                </div>
                <div style={{ width:60, textAlign:"right" }}>
                  <p style={{ fontSize:13, fontWeight:700, color:T.blueLight, fontFamily:"'Geist Mono', monospace" }}>{p.sales}</p>
                  <p style={{ fontSize:10, color:T.textMuted }}>sold</p>
                </div>
                <Tag color={p.trend==="hot"?EC_PINK:p.trend==="rising"?T.green:T.textMuted}>{p.trend}</Tag>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── TREND INTEL ── */}
      {sub==="trends" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:10, background:`${EC_PINK}08`, border:`1px solid ${EC_PINK}20`, marginBottom:20 }}>
            <Dot color={EC_PINK} pulse />
            <p style={{ fontSize:12, color:T.textSecondary }}>Aria scans TikTok, Pinterest, Amazon Best Sellers, Google Trends, and Etsy daily to surface high-potential opportunities for Better Made.</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:16 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {TRENDS.map(t=>(
                <Card key={t.id} className="card" onClick={()=>setSelectedTrend(selectedTrend?.id===t.id?null:t)} style={{ padding:18, cursor:"pointer", border:selectedTrend?.id===t.id?`1px solid ${EC_PINK}44`:undefined }}>
                  <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ fontSize:14, fontWeight:700, color:T.textPrimary }}>{t.name}</span>
                        <span style={{ fontSize:16 }}>{t.velocity}</span>
                        <Tag color={t.competition==="Low"?T.green:t.competition==="Medium"?T.amber:T.red}>{t.competition} competition</Tag>
                        <Tag color={T.blueLight}>{t.platform}</Tag>
                      </div>
                      <div style={{ marginBottom:10 }}><TrendBar score={t.score} /></div>
                      <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.6, marginBottom:10 }}>{t.aria_note}</p>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                        {[{l:"Est. COGS",v:t.cogs_est},{l:"Sell Price",v:t.sell_est},{l:"Est. Margin",v:t.margin_est}].map(m=>(
                          <div key={m.l} style={{ padding:"8px 10px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                            <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.08em", marginBottom:3, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                            <p style={{ fontSize:12, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{m.v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Detail panel */}
            <div>
              {selectedTrend ? (
                <Card style={{ padding:20, position:"sticky", top:20, animation:"fadeUp .2s ease" }}>
                  <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>ARIA'S FULL ANALYSIS</p>
                  <h3 style={{ fontSize:16, fontWeight:700, color:T.textPrimary, marginBottom:6 }}>{selectedTrend.name}</h3>
                  <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.7, marginBottom:14 }}>{selectedTrend.aria_note}</p>
                  <div style={{ height:1, background:T.border, marginBottom:14 }} />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                    {[{l:"Demand",v:selectedTrend.demand},{l:"Competition",v:selectedTrend.competition},{l:"Category",v:selectedTrend.category},{l:"Platform",v:selectedTrend.platform}].map(m=>(
                      <div key={m.l} style={{ padding:"8px 10px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                        <p style={{ fontSize:9, color:T.textMuted, marginBottom:3, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                        <p style={{ fontSize:12, fontWeight:600, color:T.textPrimary }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                    {selectedTrend.tags.map(t=><Tag key={t} color={EC_PINK}>{t}</Tag>)}
                  </div>
                  <button onClick={()=>setSub("campaigns")} style={{ width:"100%", padding:"10px", borderRadius:10, background:EC_PINK, border:"none", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                    Build Campaign for This →
                  </button>
                </Card>
              ) : (
                <Card style={{ padding:20 }}>
                  <p style={{ fontSize:12, color:T.textMuted, lineHeight:1.6 }}>Select a trend to see Aria's full analysis and build a campaign.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {sub==="products" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          <Card style={{ padding:0, overflow:"hidden", marginBottom:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 70px 80px 80px 80px 80px 100px 120px", gap:0, padding:"10px 18px", borderBottom:`1px solid ${T.border}`, fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", letterSpacing:"0.08em" }}>
              <span>PRODUCT</span><span style={{textAlign:"center"}}>MARGIN</span><span style={{textAlign:"right"}}>COGS</span><span style={{textAlign:"right"}}>PRICE</span><span style={{textAlign:"right"}}>PROFIT</span><span style={{textAlign:"right"}}>STOCK</span><span style={{textAlign:"right"}}>SALES</span><span style={{textAlign:"right"}}>TREND</span>
            </div>
            {PRODUCTS.map((p,i)=>{
              const profit = (p.price - p.cogs).toFixed(2);
              const trendClr = p.trend==="hot"?EC_PINK:p.trend==="rising"?T.green:p.trend==="slow"?T.textMuted:T.amber;
              return (
                <div key={p.id} className="row-item" onClick={()=>setSelectedProduct(selectedProduct?.id===p.id?null:p)} style={{ display:"grid", gridTemplateColumns:"2fr 70px 80px 80px 80px 80px 100px 120px", gap:0, padding:"14px 18px", borderBottom:i<PRODUCTS.length-1?`1px solid ${T.border}`:"none", cursor:"pointer", background:selectedProduct?.id===p.id?`${EC_PINK}08`:undefined, alignItems:"center" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:20 }}>{p.image}</span>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{p.name}</p>
                      <p style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{p.sku}</p>
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"center" }}><MarginBadge cogs={p.cogs} price={p.price} /></div>
                  <p style={{ fontSize:12, color:T.textSecondary, textAlign:"right", fontFamily:"'Geist Mono', monospace" }}>${p.cogs}</p>
                  <p style={{ fontSize:13, fontWeight:700, color:T.textPrimary, textAlign:"right", fontFamily:"'Geist Mono', monospace" }}>${p.price}</p>
                  <p style={{ fontSize:13, fontWeight:700, color:T.green, textAlign:"right", fontFamily:"'Geist Mono', monospace" }}>${profit}</p>
                  <p style={{ fontSize:12, color:p.inventory===0?T.red:T.textSecondary, textAlign:"right", fontFamily:"'Geist Mono', monospace" }}>{p.inventory===0?"OUT":p.inventory}</p>
                  <p style={{ fontSize:13, fontWeight:700, color:T.blueLight, textAlign:"right", fontFamily:"'Geist Mono', monospace" }}>{p.sales}</p>
                  <div style={{ textAlign:"right" }}><Tag color={trendClr}>{p.trend}</Tag></div>
                </div>
              );
            })}
          </Card>

          {/* Selected product detail */}
          {selectedProduct && (
            <Card style={{ padding:22, animation:"fadeUp .2s ease", border:`1px solid ${EC_PINK}28` }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
                <div>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                    <span style={{ fontSize:28 }}>{selectedProduct.image}</span>
                    <div>
                      <p style={{ fontSize:15, fontWeight:700, color:T.textPrimary }}>{selectedProduct.name}</p>
                      <p style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{selectedProduct.sku}</p>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[{l:"Cost of Goods",v:`$${selectedProduct.cogs}`,c:T.amber},{l:"Sell Price",v:`$${selectedProduct.price}`,c:T.textPrimary},{l:"Gross Profit",v:`$${(selectedProduct.price-selectedProduct.cogs).toFixed(2)}`,c:T.green},{l:"Margin",v:`${Math.round(((selectedProduct.price-selectedProduct.cogs)/selectedProduct.price)*100)}%`,c:T.green}].map(m=>(
                      <div key={m.l} style={{ padding:"10px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                        <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.08em", marginBottom:4, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                        <p style={{ fontSize:16, fontWeight:700, color:m.c, fontFamily:"'Geist Mono', monospace" }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:10, fontFamily:"'Geist Mono', monospace" }}>INVENTORY & SALES</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[{l:"In Stock",v:selectedProduct.inventory===0?"OUT OF STOCK":selectedProduct.inventory,c:selectedProduct.inventory===0?T.red:T.textPrimary},{l:"Units Sold",v:selectedProduct.sales,c:T.blueLight},{l:"Category",v:selectedProduct.category,c:T.textPrimary},{l:"Status",v:selectedProduct.status,c:selectedProduct.status==="Active"?T.green:T.amber}].map(m=>(
                      <div key={m.l} style={{ padding:"10px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                        <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.08em", marginBottom:4, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                        <p style={{ fontSize:14, fontWeight:700, color:m.c, fontFamily:"'Geist Mono', monospace" }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:10, fontFamily:"'Geist Mono', monospace" }}>ARIA'S NOTE</p>
                  <div style={{ padding:"12px 14px", borderRadius:10, background:`${EC_PINK}08`, border:`1px solid ${EC_PINK}22` }}>
                    <div style={{ display:"flex", gap:7, marginBottom:8 }}>
                      <Dot color={EC_PINK} />
                      <span style={{ fontSize:11, fontWeight:600, color:EC_PINK }}>Aria</span>
                    </div>
                    <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.65 }}>{selectedProduct.aria_note}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── CAMPAIGN STUDIO ── */}
      {sub==="campaigns" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>
            <div>
              <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:14, fontFamily:"'Geist Mono', monospace" }}>ACTIVE CAMPAIGNS</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
                {CAMPAIGNS.map(c=>(
                  <Card key={c.id} style={{ padding:20 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <p style={{ fontSize:14, fontWeight:700, color:T.textPrimary }}>{c.product}</p>
                          <Tag color={c.status==="Ready"?T.green:c.status==="Draft"?T.amber:T.blueLight}>{c.status}</Tag>
                          <Tag color={T.textMuted}>{c.type}</Tag>
                          <Tag color={T.purple}>{c.platform}</Tag>
                        </div>
                        {c.budget!=="—" && <p style={{ fontSize:11, color:T.textMuted }}>Budget: <span style={{ color:T.textPrimary, fontWeight:600 }}>{c.budget}</span></p>}
                      </div>
                    </div>
                    <div style={{ padding:"10px 14px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}`, marginBottom:10 }}>
                      <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:4, fontFamily:"'Geist Mono', monospace" }}>HOOK</p>
                      <p style={{ fontSize:13, color:T.textPrimary, fontStyle:"italic" }}>"{c.hook}"</p>
                    </div>
                    <div style={{ padding:"10px 14px", borderRadius:8, background:`${EC_PINK}06`, border:`1px solid ${EC_PINK}18`, marginBottom:10 }}>
                      <div style={{ display:"flex", gap:6, marginBottom:4 }}>
                        <Dot color={EC_PINK} />
                        <p style={{ fontSize:9, color:EC_PINK, letterSpacing:"0.1em", fontFamily:"'Geist Mono', monospace" }}>ARIA'S STRATEGY</p>
                      </div>
                      <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.6 }}>{c.aria_strategy}</p>
                    </div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {c.assets.map(a=><span key={a} style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{a}</span>)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Tools panel */}
            <div>
              <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:14, fontFamily:"'Geist Mono', monospace" }}>AI CREATIVE TOOLS</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {AI_TOOLS.map(tool=>(
                  <Card key={tool.id} style={{ padding:14 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span style={{ fontSize:20, flexShrink:0 }}>{tool.icon}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:12, fontWeight:600, color:T.textPrimary, marginBottom:3 }}>{tool.label}</p>
                        <p style={{ fontSize:11, color:T.textMuted, lineHeight:1.5, marginBottom:8 }}>{tool.desc}</p>
                        <button
                          onClick={()=>tool.status==="ready"&&handleGenerate(tool)}
                          style={{ width:"100%", padding:"6px 0", borderRadius:8, background:tool.status==="ready"?(generatedContent[tool.id]?`${T.green}22`:EC_PINK):"rgba(255,255,255,0.05)", border:`1px solid ${tool.status==="ready"?(generatedContent[tool.id]?T.green:EC_PINK)+"44":T.border}`, color:tool.status==="ready"?(generatedContent[tool.id]?T.green:EC_PINK):T.textMuted, fontSize:11, fontWeight:600, cursor:tool.status==="ready"?"pointer":"default", fontFamily:"'Geist Mono', monospace", letterSpacing:"0.04em" }}>
                          {tool.status==="coming"?"COMING SOON":generatingTool===tool.id?"GENERATING...":generatedContent[tool.id]?"✓ GENERATED":"GENERATE"}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {sub==="analytics" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:20 }}>
            {/* Revenue by product */}
            <Card style={{ padding:20 }}>
              <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:16 }}>Revenue by Product</p>
              {PRODUCTS.map(p=>{
                const rev = (p.price * p.sales).toFixed(0);
                const maxRev = Math.max(...PRODUCTS.map(x=>x.price*x.sales));
                const pct = (p.price*p.sales)/maxRev*100;
                return (
                  <div key={p.id} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:12, color:T.textSecondary }}>{p.image} {p.name.split(" ").slice(0,3).join(" ")}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>${Number(rev).toLocaleString()}</span>
                    </div>
                    <div style={{ height:4, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:EC_PINK, borderRadius:2, opacity:0.7+pct*0.003 }} />
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* Margin analysis */}
            <Card style={{ padding:20 }}>
              <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:16 }}>Margin Analysis</p>
              {PRODUCTS.map(p=>{
                const margin = Math.round(((p.price-p.cogs)/p.price)*100);
                const color = margin>=70?T.green:margin>=55?T.blueLight:T.amber;
                return (
                  <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{p.image}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:11, color:T.textSecondary }}>{p.name.split(" ").slice(0,3).join(" ")}</span>
                        <span style={{ fontSize:11, fontWeight:700, color, fontFamily:"'Geist Mono', monospace" }}>{margin}%</span>
                      </div>
                      <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${margin}%`, background:color, borderRadius:2 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          {/* Ad performance + pricing recommender */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <Card style={{ padding:20 }}>
              <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:16 }}>Ad Performance</p>
              {[{label:"Total Ad Spend",val:"$1,920",color:T.amber},{label:"Revenue from Ads",val:"$12,864",color:T.green},{label:"ROAS",val:"6.7×",color:T.green},{label:"Cost Per Purchase",val:"$5.53",color:T.blueLight},{label:"CTR",val:"2.8%",color:T.blueLight},{label:"CPM",val:"$8.40",color:T.textSecondary}].map(m=>(
                <div key={m.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12, color:T.textSecondary }}>{m.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:m.color, fontFamily:"'Geist Mono', monospace" }}>{m.val}</span>
                </div>
              ))}
            </Card>

            <Card style={{ padding:20 }}>
              <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:4 }}>Aria's Pricing Recommendations</p>
              <p style={{ fontSize:11, color:T.textMuted, marginBottom:14 }}>Based on margin targets, competitor pricing, and demand signals.</p>
              {PRODUCTS.slice(0,4).map(p=>{
                const recommended = (p.cogs * (1 + (p.trend==="hot"?3.8:p.trend==="rising"?3.2:2.8))).toFixed(2);
                const diff = (recommended - p.price).toFixed(2);
                const up = diff > 0;
                return (
                  <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:16 }}>{p.image}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:12, color:T.textSecondary }}>{p.name.split(" ").slice(0,3).join(" ")}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>Current: ${p.price}</p>
                      <p style={{ fontSize:12, fontWeight:700, color:up?T.green:T.amber, fontFamily:"'Geist Mono', monospace" }}>Rec: ${recommended} <span style={{ fontSize:10 }}>({up?"+":""}{diff})</span></p>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ARBITRAGE ──────────────────────────────────────────────────────────── */

const ARB_GOLD   = "#F59E0B";
const ARB_CYAN   = "#06B6D4";
const ARB_LIME   = "#84CC16";

const ARB_OPPORTUNITIES = [
  {
    id:1, type:"Retail Arbitrage", asset:"Vitamix 5200 Blender", buyPlatform:"Costco", buyPrice:299, sellPlatform:"Amazon", sellPrice:449, profit:112, roi:37, risk:"Low", speed:"Fast",
    status:"Live", confidence:94, agent:"Scout",
    thesis:"Costco periodically runs this model at $299 during member events. Consistently sells $440–465 on Amazon FBA. 200+ monthly sellers, demand stable year-round.",
    steps:["Buy at Costco during sale event","List on Amazon FBA within 48h","Price at $449 to match Buy Box","Fulfill via FBA — hands-off after listing"],
    tags:["Physical","FBA","Proven"],
  },
  {
    id:2, type:"Crypto Arbitrage", asset:"BTC/USDT Spread", buyPlatform:"Kraken", buyPrice:68420, sellPlatform:"Coinbase Pro", sellPrice:68651, profit:231, roi:0.34, risk:"Low",
    status:"Live", confidence:91, agent:"Scout",
    thesis:"0.34% cross-exchange spread detected on BTC/USDT. After fees (~0.2% combined) net ~0.14% per trade. Viable with $50K+ capital. Window typically lasts 8–90 seconds.",
    steps:["Pre-fund both exchanges","Execute simultaneous buy/sell","Auto-rebalance after each cycle","Repeat 20–40× daily for compounded return"],
    tags:["Crypto","Automated","High Volume"],
  },
  {
    id:3, type:"Domain Arbitrage", asset:"ai-agents.com", buyPlatform:"GoDaddy Auctions", buyPrice:1200, sellPlatform:"Afternic / Direct", sellPrice:18000, profit:16320, roi:1360, risk:"Medium",
    status:"Watching", confidence:82, agent:"Scout",
    thesis:"'AI agents' is a category-defining search term growing 800% YoY. Domain investors are paying $15K–$40K for exact-match .com AI domains. Window to acquire at reasonable auction prices is narrowing fast.",
    steps:["Bid at GoDaddy Auction (reserve ~$1,200)","Park with monetization during hold","List on Afternic at $18,000","Outreach to AI startups directly"],
    tags:["Domain","High ROI","Patience Required"],
  },
  {
    id:4, type:"Software License Arbitrage", asset:"Adobe CC Team Licenses", buyPlatform:"Volume Reseller (EU)", buyPrice:38, sellPlatform:"US Market / SMBs", sellPrice:64, profit:22, roi:58, risk:"Low",
    status:"Researching", confidence:76, agent:"Scout",
    thesis:"EU volume license pricing for Adobe CC is 40% cheaper than US retail due to regional pricing tiers. Legal resale to US small businesses who don't know about volume pricing represents a clean margin.",
    steps:["Source via authorized EU volume reseller","Set up resale marketplace or direct outreach","Target design agencies and SMBs","Automate fulfillment via license management tool"],
    tags:["SaaS","Regional","Scalable"],
  },
  {
    id:5, type:"AI Model Arbitrage", asset:"GPT-4o API vs Wrapper SaaS", buyPlatform:"OpenAI API", buyPrice:0.005, sellPlatform:"Niche SaaS Tool", sellPrice:49, profit:47, roi:940, risk:"Low",
    status:"Build", confidence:89, agent:"Zoriya",
    thesis:"Cost to run 1,000 GPT-4o calls: ~$5. Wrap it in a niche tool (contract summarizer, job description writer, real estate listing generator) and sell access for $49/mo. 940% markup on the core resource.",
    steps:["Identify high-value niche with repetitive writing tasks","Build thin wrapper using Claude or GPT-4o API","Launch on Product Hunt + niche communities","Scale with SEO content targeting the niche"],
    tags:["AI","SaaS","Build Now"],
  },
  {
    id:6, type:"NFT / Digital Asset Arbitrage", asset:"Midjourney Art Packs", buyPlatform:"Etsy Wholesale", buyPrice:12, sellPlatform:"Creative Market / Gumroad", sellPrice:49, profit:34, roi:283, risk:"Low",
    status:"Watching", confidence:71, agent:"Scout",
    thesis:"AI-generated Midjourney asset packs bought in bulk from Etsy creators at wholesale rates resell at 4× on Creative Market to designers who pay premium for curated packs. Low effort, scalable.",
    steps:["Source high-quality packs from Etsy bulk listings","Curate and repackage by niche (architecture, fashion, etc.)","List on Creative Market and Gumroad","Run Pinterest and Behance traffic to listings"],
    tags:["Digital","Low Effort","Passive"],
  },
];

const ARB_METRICS = [
  { label:"Active Opportunities", val:"6", color:ARB_CYAN },
  { label:"Total Potential Profit", val:"$16,738", color:ARB_LIME },
  { label:"Avg ROI", val:"440%", color:ARB_GOLD },
  { label:"Low Risk Plays", val:"4", color:T.green },
];

const TYPE_COLORS = {
  "Retail Arbitrage": T.green,
  "Crypto Arbitrage": ARB_CYAN,
  "Domain Arbitrage": ARB_GOLD,
  "Software License Arbitrage": T.blueLight,
  "AI Model Arbitrage": T.purple,
  "NFT / Digital Asset Arbitrage": EC_PINK,
};

const RISK_COLOR = r => r==="Low"?T.green:r==="Medium"?T.amber:T.red;
const STATUS_STYLE = s => s==="Live"?T.green:s==="Build"?T.purple:s==="Watching"?T.blueLight:T.textMuted;

function ROIBadge({ roi }) {
  const big = roi >= 100;
  const color = roi >= 200 ? ARB_LIME : roi >= 50 ? T.green : ARB_CYAN;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:54, height:54, borderRadius:12, background:`${color}12`, border:`1px solid ${color}30`, flexShrink:0 }}>
      <span style={{ fontSize:big?11:13, fontWeight:700, color, fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{roi >= 100 ? `${roi}%` : `${roi}%`}</span>
      <span style={{ fontSize:8, color:T.textMuted, letterSpacing:"0.04em" }}>ROI</span>
    </div>
  );
}

function ArbitrageView() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const types = ["All", "Live", "Build", "Watching", "Researching"];
  const filtered = filter === "All" ? ARB_OPPORTUNITIES : ARB_OPPORTUNITIES.filter(o => o.status === filter);

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>SCOUT AGENT · OPPORTUNITY INTELLIGENCE</p>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>Arbitrage</h1>
          <p style={{ fontSize:13, color:T.textSecondary, marginTop:5 }}>Scout scans markets 24/7 for price inefficiencies, untapped spreads, and high-ROI flips across every asset class.</p>
        </div>
        {/* Scout agent chip */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:10, background:`${ARB_GOLD}10`, border:`1px solid ${ARB_GOLD}28` }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`${ARB_GOLD}22`, border:`1.5px solid ${ARB_GOLD}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:ARB_GOLD, fontFamily:"'Geist Mono', monospace" }}>SC</div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:13, fontWeight:700, color:T.textPrimary }}>Scout</span>
              <Dot color={ARB_GOLD} pulse />
            </div>
            <span style={{ fontSize:10, color:T.textMuted }}>Arbitrage Intelligence Agent</span>
          </div>
        </div>
      </div>

      {/* Metric strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
        {ARB_METRICS.map(m => (
          <Card key={m.label} style={{ padding:"14px 18px" }}>
            <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>{m.label.toUpperCase()}</p>
            <p style={{ fontSize:24, fontWeight:700, color:m.color, fontFamily:"'Geist Mono', monospace', lineHeight:1" }}>{m.val}</p>
          </Card>
        ))}
      </div>

      {/* Scout insight banner */}
      <div style={{ padding:"12px 16px", borderRadius:10, background:`${ARB_GOLD}08`, border:`1px solid ${ARB_GOLD}22`, marginBottom:20, display:"flex", gap:12, alignItems:"flex-start" }}>
        <Dot color={ARB_GOLD} pulse />
        <div>
          <span style={{ fontSize:11, fontWeight:700, color:ARB_GOLD }}>Scout's Top Pick Right Now — </span>
          <span style={{ fontSize:12, color:T.textSecondary }}>AI Model Arbitrage (GPT-4o wrapper SaaS) is the highest-leverage, lowest-capital play in the current list. $5 in API costs → $49/mo recurring per customer. Build one niche tool this month and you have a compounding asset, not a one-time flip.</span>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {types.map(t => (
          <button key={t} className="btn" onClick={() => setFilter(t)} style={{ padding:"6px 14px", borderRadius:8, fontSize:12, background:filter===t?T.blueDim:"rgba(255,255,255,0.04)", border:`1px solid ${filter===t?T.blue+"55":T.border}`, color:filter===t?T.blueLight:T.textSecondary }}>
            {t}
            {t !== "All" && (
              <span style={{ marginLeft:6, fontSize:10, color:STATUS_STYLE(t) }}>●</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:16 }}>
        {/* Opportunity list */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(opp => {
            const typeColor = TYPE_COLORS[opp.type] || T.blueLight;
            const isSelected = selected?.id === opp.id;
            return (
              <Card key={opp.id} className="card" onClick={() => setSelected(isSelected ? null : opp)} style={{ padding:18, cursor:"pointer", border:isSelected?`1px solid ${typeColor}44`:undefined, background:isSelected?`${typeColor}06`:undefined }}>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <ROIBadge roi={opp.roi} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:14, fontWeight:700, color:T.textPrimary }}>{opp.asset}</span>
                      <Tag color={STATUS_STYLE(opp.status)}>{opp.status}</Tag>
                      <Tag color={typeColor}>{opp.type}</Tag>
                      <Tag color={RISK_COLOR(opp.risk)}>{opp.risk} risk</Tag>
                    </div>

                    {/* Buy → Sell flow */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ padding:"5px 10px", borderRadius:7, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}` }}>
                        <p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", marginBottom:1 }}>BUY @ {opp.buyPlatform}</p>
                        <p style={{ fontSize:13, fontWeight:700, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>
                          {typeof opp.buyPrice === "number" && opp.buyPrice >= 1 ? `$${opp.buyPrice.toLocaleString()}` : `$${opp.buyPrice}`}
                        </p>
                      </div>
                      <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                        <path d="M2 7h20M16 2l6 5-6 5" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div style={{ padding:"5px 10px", borderRadius:7, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}` }}>
                        <p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", marginBottom:1 }}>SELL @ {opp.sellPlatform}</p>
                        <p style={{ fontSize:13, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>
                          {typeof opp.sellPrice === "number" && opp.sellPrice >= 1 ? `$${opp.sellPrice.toLocaleString()}` : `$${opp.sellPrice}`}
                        </p>
                      </div>
                      <div style={{ padding:"5px 12px", borderRadius:7, background:`${T.green}12`, border:`1px solid ${T.green}28` }}>
                        <p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", marginBottom:1 }}>NET PROFIT</p>
                        <p style={{ fontSize:13, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>${opp.profit.toLocaleString()}</p>
                      </div>
                    </div>

                    <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.6, marginBottom:8 }}>{opp.thesis.slice(0, 130)}…</p>

                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" }}>
                      {opp.tags.map(t => <Tag key={t} color={typeColor}>{t}</Tag>)}
                      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5 }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:AGENTS.find(a=>a.name===opp.agent)?.color ?? ARB_GOLD }} />
                        <span style={{ fontSize:10, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{opp.agent}</span>
                        <span style={{ fontSize:10, color:T.textMuted }}>·</span>
                        <span style={{ fontSize:10, color:T.textMuted }}>Confidence: </span>
                        <span style={{ fontSize:10, fontWeight:700, color:opp.confidence>=90?T.green:T.blueLight, fontFamily:"'Geist Mono', monospace" }}>{opp.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div style={{ position:"sticky", top:20, display:"flex", flexDirection:"column", gap:12, animation:"fadeUp .2s ease" }}>
              <Card style={{ padding:22, border:`1px solid ${TYPE_COLORS[selected.type] ?? T.blueLight}33` }}>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <h3 style={{ fontSize:16, fontWeight:700, color:T.textPrimary, flex:1 }}>{selected.asset}</h3>
                    <Tag color={STATUS_STYLE(selected.status)}>{selected.status}</Tag>
                  </div>
                  <Tag color={TYPE_COLORS[selected.type] ?? T.blueLight}>{selected.type}</Tag>
                </div>

                {/* Key numbers */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                  {[
                    { l:"Buy Price", v:`$${typeof selected.buyPrice==="number"?selected.buyPrice.toLocaleString():selected.buyPrice}`, c:T.amber },
                    { l:"Sell Price", v:`$${typeof selected.sellPrice==="number"?selected.sellPrice.toLocaleString():selected.sellPrice}`, c:T.green },
                    { l:"Net Profit", v:`$${selected.profit.toLocaleString()}`, c:T.green },
                    { l:"ROI", v:`${selected.roi}%`, c:selected.roi>=100?ARB_LIME:T.green },
                    { l:"Risk Level", v:selected.risk, c:RISK_COLOR(selected.risk) },
                    { l:"Confidence", v:`${selected.confidence}%`, c:selected.confidence>=90?T.green:T.blueLight },
                  ].map(m => (
                    <div key={m.l} style={{ padding:"10px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                      <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.08em", marginBottom:4, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                      <p style={{ fontSize:15, fontWeight:700, color:m.c, fontFamily:"'Geist Mono', monospace" }}>{m.v}</p>
                    </div>
                  ))}
                </div>

                <div style={{ height:1, background:T.border, marginBottom:14 }} />

                {/* Thesis */}
                <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>SCOUT'S THESIS</p>
                <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.75, marginBottom:14 }}>{selected.thesis}</p>

                {/* Steps */}
                <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:10, fontFamily:"'Geist Mono', monospace" }}>EXECUTION STEPS</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
                  {selected.steps.map((step, i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background:`${TYPE_COLORS[selected.type]??T.blueLight}18`, border:`1px solid ${TYPE_COLORS[selected.type]??T.blueLight}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        <span style={{ fontSize:9, fontWeight:700, color:TYPE_COLORS[selected.type]??T.blueLight, fontFamily:"'Geist Mono', monospace" }}>{i+1}</span>
                      </div>
                      <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.55 }}>{step}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {selected.tags.map(t => <Tag key={t} color={TYPE_COLORS[selected.type]??T.blueLight}>{t}</Tag>)}
                </div>
              </Card>

              {/* Add to tasks button */}
              <button style={{ width:"100%", padding:"12px 0", borderRadius:10, background:TYPE_COLORS[selected.type]??T.blueLight, border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", letterSpacing:"0.02em" }}>
                Add to Task Queue →
              </button>
            </div>
          ) : (
            <Card style={{ padding:24 }}>
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:28, marginBottom:12 }}>◈</div>
                <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:6 }}>Select an opportunity</p>
                <p style={{ fontSize:12, color:T.textMuted, lineHeight:1.6 }}>Click any play to see Scout's full thesis, execution steps, and key numbers.</p>
              </div>

              {/* Quick stats */}
              <div style={{ marginTop:20, borderTop:`1px solid ${T.border}`, paddingTop:16 }}>
                <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:12, fontFamily:"'Geist Mono', monospace" }}>OPPORTUNITY BREAKDOWN</p>
                {Object.entries(TYPE_COLORS).map(([type, color]) => {
                  const count = ARB_OPPORTUNITIES.filter(o=>o.type===type).length;
                  return count > 0 ? (
                    <div key={type} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0 }} />
                      <span style={{ fontSize:11, color:T.textSecondary, flex:1 }}>{type}</span>
                      <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{count}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MARKETING MANAGEMENT ───────────────────────────────────────────────── */

const MKT_VIOLET = "#7C3AED";
const MKT_ROSE   = "#F43F5E";
const MKT_SKY    = "#0EA5E9";

/* ── Shared data pulled from other tabs ── */
const MKT_ECOM_CAMPAIGNS = [
  { id:"ec1", source:"E-Commerce", product:"Ceramic Pour-Over Coffee Set", type:"TikTok Video Ad", platform:"TikTok", status:"Active", budget:"$400/wk", spend:"$1,200", revenue:"$8,040", roas:"6.7×", impressions:"142K", clicks:"3,976", ctr:"2.8%" },
  { id:"ec2", source:"E-Commerce", product:"Bamboo Cutting Board Set",     type:"Instagram Carousel", platform:"Instagram", status:"Paused", budget:"$250/wk", spend:"$720", revenue:"$3,960", roas:"5.5×", impressions:"88K", clicks:"2,112", ctr:"2.4%" },
  { id:"ec3", source:"E-Commerce", product:"Beeswax Food Wraps",           type:"Pinterest Organic", platform:"Pinterest", status:"Active", budget:"—", spend:"$0", revenue:"$824", roas:"∞", impressions:"34K", clicks:"680", ctr:"2.0%" },
];

const MKT_LAUNCHES = [
  { id:"l1", name:"ZORIYA AI — Brand Launch", client:"Internal", type:"Brand", status:"In Progress", phase:"Awareness", budget:"$2,000", spent:"$640", platforms:["LinkedIn","Twitter/X","Product Hunt"], startDate:"2026-03-01", targetDate:"2026-04-01", progress:32, owner:"Zoriya", brief:"Position ZORIYA AI as the leading autonomous AI operating system for solo entrepreneurs and small businesses. Goal: 1,000 waitlist signups by April 1st.", kpis:["1,000 signups","50 press mentions","500 LinkedIn followers"] },
  { id:"l2", name:"AI Readiness Tool Launch", client:"Internal", type:"Product", status:"Planned", phase:"Pre-launch", budget:"$800", spent:"$0", platforms:["Product Hunt","Reddit","Twitter/X"], startDate:"2026-04-01", targetDate:"2026-04-15", progress:0, owner:"Aria", brief:"Drive 500 tool completions in first 2 weeks using Product Hunt launch + organic Reddit posts in r/Entrepreneur, r/AItools. Capture emails for follow-up.", kpis:["500 tool completions","300 emails captured","#1 Product of the Day on PH"] },
  { id:"l3", name:"Better Made — Spring Campaign", client:"Better Made Store", type:"E-Commerce", status:"In Progress", phase:"Execution", budget:"$1,500", spent:"$840", platforms:["TikTok","Instagram","Pinterest"], startDate:"2026-03-10", targetDate:"2026-03-31", progress:56, owner:"Aria", brief:"Eco + spring kitchen aesthetic push across TikTok and Instagram. Beeswax wraps and herb kits as hero SKUs. Pair with Pinterest SEO content for long-tail traffic.", kpis:["$8,000 revenue","ROAS 5×+","500 new email subscribers"] },
  { id:"l4", name:"GovCon AI Services — B2B", client:"Internal", type:"B2B Lead Gen", status:"Planned", phase:"Strategy", budget:"$1,200", spent:"$0", platforms:["LinkedIn","Google Ads","Email"], startDate:"2026-04-15", targetDate:"2026-05-31", progress:0, owner:"Zoriya", brief:"Outbound campaign targeting GovCon officers and agency procurement leads. LinkedIn ads + cold email sequence + Google Ads for branded search terms around AI government contracting.", kpis:["20 qualified leads","5 proposals sent","2 contracts won"] },
];

const MKT_IDEAS = [
  { id:1, title:"'Behind the AI' Content Series", category:"Content", platform:"LinkedIn + YouTube", effort:"Low", impact:"High", agent:"Zoriya", idea:"Document the ZORIYA AI build process publicly — what agents are running, what they found this week, what decisions they helped make. Founders love watching other founders build in public. This becomes a brand asset AND a lead gen machine.", tags:["Brand","Organic","Build in Public"], votes:14 },
  { id:2, title:"AI Efficiency Calculator", category:"Lead Gen Tool", platform:"Website", effort:"Medium", impact:"Very High", agent:"Zoriya", idea:"Interactive calculator that shows any business owner how many hours per week they could reclaim by deploying AI agents. Output: 'You could save 23 hours/week worth $4,600/mo.' Ends with a CTA to book a consultation. Viral share potential.", tags:["Viral","Lead Gen","Tool"], votes:19 },
  { id:3, title:"Google Ads — 'AI for Small Business' Keywords", category:"Paid Search", platform:"Google Ads", effort:"Medium", impact:"High", agent:"Scout", idea:"Search terms like 'automate my business with AI', 'AI assistant for entrepreneurs', 'how to use AI to grow my business' have high intent and low competition vs enterprise keywords. $500/mo budget could yield 40–60 qualified leads per month.", tags:["Google Ads","Paid","High Intent"], votes:11 },
  { id:4, title:"Case Study: 0 → $10K with ZORIYA AI", category:"Content", platform:"Medium + LinkedIn", effort:"Low", impact:"Very High", agent:"Zoriya", idea:"Document the first $10K milestone publicly with full breakdown — which agents ran, which opportunities were found, what campaigns ran. Authentic founder story with real numbers. This type of content consistently goes viral in entrepreneur communities.", tags:["Case Study","Social Proof","Viral"], votes:22 },
  { id:5, title:"TikTok Series: 'My AI Does This While I Sleep'", category:"Short-Form Video", platform:"TikTok", effort:"Medium", impact:"High", agent:"Aria", idea:"Daily 30-second clips showing what the agents found or did overnight. Contract finds, market opportunities, campaign results. Niche but highly shareable to entrepreneurs and AI enthusiasts. Low production, high authenticity.", tags:["TikTok","Viral","Daily Content"], votes:16 },
  { id:6, title:"Referral Loop: AI Tool Users → Consultation", category:"Growth Loop", platform:"Email + In-App", effort:"Medium", impact:"High", agent:"Zoriya", idea:"Anyone who completes the AI Readiness Tool gets a 3-email sequence offering a free 30-min consultation. Convert 10% of tool completions into discovery calls. Each call seeds the pipeline with a qualified lead who already trusts the product.", tags:["Growth Loop","Email","Funnel"], votes:9 },
];

const GOOGLE_ADS_MOCK = [
  { campaign:"ZORIYA AI — Brand", status:"Active", budget:"$15/day", spend:"$42", clicks:38, impressions:1840, ctr:"2.1%", cpc:"$1.11", conv:3, cpa:"$14.00", quality:8 },
  { campaign:"AI for Small Business", status:"Active", budget:"$20/day", spend:"$61", clicks:54, impressions:3200, ctr:"1.7%", cpc:"$1.13", conv:4, cpa:"$15.25", quality:7 },
  { campaign:"GovCon AI Services", status:"Paused", budget:"$25/day", spend:"$0", clicks:0, impressions:0, ctr:"—", cpc:"—", conv:0, cpa:"—", quality:6 },
];

const PLATFORMS_META = {
  "TikTok":    { color:"#69C9D0", icon:"T" },
  "Instagram": { color:MKT_ROSE,  icon:"I" },
  "Pinterest": { color:"#E60023", icon:"P" },
  "LinkedIn":  { color:"#0A66C2", icon:"in" },
  "Google Ads":{ color:"#4285F4", icon:"G" },
  "Twitter/X": { color:T.textSecondary, icon:"X" },
  "Product Hunt":{ color:"#DA552F", icon:"PH" },
  "Email":     { color:T.amber, icon:"@" },
  "Reddit":    { color:"#FF4500", icon:"r/" },
};

function PlatformPill({ name }) {
  const meta = PLATFORMS_META[name] || { color:T.textMuted, icon:"?" };
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:20, background:`${meta.color}14`, border:`1px solid ${meta.color}30` }}>
      <span style={{ fontSize:9, fontWeight:800, color:meta.color, fontFamily:"'Geist Mono', monospace" }}>{meta.icon}</span>
      <span style={{ fontSize:10, color:meta.color, fontWeight:600 }}>{name}</span>
    </div>
  );
}

function MiniSparkline({ positive=true }) {
  const vals = positive
    ? [20,28,24,35,32,42,38,50,46,58]
    : [58,50,54,42,46,35,38,26,30,18];
  const min=Math.min(...vals), max=Math.max(...vals);
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*88},${38-((v-min)/(max-min))*32}`).join(" ");
  const color = positive ? T.green : T.red;
  return (
    <svg width="90" height="40">
      <defs><linearGradient id={`spk${positive}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={`0,40 ${pts} 88,40`} fill={`url(#spk${positive})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function MarketingView() {
  const [sub, setSub]           = useState("overview");
  const [selLaunch, setSelLaunch] = useState(null);
  const [ideaVotes, setIdeaVotes] = useState(Object.fromEntries(MKT_IDEAS.map(i=>[i.id,i.votes])));
  const [gadsConnected, setGadsConnected] = useState(false);
  const [metaConnected, setMetaConnected] = useState(false);

  const SUBS = [
    { id:"overview",  label:"Overview"        },
    { id:"launches",  label:"Launch Manager"  },
    { id:"campaigns", label:"Campaigns"       },
    { id:"ideas",     label:"Market Ideas"    },
    { id:"google",    label:"Google Ads"      },
    { id:"meta",      label:"Meta Ads"        },
  ];

  const statusClr = s => s==="Active"||s==="In Progress"?T.green:s==="Planned"?T.blueLight:s==="Paused"?T.amber:T.textMuted;
  const impactClr = i => i==="Very High"?T.green:i==="High"?T.blueLight:T.amber;
  const effortClr = e => e==="Low"?T.green:e==="Medium"?T.amber:T.red;

  /* total ad spend across all campaigns */
  const totalSpend  = MKT_ECOM_CAMPAIGNS.reduce((a,c)=>a+(parseInt(c.spend.replace(/[^0-9]/g,""))||0),0);
  const totalRevenue= MKT_ECOM_CAMPAIGNS.reduce((a,c)=>a+(parseInt(c.revenue.replace(/[^0-9]/g,""))||0),0);

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>ZORIYA AI · GROWTH & MARKETING</p>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>Marketing</h1>
          <p style={{ fontSize:13, color:T.textSecondary, marginTop:5 }}>Campaigns, launches, and market intelligence — all in one command centre.</p>
        </div>
        {/* Agent chips */}
        <div style={{ display:"flex", gap:10 }}>
          {[{initials:"AR",name:"Aria",role:"E-Commerce Marketing",color:EC_PINK},{initials:"ZA",name:"Zoriya",role:"Brand & B2B",color:T.blueLight}].map(a=>(
            <div key={a.name} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 13px", borderRadius:10, background:`${a.color}10`, border:`1px solid ${a.color}25` }}>
              <div style={{ width:28, height:28, borderRadius:8, background:`${a.color}22`, border:`1.5px solid ${a.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:a.color, fontFamily:"'Geist Mono', monospace" }}>{a.initials}</div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:T.textPrimary }}>{a.name}</span>
                  <Dot color={a.color} pulse />
                </div>
                <span style={{ fontSize:9, color:T.textMuted }}>{a.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sub-nav ── */}
      <div style={{ display:"flex", gap:2, marginBottom:24, borderBottom:`1px solid ${T.border}` }}>
        {SUBS.map(s=>(
          <button key={s.id} onClick={()=>setSub(s.id)} style={{ padding:"9px 16px", background:"transparent", border:"none", borderBottom:`2px solid ${sub===s.id?MKT_VIOLET:"transparent"}`, color:sub===s.id?T.textPrimary:T.textSecondary, fontSize:13, fontWeight:sub===s.id?600:400, cursor:"pointer", fontFamily:"'Outfit', sans-serif", marginBottom:-1, transition:"all .15s" }}>
            {s.label}
            {s.id==="google" && !gadsConnected && <span style={{ marginLeft:5, fontSize:8, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>●</span>}
            {s.id==="meta"   && !metaConnected  && <span style={{ marginLeft:5, fontSize:8, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>●</span>}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW ══ */}
      {sub==="overview" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          {/* KPI strip */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:22 }}>
            {[
              { l:"Active Campaigns",  v:MKT_ECOM_CAMPAIGNS.filter(c=>c.status==="Active").length+MKT_LAUNCHES.filter(l=>l.status==="In Progress").length, color:T.green },
              { l:"Total Ad Spend",    v:`$${totalSpend.toLocaleString()}`, color:T.amber },
              { l:"Revenue Attributed",v:`$${totalRevenue.toLocaleString()}`, color:T.green },
              { l:"Blended ROAS",      v:`${(totalRevenue/totalSpend).toFixed(1)}×`, color:MKT_VIOLET },
              { l:"Launches This Month",v:MKT_LAUNCHES.filter(l=>l.status==="In Progress").length, color:T.blueLight },
            ].map(m=>(
              <Card key={m.l} style={{ padding:"14px 16px" }}>
                <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                <p style={{ fontSize:22, fontWeight:700, color:m.color, fontFamily:"'Geist Mono', monospace', lineHeight:1" }}>{m.v}</p>
              </Card>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, marginBottom:18 }}>
            {/* Launch progress */}
            <Card style={{ padding:20 }}>
              <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:16 }}>Active Launches</p>
              {MKT_LAUNCHES.filter(l=>l.status==="In Progress").map((l,i,arr)=>(
                <div key={l.id} style={{ marginBottom:i<arr.length-1?18:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div>
                      <span style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{l.name}</span>
                      <span style={{ fontSize:11, color:T.textMuted, marginLeft:8 }}>{l.phase}</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, color:MKT_VIOLET, fontFamily:"'Geist Mono', monospace" }}>{l.progress}%</span>
                  </div>
                  <div style={{ height:5, borderRadius:3, background:"rgba(255,255,255,0.06)", overflow:"hidden", marginBottom:6 }}>
                    <div style={{ height:"100%", width:`${l.progress}%`, borderRadius:3, background:`linear-gradient(90deg,${MKT_VIOLET},${EC_PINK})`, transition:"width .6s ease" }}/>
                  </div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {l.platforms.map(p=><PlatformPill key={p} name={p}/>)}
                  </div>
                </div>
              ))}
            </Card>

            {/* Top ideas */}
            <Card style={{ padding:18 }}>
              <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Top Market Ideas</p>
              {MKT_IDEAS.sort((a,b)=>ideaVotes[b.id]-ideaVotes[a.id]).slice(0,4).map((idea,i)=>(
                <div key={idea.id} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"9px 0", borderBottom:i<3?`1px solid ${T.border}`:"none" }}>
                  <span style={{ fontSize:16, fontWeight:700, color:MKT_VIOLET, fontFamily:"'Geist Mono', monospace", minWidth:24 }}>{ideaVotes[idea.id]}</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:600, color:T.textPrimary, marginBottom:2 }}>{idea.title}</p>
                    <Tag color={impactClr(idea.impact)}>{idea.impact} impact</Tag>
                  </div>
                </div>
              ))}
              <button onClick={()=>setSub("ideas")} style={{ marginTop:12, width:"100%", padding:"7px", borderRadius:8, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, color:T.textSecondary, fontSize:12, cursor:"pointer" }}>
                View all ideas →
              </button>
            </Card>
          </div>

          {/* E-Commerce campaigns pulled in */}
          <Card style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>E-Commerce Campaigns</p>
                <Tag color={EC_PINK}>from E-Commerce tab</Tag>
              </div>
              <button onClick={()=>setSub("campaigns")} style={{ fontSize:11, color:T.blueLight, background:"none", border:"none", cursor:"pointer" }}>View all →</button>
            </div>
            {MKT_ECOM_CAMPAIGNS.map((c,i)=>(
              <div key={c.id} className="row-item" style={{ display:"grid", gridTemplateColumns:"2fr 90px 80px 90px 70px 70px 70px", gap:8, padding:"13px 18px", borderBottom:i<MKT_ECOM_CAMPAIGNS.length-1?`1px solid ${T.border}`:"none", alignItems:"center" }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{c.product}</p>
                  <div style={{ display:"flex", gap:6, marginTop:4 }}>
                    <PlatformPill name={c.platform}/>
                    <Tag color={T.textMuted}>{c.type}</Tag>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"center" }}><MiniSparkline positive={c.status==="Active"}/></div>
                <div><p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>SPEND</p><p style={{ fontSize:13, fontWeight:700, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>{c.spend}</p></div>
                <div><p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>REVENUE</p><p style={{ fontSize:13, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>{c.revenue}</p></div>
                <div><p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>ROAS</p><p style={{ fontSize:13, fontWeight:700, color:MKT_VIOLET, fontFamily:"'Geist Mono', monospace" }}>{c.roas}</p></div>
                <div><p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>CTR</p><p style={{ fontSize:13, fontWeight:700, color:T.blueLight, fontFamily:"'Geist Mono', monospace" }}>{c.ctr}</p></div>
                <Tag color={statusClr(c.status)}>{c.status}</Tag>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ══ LAUNCH MANAGER ══ */}
      {sub==="launches" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:16 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {MKT_LAUNCHES.map(l=>(
                <Card key={l.id} className="card" onClick={()=>setSelLaunch(selLaunch?.id===l.id?null:l)} style={{ padding:20, cursor:"pointer", border:selLaunch?.id===l.id?`1px solid ${MKT_VIOLET}44`:undefined, background:selLaunch?.id===l.id?`${MKT_VIOLET}06`:undefined }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <h3 style={{ fontSize:14, fontWeight:700, color:T.textPrimary }}>{l.name}</h3>
                        <Tag color={statusClr(l.status)}>{l.status}</Tag>
                        <Tag color={MKT_VIOLET}>{l.type}</Tag>
                      </div>
                      <p style={{ fontSize:11, color:T.textMuted }}>Client: {l.client} · Phase: <span style={{ color:T.textSecondary }}>{l.phase}</span> · Owner: <span style={{ color:agentColor(l.owner) }}>{l.owner}</span></p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:18, fontWeight:700, color:MKT_VIOLET, fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{l.progress}%</p>
                      <p style={{ fontSize:10, color:T.textMuted, marginTop:2 }}>complete</p>
                    </div>
                  </div>
                  <div style={{ height:4, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden", marginBottom:12 }}>
                    <div style={{ height:"100%", width:`${l.progress}%`, borderRadius:2, background:`linear-gradient(90deg,${MKT_VIOLET},${EC_PINK})` }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{l.platforms.map(p=><PlatformPill key={p} name={p}/>)}</div>
                    <div style={{ display:"flex", gap:12 }}>
                      <div style={{ textAlign:"right" }}>
                        <p style={{ fontSize:10, color:T.textMuted }}>Budget</p>
                        <p style={{ fontSize:12, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{l.budget}</p>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <p style={{ fontSize:10, color:T.textMuted }}>Spent</p>
                        <p style={{ fontSize:12, fontWeight:700, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>{l.spent}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Launch detail */}
            {selLaunch ? (
              <Card style={{ padding:22, position:"sticky", top:20, animation:"fadeUp .2s ease" }}>
                <div style={{ marginBottom:14 }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:T.textPrimary, marginBottom:6 }}>{selLaunch.name}</h3>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                    <Tag color={statusClr(selLaunch.status)}>{selLaunch.status}</Tag>
                    <Tag color={MKT_VIOLET}>{selLaunch.phase}</Tag>
                  </div>
                  <p style={{ fontSize:11, color:T.textMuted }}>
                    {selLaunch.startDate} → {selLaunch.targetDate}
                  </p>
                </div>
                <div style={{ height:1, background:T.border, marginBottom:14 }} />
                <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>BRIEF</p>
                <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.75, marginBottom:14 }}>{selLaunch.brief}</p>
                <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:10, fontFamily:"'Geist Mono', monospace" }}>SUCCESS METRICS</p>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:14 }}>
                  {selLaunch.kpis.map((kpi,i)=>(
                    <div key={i} style={{ display:"flex", gap:9, alignItems:"center" }}>
                      <div style={{ width:16, height:16, borderRadius:5, border:`1px solid ${MKT_VIOLET}44`, background:`${MKT_VIOLET}12`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:8, color:MKT_VIOLET, fontFamily:"'Geist Mono', monospace" }}>{i+1}</span>
                      </div>
                      <p style={{ fontSize:12, color:T.textSecondary }}>{kpi}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <div style={{ padding:"10px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                    <p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", marginBottom:3 }}>BUDGET</p>
                    <p style={{ fontSize:14, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace" }}>{selLaunch.budget}</p>
                  </div>
                  <div style={{ padding:"10px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                    <p style={{ fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", marginBottom:3 }}>SPENT</p>
                    <p style={{ fontSize:14, fontWeight:700, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>{selLaunch.spent}</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card style={{ padding:22 }}>
                <p style={{ fontSize:12, color:T.textMuted, lineHeight:1.6 }}>Select a launch to see the full brief, KPIs, and budget breakdown.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ══ CAMPAIGNS ══ */}
      {sub==="campaigns" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:14, fontFamily:"'Geist Mono', monospace" }}>ALL CAMPAIGNS — LIVE VIEW</p>
          <Card style={{ padding:0, overflow:"hidden", marginBottom:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 100px 80px 90px 70px 60px 70px 80px", padding:"10px 18px", borderBottom:`1px solid ${T.border}`, fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", letterSpacing:"0.08em", gap:8 }}>
              <span>CAMPAIGN</span><span>PLATFORM</span><span style={{textAlign:"right"}}>SPEND</span><span style={{textAlign:"right"}}>REVENUE</span><span style={{textAlign:"right"}}>ROAS</span><span style={{textAlign:"right"}}>CTR</span><span style={{textAlign:"right"}}>IMPR.</span><span style={{textAlign:"right"}}>STATUS</span>
            </div>
            {MKT_ECOM_CAMPAIGNS.map((c,i)=>(
              <div key={c.id} className="row-item" style={{ display:"grid", gridTemplateColumns:"2fr 100px 80px 90px 70px 60px 70px 80px", padding:"13px 18px", borderBottom:i<MKT_ECOM_CAMPAIGNS.length-1?`1px solid ${T.border}`:"none", alignItems:"center", gap:8 }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{c.product}</p>
                  <p style={{ fontSize:10, color:T.textMuted }}>{c.type}</p>
                </div>
                <PlatformPill name={c.platform}/>
                <p style={{ textAlign:"right", fontSize:12, fontWeight:700, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>{c.spend}</p>
                <p style={{ textAlign:"right", fontSize:12, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>{c.revenue}</p>
                <p style={{ textAlign:"right", fontSize:12, fontWeight:700, color:MKT_VIOLET, fontFamily:"'Geist Mono', monospace" }}>{c.roas}</p>
                <p style={{ textAlign:"right", fontSize:12, color:T.blueLight, fontFamily:"'Geist Mono', monospace" }}>{c.ctr}</p>
                <p style={{ textAlign:"right", fontSize:12, color:T.textSecondary, fontFamily:"'Geist Mono', monospace" }}>{c.impressions}</p>
                <div style={{ display:"flex", justifyContent:"flex-end" }}><Tag color={statusClr(c.status)}>{c.status}</Tag></div>
              </div>
            ))}
          </Card>
          {/* Instruction for future real campaigns */}
          <div style={{ padding:"14px 18px", borderRadius:10, background:`${MKT_VIOLET}08`, border:`1px solid ${MKT_VIOLET}22` }}>
            <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.65 }}>
              <span style={{ color:MKT_VIOLET, fontWeight:700 }}>Zoriya can manage this. </span>
              Once connected to Google Ads, Meta Ads Manager, and TikTok Ads, Aria and Zoriya can automatically pause underperforming campaigns, adjust budgets, and create new ad sets based on performance data — without you needing to log in.
            </p>
          </div>
        </div>
      )}

      {/* ══ MARKET IDEAS ══ */}
      {sub==="ideas" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          <div style={{ padding:"12px 16px", borderRadius:10, background:`${MKT_VIOLET}08`, border:`1px solid ${MKT_VIOLET}22`, marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
            <Dot color={MKT_VIOLET} pulse />
            <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.65 }}>
              <span style={{ color:MKT_VIOLET, fontWeight:700 }}>Agent-generated. </span>
              Zoriya and Aria continuously surface high-leverage marketing plays based on your current projects, target markets, and what's working across the internet. Vote up ideas you want to act on.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {MKT_IDEAS.sort((a,b)=>ideaVotes[b.id]-ideaVotes[a.id]).map(idea=>(
              <Card key={idea.id} style={{ padding:20 }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div
                      onClick={()=>setIdeaVotes(v=>({...v,[idea.id]:v[idea.id]+1}))}
                      style={{ width:34, height:34, borderRadius:8, border:`1px solid ${T.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .15s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=MKT_VIOLET+"66";e.currentTarget.style.background=MKT_VIOLET+"12";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background="transparent";}}>
                      <span style={{ fontSize:12, color:MKT_VIOLET }}>▲</span>
                      <span style={{ fontSize:12, fontWeight:700, color:T.textPrimary, fontFamily:"'Geist Mono', monospace", lineHeight:1 }}>{ideaVotes[idea.id]}</span>
                    </div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:T.textPrimary }}>{idea.title}</span>
                    </div>
                    <div style={{ display:"flex", gap:5, marginBottom:8, flexWrap:"wrap" }}>
                      <Tag color={MKT_VIOLET}>{idea.category}</Tag>
                      <Tag color={impactClr(idea.impact)}>{idea.impact} impact</Tag>
                      <Tag color={effortClr(idea.effort)}>{idea.effort} effort</Tag>
                      <PlatformPill name={idea.platform.split(" + ")[0]}/>
                    </div>
                    <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.65, marginBottom:10 }}>{idea.idea}</p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                        {idea.tags.map(t=><Tag key={t} color={T.textMuted}>{t}</Tag>)}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <Dot color={agentColor(idea.agent)} />
                        <span style={{ fontSize:10, color:agentColor(idea.agent), fontWeight:600 }}>{idea.agent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ══ GOOGLE ADS ══ */}
      {sub==="google" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          {!gadsConnected ? (
            <div style={{ maxWidth:520, margin:"40px auto", textAlign:"center" }}>
              {/* Google G logo */}
              <div style={{ width:64, height:64, borderRadius:18, background:"rgba(66,133,244,0.12)", border:"1px solid rgba(66,133,244,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:28, fontWeight:900 }}>
                <span style={{ background:"linear-gradient(135deg,#4285F4,#EA4335,#FBBC05,#34A853)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontFamily:"sans-serif" }}>G</span>
              </div>
              <h2 style={{ fontSize:20, fontWeight:700, color:T.textPrimary, marginBottom:10 }}>Connect Google Ads</h2>
              <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.75, marginBottom:24 }}>
                Link your Google Ads account to let Zoriya and Aria monitor campaign performance, flag underperforming ad groups, suggest bid adjustments, and surface keyword opportunities — all from this dashboard.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28, textAlign:"left" }}>
                {["Real-time campaign performance pulled directly from Google Ads API","Aria flags keywords wasting budget and suggests replacements","Zoriya auto-pauses ads with ROAS below your target threshold","Quality Score improvements surfaced automatically","New campaign briefs generated from top-performing ad copy"].map((f,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ width:18, height:18, borderRadius:5, background:"rgba(66,133,244,0.15)", border:"1px solid rgba(66,133,244,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      <span style={{ fontSize:9, color:"#4285F4" }}>✓</span>
                    </div>
                    <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.55 }}>{f}</p>
                  </div>
                ))}
              </div>
              <button onClick={()=>setGadsConnected(true)} style={{ padding:"12px 32px", borderRadius:10, background:"#4285F4", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", letterSpacing:"0.02em" }}>
                Connect Google Ads Account
              </button>
              <p style={{ fontSize:10, color:T.textMuted, marginTop:10 }}>OAuth 2.0 · Read + manage permissions · Disconnect anytime</p>
            </div>
          ) : (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:8, background:"rgba(52,168,83,0.1)", border:"1px solid rgba(52,168,83,0.25)", marginBottom:20, width:"fit-content" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#34A853", boxShadow:"0 0 6px #34A853" }} />
                <span style={{ fontSize:12, color:"#34A853", fontWeight:600 }}>Google Ads connected</span>
                <span style={{ fontSize:10, color:T.textMuted, marginLeft:4 }}>Last sync: 2 min ago</span>
                <button onClick={()=>setGadsConnected(false)} style={{ fontSize:10, color:T.textMuted, background:"none", border:"none", cursor:"pointer", marginLeft:8 }}>Disconnect</button>
              </div>

              {/* Account summary */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
                {[{l:"Total Spend",v:"$103",c:T.amber},{l:"Total Clicks",v:"92",c:T.blueLight},{l:"Conversions",v:"7",c:T.green},{l:"Avg CPA",v:"$14.71",c:MKT_VIOLET}].map(m=>(
                  <Card key={m.l} style={{ padding:"14px 18px" }}>
                    <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                    <p style={{ fontSize:22, fontWeight:700, color:m.c, fontFamily:"'Geist Mono', monospace" }}>{m.v}</p>
                  </Card>
                ))}
              </div>

              {/* Campaign table */}
              <Card style={{ padding:0, overflow:"hidden", marginBottom:18 }}>
                <div style={{ display:"grid", gridTemplateColumns:"2fr 70px 70px 60px 60px 60px 60px 70px", padding:"10px 18px", borderBottom:`1px solid ${T.border}`, fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", letterSpacing:"0.08em", gap:8 }}>
                  <span>CAMPAIGN</span><span style={{textAlign:"right"}}>BUDGET</span><span style={{textAlign:"right"}}>SPEND</span><span style={{textAlign:"right"}}>CLICKS</span><span style={{textAlign:"right"}}>CTR</span><span style={{textAlign:"right"}}>CONV</span><span style={{textAlign:"right"}}>CPA</span><span style={{textAlign:"right"}}>QUAL.</span>
                </div>
                {GOOGLE_ADS_MOCK.map((c,i)=>(
                  <div key={c.campaign} className="row-item" style={{ display:"grid", gridTemplateColumns:"2fr 70px 70px 60px 60px 60px 60px 70px", padding:"13px 18px", borderBottom:i<GOOGLE_ADS_MOCK.length-1?`1px solid ${T.border}`:"none", alignItems:"center", gap:8 }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{c.campaign}</p>
                    </div>
                    <p style={{ textAlign:"right", fontSize:12, color:T.textSecondary, fontFamily:"'Geist Mono', monospace" }}>{c.budget}</p>
                    <p style={{ textAlign:"right", fontSize:12, fontWeight:700, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>{c.spend}</p>
                    <p style={{ textAlign:"right", fontSize:12, color:T.blueLight, fontFamily:"'Geist Mono', monospace" }}>{c.clicks}</p>
                    <p style={{ textAlign:"right", fontSize:12, color:T.textSecondary, fontFamily:"'Geist Mono', monospace" }}>{c.ctr}</p>
                    <p style={{ textAlign:"right", fontSize:12, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>{c.conv}</p>
                    <p style={{ textAlign:"right", fontSize:12, color:MKT_VIOLET, fontFamily:"'Geist Mono', monospace" }}>{c.cpa}</p>
                    <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:4 }}>
                      <div style={{ height:3, width:30, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${c.quality*10}%`, background:c.quality>=8?T.green:c.quality>=6?T.blueLight:T.amber, borderRadius:2 }}/>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:c.quality>=8?T.green:c.quality>=6?T.blueLight:T.amber, fontFamily:"'Geist Mono', monospace" }}>{c.quality}</span>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Zoriya recommendations */}
              <Card style={{ padding:20 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:14 }}>
                  <Dot color={T.blueLight} pulse />
                  <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>Zoriya's Google Ads Recommendations</p>
                </div>
                {[
                  { text:"Increase 'AI for Small Business' daily budget to $35 — it's converting at $15.25 CPA with room to scale.", action:"Apply", urgent:true },
                  { text:"'GovCon AI Services' is paused. Suggest activating ahead of the Q2 procurement season starting April 1.", action:"Activate", urgent:false },
                  { text:"Add negative keywords: 'free AI', 'open source AI', 'AI chatbot download' — these are driving irrelevant clicks.", action:"Add Keywords", urgent:true },
                  { text:"Quality Score on 'ZORIYA AI Brand' is 8/10. Improving landing page load speed could push it to 9–10 and reduce CPC.", action:"View Tips", urgent:false },
                ].map((r,i)=>(
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"11px 0", borderBottom:i<3?`1px solid ${T.border}`:"none" }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:r.urgent?MKT_VIOLET:T.textMuted, flexShrink:0, boxShadow:r.urgent?`0 0 6px ${MKT_VIOLET}`:undefined }} />
                    <p style={{ fontSize:12, color:T.textSecondary, flex:1, lineHeight:1.55 }}>{r.text}</p>
                    <button style={{ padding:"5px 12px", borderRadius:7, background:`${MKT_VIOLET}18`, border:`1px solid ${MKT_VIOLET}33`, color:MKT_VIOLET, fontSize:11, fontWeight:600, cursor:"pointer", flexShrink:0 }}>{r.action}</button>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      )}

      {/* ══ META ADS ══ */}
      {sub==="meta" && (
        <div style={{ animation:"fadeUp .25s ease" }}>
          {!metaConnected ? (
            <div style={{ maxWidth:520, margin:"40px auto", textAlign:"center" }}>
              {/* Meta logo */}
              <div style={{ width:64, height:64, borderRadius:18, background:"rgba(24,119,242,0.12)", border:"1px solid rgba(24,119,242,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M4 16.5C4 12 7.5 8 12 8c2.5 0 4.5 1.2 6 3 1.5-1.8 3.5-3 6-3 4.5 0 8 4 8 8.5 0 5-4 10-8.5 14C20.5 32 16 34 16 34s-4.5-2-7.5-8C4.5 22.5 4 20 4 16.5z" stroke="#1877F2" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M16 11c0 0-2 3-2 6s2 6 2 6" stroke="#1877F2" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize:20, fontWeight:700, color:T.textPrimary, marginBottom:10 }}>Connect Meta Ads</h2>
              <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.75, marginBottom:24 }}>
                Link your Facebook & Instagram Ads account so Aria can monitor performance, surface winning creatives, auto-pause low performers, and build new campaigns — all from this dashboard.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28, textAlign:"left" }}>
                {[
                  "Live Facebook & Instagram campaign data pulled via Meta Marketing API",
                  "Aria flags ad fatigue and suggests fresh creative rotations automatically",
                  "Audience insights surfaced — which demographics are converting best",
                  "Automatic budget reallocation to top-performing ad sets",
                  "Cross-platform ROAS comparison: Meta vs Google vs TikTok in one view",
                  "Lookalike audience suggestions based on your best customers"
                ].map((f,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ width:18, height:18, borderRadius:5, background:"rgba(24,119,242,0.15)", border:"1px solid rgba(24,119,242,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      <span style={{ fontSize:9, color:"#1877F2" }}>✓</span>
                    </div>
                    <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.55 }}>{f}</p>
                  </div>
                ))}
              </div>
              <button onClick={()=>setMetaConnected(true)} style={{ padding:"12px 32px", borderRadius:10, background:"#1877F2", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", letterSpacing:"0.02em" }}>
                Connect Meta Ads Account
              </button>
              <p style={{ fontSize:10, color:T.textMuted, marginTop:10 }}>OAuth 2.0 · Facebook & Instagram · Disconnect anytime</p>
            </div>
          ) : (
            <div>
              {/* Connected banner */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:8, background:"rgba(24,119,242,0.1)", border:"1px solid rgba(24,119,242,0.25)", marginBottom:20, width:"fit-content" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#1877F2", boxShadow:"0 0 6px #1877F2" }} />
                <span style={{ fontSize:12, color:"#1877F2", fontWeight:600 }}>Meta Ads connected</span>
                <span style={{ fontSize:10, color:T.textMuted, marginLeft:4 }}>· Facebook + Instagram · Last sync: 4 min ago</span>
                <button onClick={()=>setMetaConnected(false)} style={{ fontSize:10, color:T.textMuted, background:"none", border:"none", cursor:"pointer", marginLeft:8 }}>Disconnect</button>
              </div>

              {/* Account KPIs */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:22 }}>
                {[
                  {l:"Spend",         v:"$2,140",  c:T.amber},
                  {l:"Revenue",       v:"$14,980", c:T.green},
                  {l:"ROAS",          v:"7.0×",    c:MKT_VIOLET},
                  {l:"Reach",         v:"184K",    c:T.blueLight},
                  {l:"Link Clicks",   v:"5,620",   c:"#1877F2"},
                ].map(m=>(
                  <Card key={m.l} style={{ padding:"14px 16px" }}>
                    <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:8, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                    <p style={{ fontSize:22, fontWeight:700, color:m.c, fontFamily:"'Geist Mono', monospace" }}>{m.v}</p>
                  </Card>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
                {/* Campaigns table */}
                <Card style={{ padding:0, overflow:"hidden" }}>
                  <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
                    <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>Campaigns</p>
                  </div>
                  {[
                    {name:"Ceramic Pour-Over — TikTok-style Video", platform:"Instagram Reels", spend:"$640", roas:"8.1×", status:"Active"},
                    {name:"Spring Kitchen — Carousel", platform:"Facebook Feed", spend:"$480", roas:"5.4×", status:"Active"},
                    {name:"Eco Wraps — Story Ads", platform:"Instagram Stories", spend:"$320", roas:"6.2×", status:"Active"},
                    {name:"ZORIYA AI — Brand Awareness", platform:"Facebook Feed", spend:"$700", roas:"3.1×", status:"Paused"},
                  ].map((c,i,arr)=>(
                    <div key={i} className="row-item" style={{ padding:"12px 16px", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none", display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:12, fontWeight:600, color:T.textPrimary, marginBottom:2 }}>{c.name}</p>
                        <p style={{ fontSize:10, color:T.textMuted }}>{c.platform}</p>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <p style={{ fontSize:12, fontWeight:700, color:T.amber, fontFamily:"'Geist Mono', monospace" }}>{c.spend}</p>
                        <p style={{ fontSize:11, fontWeight:700, color:c.status==="Active"?T.green:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>ROAS {c.roas}</p>
                      </div>
                      <Tag color={c.status==="Active"?T.green:T.amber}>{c.status}</Tag>
                    </div>
                  ))}
                </Card>

                {/* Audience breakdown */}
                <Card style={{ padding:20 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Top Converting Audiences</p>
                  {[
                    {label:"Women 25–34 · Home & Kitchen",  conv:38, pct:82},
                    {label:"Women 35–44 · Lifestyle",       conv:24, pct:65},
                    {label:"Men 28–40 · Coffee & Cooking",  conv:17, pct:48},
                    {label:"Women 18–24 · Eco / Sustainable",conv:12, pct:38},
                  ].map((a,i)=>(
                    <div key={i} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:12, color:T.textSecondary }}>{a.label}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:"#1877F2", fontFamily:"'Geist Mono', monospace" }}>{a.conv} conv.</span>
                      </div>
                      <div style={{ height:4, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${a.pct}%`, background:"#1877F2", borderRadius:2, opacity:0.6+a.pct*0.004 }}/>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>

              {/* Aria Meta recommendations */}
              <Card style={{ padding:20 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:14 }}>
                  <Dot color={EC_PINK} pulse />
                  <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>Aria's Meta Recommendations</p>
                </div>
                {[
                  {text:"Instagram Reels outperforming Facebook Feed by 2.7× ROAS. Shift 30% of Facebook budget to Reels.", action:"Reallocate", urgent:true},
                  {text:"'ZORIYA AI Brand' campaign is paused. CTR was 0.9% — below the 1.5% benchmark. Test a new hook creative before reactivating.", action:"New Creative", urgent:false},
                  {text:"Women 25–34 Home & Kitchen audience is your #1 converter. Build a Lookalike audience from this segment — estimated 2× reach.", action:"Create LAL", urgent:true},
                  {text:"Ad frequency on Eco Wraps Story Ads has hit 4.2 — audience fatigue likely. Rotate in 2 new creatives this week.", action:"Refresh Ads", urgent:true},
                ].map((r,i)=>(
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"11px 0", borderBottom:i<3?`1px solid ${T.border}`:"none" }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:r.urgent?"#1877F2":T.textMuted, flexShrink:0, boxShadow:r.urgent?"0 0 6px #1877F2":undefined }}/>
                    <p style={{ fontSize:12, color:T.textSecondary, flex:1, lineHeight:1.55 }}>{r.text}</p>
                    <button style={{ padding:"5px 12px", borderRadius:7, background:"rgba(24,119,242,0.15)", border:"1px solid rgba(24,119,242,0.3)", color:"#1877F2", fontSize:11, fontWeight:600, cursor:"pointer", flexShrink:0 }}>{r.action}</button>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── DOCUMENT GENERATOR ─────────────────────────────────────────────────── */

const DOC_INDIGO = "#6366F1";

const CONTRACT_TEMPLATES = [
  {
    id:"sow",     label:"Statement of Work",          icon:"◈",
    desc:"Project scope, deliverables, timeline, and payment terms for client engagements.",
    fields:["Client Name","Client Company","Project Name","Project Scope","Deliverables","Timeline","Total Value","Payment Schedule","Your Name","Your Company"],
  },
  {
    id:"nda",     label:"Non-Disclosure Agreement",   icon:"◉",
    desc:"Mutual or one-way NDA to protect confidential information shared with clients or partners.",
    fields:["Party 1 Name","Party 1 Company","Party 2 Name","Party 2 Company","Purpose of Disclosure","Duration (months)","Governing State/Country"],
  },
  {
    id:"retainer",label:"Monthly Retainer Agreement", icon:"◷",
    desc:"Ongoing services retainer with monthly fee, scope of services, and termination clause.",
    fields:["Client Name","Client Company","Services Description","Monthly Retainer Fee","Start Date","Notice Period (days)","Your Name","Your Company"],
  },
  {
    id:"proposal", label:"Client Proposal",           icon:"◆",
    desc:"Professional proposal outlining your solution, pricing tiers, timeline, and next steps.",
    fields:["Client Name","Client Company","Problem Statement","Proposed Solution","Package Name","Package Price","Timeline","Your Name","Your Company"],
  },
  {
    id:"freelance",label:"Freelance Service Contract", icon:"◧",
    desc:"Single-project freelance contract with IP ownership, revisions policy, and kill fee clause.",
    fields:["Client Name","Freelancer Name","Project Description","Project Fee","Revision Rounds","Deposit Amount","Completion Date","Kill Fee %"],
  },
  {
    id:"partnership",label:"Partnership Agreement",   icon:"⊞",
    desc:"Outlines responsibilities, revenue split, IP ownership, and exit terms between two parties.",
    fields:["Partner 1 Name","Partner 2 Name","Business Name","Revenue Split %","Each Partner's Responsibilities","Initial Investment Each","Exit Clause Notice (days)","Governing State"],
  },
];

const GENERATED_DOCS = [
  {id:1, name:"SOW — Meridian Financial AI Project", template:"Statement of Work",  client:"Meridian Financial", value:"$150,000", date:"2026-03-05", status:"Sent"},
  {id:2, name:"NDA — Apex Logistics",                template:"NDA",                client:"Apex Logistics",     value:"—",        date:"2026-03-04", status:"Signed"},
  {id:3, name:"Retainer — Greenfield Properties",    template:"Monthly Retainer",   client:"Greenfield",        value:"$4,500/mo", date:"2026-03-02", status:"Active"},
  {id:4, name:"Proposal — NovaTech Solutions",       template:"Client Proposal",    client:"NovaTech",          value:"$95,000",   date:"2026-02-28", status:"Draft"},
];

function DocgenView() {
  const [tab, setTab]           = useState("generate");
  const [selTemplate, setSelTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleField = (field, val) => setFormData(prev=>({...prev,[field]:val}));

  const generate = () => {
    if(!selTemplate) return;
    setGenerating(true);
    setTimeout(()=>{ setGenerating(false); setGenerated(true); }, 2200);
  };

  const statusClr = s => s==="Signed"||s==="Active"?T.green:s==="Sent"?T.blueLight:T.amber;

  const PREVIEW_TEXT = {
    sow:`STATEMENT OF WORK\n\nThis Statement of Work ("SOW") is entered into as of ${new Date().toLocaleDateString()} between ${formData["Your Company"]||"[Your Company]"} ("Service Provider") and ${formData["Client Company"]||"[Client Company]"} ("Client").\n\n1. PROJECT SCOPE\n${formData["Project Scope"]||"[Describe the full scope of work here]"}\n\n2. DELIVERABLES\n${formData["Deliverables"]||"[List all deliverables]"}\n\n3. TIMELINE\nProject shall be completed within ${formData["Timeline"]||"[X weeks/months]"} of the project start date.\n\n4. COMPENSATION\nTotal project value: ${formData["Total Value"]||"[Amount]"}\nPayment schedule: ${formData["Payment Schedule"]||"50% deposit, 50% on completion"}\n\n5. SIGNATURES\n\n_________________________\n${formData["Your Name"]||"[Your Name]"}, ${formData["Your Company"]||"[Your Company]"}\n\n_________________________\n${formData["Client Name"]||"[Client Name]"}, ${formData["Client Company"]||"[Client Company]"}`,
    nda:`NON-DISCLOSURE AGREEMENT\n\nThis NDA is entered into as of ${new Date().toLocaleDateString()} between ${formData["Party 1 Name"]||"[Party 1]"} ("Disclosing Party") and ${formData["Party 2 Name"]||"[Party 2]"} ("Receiving Party").\n\n1. CONFIDENTIAL INFORMATION\nBoth parties agree to keep all shared information confidential in connection with: ${formData["Purpose of Disclosure"]||"[Purpose]"}\n\n2. DURATION\nThis agreement remains in effect for ${formData["Duration (months)"]||"24"} months.\n\n3. GOVERNING LAW\nThis agreement shall be governed by the laws of ${formData["Governing State/Country"]||"[State/Country]"}.`,
    default:`CONTRACT DOCUMENT\n\nThis agreement is entered into as of ${new Date().toLocaleDateString()}.\n\nAll terms and conditions as discussed and agreed upon between the signing parties shall apply. This document was generated by ZORIYA AI Document Generator.\n\n[Full contract terms will appear here based on your inputs]\n\n_________________________\nSignature · Date`,
  };

  return (
    <div style={{ padding:28, animation:"fadeUp .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.14em", marginBottom:5, fontFamily:"'Geist Mono', monospace" }}>ZORIYA AI · LEGAL & DOCUMENTS</p>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.textPrimary, letterSpacing:"-0.02em" }}>Contract Gen</h1>
          <p style={{ fontSize:13, color:T.textSecondary, marginTop:5 }}>Generate professional contracts and proposals in seconds. Powered by Zoriya.</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", borderRadius:10, background:`${DOC_INDIGO}10`, border:`1px solid ${DOC_INDIGO}28` }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`${DOC_INDIGO}22`, border:`1.5px solid ${DOC_INDIGO}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:DOC_INDIGO, fontFamily:"'Geist Mono', monospace" }}>ZA</div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:13, fontWeight:700, color:T.textPrimary }}>Zoriya</span>
              <Dot color={DOC_INDIGO} pulse />
            </div>
            <span style={{ fontSize:10, color:T.textMuted }}>Document Intelligence Agent</span>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:2, marginBottom:24, borderBottom:`1px solid ${T.border}` }}>
        {[{id:"generate",label:"Generate Document"},{id:"library",label:"Document Library"},{id:"history",label:"History"}].map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setGenerated(false);}} style={{ padding:"9px 16px", background:"transparent", border:"none", borderBottom:`2px solid ${tab===t.id?DOC_INDIGO:"transparent"}`, color:tab===t.id?T.textPrimary:T.textSecondary, fontSize:13, fontWeight:tab===t.id?600:400, cursor:"pointer", fontFamily:"'Outfit', sans-serif", marginBottom:-1, transition:"all .15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GENERATE ── */}
      {tab==="generate" && (
        <div style={{ animation:"fadeUp .2s ease" }}>
          {!generated ? (
            <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20 }}>
              {/* Template picker */}
              <div>
                <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:12, fontFamily:"'Geist Mono', monospace" }}>CHOOSE TEMPLATE</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {CONTRACT_TEMPLATES.map(t=>(
                    <button key={t.id} onClick={()=>{setSelTemplate(t);setFormData({});setGenerated(false);}} style={{ padding:"12px 14px", borderRadius:10, background:selTemplate?.id===t.id?`${DOC_INDIGO}18`:"rgba(255,255,255,0.03)", border:`1px solid ${selTemplate?.id===t.id?DOC_INDIGO+"55":T.border}`, cursor:"pointer", textAlign:"left", transition:"all .15s" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:12, color:DOC_INDIGO, fontFamily:"'Geist Mono', monospace" }}>{t.icon}</span>
                        <span style={{ fontSize:13, fontWeight:600, color:selTemplate?.id===t.id?T.textPrimary:T.textSecondary }}>{t.label}</span>
                      </div>
                      <p style={{ fontSize:11, color:T.textMuted, lineHeight:1.5 }}>{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div>
                {selTemplate ? (
                  <Card style={{ padding:24 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                      <div>
                        <h3 style={{ fontSize:16, fontWeight:700, color:T.textPrimary, marginBottom:4 }}>{selTemplate.label}</h3>
                        <p style={{ fontSize:12, color:T.textMuted }}>{selTemplate.desc}</p>
                      </div>
                      <Tag color={DOC_INDIGO}>AI-Powered</Tag>
                    </div>
                    <div style={{ height:1, background:T.border, marginBottom:18 }}/>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                      {selTemplate.fields.map(field=>(
                        <div key={field}>
                          <label style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", fontFamily:"'Geist Mono', monospace", display:"block", marginBottom:5 }}>{field.toUpperCase()}</label>
                          <input
                            value={formData[field]||""}
                            onChange={e=>handleField(field,e.target.value)}
                            placeholder={`Enter ${field.toLowerCase()}…`}
                            style={{ width:"100%", padding:"9px 12px", borderRadius:8, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, color:T.textPrimary, fontSize:13, outline:"none", transition:"border-color .15s" }}
                            onFocus={e=>e.target.style.borderColor=DOC_INDIGO+"66"}
                            onBlur={e=>e.target.style.borderColor=T.border}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ padding:"12px 16px", borderRadius:10, background:`${DOC_INDIGO}08`, border:`1px solid ${DOC_INDIGO}20`, marginBottom:18 }}>
                      <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:5 }}>
                        <Dot color={DOC_INDIGO} pulse />
                        <span style={{ fontSize:11, fontWeight:600, color:DOC_INDIGO }}>Zoriya will:</span>
                      </div>
                      <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.65 }}>
                        Fill in all legal boilerplate, liability clauses, IP ownership terms, and jurisdiction-appropriate language. You provide the business details — Zoriya handles the legal structure.
                      </p>
                    </div>
                    <button onClick={generate} style={{ width:"100%", padding:"12px", borderRadius:10, background:`linear-gradient(135deg,${DOC_INDIGO},${MKT_VIOLET})`, border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", letterSpacing:"0.02em" }}>
                      {generating ? "Generating Document…" : "Generate Document"}
                    </button>
                    {generating && (
                      <div style={{ marginTop:12, display:"flex", gap:8, alignItems:"center", justifyContent:"center" }}>
                        {["Analysing inputs","Applying legal structure","Formatting document"].map((s,i)=>(
                          <div key={s} style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <div style={{ width:5, height:5, borderRadius:"50%", background:DOC_INDIGO, animation:`pulse 1.2s ${i*0.4}s ease-in-out infinite` }}/>
                            <span style={{ fontSize:10, color:T.textMuted }}>{s}</span>
                            {i<2 && <span style={{ color:T.border }}>→</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:300, gap:10 }}>
                    <div style={{ fontSize:32, color:T.textMuted }}>◈</div>
                    <p style={{ fontSize:14, fontWeight:600, color:T.textPrimary }}>Select a template</p>
                    <p style={{ fontSize:12, color:T.textMuted }}>Choose a contract type on the left to get started.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Generated document preview ── */
            <div style={{ animation:"fadeUp .25s ease" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:20 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:T.green, boxShadow:`0 0 8px ${T.green}` }}/>
                <span style={{ fontSize:14, fontWeight:700, color:T.green }}>Document generated successfully</span>
                <button onClick={()=>{setGenerated(false);}} style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:8, background:"rgba(255,255,255,0.05)", border:`1px solid ${T.border}`, color:T.textSecondary, fontSize:12, cursor:"pointer" }}>← Edit Inputs</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>
                {/* Document preview */}
                <Card style={{ padding:32, fontFamily:"Georgia, serif" }}>
                  <div style={{ maxWidth:600, margin:"0 auto" }}>
                    <div style={{ textAlign:"center", marginBottom:28, borderBottom:`1px solid ${T.border}`, paddingBottom:20 }}>
                      <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.2em", fontFamily:"'Geist Mono', monospace", marginBottom:8 }}>ZORIYA AI · DOCUMENT GENERATOR</p>
                      <h2 style={{ fontSize:20, fontWeight:700, color:T.textPrimary, letterSpacing:"0.02em" }}>{selTemplate?.label?.toUpperCase()}</h2>
                      <p style={{ fontSize:11, color:T.textMuted, marginTop:6, fontFamily:"'Geist Mono', monospace" }}>Generated {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p>
                    </div>
                    <pre style={{ fontSize:12, color:T.textSecondary, lineHeight:1.9, whiteSpace:"pre-wrap", fontFamily:"Georgia, serif" }}>
                      {PREVIEW_TEXT[selTemplate?.id] || PREVIEW_TEXT.default}
                    </pre>
                  </div>
                </Card>
                {/* Actions */}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <Card style={{ padding:18 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Document Actions</p>
                    {[
                      {label:"Download as PDF",   icon:"↓", color:DOC_INDIGO},
                      {label:"Download as DOCX",  icon:"↓", color:T.blueLight},
                      {label:"Copy to Clipboard", icon:"⧉", color:T.textSecondary},
                      {label:"Send to Client",    icon:"→", color:T.green},
                      {label:"Save to Library",   icon:"◉", color:MKT_VIOLET},
                    ].map(a=>(
                      <button key={a.label} style={{ width:"100%", padding:"10px 14px", borderRadius:9, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}`, color:a.color, fontSize:13, fontWeight:500, cursor:"pointer", marginBottom:8, textAlign:"left", display:"flex", alignItems:"center", gap:10, transition:"all .15s" }}
                        onMouseEnter={e=>{e.currentTarget.style.background=`${a.color}12`;e.currentTarget.style.borderColor=`${a.color}44`;}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor=T.border;}}>
                        <span style={{ fontSize:14 }}>{a.icon}</span> {a.label}
                      </button>
                    ))}
                  </Card>
                  <Card style={{ padding:16 }}>
                    <p style={{ fontSize:11, color:T.textMuted, lineHeight:1.65, fontStyle:"italic" }}>
                      ⚠ This document is AI-generated for reference. Have a licensed attorney review before sending to clients for legally binding engagements.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LIBRARY ── */}
      {tab==="library" && (
        <div style={{ animation:"fadeUp .2s ease" }}>
          <p style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", marginBottom:16, fontFamily:"'Geist Mono', monospace" }}>TEMPLATE LIBRARY — {CONTRACT_TEMPLATES.length} TEMPLATES</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {CONTRACT_TEMPLATES.map(t=>(
              <Card key={t.id} className="card" style={{ padding:18, cursor:"pointer" }} onClick={()=>{setTab("generate");setSelTemplate(t);setFormData({});setGenerated(false);}}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:`${DOC_INDIGO}18`, border:`1px solid ${DOC_INDIGO}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14, color:DOC_INDIGO, fontFamily:"'Geist Mono', monospace" }}>{t.icon}</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:T.textPrimary, marginBottom:3 }}>{t.label}</p>
                    <p style={{ fontSize:11, color:T.textMuted, lineHeight:1.5 }}>{t.desc}</p>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${T.border}`, paddingTop:10 }}>
                  <span style={{ fontSize:10, color:T.textMuted }}>{t.fields.length} fields</span>
                  <button style={{ fontSize:11, color:DOC_INDIGO, background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Use Template →</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── HISTORY ── */}
      {tab==="history" && (
        <div style={{ animation:"fadeUp .2s ease" }}>
          <Card style={{ padding:0, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 140px 110px 90px 80px", padding:"10px 18px", borderBottom:`1px solid ${T.border}`, fontSize:9, color:T.textMuted, fontFamily:"'Geist Mono', monospace", letterSpacing:"0.08em", gap:8 }}>
              <span>DOCUMENT</span><span>TEMPLATE</span><span style={{textAlign:"right"}}>VALUE</span><span style={{textAlign:"right"}}>DATE</span><span style={{textAlign:"right"}}>STATUS</span>
            </div>
            {GENERATED_DOCS.map((doc,i)=>(
              <div key={doc.id} className="row-item" style={{ display:"grid", gridTemplateColumns:"2fr 140px 110px 90px 80px", padding:"14px 18px", borderBottom:i<GENERATED_DOCS.length-1?`1px solid ${T.border}`:"none", alignItems:"center", gap:8, cursor:"pointer" }}
                onClick={()=>setPreviewDoc(previewDoc?.id===doc.id?null:doc)}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{doc.name}</p>
                  <p style={{ fontSize:11, color:T.textMuted }}>{doc.client}</p>
                </div>
                <Tag color={DOC_INDIGO}>{doc.template}</Tag>
                <p style={{ textAlign:"right", fontSize:12, fontWeight:700, color:T.green, fontFamily:"'Geist Mono', monospace" }}>{doc.value}</p>
                <p style={{ textAlign:"right", fontSize:11, color:T.textMuted, fontFamily:"'Geist Mono', monospace" }}>{doc.date}</p>
                <div style={{ display:"flex", justifyContent:"flex-end" }}><Tag color={statusClr(doc.status)}>{doc.status}</Tag></div>
              </div>
            ))}
          </Card>
          {previewDoc && (
            <Card style={{ padding:20, marginTop:14, animation:"fadeUp .2s ease", border:`1px solid ${DOC_INDIGO}33` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:T.textPrimary }}>{previewDoc.name}</h3>
                <div style={{ display:"flex", gap:8 }}>
                  <button style={{ padding:"6px 14px", borderRadius:8, background:`${DOC_INDIGO}18`, border:`1px solid ${DOC_INDIGO}33`, color:DOC_INDIGO, fontSize:12, cursor:"pointer" }}>Download PDF</button>
                  <button style={{ padding:"6px 14px", borderRadius:8, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, color:T.textSecondary, fontSize:12, cursor:"pointer" }}>Send to Client</button>
                </div>
              </div>
              <div style={{ display:"flex", gap:14 }}>
                {[{l:"Client",v:previewDoc.client},{l:"Template",v:previewDoc.template},{l:"Value",v:previewDoc.value},{l:"Created",v:previewDoc.date},{l:"Status",v:previewDoc.status}].map(m=>(
                  <div key={m.l} style={{ padding:"10px 14px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                    <p style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:3, fontFamily:"'Geist Mono', monospace" }}>{m.l.toUpperCase()}</p>
                    <p style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{m.v}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive]   = useState("hq");
  const [authed, setAuthed]   = useState(() => sessionStorage.getItem("zmc_auth")==="1");
  const live = useLiveData();

  const handleLogin = () => { sessionStorage.setItem("zmc_auth","1"); setAuthed(true); };
  if(!authed) return <LoginView onLogin={handleLogin} />;
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
    lab:       <LabView />,
    ecommerce: <EcommerceView />,
    arbitrage: <ArbitrageView />,
    marketing: <MarketingView />,
    docgen:    <DocgenView />,
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
