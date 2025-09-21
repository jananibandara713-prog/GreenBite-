// ========= Workout Data (embedded) ==================================
const DATA = {
  // Core focus areas
  full:   { none:["Burpees","Push-Ups","Bodyweight Squats","Reverse Lunges","Mountain Climbers","Plank","Jumping Jacks"] },
  legs:   { none:["Bodyweight Squats","Reverse Lunges","Glute Bridges","Calf Raises","Wall Sit","Step-Ups"] },
  arms:   { none:["Push-Ups","Diamond Push-Ups","Chair Dips","Pike Push-Ups","Close-Grip Push-Ups"] },
  abs:    { none:["Crunches","Leg Raises","Bicycle Crunches","Plank","Side Plank","Dead Bug","Mountain Climbers"] },
  back:   { none:["Superman Hold","Prone T Raise","Reverse Snow Angels","Doorway Row (towel)","Y-T-W Raises"] },
  yoga:   { none:["Sun Salutations","Chair Pose","Warrior II","Downward Dog","Bridge Pose","Child’s Pose","Cat–Cow","Pigeon (gentle)"] },

  // Extra categories
  wall:   { none:["Wall Angels","Wall Sits","Wall Walkouts","Wall Push-Ups","Wall Leg Raises","Wall Pike Hold"] },
  bed:    { none:["Bed Roll-Downs","Bed Glute Bridge","Bed Single-Leg Lift","Bed Crunch Reach","Bed Clamshells","Bed Hip Abduction"] },
  chair:  { none:["Chair Cat-Cow","Chair Twist","Chair Knee Raises","Chair Forward Fold","Chair Marches","Chair Side Bend"] },

  // New requirements
  home:   { none:["Jumping Jacks","Bodyweight Squats","Alternating Lunges","Incline Push-Ups","Glute Bridge","Plank 30s","Mountain Climbers"] },
  facial: { none:["Forehead Smoothing (palms)","Brow Lift Hold","Eye Circles (gentle)","Cheek Lift Smile","Jaw Release (tongue press)","Neck Stretch (side/center)"] }
};

// Optional images (fallback to gradients if missing)
const IMAGE = {
  // Optional images (fallback to gradients if missing)
  home:"https://i.pinimg.com/736x/03/7a/78/037a78e3cae1d906c0cc484d122fe28d.jpg ",
  full:"https://i.pinimg.com/1200x/fd/6e/ce/fd6ece77635c777293353a9900d3992a.jpg",
  legs:"https://i.pinimg.com/1200x/70/e2/72/70e2727f57ba463ab41777cc959ab3b0.jpg",
  arms:"https://i.pinimg.com/1200x/ab/dc/fd/abdcfd9cb62a8349ba12d968ce76392a.jpg",
  abs:" https://i.pinimg.com/1200x/da/ba/b7/dabab7a5ab477bf69b0cfe65aa7efc9d.jpg", 
  back:"https://i.pinimg.com/1200x/6a/44/8a/6a448a88aa88b37a312fdaf8da1c16f9.jpg",
  yoga:"https://i.pinimg.com/736x/81/b1/87/81b1875a34ef35e2f75329fa55e86316.jpg",
  wall:"https://i.pinimg.com/736x/f7/bf/d8/f7bfd83ed58724586b9728f18d1c2f7e.jpg",
  bed:"https://i.pinimg.com/1200x/03/d9/77/03d97729ec791a3165af948eda38c7f5.jpg",
  chair:"https://i.pinimg.com/736x/5e/22/cc/5e22cccff06e161f8a51e7e657f957ad.jpg",
  facial:"https://i.pinimg.com/736x/04/52/19/045219fc3d900f261add48218d43eb8e.jpg",
  placeholder:"https://i.pinimg.com/1200x/02/9c/a8/029ca89fbf8b2872524d233e9f6ae57e.jpg ",
};

