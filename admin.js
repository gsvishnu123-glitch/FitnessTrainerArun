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

function saveTheme(theme){
  localStorage.setItem("siteTheme", theme);
  document.getElementById("currentTheme").innerText = "Current theme: " + theme.replace("theme-","").toUpperCase();
  alert("Theme saved. Open website to view.");
}

function loadCurrentTheme(){
  const theme=localStorage.getItem("siteTheme") || "theme-ignite";
  const el=document.getElementById("currentTheme");
  if(el) el.innerText = "Current theme: " + theme.replace("theme-","").toUpperCase();
}

loadCurrentTheme();

function saveSectionContent(){
  const key=document.getElementById("sectionKey").value;
  const title=document.getElementById("sectionTitle").value.trim();
  const text=document.getElementById("sectionText").value.trim();

  if(!title || !text){alert("Enter title and content");return;}

  const all=JSON.parse(localStorage.getItem("sectionContent")) || {};
  all[key]={title,text};
  localStorage.setItem("sectionContent",JSON.stringify(all));
  alert("Website section saved");
}

function saveLibraryMedia(){
  const title=document.getElementById("mediaTitle").value.trim();
  const category=document.getElementById("mediaCategory").value;
  const file=document.getElementById("libraryFile").files[0];

  if(!title || !file){alert("Enter title and choose file");return;}

  const reader=new FileReader();
  reader.onload=e=>{
    const list=JSON.parse(localStorage.getItem("mediaLibrary")) || [];
    list.push({
      id:Date.now(),
      title,
      category,
      type:file.type || "application/pdf",
      name:file.name,
      data:e.target.result
    });
    localStorage.setItem("mediaLibrary",JSON.stringify(list));
    document.getElementById("mediaTitle").value="";
    document.getElementById("libraryFile").value="";
    renderMediaLibraryAdmin();
    alert("Uploaded to media library");
  };
  reader.readAsDataURL(file);
}

function deleteLibraryMedia(id){
  let list=JSON.parse(localStorage.getItem("mediaLibrary")) || [];
  list=list.filter(x=>String(x.id)!==String(id));
  localStorage.setItem("mediaLibrary",JSON.stringify(list));
  renderMediaLibraryAdmin();
}

function renderMediaLibraryAdmin(){
  const list=JSON.parse(localStorage.getItem("mediaLibrary")) || [];
  const box=document.getElementById("mediaLibraryList");
  const select=document.getElementById("assignMediaSelect");

  if(box){
    box.innerHTML=list.length ? "" : "<p>No media uploaded yet.</p>";
    list.forEach(m=>{
      box.innerHTML += `
        <div class="mini-item">
          <b>${m.title}</b><br>
          <small>${m.category} - ${m.name}</small><br>
          <button onclick="deleteLibraryMedia('${m.id}')">Delete</button>
        </div>`;
    });
  }

  if(select){
    select.innerHTML="";
    list.forEach(m=>{
      select.innerHTML += `<option value="${m.id}">${m.title} - ${m.category}</option>`;
    });
  }

  renderClientContentAdmin();
}

function assignContentToClient(){
  const client=document.getElementById("assignClientName").value.trim();
  const mediaId=document.getElementById("assignMediaSelect").value;

  if(!client || !mediaId){alert("Enter client and select content");return;}

  const assigned=JSON.parse(localStorage.getItem("clientAssignments")) || {};
  if(!assigned[client]) assigned[client]=[];
  assigned[client].push(mediaId);
  localStorage.setItem("clientAssignments",JSON.stringify(assigned));

  renderClientContentAdmin();
  alert("Content assigned to client");
}

function renderClientContentAdmin(){
  const assigned=JSON.parse(localStorage.getItem("clientAssignments")) || {};
  const media=JSON.parse(localStorage.getItem("mediaLibrary")) || [];
  const box=document.getElementById("clientContentList");
  if(!box) return;

  box.innerHTML="";
  Object.keys(assigned).forEach(client=>{
    box.innerHTML += `<h4>${client}</h4>`;
    assigned[client].forEach(id=>{
      const m=media.find(x=>String(x.id)===String(id));
      if(m) box.innerHTML += `<p>✓ ${m.title} <small>(${m.category})</small></p>`;
    });
  });

  if(!box.innerHTML) box.innerHTML="<p>No client content assigned yet.</p>";
}

renderMediaLibraryAdmin();

function loadSectionToEdit(){
  const key=document.getElementById("sectionKey").value;
  const all=JSON.parse(localStorage.getItem("sectionContent")) || {};
  const data=all[key] || {};
  document.getElementById("sectionTitle").value=data.title || "";
  document.getElementById("sectionText").value=data.text || "";
}

setTimeout(()=>{
  const sectionKey=document.getElementById("sectionKey");
  if(sectionKey){
    sectionKey.addEventListener("change",loadSectionToEdit);
    loadSectionToEdit();
  }
},500);
