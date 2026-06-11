import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

// ─── FIREBASE ─────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAE_GXAmfPbKtQsHRVZl28zitk3oYHfSWI",
  authDomain: "wc-quiniela-4d474.firebaseapp.com",
  projectId: "wc-quiniela-4d474",
  storageBucket: "wc-quiniela-4d474.firebasestorage.app",
  messagingSenderId: "631051017810",
  appId: "1:631051017810:web:cf4afd7f0cadd52292c98b"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "dzalles@iterla.com";
const EMAILJS_TEMPLATE_ID = "template_33yasn5";


const ADMIN_PW = "wc2026admin";

// ─── MATCHES ──────────────────────────────────────────────────────────────────
const ALL_MATCHES = [
  { id:"G1",  date:"Jun 11", kickoff:"2026-06-11T19:00:00Z", home:"Mexico",       away:"South Africa",   group:"A" },
  { id:"G2",  date:"Jun 11", kickoff:"2026-06-12T02:00:00Z", home:"South Korea",  away:"Czechia",        group:"A" },
  { id:"G3",  date:"Jun 12", kickoff:"2026-06-12T19:00:00Z", home:"Canada",       away:"Bosnia & Herz.", group:"B" },
  { id:"G4",  date:"Jun 12", kickoff:"2026-06-13T01:00:00Z", home:"USA",          away:"Paraguay",       group:"D" },
  { id:"G5",  date:"Jun 13", kickoff:"2026-06-13T19:00:00Z", home:"Qatar",        away:"Switzerland",    group:"B" },
  { id:"G6",  date:"Jun 13", kickoff:"2026-06-13T22:00:00Z", home:"Brazil",       away:"Morocco",        group:"C" },
  { id:"G7",  date:"Jun 13", kickoff:"2026-06-14T01:00:00Z", home:"Haiti",        away:"Scotland",       group:"C" },
  { id:"G8",  date:"Jun 13", kickoff:"2026-06-14T04:00:00Z", home:"Australia",    away:"Turkey",         group:"D" },
  { id:"G9",  date:"Jun 14", kickoff:"2026-06-14T17:00:00Z", home:"Germany",      away:"Curaçao",        group:"E" },
  { id:"G10", date:"Jun 14", kickoff:"2026-06-14T20:00:00Z", home:"Netherlands",  away:"Japan",          group:"F" },
  { id:"G11", date:"Jun 14", kickoff:"2026-06-14T23:00:00Z", home:"Ivory Coast",  away:"Ecuador",        group:"E" },
  { id:"G12", date:"Jun 15", kickoff:"2026-06-15T02:00:00Z", home:"Sweden",       away:"Tunisia",        group:"F" },
  { id:"G13", date:"Jun 15", kickoff:"2026-06-15T17:00:00Z", home:"Spain",        away:"Cape Verde",     group:"H" },
  { id:"G14", date:"Jun 15", kickoff:"2026-06-15T20:00:00Z", home:"Belgium",      away:"Egypt",          group:"G" },
  { id:"G15", date:"Jun 15", kickoff:"2026-06-15T22:00:00Z", home:"Saudi Arabia", away:"Uruguay",        group:"H" },
  { id:"G16", date:"Jun 16", kickoff:"2026-06-16T01:00:00Z", home:"Iran",         away:"New Zealand",    group:"G" },
  { id:"G17", date:"Jun 16", kickoff:"2026-06-16T19:00:00Z", home:"France",       away:"Senegal",        group:"I" },
  { id:"G18", date:"Jun 16", kickoff:"2026-06-16T22:00:00Z", home:"Iraq",         away:"Norway",         group:"I" },
  { id:"G19", date:"Jun 17", kickoff:"2026-06-17T01:00:00Z", home:"Argentina",    away:"Algeria",        group:"J" },
  { id:"G20", date:"Jun 17", kickoff:"2026-06-17T04:00:00Z", home:"Austria",      away:"Jordan",         group:"J" },
  { id:"G21", date:"Jun 17", kickoff:"2026-06-17T17:00:00Z", home:"Portugal",     away:"DR Congo",       group:"K" },
  { id:"G22", date:"Jun 17", kickoff:"2026-06-17T20:00:00Z", home:"Uzbekistan",   away:"Colombia",       group:"K" },
  { id:"G23", date:"Jun 17", kickoff:"2026-06-17T22:00:00Z", home:"England",      away:"Panama",         group:"L" },
  { id:"G24", date:"Jun 18", kickoff:"2026-06-18T01:00:00Z", home:"Ghana",        away:"Croatia",        group:"L" },
  { id:"G25", date:"Jun 18", kickoff:"2026-06-18T17:00:00Z", home:"Mexico",       away:"South Korea",    group:"A" },
  { id:"G26", date:"Jun 18", kickoff:"2026-06-18T20:00:00Z", home:"Czechia",      away:"South Africa",   group:"A" },
  { id:"G27", date:"Jun 18", kickoff:"2026-06-18T23:00:00Z", home:"Switzerland",  away:"Bosnia & Herz.", group:"B" },
  { id:"G28", date:"Jun 19", kickoff:"2026-06-19T02:00:00Z", home:"Canada",       away:"Qatar",          group:"B" },
  { id:"G29", date:"Jun 19", kickoff:"2026-06-19T17:00:00Z", home:"USA",          away:"Australia",      group:"D" },
  { id:"G30", date:"Jun 19", kickoff:"2026-06-19T20:00:00Z", home:"Turkey",       away:"Paraguay",       group:"D" },
  { id:"G31", date:"Jun 19", kickoff:"2026-06-19T23:00:00Z", home:"Morocco",      away:"Haiti",          group:"C" },
  { id:"G32", date:"Jun 20", kickoff:"2026-06-20T02:00:00Z", home:"Brazil",       away:"Scotland",       group:"C" },
  { id:"G33", date:"Jun 20", kickoff:"2026-06-20T17:00:00Z", home:"Germany",      away:"Ivory Coast",    group:"E" },
  { id:"G34", date:"Jun 20", kickoff:"2026-06-20T20:00:00Z", home:"Ecuador",      away:"Curaçao",        group:"E" },
  { id:"G35", date:"Jun 20", kickoff:"2026-06-20T23:00:00Z", home:"Netherlands",  away:"Sweden",         group:"F" },
  { id:"G36", date:"Jun 21", kickoff:"2026-06-21T02:00:00Z", home:"Japan",        away:"Tunisia",        group:"F" },
  { id:"G37", date:"Jun 21", kickoff:"2026-06-21T17:00:00Z", home:"Belgium",      away:"Iran",           group:"G" },
  { id:"G38", date:"Jun 21", kickoff:"2026-06-21T20:00:00Z", home:"New Zealand",  away:"Egypt",          group:"G" },
  { id:"G39", date:"Jun 21", kickoff:"2026-06-21T23:00:00Z", home:"Spain",        away:"Saudi Arabia",   group:"H" },
  { id:"G40", date:"Jun 22", kickoff:"2026-06-22T02:00:00Z", home:"Uruguay",      away:"Cape Verde",     group:"H" },
  { id:"G41", date:"Jun 22", kickoff:"2026-06-22T17:00:00Z", home:"Argentina",    away:"Austria",        group:"J" },
  { id:"G42", date:"Jun 22", kickoff:"2026-06-22T20:00:00Z", home:"Jordan",       away:"Algeria",        group:"J" },
  { id:"G43", date:"Jun 22", kickoff:"2026-06-22T23:00:00Z", home:"France",       away:"Iraq",           group:"I" },
  { id:"G44", date:"Jun 23", kickoff:"2026-06-23T02:00:00Z", home:"Norway",       away:"Senegal",        group:"I" },
  { id:"G45", date:"Jun 23", kickoff:"2026-06-23T17:00:00Z", home:"Portugal",     away:"Uzbekistan",     group:"K" },
  { id:"G46", date:"Jun 23", kickoff:"2026-06-23T20:00:00Z", home:"Colombia",     away:"DR Congo",       group:"K" },
  { id:"G47", date:"Jun 23", kickoff:"2026-06-23T23:00:00Z", home:"England",      away:"Ghana",          group:"L" },
  { id:"G48", date:"Jun 24", kickoff:"2026-06-24T02:00:00Z", home:"Croatia",      away:"Panama",         group:"L" },
  { id:"G49", date:"Jun 24", kickoff:"2026-06-24T17:00:00Z", home:"South Korea",  away:"South Africa",   group:"A" },
  { id:"G50", date:"Jun 24", kickoff:"2026-06-24T20:00:00Z", home:"Mexico",       away:"Czechia",        group:"A" },
  { id:"G51", date:"Jun 24", kickoff:"2026-06-24T23:00:00Z", home:"Bosnia & Herz.",away:"Qatar",         group:"B" },
  { id:"G52", date:"Jun 25", kickoff:"2026-06-25T02:00:00Z", home:"Switzerland",  away:"Canada",         group:"B" },
  { id:"G53", date:"Jun 25", kickoff:"2026-06-25T17:00:00Z", home:"Scotland",     away:"Morocco",        group:"C" },
  { id:"G54", date:"Jun 25", kickoff:"2026-06-25T20:00:00Z", home:"Haiti",        away:"Brazil",         group:"C" },
  { id:"G55", date:"Jun 25", kickoff:"2026-06-25T23:00:00Z", home:"Paraguay",     away:"Australia",      group:"D" },
  { id:"G56", date:"Jun 26", kickoff:"2026-06-26T02:00:00Z", home:"Turkey",       away:"USA",            group:"D" },
  { id:"G57", date:"Jun 26", kickoff:"2026-06-26T17:00:00Z", home:"Curaçao",      away:"Germany",        group:"E" },
  { id:"G58", date:"Jun 26", kickoff:"2026-06-26T20:00:00Z", home:"Ecuador",      away:"Ivory Coast",    group:"E" },
  { id:"G59", date:"Jun 26", kickoff:"2026-06-26T20:00:00Z", home:"Tunisia",      away:"Netherlands",    group:"F" },
  { id:"G60", date:"Jun 26", kickoff:"2026-06-26T23:00:00Z", home:"Sweden",       away:"Japan",          group:"F" },
  { id:"G61", date:"Jun 26", kickoff:"2026-06-26T19:00:00Z", home:"Norway",       away:"France",         group:"I" },
  { id:"G62", date:"Jun 26", kickoff:"2026-06-26T19:00:00Z", home:"Senegal",      away:"Iraq",           group:"I" },
  { id:"G63", date:"Jun 26", kickoff:"2026-06-26T23:00:00Z", home:"Cape Verde",   away:"Saudi Arabia",   group:"H" },
  { id:"G64", date:"Jun 26", kickoff:"2026-06-26T23:00:00Z", home:"Uruguay",      away:"Spain",          group:"H" },
  { id:"G65", date:"Jun 27", kickoff:"2026-06-27T02:00:00Z", home:"Egypt",        away:"Iran",           group:"G" },
  { id:"G66", date:"Jun 27", kickoff:"2026-06-27T02:00:00Z", home:"New Zealand",  away:"Belgium",        group:"G" },
  { id:"G67", date:"Jun 27", kickoff:"2026-06-27T21:00:00Z", home:"Panama",       away:"England",        group:"L" },
  { id:"G68", date:"Jun 27", kickoff:"2026-06-27T21:00:00Z", home:"Croatia",      away:"Ghana",          group:"L" },
  { id:"G69", date:"Jun 27", kickoff:"2026-06-27T23:30:00Z", home:"Colombia",     away:"Portugal",       group:"K" },
  { id:"G70", date:"Jun 27", kickoff:"2026-06-27T23:30:00Z", home:"DR Congo",     away:"Uzbekistan",     group:"K" },
  { id:"G71", date:"Jun 28", kickoff:"2026-06-28T02:00:00Z", home:"Algeria",      away:"Austria",        group:"J" },
  { id:"G72", date:"Jun 28", kickoff:"2026-06-28T02:00:00Z", home:"Jordan",       away:"Argentina",      group:"J" },
];