// Gradient classes for each category
const GRAD = {
  full:"grad-full", legs:"grad-legs", arms:"grad-arms", abs:"grad-abs", back:"grad-back", yoga:"grad-yoga",
  wall:"grad-wall", bed:"grad-bed", chair:"grad-chair", home:"grad-home", facial:"grad-facial"
};

// Search aliases (mirrors Recipes-style search)
const ALIAS = {
  "home":"home","home workout":"home","workout at home":"home","no equipment":"home",
  "full":"full","full body":"full","total body":"full","all":"full",
  "legs":"legs","leg":"legs","lower body":"legs",
  "arms":"arms","arm":"arms","upper body":"arms",
  "abs":"abs","core":"abs","belly":"abs","abs workout":"abs",
  "back":"back",
  "yoga":"yoga","stretch":"yoga","mobility":"yoga",
  "facial yoga":"facial","face yoga":"facial","facial":"facial",
  "wall":"wall","wall pilates":"wall",
  "bed":"bed","bed pilates":"bed",
  "chair":"chair","chair yoga":"chair","chair work":"chair"
};

// ========= Utilities ==========================================
const $ = s => document.querySelector(s);
const pretty = s => String(s).replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
function toast(msg){
  const t=document.createElement("div");
  t.className="gb-toast";
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add("show"),10);
  setTimeout(()=>{t.classList.remove("show"); setTimeout(()=>t.remove(),250);},1800);
}

// ========= Timer ==============================================
let iv=null, left=0; window._timerDuration=30;
const timerEl=$("#timer");
$("#startTimer").addEventListener("click", startTimer);
$("#stopTimer").addEventListener("click", ()=>{ stopTimer(); resetTimer(); });

function resetTimer(){
  left=window._timerDuration||30;
  timerEl.textContent="00:"+String(left).padStart(2,"0");
}
function startTimer(){
  if(iv) return;
  iv=setInterval(()=>{
    left--;
    timerEl.textContent="00:"+String(left).padStart(2,"0");
    if(left<=0){
      stopTimer();
      alert("⏱️ Time! Next exercise.");
      resetTimer();
    }
  },1000);
}
function stopTimer(){ clearInterval(iv); iv=null; }

// ========= Grid Rendering =====================================
function renderGrid({ area="all", level="intermediate", equip="none" }={}){
  const grid=$("#workoutGrid");
  const keys=Object.keys(DATA).filter(k => area==="all" ? true : k===area);

  grid.innerHTML = keys.map(k => {
    const list=(DATA[k]?.[equip] || DATA[k]?.none || []).slice(0,5);
    const sets=level==="beginner"?2:(level==="intermediate"?3:4);
    const dur =level==="beginner"?30:(level==="intermediate"?40:50);
    const img =IMAGE[k];
    const grad=GRAD[k] || "grad-full";
    const subtitle=`${pretty(level)} Level • ${pretty(k)}`;

    return `
      <article class="card-w" data-body="${k}" data-level="${level}" data-equip="${equip}">
        <div class="thumb">
          ${img ? `<img src="${img}" alt="${pretty(k)}" onerror="this.remove()">` : ""}
          <div class="grad ${grad}"></div>
        </div>
        <div class="card-body">
          <div class="card-title">${pretty(k)}</div>
          <div class="subtitle">${subtitle}</div>
          <div class="badges">
            <span class="badge">${pretty(equip)}</span>
            <span class="badge">${sets}×${dur}s</span>
          </div>
          <ol class="list">${list.map(x=>`<li>${x}</li>`).join("")}</ol>
        </div>
      </article>
    `;
  }).join("");

  // bind clicks
  grid.querySelectorAll(".card-w").forEach(el=>{
    el.addEventListener("click", ()=>{
      const body=el.getAttribute("data-body");
      const lvl =el.getAttribute("data-level");
      const eq  =el.getAttribute("data-equip");
      openPlan(body, lvl, eq);
    });
  });
}

