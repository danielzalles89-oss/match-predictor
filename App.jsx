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
  { id:"G1",  date:"Jun 11", time:"2:00 PM",  kickoff:"2026-06-11T19:00:00Z", home:"Mexico",        away:"South Africa",   group:"A" },
  { id:"G2",  date:"Jun 11", time:"9:00 PM",  kickoff:"2026-06-12T02:00:00Z", home:"South Korea",   away:"Czechia",        group:"A" },
  { id:"G3",  date:"Jun 12", time:"2:00 PM",  kickoff:"2026-06-12T19:00:00Z", home:"Canada",        away:"Bosnia & Herz.", group:"B" },
  { id:"G4",  date:"Jun 12", time:"8:00 PM",  kickoff:"2026-06-13T01:00:00Z", home:"USA",           away:"Paraguay",       group:"D" },
  { id:"G5",  date:"Jun 13", time:"2:00 PM",  kickoff:"2026-06-13T19:00:00Z", home:"Qatar",         away:"Switzerland",    group:"B" },
  { id:"G6",  date:"Jun 13", time:"5:00 PM",  kickoff:"2026-06-13T22:00:00Z", home:"Brazil",        away:"Morocco",        group:"C" },
  { id:"G7",  date:"Jun 13", time:"8:00 PM",  kickoff:"2026-06-14T01:00:00Z", home:"Haiti",         away:"Scotland",       group:"C" },
  { id:"G8",  date:"Jun 13", time:"11:00 PM", kickoff:"2026-06-14T04:00:00Z", home:"Australia",     away:"Turkey",         group:"D" },
  { id:"G9",  date:"Jun 14", time:"12:00 PM", kickoff:"2026-06-14T17:00:00Z", home:"Germany",       away:"Curaçao",        group:"E" },
  { id:"G10", date:"Jun 14", time:"3:00 PM",  kickoff:"2026-06-14T20:00:00Z", home:"Netherlands",   away:"Japan",          group:"F" },
  { id:"G11", date:"Jun 14", time:"6:00 PM",  kickoff:"2026-06-14T23:00:00Z", home:"Ivory Coast",   away:"Ecuador",        group:"E" },
  { id:"G12", date:"Jun 14", time:"9:00 PM",  kickoff:"2026-06-15T02:00:00Z", home:"Sweden",        away:"Tunisia",        group:"F" },
  { id:"G13", date:"Jun 15", time:"12:00 PM", kickoff:"2026-06-15T17:00:00Z", home:"Spain",         away:"Cape Verde",     group:"H" },
  { id:"G14", date:"Jun 15", time:"3:00 PM",  kickoff:"2026-06-15T20:00:00Z", home:"Belgium",       away:"Egypt",          group:"G" },
  { id:"G15", date:"Jun 15", time:"5:00 PM",  kickoff:"2026-06-15T22:00:00Z", home:"Saudi Arabia",  away:"Uruguay",        group:"H" },
  { id:"G16", date:"Jun 15", time:"8:00 PM",  kickoff:"2026-06-16T01:00:00Z", home:"Iran",          away:"New Zealand",    group:"G" },
  { id:"G17", date:"Jun 16", time:"2:00 PM",  kickoff:"2026-06-16T19:00:00Z", home:"France",        away:"Senegal",        group:"I" },
  { id:"G18", date:"Jun 16", time:"5:00 PM",  kickoff:"2026-06-16T22:00:00Z", home:"Iraq",          away:"Norway",         group:"I" },
  { id:"G19", date:"Jun 16", time:"8:00 PM",  kickoff:"2026-06-17T01:00:00Z", home:"Argentina",     away:"Algeria",        group:"J" },
  { id:"G20", date:"Jun 16", time:"11:00 PM", kickoff:"2026-06-17T04:00:00Z", home:"Austria",       away:"Jordan",         group:"J" },
  { id:"G21", date:"Jun 17", time:"12:00 PM", kickoff:"2026-06-17T17:00:00Z", home:"Portugal",      away:"DR Congo",       group:"K" },
  { id:"G22", date:"Jun 17", time:"3:00 PM",  kickoff:"2026-06-17T20:00:00Z", home:"Uzbekistan",    away:"Colombia",       group:"K" },
  { id:"G23", date:"Jun 17", time:"5:00 PM",  kickoff:"2026-06-17T22:00:00Z", home:"England",       away:"Panama",         group:"L" },
  { id:"G24", date:"Jun 17", time:"8:00 PM",  kickoff:"2026-06-18T01:00:00Z", home:"Ghana",         away:"Croatia",        group:"L" },
  { id:"G25", date:"Jun 18", time:"12:00 PM", kickoff:"2026-06-18T17:00:00Z", home:"Mexico",        away:"South Korea",    group:"A" },
  { id:"G26", date:"Jun 18", time:"3:00 PM",  kickoff:"2026-06-18T20:00:00Z", home:"Czechia",       away:"South Africa",   group:"A" },
  { id:"G27", date:"Jun 18", time:"6:00 PM",  kickoff:"2026-06-18T23:00:00Z", home:"Switzerland",   away:"Bosnia & Herz.", group:"B" },
  { id:"G28", date:"Jun 18", time:"9:00 PM",  kickoff:"2026-06-19T02:00:00Z", home:"Canada",        away:"Qatar",          group:"B" },
  { id:"G29", date:"Jun 19", time:"12:00 PM", kickoff:"2026-06-19T17:00:00Z", home:"USA",           away:"Australia",      group:"D" },
  { id:"G30", date:"Jun 19", time:"3:00 PM",  kickoff:"2026-06-19T20:00:00Z", home:"Turkey",        away:"Paraguay",       group:"D" },
  { id:"G31", date:"Jun 19", time:"6:00 PM",  kickoff:"2026-06-19T23:00:00Z", home:"Morocco",       away:"Haiti",          group:"C" },
  { id:"G32", date:"Jun 19", time:"9:00 PM",  kickoff:"2026-06-20T02:00:00Z", home:"Brazil",        away:"Scotland",       group:"C" },
  { id:"G33", date:"Jun 20", time:"12:00 PM", kickoff:"2026-06-20T17:00:00Z", home:"Germany",       away:"Ivory Coast",    group:"E" },
  { id:"G34", date:"Jun 20", time:"3:00 PM",  kickoff:"2026-06-20T20:00:00Z", home:"Ecuador",       away:"Curaçao",        group:"E" },
  { id:"G35", date:"Jun 20", time:"6:00 PM",  kickoff:"2026-06-20T23:00:00Z", home:"Netherlands",   away:"Sweden",         group:"F" },
  { id:"G36", date:"Jun 20", time:"9:00 PM",  kickoff:"2026-06-21T02:00:00Z", home:"Japan",         away:"Tunisia",        group:"F" },
  { id:"G37", date:"Jun 21", time:"12:00 PM", kickoff:"2026-06-21T17:00:00Z", home:"Belgium",       away:"Iran",           group:"G" },
  { id:"G38", date:"Jun 21", time:"3:00 PM",  kickoff:"2026-06-21T20:00:00Z", home:"New Zealand",   away:"Egypt",          group:"G" },
  { id:"G39", date:"Jun 21", time:"6:00 PM",  kickoff:"2026-06-21T23:00:00Z", home:"Spain",         away:"Saudi Arabia",   group:"H" },
  { id:"G40", date:"Jun 21", time:"9:00 PM",  kickoff:"2026-06-22T02:00:00Z", home:"Uruguay",       away:"Cape Verde",     group:"H" },
  { id:"G41", date:"Jun 22", time:"12:00 PM", kickoff:"2026-06-22T17:00:00Z", home:"Argentina",     away:"Austria",        group:"J" },
  { id:"G42", date:"Jun 22", time:"3:00 PM",  kickoff:"2026-06-22T20:00:00Z", home:"Jordan",        away:"Algeria",        group:"J" },
  { id:"G43", date:"Jun 22", time:"6:00 PM",  kickoff:"2026-06-22T23:00:00Z", home:"France",        away:"Iraq",           group:"I" },
  { id:"G44", date:"Jun 22", time:"9:00 PM",  kickoff:"2026-06-23T02:00:00Z", home:"Norway",        away:"Senegal",        group:"I" },
  { id:"G45", date:"Jun 23", time:"12:00 PM", kickoff:"2026-06-23T17:00:00Z", home:"Portugal",      away:"Uzbekistan",     group:"K" },
  { id:"G46", date:"Jun 23", time:"3:00 PM",  kickoff:"2026-06-23T20:00:00Z", home:"Colombia",      away:"DR Congo",       group:"K" },
  { id:"G47", date:"Jun 23", time:"6:00 PM",  kickoff:"2026-06-23T23:00:00Z", home:"England",       away:"Ghana",          group:"L" },
  { id:"G48", date:"Jun 23", time:"9:00 PM",  kickoff:"2026-06-24T02:00:00Z", home:"Croatia",       away:"Panama",         group:"L" },
  { id:"G49", date:"Jun 24", time:"12:00 PM", kickoff:"2026-06-24T17:00:00Z", home:"South Korea",   away:"South Africa",   group:"A" },
  { id:"G50", date:"Jun 24", time:"3:00 PM",  kickoff:"2026-06-24T20:00:00Z", home:"Mexico",        away:"Czechia",        group:"A" },
  { id:"G51", date:"Jun 24", time:"6:00 PM",  kickoff:"2026-06-24T23:00:00Z", home:"Bosnia & Herz.",away:"Qatar",          group:"B" },
  { id:"G52", date:"Jun 24", time:"9:00 PM",  kickoff:"2026-06-25T02:00:00Z", home:"Switzerland",   away:"Canada",         group:"B" },
  { id:"G53", date:"Jun 25", time:"12:00 PM", kickoff:"2026-06-25T17:00:00Z", home:"Scotland",      away:"Morocco",        group:"C" },
  { id:"G54", date:"Jun 25", time:"3:00 PM",  kickoff:"2026-06-25T20:00:00Z", home:"Haiti",         away:"Brazil",         group:"C" },
  { id:"G55", date:"Jun 25", time:"6:00 PM",  kickoff:"2026-06-25T23:00:00Z", home:"Paraguay",      away:"Australia",      group:"D" },
  { id:"G56", date:"Jun 25", time:"9:00 PM",  kickoff:"2026-06-26T02:00:00Z", home:"Turkey",        away:"USA",            group:"D" },
  { id:"G57", date:"Jun 26", time:"12:00 PM", kickoff:"2026-06-26T17:00:00Z", home:"Curaçao",       away:"Germany",        group:"E" },
  { id:"G58", date:"Jun 26", time:"3:00 PM",  kickoff:"2026-06-26T20:00:00Z", home:"Ecuador",       away:"Ivory Coast",    group:"E" },
  { id:"G59", date:"Jun 26", time:"3:00 PM",  kickoff:"2026-06-26T20:00:00Z", home:"Tunisia",       away:"Netherlands",    group:"F" },
  { id:"G60", date:"Jun 26", time:"6:00 PM",  kickoff:"2026-06-26T23:00:00Z", home:"Sweden",        away:"Japan",          group:"F" },
  { id:"G61", date:"Jun 26", time:"2:00 PM",  kickoff:"2026-06-26T19:00:00Z", home:"Norway",        away:"France",         group:"I" },
  { id:"G62", date:"Jun 26", time:"2:00 PM",  kickoff:"2026-06-26T19:00:00Z", home:"Senegal",       away:"Iraq",           group:"I" },
  { id:"G63", date:"Jun 26", time:"6:00 PM",  kickoff:"2026-06-26T23:00:00Z", home:"Cape Verde",    away:"Saudi Arabia",   group:"H" },
  { id:"G64", date:"Jun 26", time:"6:00 PM",  kickoff:"2026-06-26T23:00:00Z", home:"Uruguay",       away:"Spain",          group:"H" },
  { id:"G65", date:"Jun 26", time:"9:00 PM",  kickoff:"2026-06-27T02:00:00Z", home:"Egypt",         away:"Iran",           group:"G" },
  { id:"G66", date:"Jun 26", time:"9:00 PM",  kickoff:"2026-06-27T02:00:00Z", home:"New Zealand",   away:"Belgium",        group:"G" },
  { id:"G67", date:"Jun 27", time:"4:00 PM",  kickoff:"2026-06-27T21:00:00Z", home:"Panama",        away:"England",        group:"L" },
  { id:"G68", date:"Jun 27", time:"4:00 PM",  kickoff:"2026-06-27T21:00:00Z", home:"Croatia",       away:"Ghana",          group:"L" },
  { id:"G69", date:"Jun 27", time:"6:30 PM",  kickoff:"2026-06-27T23:30:00Z", home:"Colombia",      away:"Portugal",       group:"K" },
  { id:"G70", date:"Jun 27", time:"6:30 PM",  kickoff:"2026-06-27T23:30:00Z", home:"DR Congo",      away:"Uzbekistan",     group:"K" },
  { id:"G71", date:"Jun 27", time:"9:00 PM",  kickoff:"2026-06-28T02:00:00Z", home:"Algeria",       away:"Austria",        group:"J" },
  { id:"G72", date:"Jun 27", time:"9:00 PM",  kickoff:"2026-06-28T02:00:00Z", home:"Jordan",        away:"Argentina",      group:"J" },
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
  return (ph===ah&&pa===aa) ? 1 : 0;
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