const FLAGS = {
  "Mexico":"🇲🇽","South Korea":"🇰🇷","Czechia":"🇨🇿","South Africa":"🇿🇦",
  "Switzerland":"🇨🇭","Canada":"🇨🇦","Qatar":"🇶🇦","Bosnia & Herz.":"🇧🇦",
  "Brazil":"🇧🇷","Morocco":"🇲🇦","Scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Haiti":"🇭🇹",
  "USA":"🇺🇸","Turkey":"🇹🇷","Australia":"🇦🇺","Paraguay":"🇵🇾",
  "Germany":"🇩🇪","Ecuador":"🇪🇨","Ivory Coast":"🇨🇮","Curaçao":"🇨🇼",
  "Netherlands":"🇳🇱","Japan":"🇯🇵","Sweden":"🇸🇪","Tunisia":"🇹🇳",
  "Belgium":"🇧🇪","Egypt":"🇪🇬","Iran":"🇮🇷","New Zealand":"🇳🇿",
  "Spain":"🇪🇸","Uruguay":"🇺🇾","Saudi Arabia":"🇸🇦","Cape Verde":"🇨🇻",
  "France":"🇫🇷","Senegal":"🇸🇳","Norway":"🇳🇴","Iraq":"🇮🇶",
  "Argentina":"🇦🇷","Austria":"🇦🇹","Algeria":"🇩🇿","Jordan":"🇯🇴",
  "Portugal":"🇵🇹","Colombia":"🇨🇴","DR Congo":"🇨🇩","Uzbekistan":"🇺🇿",
  "England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croatia":"🇭🇷","Ghana":"🇬🇭","Panama":"🇵🇦",
};

