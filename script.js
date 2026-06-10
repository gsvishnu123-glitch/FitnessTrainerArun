const defaultWorkouts = [
  {
    title:"Beginner Full Body",
    desc:"Squats, push-ups, rows, shoulder press and plank. Ideal for beginners."
  },
  {
    title:"Muscle Gain Split",
    desc:"Chest, back, shoulder, arms and legs split with progressive overload."
  },
  {
    title:"Fat Loss Circuit",
    desc:"HIIT, bodyweight circuit, core training and calorie-controlled diet."
  }
];

function getWorkouts(){
  return JSON.parse(localStorage.getItem("workouts")) || defaultWorkouts;
}

function saveWorkouts(data){
  localStorage.setItem("workouts", JSON.stringify(data));
}

function renderWorkouts(){
  const list=document.getElementById("workoutList");
  list.innerHTML="";
  getWorkouts().forEach(w=>{
    list.innerHTML += `
      <div class="card">
        <img src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=700&q=80">
        <h3>${w.title}</h3>
        <p>${w.desc}</p>
      </div>`;
  });
}

function addWorkout(){
  const title=document.getElementById("workoutTitle").value.trim();
  const desc=document.getElementById("workoutDesc").value.trim();
  if(!title || !desc){alert("Enter workout title and details");return;}
  const data=getWorkouts();
  data.push({title,desc});
  saveWorkouts(data);
  document.getElementById("workoutTitle").value="";
  document.getElementById("workoutDesc").value="";
  renderWorkouts();
}

function getMedia(){
  return JSON.parse(localStorage.getItem("media")) || [];
}

function saveMedia(data){
  localStorage.setItem("media", JSON.stringify(data));
}

function renderMedia(){
  const box=document.getElementById("galleryList");
  box.innerHTML="";
  getMedia().forEach(m=>{
    box.innerHTML += m.type.startsWith("image")
      ? `<img src="${m.data}">`
      : `<video controls src="${m.data}"></video>`;
  });
}

function uploadMedia(){
  const file=document.getElementById("mediaFile").files[0];
  if(!file){alert("Choose image or video");return;}
  const reader=new FileReader();
  reader.onload=function(e){
    const data=getMedia();
    data.push({type:file.type,data:e.target.result});
    saveMedia(data);
    renderMedia();
  };
  reader.readAsDataURL(file);
}

renderWorkouts();
renderMedia();