// ─── DAILY PREDICT PAGE ───────────────────────────────────────────────────────
function DailyPredictPage({date, userId, userName}) {
  const matches = ALL_MATCHES.filter(m=>m.date===date&&!isLocked(m));
  const allMatches = ALL_MATCHES.filter(m=>m.date===date);
  const [preds, setPreds] = useState({});
  const [saved, setSaved] = useState({});
  const [actuals, setActuals] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [allSaved, setAllSaved] = useState(false);

  useEffect(()=>{
    async function load() {
      // Load existing predictions for all today's matches
      const predPromises = allMatches.map(m=>getDoc(doc(db,"match_predictions",`${m.id}_${userId}`)));
      const aSnap = await getDoc(doc(db,"actuals","results"));
      const cur = aSnap.exists()?aSnap.data():{};
      setActuals(cur);
      const pSnaps = await Promise.all(predPromises);
      const existingPreds = {};
      const existingSaved = {};
      pSnaps.forEach((snap,i)=>{
        const m = allMatches[i];
        if (snap.exists()) {
          existingPreds[m.id] = {h:snap.data().h, a:snap.data().a};
          existingSaved[m.id] = true;
        } else {
          existingPreds[m.id] = {h:"",a:""};
        }
      });
      setPreds(existingPreds);
      setSaved(existingSaved);
      setLoading(false);
    }
    load();
  },[date,userId]);

  async function handleSubmitAll() {
    setSubmitting(true);
    const toSave = matches.filter(m=>preds[m.id]?.h!==""&&preds[m.id]?.a!=="");
    await Promise.all(toSave.map(m=>
      setDoc(doc(db,"match_predictions",`${m.id}_${userId}`),{
        h:preds[m.id].h, a:preds[m.id].a,
        userId, userName, matchId:m.id,
        submittedAt: new Date().toISOString()
      })
    ));
    const newSaved = {...saved};
    toSave.forEach(m=>{ newSaved[m.id]=true; });
    setSaved(newSaved);
    setAllSaved(true);
    setSubmitting(false);
    setTimeout(()=>setAllSaved(false),3000);
  }

  const openMatches = matches.filter(m=>!isLocked(m));
  const filledCount = openMatches.filter(m=>preds[m.id]?.h!==""&&preds[m.id]?.a!=="").length;

  if (loading) return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.teal,fontSize:36}}>⚽</div>;

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${T.navy} 0%,${T.blue} 100%)`,padding:"20px 16px",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:11,color:T.teal,letterSpacing:4,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>⚽ WC 2026 · {date}</div>
          <div style={{fontSize:28,fontWeight:900,color:T.white,letterSpacing:-0.5}}>Today's Predictions</div>
          <div style={{color:T.light,fontSize:13,marginTop:4}}>Hey <strong style={{color:T.teal}}>{userName}</strong>! Pick your scores for all matches.</div>
        </div>

        {/* Match cards */}
        {allMatches.map(m=>{
          const locked = isLocked(m);
          const pred = preds[m.id]||{h:"",a:""};
          const isSaved = saved[m.id];
          const actual = actuals[m.id];
          const hasActual = actual&&actual.h!==""&&actual.a!=="";
          const pts = isSaved&&hasActual ? calcScore(pred,actual) : null;

          return (
            <div key={m.id} style={{
              background:"rgba(0,33,113,0.7)",backdropFilter:"blur(10px)",
              border:`1px solid ${pts===1?T.gold:locked?T.border:T.teal}`,
              borderRadius:16,padding:"18px 16px",marginBottom:12,
              boxShadow:pts===1?`0 0 16px ${T.gold}44`:"none",
            }}>
              {/* Match header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:4}}>
                <div style={{color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1}}>Group {m.group}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{color:T.muted,fontSize:11}}>{m.time}</div>
                  {locked&&<span style={{color:T.red,fontSize:10,fontWeight:700,background:"rgba(231,76,60,0.15)",padding:"2px 8px",borderRadius:20}}>🔒 LOCKED</span>}
                  {!locked&&isSaved&&<span style={{color:T.teal,fontSize:10,fontWeight:700,background:"rgba(32,178,170,0.15)",padding:"2px 8px",borderRadius:20}}>✓ SAVED</span>}
                </div>
              </div>

              {/* Teams + score input */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                <div style={{textAlign:"center",flex:1}}>
                  <div style={{fontSize:36,marginBottom:4}}>{FLAGS[m.home]||"🏳️"}</div>
                  <div style={{color:T.white,fontWeight:800,fontSize:13}}>{m.home}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <ScoreInput
                    h={pred.h} a={pred.a}
                    onChange={val=>setPreds(p=>({...p,[m.id]:val}))}
                    disabled={locked}
                  />
                  {hasActual&&(
                    <div style={{textAlign:"center"}}>
                      <div style={{color:T.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>Result</div>
                      <div style={{color:T.gold,fontWeight:900,fontFamily:"monospace",fontSize:16}}>{actual.h}:{actual.a}</div>
                      {pts!==null&&<span style={{fontSize:11,fontWeight:800,color:pts===1?T.gold:T.red}}>{pts===1?"🎯 +1":"✗ 0"}</span>}
                    </div>
                  )}
                </div>
                <div style={{textAlign:"center",flex:1}}>
                  <div style={{fontSize:36,marginBottom:4}}>{FLAGS[m.away]||"🏳️"}</div>
                  <div style={{color:T.white,fontWeight:800,fontSize:13}}>{m.away}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Submit all button */}
        {openMatches.length>0&&(
          <div style={{position:"sticky",bottom:16,marginTop:8}}>
            <button onClick={handleSubmitAll} disabled={submitting||filledCount===0}
              style={{width:"100%",padding:16,fontSize:16,fontWeight:900,
                background:filledCount===0?"rgba(255,255,255,0.05)":`linear-gradient(135deg,${T.teal},#178a84)`,
                color:filledCount===0?T.border:"#fff",border:"none",borderRadius:14,
                cursor:filledCount===0?"not-allowed":"pointer",
                boxShadow:filledCount>0?"0 4px 20px rgba(32,178,170,0.4)":"none",
                opacity:submitting?0.7:1,
              }}>
              {submitting?"Saving..."
                :allSaved?"✅ All predictions saved!"
                :`⚽ Submit ${filledCount} prediction${filledCount!==1?"s":""}`}
            </button>
            <div style={{textAlign:"center",marginTop:8,color:T.muted,fontSize:12}}>
              🎯 Exact score = 1 pt · ✗ Wrong = 0 pts
            </div>
          </div>
        )}

        {openMatches.length===0&&(
          <div style={{textAlign:"center",color:T.muted,padding:20}}>All matches for {date} have started.</div>
        )}
      </div>
    </div>
  );
}

