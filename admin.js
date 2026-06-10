function adminLogin(){
  const u=document.getElementById("adminUser").value;
  const p=document.getElementById("adminPass").value;
  if(u==="admin" && p==="admin123"){
    document.getElementById("loginBox").style.display="none";
    document.getElementById("adminDashboard").style.display="block";
    loadProfileFields();
  }else{
    alert("Wrong login");
  }
}

function saveProfile(){
  const profile={
    name:document.getElementById("trainerName").value,
    phone:document.getElementById("trainerPhone").value,
    email:document.getElementById("trainerEmail").value,
    address:document.getElementById("trainerAddress").value
  };
  localStorage.setItem("trainerProfile",JSON.stringify(profile));
  alert("Profile saved locally");
}

function loadProfileFields(){
  const p=JSON.parse(localStorage.getItem("trainerProfile")) || {};
  document.getElementById("trainerName").value=p.name || "Arun";
  document.getElementById("trainerPhone").value=p.phone || "+971 52 612 0096";
  document.getElementById("trainerEmail").value=p.email || "arunpersonaltrainerin@gmail.com";
  document.getElementById("trainerAddress").value=p.address || "11a Street 2, Sector, Dubai, United Arab Emirates";
}

function saveBrandImage(){
  const file=document.getElementById("brandImage").files[0];
  if(!file){alert("Choose image");return;}
  const reader=new FileReader();
  reader.onload=e=>{
    localStorage.setItem("brandImage",e.target.result);
    alert("Brand image saved locally");
  };
  reader.readAsDataURL(file);
}

function saveCarousel(){
  const file=document.getElementById("carouselFile").files[0];
  if(!file){alert("Choose file");return;}
  const reader=new FileReader();
  reader.onload=e=>{
    const list=JSON.parse(localStorage.getItem("carousel")) || [];
    list.push({type:file.type,data:e.target.result});
    localStorage.setItem("carousel",JSON.stringify(list));
    alert("Carousel item saved locally");
  };
  reader.readAsDataURL(file);
}

function saveClient(){
  const clients=JSON.parse(localStorage.getItem("clients")) || [];
  clients.push({
    name:document.getElementById("clientName").value,
    plan:document.getElementById("clientPlan").value,
    content:document.getElementById("clientContent").value
  });
  localStorage.setItem("clients",JSON.stringify(clients));
  alert("Client created locally");
}

function savePlan(){
  const plans=JSON.parse(localStorage.getItem("plans")) || [];
  plans.push({
    name:document.getElementById("planName").value,
    price:document.getElementById("planPrice").value,
    details:document.getElementById("planDetails").value
  });
  localStorage.setItem("plans",JSON.stringify(plans));
  alert("Plan added locally");
}
