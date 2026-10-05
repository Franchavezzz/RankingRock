const artists = [
["Soda Stereo","Banda"],["Patricio Rey y sus Redonditos de Ricota","Banda"],["Los Piojos","Banda"],
["Divididos","Banda"],["La Renga","Banda"],["Sumo","Banda"],["Virus","Banda"],["Los Abuelos de la Nada","Banda"],
["Serú Girán","Banda"],["Almendra","Banda"],["Manal","Banda"],["Pappo's Blues","Banda"],["Vox Dei","Banda"],
["Invisible","Banda"],["Rata Blanca","Banda"],["Attaque 77","Banda"],["Los Fabulosos Cadillacs","Banda"],
["Babasónicos","Banda"],["Las Pelotas","Banda"],["Catupecu Machu","Banda"],["Airbag","Banda"],
["Guasones","Banda"],["La Beriso","Banda"],["Ratones Paranoicos","Banda"],["Massacre","Banda"],
["Ciro y los Persas","Banda"],["Viejas Locas","Banda"],["Intoxicados","Banda"],["Los Tipitos","Banda"],
["Miranda!","Banda"],["Eruca Sativa","Banda"],["El Mató a un Policía Motorizado","Banda"],
["Él Mató","Banda"],["Bersuit Vergarabat","Banda"],["Auténticos Decadentes","Banda"],["Turf","Banda"],
["Marilina Bertoldi","Solista"],["Charly García","Solista"],["Luis Alberto Spinetta","Solista"],
["Gustavo Cerati","Solista"],["Fito Páez","Solista"],["Andrés Calamaro","Solista"],
["León Gieco","Solista"],["Indio Solari","Solista"],["Wos","Solista"],["Trueno","Solista"],
["Dillom","Solista"],["Nicki Nicole","Solista"],["Lali","Solista"],["Fabiana Cantilo","Solista"],
["Celeste Carballo","Solista"],["Hilda Lizarazu","Solista"],["Miguel Mateos","Solista"],
["Vicentico","Solista"],["Juanse","Solista"],["David Lebón","Solista"],["Javier Calamaro","Solista"],
["Gustavo Santaolalla","Solista"],["Tete Novoa","Solista"]
];

let counts = JSON.parse(localStorage.getItem("rankingRockCounts") || "{}");
let bracket=[], round=0, match=0;

function save(){localStorage.setItem("rankingRockCounts",JSON.stringify(counts))}
function weightedPick(pool,n){
  const copy=[...pool], out=[];
  while(out.length<n && copy.length){
    const weights=copy.map(a=>1/(1+(counts[a[0]]||0)));
    const total=weights.reduce((a,b)=>a+b,0);
    let r=Math.random()*total, idx=0;
    for(;idx<copy.length;idx++){r-=weights[idx];if(r<=0)break}
    const chosen=copy.splice(idx,1)[0]; out.push(chosen); counts[chosen[0]]=(counts[chosen[0]]||0)+1;
  }
  save(); return out;
}
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active")}
function start(){
  bracket=weightedPick(artists,16); round=0; match=0; show("game"); render();
}
function render(){
  const names=["OCTAVOS","CUARTOS","SEMIFINALES","FINAL"];
  const totalMatches=[8,4,2,1][round];
  document.getElementById("roundName").textContent=names[round];
  document.getElementById("matchNumber").textContent=` · ${match+1}/${totalMatches}`;
  document.getElementById("progressFill").style.width=((match/totalMatches)*100)+"%";
  const a=bracket[match*2], b=bracket[match*2+1];
  document.getElementById("match").innerHTML=`
    <h2>${names[round]}</h2><div class="sub">Elegí quién avanza</div>
    <div class="choices">
      ${card(a,0)}${card(b,1)}
    </div>
    <div class="winner">El ganador pasa a la siguiente ronda.</div>`;
}
function card(a,i){
 return `<button class="choice" onclick="choose(${i})"><span class="badge">${a[1]}</span><h3>${a[0]}</h3><p>Elegir este</p></button>`;
}
function choose(i){
  const winner=bracket[match*2+i];
  const winnersStart=16 >> round;
  if(!window.nextWinners) window.nextWinners=[];
  window.nextWinners.push(winner);
  match++;
  const total=[8,4,2,1][round];
  if(match<total){render();return}
  if(round===3){showChampion(winner);return}
  bracket=window.nextWinners; window.nextWinners=[]; round++; match=0; render();
}
function showChampion(w){
 document.getElementById("progressFill").style.width="100%";
 document.getElementById("match").innerHTML=`<div class="champion"><div class="trophy">🏆</div><h1>CAMPEÓN</h1><div class="name">${w[0]}</div><p>${w[1]} · Ganador de RankingRock</p><br><button class="main-btn" onclick="start()">JUGAR OTRA VEZ</button></div>`;
}
function stats(){
 const data=artists.map(a=>[a[0],a[1],counts[a[0]]||0]).sort((x,y)=>y[2]-x[2]);
 const max=Math.max(1,...data.map(x=>x[2]));
 document.getElementById("statsContent").innerHTML=`<h2>Veces que apareció cada artista</h2><p class="note">Los que jugaron menos tienen más posibilidades de aparecer en futuras partidas.</p><div class="stats-grid">${data.map(x=>`<div class="stat-card"><strong>${x[0]}</strong><div>${x[1]} · ${x[2]} partida${x[2]===1?"":"s"}</div><div class="bar"><i style="width:${x[2]/max*100}%"></i></div></div>`).join("")}</div>`;
 show("stats");
}
document.getElementById("startBtn").onclick=start;
document.getElementById("statsBtn").onclick=stats;
document.getElementById("homeBtn").onclick=()=>show("home");
document.getElementById("statsHomeBtn").onclick=()=>show("home");
document.getElementById("resetBtn").onclick=()=>{if(confirm("¿Borrar el historial de apariciones?")){counts={};save();alert("Historial borrado.");}};
