
const defaultWorkouts = [
  {title:"Beginner Transformation",desc:"Full body training, basic strength, mobility and consistency building."},
  {title:"Muscle Gain Program",desc:"Progressive strength training with structured diet support."},
  {title:"Fat Loss Program",desc:"Customized workout and nutrition plan for sustainable fat loss."}
];

function getWorkouts(){return JSON.parse(localStorage.getItem("workouts")) || defaultWorkouts;}
function saveWorkouts(data){localStorage.setItem("workouts", JSON.stringify(data));}
function renderWorkouts(){
  const list=document.getElementById("workoutList");
  if(!list) return;
  list.innerHTML="";
  getWorkouts().forEach(w=>{list.innerHTML += `<div class="card"><h3>${w.title}</h3><p>${w.desc}</p></div>`;});
}
function addWorkout(){
  const title=document.getElementById("workoutTitle").value.trim();
  const desc=document.getElementById("workoutDesc").value.trim();
  if(!title || !desc){alert("Enter workout title and details");return;}
  const data=getWorkouts(); data.push({title,desc}); saveWorkouts(data);
  document.getElementById("workoutTitle").value=""; document.getElementById("workoutDesc").value="";
  renderWorkouts();
}
function getMedia(){return JSON.parse(localStorage.getItem("media")) || [];}
function saveMedia(data){localStorage.setItem("media", JSON.stringify(data));}
function renderMedia(){
  const box=document.getElementById("galleryList");
  if(!box) return;
  box.innerHTML="";
  getMedia().forEach(m=>{box.innerHTML += m.type.startsWith("image") ? `<img src="${m.data}">` : `<video controls src="${m.data}"></video>`;});
}
function uploadMedia(){
  const file=document.getElementById("mediaFile").files[0];
  if(!file){alert("Choose image or video");return;}
  const reader=new FileReader();
  reader.onload=function(e){const data=getMedia();data.push({type:file.type,data:e.target.result});saveMedia(data);renderMedia();};
  reader.readAsDataURL(file);
}
renderWorkouts(); renderMedia();

function loadDynamicProfile(){
  const p=JSON.parse(localStorage.getItem("trainerProfile")) || {};
  const contact=document.getElementById("contact");
  if(contact && p.phone){
    contact.innerHTML = `
      <p class="section-tag">Contact</p>
      <h2>Start Your Fitness Journey</h2>
      <p><b>${p.name || "Arun Personal Trainer"}</b></p>
      <p>Fitness Incharge, Restart Fitness - Rolla Branch</p>
      <p>${p.address || "11a Street 2, Sector, Dubai, United Arab Emirates"}</p>
      <p>Email: ${p.email || "arunpersonaltrainerin@gmail.com"}</p>
      <p>WhatsApp: ${p.phone || "+971 52 612 0096"}</p>
      <a class="primary-btn" href="https://wa.me/971526120096">Chat on WhatsApp</a>`;
  }
}

function loadCarousel(){
  const box=document.getElementById("carouselBox");
  if(!box) return;
  const list=JSON.parse(localStorage.getItem("carousel")) || [];
  if(!list.length){
    box.innerHTML = `
      <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=90">
      <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=90">
      <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=90">`;
    return;
  }
  box.innerHTML="";
  list.forEach(m=>{
    box.innerHTML += m.type.startsWith("image")
      ? `<img src="${m.data}">`
      : `<video controls src="${m.data}"></video>`;
  });
}

function loadPlans(){
  const plans=JSON.parse(localStorage.getItem("plans")) || [];
  const box=document.getElementById("plansList");
  if(!box || !plans.length) return;
  box.innerHTML="";
  plans.forEach(p=>{
    box.innerHTML += `<div class="card"><h3>${p.name}</h3><p><b>${p.price}</b></p><p>${p.details}</p><a class="primary-btn" href="https://wa.me/971526120096">Subscribe</a></div>`;
  });
}

function enableMenuThemes(){
  document.querySelectorAll('a[href="#programs"]').forEach(a=>a.onclick=()=>document.body.className="theme-programs");
  document.querySelectorAll('a[href="#plans"]').forEach(a=>a.onclick=()=>document.body.className="theme-plans");
  document.querySelectorAll('a[href="#gallery"]').forEach(a=>a.onclick=()=>document.body.className="theme-media");
  document.querySelectorAll('a[href="#home"]').forEach(a=>a.onclick=()=>document.body.className="");
}

loadDynamicProfile();
loadCarousel();
loadPlans();
enableMenuThemes();

function applySavedTheme(){
  const theme=localStorage.getItem("siteTheme") || "theme-ignite";
  document.body.classList.remove("theme-ignite","theme-elite","theme-aqua","theme-nature","theme-power");
  document.body.classList.add(theme);
}