function calcScore(pred, actual) {
  if (!actual||actual.h==null||actual.a==null||actual.h===""||actual.a==="") return 0;
  if (!pred||pred.h==null||pred.a==null||pred.h===""||pred.a==="") return 0;
  const ph=Number(pred.h),pa=Number(pred.a),ah=Number(actual.h),aa=Number(actual.a);
  if (isNaN(ph)||isNaN(pa)||isNaN(ah)||isNaN(aa)) return 0;
  if (ph===ah&&pa===aa) return 3;
  const pw=ph>pa?"h":ph<pa?"a":"d",aw=ah>aa?"h":ah<aa?"a":"d";
  return pw===aw?1:0;
}

function isLocked(match) { return new Date() >= new Date(match.kickoff); }

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg:"#001254", bgCard:"#0a1f6e", bgDeep:"#000d3a",
  navy:"#002171", blue:"#20428E",
  teal:"#20B2AA", light:"#83BAB5",
  white:"#f0f8ff", muted:"#83BAB5", border:"#1a3080",
  gold:"#f5c842", green:"#2ecc71", red:"#e74c3c",
};

function ScoreInput({h,a,onChange,disabled}) {
  const s={width:48,height:48,textAlign:"center",background:disabled?T.bgDeep:T.blue,border:`2px solid ${disabled?T.border:T.teal}`,borderRadius:10,color:disabled?"#1a3a6a":T.white,fontSize:22,fontWeight:900,fontFamily:"'Courier New',monospace",outline:"none",cursor:disabled?"not-allowed":"text"};
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <input type="number" min="0" max="99" value={h??""} disabled={disabled} onChange={e=>onChange({h:e.target.value,a})} style={s}/>
      <span style={{color:disabled?T.border:T.teal,fontWeight:900,fontSize:24,fontFamily:"monospace"}}>:</span>
      <input type="number" min="0" max="99" value={a??""} disabled={disabled} onChange={e=>onChange({h,a:e.target.value})} style={s}/>
    </div>
  );
}

