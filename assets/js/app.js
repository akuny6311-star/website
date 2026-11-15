(() => {
 const $ = (id) => document.getElementById(id);
 const screens = ["homeScreen","gameScreen","resultScreen"];
 let player = "Pemain", score = 0, correct = 0, wrong = 0, total = 0, index = 0;
 let mode = "", items = [], answers = [], startedAt = 0, timerId = null, soundOn = true;
 let activeQuestion = null, awaiting = false;

 function show(id){ screens.forEach(s => $(s).classList.toggle("active",s===id)); window.scrollTo({top:0,behavior:"smooth"}); }
 function beep(freq=620,duration=.08){ if(!soundOn)return; try{const C=window.AudioContext||window.webkitAudioContext;const c=new C();const o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.connect(g);g.connect(c.destination);g.gain.value=.035;o.start();o.stop(c.currentTime+duration);o.onended=()=>c.close();}catch(e){} }
 function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
 function setProgress(){ $("progressText").textContent = total ? `Tantangan ${Math.min(index+1,total)} dari ${total}` : ""; $("progressBar").style.width = `${total ? index/total*100 : 0}%`; $("liveScore").textContent=score; }
 function startClock(){startedAt=Date.now();clearInterval(timerId);timerId=setInterval(()=>{const s=Math.floor((Date.now()-startedAt)/1000);$("timerText").textContent=`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;},500);}
 function begin(name){player=name.trim()||"Pemain";score=0;correct=0;wrong=0;answers=[];show("homeScreen");}
 function startGame(which){
   mode=which;score=0;correct=0;wrong=0;index=0;answers=[];
   if(which==="quiz"){items=window.QUIZ_QUESTIONS; $("gameTitle").textContent="Quick Quiz";$("gameKicker").textContent="MISSION 01 / KNOWLEDGE";}
   if(which==="mvc"){items=window.MVC_ITEMS;$("gameTitle").textContent="MVC Sorting";$("gameKicker").textContent="MISSION 02 / ARCHITECTURE";}
   if(which==="render"){items=window.RENDER_ITEMS;$("gameTitle").textContent="SSR vs SPA Battle";$("gameKicker").textContent="MISSION 03 / RENDERING";}
   if(which==="bug"){items=window.BUG_ITEMS;$("gameTitle").textContent="Find the Bug";$("gameKicker").textContent="MISSION 04 / CODE QUALITY";}
   total=items.length;$("liveScore").textContent="0";setProgress();show("gameScreen");startClock();render();
 }
 function render(){
   awaiting=false;setProgress();const item=items[index];let html="";
   if(mode==="quiz"||mode==="bug"){
     html=`<span class="question-count">CHALLENGE ${index+1} / ${total}</span><h3 class="question">${escapeHtml(mode==="bug"?item.title:item.q)}</h3>`;
     if(mode==="bug") html+=`<pre class="code-sample">${escapeHtml(item.code)}</pre><p class="scenario">${escapeHtml(item.q)}</p>`;
     html+=`<div class="answers">${item.a.map((a,i)=>`<button class="answer-btn" data-answer="${i}"><b>${String.fromCharCode(65+i)}.</b> ${escapeHtml(a)}</button>`).join("")}</div><div id="feedback"></div><div class="next-row"><button id="nextBtn" class="btn btn-primary" hidden>${index===total-1?"LIHAT HASIL":"LANJUT →"}</button></div>`;
   } else if(mode==="mvc"){
     html=`<span class="question-count">SORTING ${index+1} / ${total}</span><h3 class="question">Ke mana tanggung jawab ini seharusnya ditempatkan?</h3><p class="scenario">${escapeHtml(item.t)}</p><div class="choice-grid">${["Model","View","Controller"].map(x=>`<button class="choice-btn" data-answer="${x}">${x}</button>`).join("")}</div><div id="feedback"></div><div class="next-row"><button id="nextBtn" class="btn btn-primary" hidden>${index===total-1?"LIHAT HASIL":"LANJUT →"}</button></div>`;
   } else {
     html=`<span class="question-count">BATTLE ${index+1} / ${total}</span><h3 class="question">Identifikasi pendekatan rendering</h3><p class="scenario">${escapeHtml(item.t)}</p><div class="choice-grid">${["SSR","SPA"].map(x=>`<button class="choice-btn" data-answer="${x}">${x}</button>`).join("")}</div><div id="feedback"></div><div class="next-row"><button id="nextBtn" class="btn btn-primary" hidden>${index===total-1?"LIHAT HASIL":"LANJUT →"}</button></div>`;
   }
   $("gameContent").innerHTML=html;
   $("gameContent").querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>choose(b)));
   $("nextBtn").addEventListener("click",()=>{index++;if(index>=total)finish();else render();});
 }
 function choose(btn){
   if(awaiting)return;awaiting=true;const item=items[index], chosen=btn.dataset.answer;
   const expected=mode==="mvc"||mode==="render"?item.c:item.c;
   const isCorrect=mode==="mvc"||mode==="render" ? chosen===expected : Number(chosen)===expected;
   if(isCorrect){score+=10;correct++;beep(760);}else{wrong++;beep(220,.13);}
   answers.push({title:mode==="quiz"?item.q:mode==="bug"?item.title:item.t,chosen:mode==="mvc"||mode==="render"?chosen:item.a[Number(chosen)],correct:isCorrect,expected:mode==="mvc"||mode==="render"?expected:item.a[expected],explanation:item.e});
   $("gameContent").querySelectorAll("[data-answer]").forEach(b=>{b.disabled=true;if((mode==="mvc"||mode==="render")?b.dataset.answer===expected:Number(b.dataset.answer)===expected)b.classList.add("correct");});
   if(!isCorrect)btn.classList.add("wrong");
   $("feedback").innerHTML=`<div class="feedback"><b>${isCorrect?"✓ Tepat!":"✕ Belum tepat."}</b> ${escapeHtml(item.e)}</div>`;
   $("nextBtn").hidden=false;$("liveScore").textContent=score;setProgress();
 }
 function finish(){
   clearInterval(timerId);$("progressBar").style.width="100%";show("resultScreen");
   const accuracy=total?Math.round(correct/total*100):0;
   $("finalScore").textContent=score;$("correctCount").textContent=correct;$("wrongCount").textContent=wrong;$("accuracy").textContent=accuracy+"%";
   let badge=accuracy>=90?"ARCHITECT MASTER":accuracy>=70?"WEB BUILDER":accuracy>=50?"CODE EXPLORER":"LEARNING STARTER";
   $("resultBadge").textContent=badge;$("resultTitle").textContent=accuracy>=70?"Misi berhasil!":"Misi selesai!";
   $("resultSubtitle").textContent=`${player}, kamu menyelesaikan ${total} tantangan. Terus tingkatkan pemahamanmu.`;
   $("resultReview").innerHTML=`<h3>Review jawaban</h3><div class="review-list">${answers.map((a,i)=>`<div class="review-item"><b>${i+1}. ${a.correct?"BENAR":"PERLU DITINJAU"}</b><div>${escapeHtml(a.title)}</div><div class="muted">Jawaban: ${escapeHtml(String(a.chosen))} · Kunci: ${escapeHtml(String(a.expected))}</div><div>${escapeHtml(a.explanation)}</div></div>`).join("")}</div>`;
   const records=JSON.parse(localStorage.getItem("wac_scores")||"[]");records.push({name:player,score,accuracy,badge,date:new Date().toLocaleDateString("id-ID")});records.sort((a,b)=>b.score-a.score);localStorage.setItem("wac_scores",JSON.stringify(records.slice(0,10)));renderLeaderboard();
 }
 function renderLeaderboard(){const records=JSON.parse(localStorage.getItem("wac_scores")||"[]");$("leaderboardList").innerHTML=records.length?records.map((r,i)=>`<div class="leader-row"><span>${i+1}. ${escapeHtml(r.name)} <small class="muted">· ${r.date}</small></span><b>${r.score} poin</b></div>`).join(""):'<p class="muted">Belum ada skor. Jadilah pemain pertama!</p>';}
 $("startForm").addEventListener("submit",e=>{e.preventDefault();const n=$("playerName").value.trim();if(!n){$("playerName").focus();return;}player=n;startGame("quiz");});
 $("backHome").addEventListener("click",()=>{clearInterval(timerId);show("homeScreen");});
 $("resultHome").addEventListener("click",()=>show("homeScreen"));
 $("playAgain").addEventListener("click",()=>startGame("quiz"));
 $("clearScores").addEventListener("click",()=>{if(confirm("Hapus seluruh leaderboard lokal pada browser ini?")){localStorage.removeItem("wac_scores");renderLeaderboard();}});
 $("soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("soundToggle").innerHTML=`♫ <span>Suara: ${soundOn?"ON":"OFF"}</span>`;});
 // Tombol pemilihan mini-game muncul dari panel misi agar semua mode dapat diakses.
 const cards=document.querySelectorAll(".game-card");
 cards.forEach((card,i)=>card.addEventListener("click",()=>{if(!$("playerName").value.trim()){ $("playerName").value="Pemain"; }player=$("playerName").value.trim()||"Pemain";startGame(["quiz","mvc","render","bug"][i]);}));
 renderLeaderboard();
})();