applySavedTheme();

function applySectionContent(){
  const all = JSON.parse(localStorage.getItem("sectionContent")) || {};

  if(all.home){
    const h = document.querySelector(".hero h2");
    const p = document.querySelector(".hero-text");
    if(h) h.innerHTML = all.home.title;
    if(p) p.innerText = all.home.text;
  }

  if(all.about){
    const aboutTitle = document.querySelector("#about h2");
    const aboutText = document.querySelector("#about p:nth-of-type(2)");
    if(aboutTitle) aboutTitle.innerText = all.about.title;
    if(aboutText) aboutText.innerText = all.about.text;
  }

  if(all.programs){
    const t = document.querySelector("#programs h2");
    if(t) t.innerText = all.programs.title;
  }

  if(all.plans){
    const t = document.querySelector("#plans h2");
    if(t) t.innerText = all.plans.title;
  }

  if(all.contact){
    const t = document.querySelector("#contact h2");
    if(t) t.innerText = all.contact.title;
  }
}

applySectionContent();

/* Fix menu click theme conflict */
function fixMenuThemeClicks(){
  const savedTheme = localStorage.getItem("siteTheme") || "theme-ignite";

  document.querySelectorAll('a[href="#programs"],a[href="#plans"],a[href="#gallery"],a[href="#home"]').forEach(a=>{
    a.onclick = () => {
      document.body.className = savedTheme;
    };
  });
}

fixMenuThemeClicks();

/* Active menu highlighter */
function enableActiveMenu(){
  const menuLinks=document.querySelectorAll('.menu a[href^="#"]');

  menuLinks.forEach(link=>{
    link.addEventListener('click',()=>{
      menuLinks.forEach(x=>x.classList.remove('active'));
      link.classList.add('active');

      const savedTheme = localStorage.getItem("siteTheme") || "theme-ignite";
      document.body.className = savedTheme;
    });
  });
}

enableActiveMenu();

function recommendPlan(){
  const name=document.getElementById("pfName")?.value.trim();
  const whatsapp=document.getElementById("pfWhatsapp")?.value.trim();
  const weight=Number(document.getElementById("pfWeight")?.value||0);
  const height=Number(document.getElementById("pfHeight")?.value||0);
  const goal=document.getElementById("pfGoal")?.value;
  const level=document.getElementById("pfLevel")?.value;
  const box=document.getElementById("planResult");

  if(!name || !whatsapp || !weight || !height || !goal || !level){
    box.style.display="block";
    box.innerHTML="Please enter your name, WhatsApp number, weight, height, goal and fitness level to get your recommendation.";
    return;
  }

  let plan="Gold Transformation Coaching";
  let timeline="12–16 weeks";
  let target="improve strength, consistency, body composition and overall fitness";

  if(goal==="fat"){plan="Gold Fat Loss Transformation";timeline="12–20 weeks";target="sustainable fat loss, better stamina and improved food discipline";}
  if(goal==="muscle"){plan="Gold Muscle Gain Program";timeline="16–24 weeks";target="progressive strength, muscle gain and structured recovery";}
  if(goal==="lean"){plan="Gold Lean Body Program";timeline="10–16 weeks";target="lean body shaping, strength, posture and controlled nutrition";}
  if(goal==="fitness"){plan=level==="beginner"?"Silver Starter Fitness":"Gold General Fitness Coaching";timeline=level==="beginner"?"8–12 weeks":"10–16 weeks";target="routine building, mobility, stamina and healthy habits";}
  if(level==="advanced"){plan="Platinum One-to-One Premium";timeline="12–24 weeks";target="advanced transformation with priority personal coaching and accountability";}

  box.style.display="block";
  box.innerHTML=`
    <b>Hello ${name}, your recommended plan is: ${plan}</b><br>
    <b>Target:</b> ${target}.<br>
    <b>Approximate timeline:</b> ${timeline}.<br><br>
    <b>How we will do it step by step:</b><br>
    1. Review your current weight, height, fitness level and lifestyle.<br>
    2. Understand your goal: fat loss, muscle gain, lean body or general fitness.<br>
    3. Prepare a suitable workout and nutrition direction.<br>
    4. Start with trial support and adjust the plan based on your response.<br>
    5. Continue with monthly subscription, one-to-one coaching or personal training support as required.<br><br>
    This is an initial recommendation. Final plan will be customized after WhatsApp consultation.<br><br>
    <a class="plan-btn" href="https://wa.me/971526120096?text=Hi%20Arun,%20my%20name%20is%20${encodeURIComponent(name)}.%20My%20WhatsApp%20number%20is%20${encodeURIComponent(whatsapp)}.%20I%20want%20to%20discuss%20my%20recommended%20fitness%20plan.">Continue on WhatsApp</a>
  `;
}