// ─── PREDICT PAGE ─────────────────────────────────────────────────────────────
function PredictPage({matchId, userId, userName}) {
  const match = ALL_MATCHES.find(m=>m.id===matchId);
  const [pred, setPred] = useState({h:"",a:""});
  const [actual, setActual] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const locked = match ? isLocked(match) : false;

  useEffect(()=>{
    if (!match) return;
    async function load() {
      const pSnap = await getDoc(doc(db,"match_predictions",`${matchId}_${userId}`));
      if (pSnap.exists()) { setPred(pSnap.data()); setSubmitted(true); }
      const aSnap = await getDoc(doc(db,"actuals","results"));
      if (aSnap.exists()&&aSnap.data()[matchId]) setActual(aSnap.data()[matchId]);
      setLoading(false);
    }
    load();
  },[matchId,userId]);

  async function handleSubmit() {
    if (pred.h===""||pred.a==="") return;
    await setDoc(doc(db,"match_predictions",`${matchId}_${userId}`),{
      ...pred, userId, userName, matchId, submittedAt: new Date().toISOString()
    });
    setSubmitted(true);
  }

  const pts = actual ? calcScore(pred, actual) : null;

  if (!match) return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,fontFamily:"sans-serif"}}>Match not found.</div>;
  if (loading) return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.teal,fontSize:36}}>⚽</div>;

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${T.navy} 0%,${T.blue} 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{maxWidth:400,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:11,color:T.teal,letterSpacing:4,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Group {match.group} · {match.date}</div>
          <div style={{fontSize:32,fontWeight:900,color:T.white,letterSpacing:-0.5}}>⚽ Match Prediction</div>
          <div style={{color:T.light,fontSize:13,marginTop:4}}>Hey <strong style={{color:T.teal}}>{userName}</strong>! Pick your score before kickoff.</div>
        </div>

        <div style={{background:"rgba(0,33,113,0.7)",backdropFilter:"blur(10px)",border:`1px solid ${T.border}`,borderRadius:20,padding:"28px 22px",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          {/* Teams */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,gap:8}}>
            <div style={{textAlign:"center",flex:1}}>
              <div style={{fontSize:52,marginBottom:6,filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.4))"}}>{FLAGS[match.home]||"🏳️"}</div>
              <div style={{color:T.white,fontWeight:800,fontSize:15}}>{match.home}</div>
            </div>
            <div style={{color:T.border,fontWeight:900,fontSize:14,letterSpacing:2}}>VS</div>
            <div style={{textAlign:"center",flex:1}}>
              <div style={{fontSize:52,marginBottom:6,filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.4))"}}>{FLAGS[match.away]||"🏳️"}</div>
              <div style={{color:T.white,fontWeight:800,fontSize:15}}>{match.away}</div>
            </div>
          </div>

          {/* Input area */}
          {locked ? (
            <div style={{textAlign:"center",padding:20,background:"rgba(231,76,60,0.1)",borderRadius:12,border:"1px solid rgba(231,76,60,0.3)",marginBottom:12}}>
              <div style={{fontSize:28,marginBottom:6}}>🔒</div>
              <div style={{color:T.red,fontWeight:800,fontSize:15}}>Predictions closed</div>
              <div style={{color:T.muted,fontSize:12,marginTop:4}}>This match has already started</div>
              {submitted&&<div style={{color:T.light,fontSize:13,marginTop:8}}>Your pick: <span style={{color:T.white,fontWeight:700,fontFamily:"monospace"}}>{pred.h} : {pred.a}</span></div>}
            </div>
          ) : submitted ? (
            <div style={{textAlign:"center",padding:20,background:"rgba(32,178,170,0.1)",borderRadius:12,border:"1px solid rgba(32,178,170,0.3)",marginBottom:12}}>
              <div style={{fontSize:28,marginBottom:6}}>✅</div>
              <div style={{color:T.teal,fontWeight:800,fontSize:15}}>Prediction saved!</div>
              <div style={{color:T.white,fontSize:28,fontWeight:900,margin:"10px 0",fontFamily:"'Courier New',monospace"}}>{pred.h} : {pred.a}</div>
              <button onClick={()=>setSubmitted(false)} style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,padding:"6px 16px",cursor:"pointer",fontSize:12}}>Change prediction</button>
            </div>
          ) : (
            <>
              <div style={{color:T.light,fontSize:11,textAlign:"center",marginBottom:12,letterSpacing:2,textTransform:"uppercase"}}>Your score prediction</div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                <ScoreInput h={pred.h} a={pred.a} onChange={setPred} disabled={false}/>
              </div>
              <button onClick={handleSubmit} disabled={pred.h===""||pred.a===""}
                style={{width:"100%",padding:16,fontSize:16,fontWeight:900,background:pred.h===""||pred.a===""?"rgba(255,255,255,0.05)":`linear-gradient(135deg,${T.teal},#178a84)`,color:pred.h===""||pred.a===""?T.border:"#fff",border:"none",borderRadius:12,cursor:pred.h===""||pred.a===""?"not-allowed":"pointer",letterSpacing:0.3}}>
                Submit Prediction ⚽
              </button>
            </>
          )}

          {/* Result */}
          {actual && (
            <div style={{textAlign:"center",marginTop:12,padding:16,background:"rgba(0,13,58,0.8)",borderRadius:12,border:`1px solid ${T.border}`}}>
              <div style={{color:T.light,fontSize:11,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Final Result</div>
              <div style={{color:T.gold,fontSize:32,fontWeight:900,fontFamily:"'Courier New',monospace",marginBottom:8}}>{actual.h} : {actual.a}</div>
              {pts!==null&&(
                <span style={{display:"inline-block",background:pts===3?"rgba(245,200,66,0.15)":pts===1?"rgba(46,204,113,0.15)":"rgba(231,76,60,0.15)",color:pts===3?T.gold:pts===1?T.green:T.red,padding:"5px 18px",borderRadius:20,fontSize:13,fontWeight:800}}>
                  {pts===3?"🎯 Exact score! +3 pts":pts===1?"✓ Correct result +1 pt":"✗ No points this time"}
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:14,color:T.muted,fontSize:12}}>✓ Correct result = 1 pt · 🎯 Exact score = 3 pts</div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [adminPwInput, setAdminPwInput] = useState("");
  const [screen, setScreen] = useState("matches");
  const [players, setPlayers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [actuals, setActuals] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLb, setLoadingLb] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);
  const predictMatchId = urlParams.get("match");
  const predictUserId = urlParams.get("uid");
  const predictUserName = urlParams.get("name");

  if (predictMatchId && predictUserId) {
    return <PredictPage matchId={predictMatchId} userId={predictUserId} userName={decodeURIComponent(predictUserName||"Friend")}/>;
  }

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u); setAuthLoading(false);
      if (u) { await loadPlayers(); await loadActuals(); }
    });
    return unsub;
  },[]);

  async function loadPlayers() {
    const snap = await getDocs(collection(db,"players"));
    const list = [];
    snap.forEach(d=>list.push({id:d.id,...d.data()}));
    setPlayers(list);
  }

  async function loadActuals() {
    const snap = await getDoc(doc(db,"actuals","results"));
    if (snap.exists()) setActuals(snap.data());
  }

  async function loadLeaderboard() {
    setLoadingLb(true);
    const aSnap = await getDoc(doc(db,"actuals","results"));
    const cur = aSnap.exists()?aSnap.data():{};
    const pSnap = await getDocs(collection(db,"players"));
    const playerList = [];
    pSnap.forEach(d=>playerList.push({id:d.id,...d.data()}));
    const results = await Promise.all(playerList.map(async p=>{
      let total=0;
      for (const m of ALL_MATCHES) {
        const pDoc = await getDoc(doc(db,"match_predictions",`${m.id}_${p.id}`));
        if (pDoc.exists()) total+=calcScore(pDoc.data(),cur[m.id]||{});
      }
      return {...p,total};
    }));
    results.sort((a,b)=>b.total-a.total);
    setLeaderboard(results);
    setLoadingLb(false);
  }

  async function addPlayer() {
    if (!newName.trim()||!newEmail.trim()) return;
    const id = newEmail.toLowerCase().replace(/[^a-z0-9]/g,"_");
    await setDoc(doc(db,"players",id),{name:newName.trim(),email:newEmail.trim()});
    setNewName(""); setNewEmail("");
    await loadPlayers();
  }

  async function removePlayer(id) {
    await deleteDoc(doc(db,"players",id));
    await loadPlayers();
  }

  async function saveActuals() {
    setSaving(true);
    await setDoc(doc(db,"actuals","results"),actuals);
    setSaveMsg("✓ Results saved!");
    setTimeout(()=>setSaveMsg(""),2500);
    setSaving(false);
  }

  function buildPredictLink(playerId, playerName, matchId) {
    const base = window.location.origin + window.location.pathname;
    return `${base}?match=${matchId}&uid=${playerId}&name=${encodeURIComponent(playerName)}`;
  }

  async function loadEmailJS() {
    return new Promise((res,rej)=>{
      if (window.emailjs) { res(); return; }
      const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
      s.onload=()=>{
        window.emailjs.init("lKMwUgdBhxa_0t7sDeq1l");
        res();
      };
      s.onerror=rej;
      document.head.appendChild(s);
    });
  }

  async function sendEmails() {
    if (selectedMatches.length===0) { alert("Select at least one match"); return; }
    if (players.length===0) { alert("Add players first"); return; }
    setSending(true);
    setSendMsg("");
    try {
      await loadEmailJS();
      const matches = ALL_MATCHES.filter(m=>selectedMatches.includes(m.id));
      let sent=0, failed=0;
      for (const player of players) {
        const matchLines = matches.map(m=>{
          const link = buildPredictLink(player.id, player.name, m.id);
          return `${m.home} vs ${m.away} (${m.date}) - ${link}`;
        }).join("\n\n");
        const body = `Hi ${player.name}!\n\nPredict today's World Cup matches:\n\n${matchLines}\n\n1 pt correct result, 3 pts exact score.\n\nGood luck!\nZalles WC 2026`;
        try {
          const result = await window.emailjs.send(
            "dzalles@iterla.com",
            "template_33yasn5",
            {
              to_email: player.email,
              email: player.email,
              subject: "Predict today's WC matches! WC 2026",
              message: body,
            }
          );
          console.log("Sent to", player.email, result);
          sent++;
        } catch(e) {
          failed++;
          console.error("Failed for", player.email, JSON.stringify(e));
        }
      }
      setSendMsg(sent>0 ? `✓ Sent to ${sent} player${sent!==1?"s":""}${failed>0?` (${failed} failed)`:""}` : `✗ All ${failed} failed — check console`);
    } catch(e) {
      console.error("EmailJS load error:", e);
      setSendMsg("Error: Could not load email service");
    }
    setTimeout(()=>setSendMsg(""),6000);
    setSending(false);
  }

  function handleAdminLogin() {
    if (adminPwInput===ADMIN_PW) { setIsAdmin(true); setShowAdminPw(false); setAdminPwInput(""); }
    else { alert("Wrong password"); setAdminPwInput(""); }
  }

  if (authLoading) return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.teal,fontSize:36}}>⚽</div>;

  if (!user) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${T.navy},${T.blue})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:72,marginBottom:8,filter:`drop-shadow(0 0 24px ${T.teal}66)`}}>⚽</div>
        <div style={{fontSize:11,color:T.teal,letterSpacing:6,textTransform:"uppercase",fontWeight:700,marginBottom:8}}>WC 2026</div>
        <h1 style={{fontSize:34,fontWeight:900,color:T.white,margin:"0 0 4px",letterSpacing:-1}}>Match Predictor</h1>
        <div style={{fontSize:14,color:T.light,marginBottom:32}}>Admin Panel · dzalles@iterla.com</div>
        <div style={{background:"rgba(0,33,113,0.8)",backdropFilter:"blur(10px)",border:`1px solid ${T.border}`,borderRadius:16,padding:"28px 24px",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          <button onClick={async()=>{try{await signInWithPopup(auth,provider);}catch(e){console.error(e);}}}
            style={{width:"100%",padding:14,fontSize:15,fontWeight:800,background:"#fff",color:"#1a1a1a",border:"none",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16}}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign in with Google
          </button>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:14}}>
            {!showAdminPw?(
              <button onClick={()=>setShowAdminPw(true)} style={{background:"none",border:"none",color:T.border,fontSize:11,cursor:"pointer",letterSpacing:2}}>···</button>
            ):(
              <div style={{display:"flex",gap:8}}>
                <input type="password" placeholder="Admin password" value={adminPwInput} onChange={e=>setAdminPwInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()}
                  style={{flex:1,padding:"10px 12px",fontSize:13,background:T.bgDeep,border:`1px solid ${T.border}`,borderRadius:8,color:T.white,outline:"none"}}/>
                <button onClick={handleAdminLogin} style={{padding:"10px 16px",background:T.blue,border:`1px solid ${T.border}`,borderRadius:8,color:T.teal,fontWeight:700,cursor:"pointer"}}>Go</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const upcomingMatches = ALL_MATCHES.filter(m=>!isLocked(m));
  const playedMatches = ALL_MATCHES.filter(m=>isLocked(m));

  const navStyle = (key) => ({
    padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer",
    fontSize:13, fontWeight:700, whiteSpace:"nowrap",
    background:screen===key?T.blue:"transparent",
    color:screen===key?T.teal:T.muted,
    borderBottom:screen===key?`2px solid ${T.teal}`:"2px solid transparent",
  });

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.white,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      {/* Header */}
      <div style={{background:T.bgDeep,borderBottom:`1px solid ${T.border}`,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:`linear-gradient(135deg,${T.teal},#178a84)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚽</div>
          <div>
            <div style={{color:T.white,fontWeight:900,fontSize:14}}>Match Predictor</div>
            <div style={{color:T.muted,fontSize:11}}>WC 2026 · Admin</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {user.photoURL&&<img src={user.photoURL} style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${T.teal}`}} alt=""/>}
          <button onClick={()=>{signOut(auth);setUser(null);setIsAdmin(false);}} style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>Sign out</button>
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:2,padding:"10px 12px",background:T.bgDeep,borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
        <button style={navStyle("matches")} onClick={()=>setScreen("matches")}>📧 Send Emails</button>
        <button style={navStyle("players")} onClick={()=>setScreen("players")}>👥 Players</button>
        <button style={navStyle("results")} onClick={()=>setScreen("results")}>⚽ Results</button>
        <button style={navStyle("leaderboard")} onClick={()=>{setScreen("leaderboard");loadLeaderboard();}}>🏅 Leaderboard</button>
      </div>

      {/* ── SEND EMAILS ── */}
      {screen==="matches"&&(
        <div style={{maxWidth:660,margin:"0 auto",padding:16}}>
          <div style={{background:T.bgCard,border:`1px solid ${T.teal}`,borderRadius:12,padding:"14px 16px",marginBottom:16}}>
            <div style={{color:T.teal,fontWeight:800,fontSize:15,marginBottom:4}}>📧 Send Prediction Emails via Outlook</div>
            <div style={{color:T.muted,fontSize:13}}>Select matches → send personal prediction links to all {players.length} player{players.length!==1?"s":""}.</div>
          </div>

          {upcomingMatches.length===0?(
            <div style={{textAlign:"center",color:T.muted,padding:40}}>All group stage matches have started.</div>
          ):(
            <>
              <div style={{color:T.white,fontWeight:700,fontSize:13,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Upcoming Matches</div>
              {upcomingMatches.map(m=>{
                const selected=selectedMatches.includes(m.id);
                return(
                  <div key={m.id} onClick={()=>setSelectedMatches(s=>s.includes(m.id)?s.filter(x=>x!==m.id):[...s,m.id])}
                    style={{background:selected?T.bgCard:T.bgDeep,border:`1px solid ${selected?T.teal:T.border}`,borderRadius:12,padding:"12px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${selected?T.teal:T.muted}`,background:selected?T.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0}}>
                        {selected&&"✓"}
                      </div>
                      <span style={{fontSize:18}}>{FLAGS[m.home]||"🏳️"}</span>
                      <span style={{color:T.white,fontWeight:700,fontSize:13}}>{m.home} vs {m.away}</span>
                      <span style={{fontSize:18}}>{FLAGS[m.away]||"🏳️"}</span>
                    </div>
                    <span style={{color:T.muted,fontSize:11,flexShrink:0}}>{m.date}</span>
                  </div>
                );
              })}
            </>
          )}

          <div style={{marginTop:20,display:"flex",alignItems:"center",gap:12}}>
            <button onClick={sendEmails} disabled={sending||selectedMatches.length===0||players.length===0}
              style={{flex:1,padding:14,fontSize:15,fontWeight:900,background:selectedMatches.length===0||players.length===0?T.bgCard:`linear-gradient(135deg,${T.teal},#178a84)`,color:selectedMatches.length===0||players.length===0?T.muted:"#fff",border:"none",borderRadius:12,cursor:selectedMatches.length===0||players.length===0?"not-allowed":"pointer",opacity:sending?0.6:1}}>
              {sending?`Sending to ${players.length} players...`:`📧 Send to ${players.length} players (${selectedMatches.length} match${selectedMatches.length!==1?"es":""})`}
            </button>
          </div>
          {sendMsg&&<div style={{color:T.green,fontWeight:800,textAlign:"center",marginTop:12,fontSize:14}}>{sendMsg}</div>}
        </div>
      )}

      {/* ── PLAYERS ── */}
      {screen==="players"&&(
        <div style={{maxWidth:600,margin:"0 auto",padding:16}}>
          <div style={{color:T.white,fontWeight:900,fontSize:18,marginBottom:16}}>👥 Players <span style={{color:T.teal}}>({players.length})</span></div>
          <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:16}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input placeholder="Name" value={newName} onChange={e=>setNewName(e.target.value)}
                style={{flex:1,minWidth:100,padding:"10px 12px",fontSize:14,background:T.bgDeep,border:`1px solid ${T.border}`,borderRadius:8,color:T.white,outline:"none"}}/>
              <input placeholder="Email" value={newEmail} onChange={e=>setNewEmail(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addPlayer()}
                style={{flex:2,minWidth:160,padding:"10px 12px",fontSize:14,background:T.bgDeep,border:`1px solid ${T.border}`,borderRadius:8,color:T.white,outline:"none"}}/>
              <button onClick={addPlayer} style={{padding:"10px 20px",background:`linear-gradient(135deg,${T.teal},#178a84)`,border:"none",borderRadius:8,color:"#fff",fontWeight:800,cursor:"pointer",fontSize:14}}>Add</button>
            </div>
          </div>
          {players.length===0?(
            <div style={{textAlign:"center",color:T.muted,padding:40}}>No players yet. Add someone above!</div>
          ):players.map(p=>(
            <div key={p.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,background:`linear-gradient(135deg,${T.navy},${T.blue})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:T.teal,flexShrink:0}}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{color:T.white,fontWeight:700,fontSize:14}}>{p.name}</div>
                  <div style={{color:T.muted,fontSize:12}}>{p.email}</div>
                </div>
              </div>
              <button onClick={()=>removePlayer(p.id)} style={{background:"none",border:"1px solid rgba(231,76,60,0.3)",color:T.red,borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12}}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {/* ── RESULTS ── */}
      {screen==="results"&&(
        <div style={{maxWidth:660,margin:"0 auto",padding:16}}>
          <div style={{color:T.white,fontWeight:900,fontSize:18,marginBottom:16}}>⚽ Enter Results</div>
          {playedMatches.length===0?(
            <div style={{textAlign:"center",color:T.muted,padding:40}}>No matches have started yet.</div>
          ):playedMatches.map(m=>(
            <div key={m.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 16px",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
                  <span style={{fontSize:18}}>{FLAGS[m.home]||"🏳️"}</span>
                  <span style={{color:T.white,fontSize:13,fontWeight:600}}>{m.home}</span>
                </div>
                <ScoreInput h={actuals[m.id]?.h??""} a={actuals[m.id]?.a??""} onChange={val=>setActuals(p=>({...p,[m.id]:{...p[m.id],...val}}))} disabled={false}/>
                <div style={{display:"flex",alignItems:"center",gap:6,flex:1,justifyContent:"flex-end"}}>
                  <span style={{color:T.white,fontSize:13,fontWeight:600}}>{m.away}</span>
                  <span style={{fontSize:18}}>{FLAGS[m.away]||"🏳️"}</span>
                </div>
              </div>
            </div>
          ))}
          {playedMatches.length>0&&(
            <div style={{marginTop:16,display:"flex",alignItems:"center",gap:12}}>
              <button onClick={saveActuals} disabled={saving}
                style={{flex:1,padding:14,fontSize:15,fontWeight:900,background:`linear-gradient(135deg,${T.gold},#c9a030)`,color:T.bgDeep,border:"none",borderRadius:12,cursor:"pointer",opacity:saving?0.6:1}}>
                {saving?"Saving...":"💾 Save Results"}
              </button>
              {saveMsg&&<span style={{color:T.green,fontWeight:800}}>{saveMsg}</span>}
            </div>
          )}
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {screen==="leaderboard"&&(
        <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:40,filter:`drop-shadow(0 0 12px ${T.gold}66)`}}>🏆</div>
            <h2 style={{color:T.gold,fontWeight:900,margin:"4px 0 2px",fontSize:24}}>Leaderboard</h2>
            <div style={{color:T.muted,fontSize:13}}>Match Predictor · WC 2026</div>
          </div>
          {loadingLb?(
            <div style={{textAlign:"center",color:T.muted,padding:40}}>Calculating scores...</div>
          ):leaderboard.length===0?(
            <div style={{textAlign:"center",color:T.muted,padding:40}}>No predictions yet.</div>
          ):leaderboard.map((p,i)=>{
            const medals=["🥇","🥈","🥉"];
            return(
              <div key={p.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:24,minWidth:32}}>{medals[i]||`#${i+1}`}</span>
                  <div style={{width:36,height:36,background:`linear-gradient(135deg,${T.navy},${T.blue})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:T.teal,flexShrink:0}}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{color:T.white,fontWeight:800,fontSize:15}}>{p.name}</div>
                    <div style={{color:T.muted,fontSize:11}}>{p.email}</div>
                  </div>
                </div>
                <div style={{background:T.bgDeep,border:`1px solid ${T.border}`,padding:"6px 18px",borderRadius:20,color:T.gold,fontWeight:900,fontSize:20}}>
                  {p.total}<span style={{fontSize:11,fontWeight:400,color:T.muted,marginLeft:3}}>pts</span>
                </div>
              </div>
            );
          })}
          <button onClick={loadLeaderboard} style={{marginTop:16,width:"100%",padding:12,fontSize:13,fontWeight:700,background:"transparent",border:`1px solid ${T.border}`,borderRadius:10,color:T.muted,cursor:"pointer"}}>🔄 Refresh</button>
        </div>
      )}
    </div>
  );
}
