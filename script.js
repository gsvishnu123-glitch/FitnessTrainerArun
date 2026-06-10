
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