// ─── SINGLE MATCH PREDICT PAGE (kept for backwards compat) ────────────────────
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
          {actual && (
            <div style={{textAlign:"center",marginTop:12,padding:16,background:"rgba(0,13,58,0.8)",borderRadius:12,border:`1px solid ${T.border}`}}>
              <div style={{color:T.light,fontSize:11,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Final Result</div>
              <div style={{color:T.gold,fontSize:32,fontWeight:900,fontFamily:"'Courier New',monospace",marginBottom:8}}>{actual.h} : {actual.a}</div>
              {pts!==null&&(
                <span style={{display:"inline-block",background:pts===1?"rgba(245,200,66,0.15)":"rgba(231,76,60,0.15)",color:pts===1?T.gold:T.red,padding:"5px 18px",borderRadius:20,fontSize:13,fontWeight:800}}>
                  {pts===1?"🎯 Exact score! +1 pt":"✗ Wrong score"}
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:14,color:T.muted,fontSize:12}}>🎯 Exact score = 1 pt · ✗ Wrong = 0 pts</div>
      </div>
    </div>
  );
}
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
                <span style={{display:"inline-block",background:pts===1?"rgba(245,200,66,0.15)":"rgba(231,76,60,0.15)",color:pts===1?T.gold:T.red,padding:"5px 18px",borderRadius:20,fontSize:13,fontWeight:800}}>
                  {pts===1?"🎯 Exact score! +1 pt":"✗ Wrong score"}
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:14,color:T.muted,fontSize:12}}>🎯 Exact score = 1 pt · ✗ Wrong = 0 pts</div>
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
  const [allPredictions, setAllPredictions] = useState({});
  const [loadingPreds, setLoadingPreds] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const predictMatchId = urlParams.get("match");
  const predictDate = urlParams.get("date");
  const predictUserId = urlParams.get("uid");
  const predictUserName = urlParams.get("name");

  if (predictDate && predictUserId) {
    return <DailyPredictPage date={decodeURIComponent(predictDate)} userId={predictUserId} userName={decodeURIComponent(predictUserName||"Friend")}/>;
  }

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

  async function loadAllPredictions() {
    setLoadingPreds(true);
    // Load players + actuals in parallel
    const [pSnap, aSnap] = await Promise.all([
      getDocs(collection(db,"players")),
      getDoc(doc(db,"actuals","results")),
    ]);
    const playerList = [];
    pSnap.forEach(d=>playerList.push({id:d.id,...d.data()}));
    const cur = aSnap.exists()?aSnap.data():{};

    // Load ALL match_predictions docs in parallel (one per player, not per match)
    // Each player's predictions are stored in one doc keyed by matchId
    // But since they're stored as match_predictions/{matchId}_{userId},
    // we use getDocs on the whole collection — 1 read gets everything
    const allPredsSnap = await getDocs(collection(db,"match_predictions"));
    const predsByMatchPlayer = {};
    allPredsSnap.forEach(d => {
      predsByMatchPlayer[d.id] = d.data();
    });

    // Build result grouped by match
    const result = {};
    for (const m of ALL_MATCHES) {
      const preds = [];
      for (const p of playerList) {
        const key = `${m.id}_${p.id}`;
        const data = predsByMatchPlayer[key];
        if (data && data.h!=="" && data.a!=="") {
          preds.push({ name: p.name, h: data.h, a: data.a, pts: calcScore(data, cur[m.id]||{}) });
        }
      }
      if (preds.length > 0) {
        result[m.id] = { match: m, actual: cur[m.id]||null, preds };
      }
    }
    setAllPredictions(result);
    setLoadingPreds(false);
  }

  async function loadLeaderboard() {
    setLoadingLb(true);
    const [aSnap, pSnap, allPredsSnap] = await Promise.all([
      getDoc(doc(db,"actuals","results")),
      getDocs(collection(db,"players")),
      getDocs(collection(db,"match_predictions")),
    ]);
    const cur = aSnap.exists()?aSnap.data():{};
    const playerList = [];
    pSnap.forEach(d=>playerList.push({id:d.id,...d.data()}));
    const predsByKey = {};
    allPredsSnap.forEach(d=>{ predsByKey[d.id]=d.data(); });

    const results = playerList.map(p=>{
      let total=0;
      for (const m of ALL_MATCHES) {
        const data = predsByKey[`${m.id}_${p.id}`];
        if (data) total+=calcScore(data,cur[m.id]||{});
      }
      return {...p,total};
    });
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
      if (window.emailjs) {
        window.emailjs.init("3RspfC0a9VWZeVpzQ");
        res(); return;
      }
      const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
      s.onload=()=>{
        window.emailjs.init("3RspfC0a9VWZeVpzQ");
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
        // Group matches by date
        const byDate = {};
        matches.forEach(m=>{ if(!byDate[m.date])byDate[m.date]=[]; byDate[m.date].push(m); });

        const matchButtons = Object.entries(byDate).map(([date, dayMatches])=>{
          const link = `${window.location.origin}${window.location.pathname}?date=${encodeURIComponent(date)}&uid=${player.id}&name=${encodeURIComponent(player.name)}`;
          const matchList = dayMatches.map(m=>`${FLAGS[m.home]||''} ${m.home} vs ${m.away} ${FLAGS[m.away]||''} · ${m.time}`).join('<br>');
          return `<div style="margin-bottom:16px;background:#0a1f6e;border-radius:10px;padding:16px;border:1px solid #1a3080">
  <div style="font-size:13px;font-weight:bold;color:#20B2AA;margin-bottom:8px">📅 ${date}</div>
  <div style="font-size:13px;color:#83BAB5;margin-bottom:12px;line-height:1.8">${matchList}</div>
  <a href="${link}" style="display:inline-block;background:#20B2AA;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">⚽ Predict all ${dayMatches.length} matches</a>
</div>`;
        }).join('\n');

        const htmlBody = `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#001254;color:#f0f8ff;padding:24px;border-radius:12px">
  <h2 style="color:#20B2AA;margin:0 0 4px">⚽ WC 2026 Match Predictor</h2>
  <p style="color:#83BAB5;margin:0 0 20px">Hi ${player.name}! Pick your scores before kickoff.</p>
  ${matchButtons}
  <p style="color:#83BAB5;font-size:12px;margin-top:20px">🎯 Exact score = 1 pt · ✗ Wrong = 0 pts</p>
  <p style="color:#4a7a8a;font-size:11px">Zalles WC 2026 Quiniela</p>
</div>`;
        try {
          const result = await window.emailjs.send(
            "dzalles@iterla.com",
            "template_33yasn5",
            {
              to_email: player.email,
              email: player.email,
              subject: "⚽ Predict today's WC matches!",
              message: htmlBody,
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

  const [sendingLb, setSendingLb] = useState(false);
  const [sendLbMsg, setSendLbMsg] = useState("");

  async function sendLeaderboardEmail() {
    setSendingLb(true);
    setSendLbMsg("");
    try {
      await loadEmailJS();

      // ── Load all data in parallel ──
      const [allPredsSnap, aSnap, pSnap, excelSnap] = await Promise.all([
        getDocs(collection(db,"match_predictions")),
        getDoc(doc(db,"actuals","results")),
        getDocs(collection(db,"players")),
        getDocs(collection(db,"excel_quiniela")),
      ]);
      const cur = aSnap.exists()?aSnap.data():{};
      const playerList = [];
      pSnap.forEach(d=>playerList.push({id:d.id,...d.data()}));
      const predsByKey = {};
      allPredsSnap.forEach(d=>{ predsByKey[d.id]=d.data(); });

      // ── Match Predictor standings (exact score wins) ──
      const mpStandings = playerList.map(p=>{
        let wins=0, played=0;
        for (const m of ALL_MATCHES) {
          const actual = cur[m.id];
          if (!actual||actual.h===""||actual.a==="") continue;
          played++;
          const data = predsByKey[`${m.id}_${p.id}`];
          if (data && calcScore(data,actual)===1) wins++;
        }
        return {...p, wins, played};
      }).sort((a,b)=>b.wins-a.wins);

      // ── Excel Quiniela standings (points system) ──
      // Scoring: Result=10, Goals=3 per team, Goal Diff=4
      function calcQuinielaScore(pred, actual) {
        if (!actual||actual.h===""||actual.a==="") return 0;
        if (!pred||pred.h===""||pred.a==="") return 0;
        const ph=Number(pred.h),pa=Number(pred.a),ah=Number(actual.h),aa=Number(actual.a);
        if (isNaN(ph)||isNaN(pa)||isNaN(ah)||isNaN(aa)) return 0;
        let pts=0;
        // Correct result (winner/draw)
        const pw=ph>pa?"h":ph<pa?"a":"d";
        const aw=ah>aa?"h":ah<aa?"a":"d";
        if (pw===aw) pts+=10;
        // Exact goals team 1
        if (ph===ah) pts+=3;
        // Exact goals team 2
        if (pa===aa) pts+=3;
        // Exact goal difference
        if ((ph-pa)===(ah-aa)) pts+=4;
        return pts;
      }

      const excelPlayers = {};
      excelSnap.forEach(d=>{
        const data = d.data();
        const email = data.email;
        if (!excelPlayers[email]) excelPlayers[email] = [];
        excelPlayers[email].push({name:data.name, preds:data.predictions, total:0});
      });

      // Calculate excel quiniela points
      const excelStandings = [];
      for (const [email, entries] of Object.entries(excelPlayers)) {
        for (const entry of entries) {
          let total=0;
          for (const m of ALL_MATCHES) {
            const actual = cur[m.id];
            const pred = entry.preds?.[m.id];
            total += calcQuinielaScore(pred, actual);
          }
          excelStandings.push({email, name:entry.name, total});
        }
      }
      excelStandings.sort((a,b)=>b.total-a.total);

      // ── Build combined HTML email ──
      const medals = ["🥇","🥈","🥉"];

      const mpRows = mpStandings.map((p,i)=>
        `<tr style="border-bottom:1px solid #1a3080">
          <td style="padding:10px 14px;color:#f0f8ff;font-weight:700">${medals[i]||`#${i+1}`} ${p.name}</td>
          <td style="padding:10px 14px;text-align:center;color:#20B2AA;font-weight:900;font-size:18px">${p.wins}</td>
          <td style="padding:10px 14px;text-align:center;color:#83BAB5;font-size:12px">${p.played} played</td>
        </tr>`
      ).join('');

      const excelRows = excelStandings.map((p,i)=>
        `<tr style="border-bottom:1px solid #1a3080">
          <td style="padding:10px 14px;color:#f0f8ff;font-weight:700">${medals[i]||`#${i+1}`} ${p.name}</td>
          <td style="padding:10px 14px;text-align:center;color:#f5c842;font-weight:900;font-size:18px">${p.total}</td>
        </tr>`
      ).join('');

      const htmlBody = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#001254;color:#f0f8ff;padding:24px;border-radius:12px">
        <h2 style="color:#20B2AA;margin:0 0 4px">⚽ WC 2026 - Combined Standings</h2>
        <p style="color:#83BAB5;margin:0 0 24px;font-size:13px">Updated after latest results</p>

        <h3 style="color:#20B2AA;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">🎯 Match Predictor — Exact Score Wins</h3>
        <table style="width:100%;border-collapse:collapse;background:#0a1f6e;border-radius:10px;overflow:hidden;margin-bottom:24px">
          <thead><tr style="background:#002171">
            <th style="padding:10px 14px;text-align:left;color:#83BAB5;font-size:11px;text-transform:uppercase;letter-spacing:1px">Player</th>
            <th style="padding:10px 14px;text-align:center;color:#83BAB5;font-size:11px;text-transform:uppercase;letter-spacing:1px">Wins</th>
            <th style="padding:10px 14px;text-align:center;color:#83BAB5;font-size:11px;text-transform:uppercase;letter-spacing:1px">Played</th>
          </tr></thead>
          <tbody>${mpRows}</tbody>
        </table>

        <h3 style="color:#f5c842;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">📊 Quiniela Excel — Points System</h3>
        <p style="color:#83BAB5;font-size:11px;margin:0 0 8px">Result=10pts · Exact goals=3pts each · Goal diff=4pts</p>
        <table style="width:100%;border-collapse:collapse;background:#0a1f6e;border-radius:10px;overflow:hidden;margin-bottom:24px">
          <thead><tr style="background:#002171">
            <th style="padding:10px 14px;text-align:left;color:#83BAB5;font-size:11px;text-transform:uppercase;letter-spacing:1px">Player</th>
            <th style="padding:10px 14px;text-align:center;color:#83BAB5;font-size:11px;text-transform:uppercase;letter-spacing:1px">Points</th>
          </tr></thead>
          <tbody>${excelRows}</tbody>
        </table>

        <p style="color:#4a7a8a;font-size:11px;margin-top:4px">Zalles WC 2026 · Combined Leaderboard</p>
      </div>`;

      let sent=0, failed=0;
      for (const player of players) {
        try {
          await window.emailjs.send("dzalles@iterla.com","template_33yasn5",{
            to_email: player.email,
            email: player.email,
            subject: "⚽ WC 2026 - Combined Standings Update",
            message: htmlBody,
          });
          sent++;
        } catch(e) { failed++; console.error(e); }
      }
      setSendLbMsg(`✓ Combined standings sent to ${sent} players${failed>0?` (${failed} failed)`:""}`);
    } catch(e) {
      setSendLbMsg("Error sending leaderboard");
      console.error(e);
    }
    setTimeout(()=>setSendLbMsg(""),5000);
    setSendingLb(false);
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
        <button style={navStyle("predictions")} onClick={()=>{setScreen("predictions");loadAllPredictions();}}>🏆 Match Winners</button>
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
          ):(()=>{
            // Group upcoming matches by date
            const byDate = {};
            for (const m of upcomingMatches) {
              if (!byDate[m.date]) byDate[m.date] = [];
              byDate[m.date].push(m);
            }
            return Object.entries(byDate).map(([date, matches])=>{
              const allSelected = matches.every(m=>selectedMatches.includes(m.id));
              const someSelected = matches.some(m=>selectedMatches.includes(m.id));
              const toggleDate = () => {
                if (allSelected) {
                  setSelectedMatches(s=>s.filter(id=>!matches.find(m=>m.id===id)));
                } else {
                  setSelectedMatches(s=>[...new Set([...s,...matches.map(m=>m.id)])]);
                }
              };
              return (
                <div key={date} style={{marginBottom:16}}>
                  {/* Date header — click to select all matches that day */}
                  <div onClick={toggleDate} style={{
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    background:allSelected?"#0a2a4a":someSelected?"#071a30":T.bgDeep,
                    border:`1px solid ${allSelected?T.teal:someSelected?"#1a5060":T.border}`,
                    borderRadius:10,padding:"10px 16px",marginBottom:6,cursor:"pointer",
                    transition:"all 0.15s",
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{
                        width:22,height:22,borderRadius:5,
                        border:`2px solid ${allSelected?T.teal:T.muted}`,
                        background:allSelected?T.teal:someSelected?"#1a5060":"transparent",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:12,color:"#fff",flexShrink:0,
                      }}>
                        {allSelected?"✓":someSelected?"–":""}
                      </div>
                      <span style={{color:T.teal,fontWeight:900,fontSize:14}}>📅 {date}</span>
                      <span style={{color:T.muted,fontSize:12}}>{matches.length} match{matches.length!==1?"es":""}</span>
                    </div>
                    <span style={{color:allSelected?T.teal:T.muted,fontSize:12,fontWeight:700}}>
                      {allSelected?"All selected":"Select all"}
                    </span>
                  </div>
                  {/* Individual matches */}
                  {matches.map(m=>{
                    const selected=selectedMatches.includes(m.id);
                    return(
                      <div key={m.id} onClick={()=>setSelectedMatches(s=>s.includes(m.id)?s.filter(x=>x!==m.id):[...s,m.id])}
                        style={{background:selected?"#071a30":T.bgDeep,border:`1px solid ${selected?T.teal:T.border}`,borderRadius:10,padding:"10px 16px",marginBottom:4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginLeft:16}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${selected?T.teal:T.muted}`,background:selected?T.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>
                            {selected&&"✓"}
                          </div>
                          <span style={{fontSize:16}}>{FLAGS[m.home]||"🏳️"}</span>
                          <span style={{color:T.white,fontSize:13,fontWeight:600}}>{m.home} vs {m.away}</span>
                          <span style={{fontSize:16}}>{FLAGS[m.away]||"🏳️"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}

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
            <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button onClick={saveActuals} disabled={saving}
                  style={{flex:1,padding:14,fontSize:15,fontWeight:900,background:`linear-gradient(135deg,${T.gold},#c9a030)`,color:T.bgDeep,border:"none",borderRadius:12,cursor:"pointer",opacity:saving?0.6:1}}>
                  {saving?"Saving...":"💾 Save Results"}
                </button>
                {saveMsg&&<span style={{color:T.green,fontWeight:800}}>{saveMsg}</span>}
              </div>
              <button onClick={sendLeaderboardEmail} disabled={sendingLb}
                style={{width:"100%",padding:14,fontSize:15,fontWeight:900,background:`linear-gradient(135deg,${T.teal},#178a84)`,color:"#fff",border:"none",borderRadius:12,cursor:"pointer",opacity:sendingLb?0.6:1}}>
                {sendingLb?`Sending standings...`:`📊 Send Standings to ${players.length} players`}
              </button>
              {sendLbMsg&&<div style={{color:T.green,fontWeight:800,textAlign:"center"}}>{sendLbMsg}</div>}
            </div>
          )}
        </div>
      )}

      {/* ── MATCH WINNERS ── */}
      {screen==="predictions"&&(
        <div style={{maxWidth:700,margin:"0 auto",padding:16}}>
          <div style={{color:T.white,fontWeight:900,fontSize:18,marginBottom:4}}>🏆 Match Results</div>
          <div style={{color:T.muted,fontSize:13,marginBottom:16}}>Who predicted the exact score for each match.</div>
          {loadingPreds?(
            <div style={{textAlign:"center",color:T.muted,padding:40}}>Loading...</div>
          ):Object.keys(allPredictions).length===0?(
            <div style={{textAlign:"center",color:T.muted,padding:40}}>No predictions yet.</div>
          ):Object.values(allPredictions).map(({match:m, actual, preds})=>{
            const hasResult = actual&&actual.h!==""&&actual.a!=="";
            const winners = preds.filter(p=>p.pts===1);
            const participated = preds.length;
            return (
              <div key={m.id} style={{
                background:T.bgCard,
                border:`1px solid ${winners.length>0?T.gold:T.border}`,
                borderRadius:16,padding:18,marginBottom:12,
                boxShadow:winners.length>0?`0 0 16px ${T.gold}33`:"none",
              }}>
                {/* Match header */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:22}}>{FLAGS[m.home]||"🏳️"}</span>
                    <span style={{color:T.white,fontWeight:800,fontSize:15}}>{m.home} vs {m.away}</span>
                    <span style={{fontSize:22}}>{FLAGS[m.away]||"🏳️"}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    {hasResult?(
                      <span style={{background:"#f5c84233",color:T.gold,padding:"4px 14px",borderRadius:20,fontWeight:900,fontSize:16,fontFamily:"monospace",border:`1px solid ${T.gold}44`}}>
                        {actual.h} : {actual.a}
                      </span>
                    ):(
                      <span style={{background:T.bgDeep,color:T.muted,padding:"4px 12px",borderRadius:20,fontSize:12,border:`1px solid ${T.border}`}}>
                        ⏳ No result yet
                      </span>
                    )}
                    <span style={{color:T.muted,fontSize:11}}>{m.date} · {m.time}</span>
                  </div>
                </div>

                {/* Winner(s) */}
                {hasResult&&(
                  <div style={{marginBottom:12}}>
                    {winners.length===0?(
                      <div style={{background:"#1a0a0a",border:"1px solid #3a1a1a",borderRadius:10,padding:"10px 14px",color:T.red,fontSize:13,fontWeight:700}}>
                        😬 No one got the exact score
                      </div>
                    ):(
                      <div style={{background:"#1a1a00",border:`1px solid ${T.gold}55`,borderRadius:10,padding:"10px 14px"}}>
                        <div style={{color:T.gold,fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                          🎯 Winner{winners.length>1?"s":""}
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                          {winners.map((w,i)=>(
                            <div key={i} style={{background:"#f5c84222",border:`1px solid ${T.gold}`,borderRadius:20,padding:"6px 16px",display:"flex",alignItems:"center",gap:6}}>
                              <span style={{color:T.gold,fontWeight:900,fontSize:14}}>🏆 {w.name}</span>
                              <span style={{color:T.gold,fontSize:13,fontFamily:"monospace",opacity:0.8}}>{w.h}:{w.a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* All predictions */}
                <div style={{borderTop:`1px solid ${T.border}`,paddingTop:10}}>
                  <div style={{color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                    {participated} prediction{participated!==1?"s":""}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {preds.map((p,i)=>{
                      const isWinner = p.pts===1;
                      return (
                        <div key={i} style={{
                          background:isWinner?"#f5c84222":hasResult?"#1a0a0a":T.bgDeep,
                          border:`1px solid ${isWinner?T.gold:hasResult?"#3a1a1a":T.border}`,
                          borderRadius:10,padding:"6px 12px",
                          display:"flex",alignItems:"center",gap:6,
                        }}>
                          <span style={{color:isWinner?T.gold:hasResult?T.red:T.white,fontSize:13,fontWeight:700}}>{p.name}</span>
                          <span style={{color:isWinner?T.gold:T.muted,fontSize:13,fontFamily:"monospace",fontWeight:900}}>{p.h}:{p.a}</span>
                          {isWinner&&<span style={{fontSize:14}}>🎯</span>}
                        </div>
                      );
                    })}
                    {/* Show players who didn't predict */}
                    {players.filter(pl=>!preds.find(p=>p.name===pl.name)).map((pl,i)=>(
                      <div key={`np${i}`} style={{background:"#0a0a1a",border:`1px solid ${T.border}`,borderRadius:10,padding:"6px 12px",display:"flex",alignItems:"center",gap:6,opacity:0.5}}>
                        <span style={{color:T.muted,fontSize:13}}>{pl.name}</span>
                        <span style={{color:"#e74c3c",fontSize:10,fontWeight:700}}>NO PICK</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={loadAllPredictions} style={{marginTop:8,width:"100%",padding:12,fontSize:13,fontWeight:700,background:"transparent",border:`1px solid ${T.border}`,borderRadius:10,color:T.muted,cursor:"pointer"}}>🔄 Refresh</button>
        </div>
      )}
    </div>
  );
}