// ========= Plan Modal =========================================
function openPlan(body, level, equip){
  const age = parseInt($("#filterAge")?.value || "0",10);
  const list = (DATA[body]?.[equip] || DATA[body]?.none || []).slice(0,7);
  const adjusted = age>50 ? list.map(x => x==="Burpees" ? "Step-Back Squats" : x) : list;

  const sets=level==="beginner"?2:(level==="intermediate"?3:4);
  const dur =level==="beginner"?30:(level==="intermediate"?40:50);

  const modal=$("#workoutDetail");
  modal.style.display="flex";
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-head"><strong>${pretty(body)} • ${pretty(level)}</strong></div>
      <div class="modal-body">
        <div class="badges" style="margin-bottom:10px">
          <span class="badge">${pretty(equip)}</span>
          <span class="badge">${sets} sets</span>
          <span class="badge">${dur}s / exercise</span>
        </div>
        <h4>Warm-up</h4>
        <ul class="list">
          <li>2–3 min brisk walk or march</li>
          <li>Arm/hip circles</li>
          <li>Dynamic stretches</li>
        </ul>

        <h4>Main Set</h4>
        <ol class="list">${adjusted.map(x=>`<li>${x}</li>`).join("")}</ol>

        <h4>Cool-down</h4>
        <ul class="list">
          <li>Easy breathing (4-4-4-4)</li>
          <li>Gentle stretch: quads, hamstrings, chest/shoulders</li>
        </ul>
        <p class="tip">Tip: Keep movements slow and controlled. Hydrate 💧</p>
      </div>
      <div class="modal-foot">
        <button class="btn" id="sendTimer">Send to Timer</button>
        <button class="btn ghost" id="closePlan">Close</button>
      </div>
    </div>
  `;

  $("#closePlan").addEventListener("click", ()=>{
    modal.style.display="none";
    modal.innerHTML="";
  });
  $("#sendTimer").addEventListener("click", ()=>{
    window._timerDuration = dur;
    resetTimer();
    localStorage.setItem("lastWorkout",
      JSON.stringify({ body, level, equip, age, chosen: adjusted })
    );
    toast("Loaded into timer ✅");
    modal.style.display="none";
    modal.innerHTML="";
  });
}

// ========= Search / Chips / Reset =============================
function bindSearch(){
  const run=()=>{
    const q = ($("#workoutSearch").value||"").trim().toLowerCase();
    const lvl=$("#searchLevel").value;
    if(!q){
      toast("Type a workout: yoga, abs workout, facial yoga, home workout…");
      return;
    }
    const area = ALIAS[q] || q;
    if(!DATA[area]){
      toast("No workout found for: "+q);
      return;
    }
    renderGrid({ area, level:lvl, equip: $("#filterEquip").value });
  };
  $("#searchBtn").addEventListener("click", run);
  $("#workoutSearch").addEventListener("keydown", e=>{ if(e.key==="Enter") run(); });
}

function bindChips(){
  document.querySelectorAll("[data-chip]").forEach(ch=>{
    ch.addEventListener("click", ()=>{
      const area=ch.getAttribute("data-chip"); // keys match DATA
      renderGrid({ area, level: $("#searchLevel").value, equip: $("#filterEquip").value });
    });
  });
}

function bindReset(){
  $("#resetFilters").addEventListener("click", ()=>{
    $("#workoutSearch").value="";
    $("#searchLevel").value="intermediate";
    $("#filterEquip").value="none";
    $("#filterAge").value="";
    renderGrid({ area:"all", level:"intermediate", equip:"none" });
  });
}

// ========= Init ===============================================
(function init(){
  bindSearch(); bindChips(); bindReset();
  // Pre-prepared gallery on entry (like Recipes)
  renderGrid({ area:"all", level:"intermediate", equip:"none" });
  const last=localStorage.getItem("lastWorkout");
  if(last){
    const p=JSON.parse(last);
    window._timerDuration = p.level==="beginner"?30:(p.level==="intermediate"?40:50);
  }
  resetTimer();
})();
