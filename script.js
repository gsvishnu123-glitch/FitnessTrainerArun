
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
