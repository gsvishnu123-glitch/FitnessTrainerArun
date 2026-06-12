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

function deleteClientByName(name){
  let clients=JSON.parse(localStorage.getItem("clients")) || [];
  clients=clients.filter(c=>String(c.name).toLowerCase()!==String(name).toLowerCase());
  localStorage.setItem("clients",JSON.stringify(clients));

  const assigned=JSON.parse(localStorage.getItem("clientAssignments")) || {};
  delete assigned[name];
  localStorage.setItem("clientAssignments",JSON.stringify(assigned));

  renderClientContentAdmin();
  alert("Client deleted");
}

function removeAssignedContent(client,id){
  const assigned=JSON.parse(localStorage.getItem("clientAssignments")) || {};
  assigned[client]=(assigned[client] || []).filter(x=>String(x)!==String(id));
  localStorage.setItem("clientAssignments",JSON.stringify(assigned));
  renderClientContentAdmin();
}

function renderClientContentAdmin(){
  const assigned=JSON.parse(localStorage.getItem("clientAssignments")) || {};
  const media=JSON.parse(localStorage.getItem("mediaLibrary")) || [];
  const clients=JSON.parse(localStorage.getItem("clients")) || [];
  const box=document.getElementById("clientContentList");
  if(!box) return;

  box.innerHTML="";

  clients.forEach(c=>{
    box.innerHTML += `
      <div class="mini-item">
        <b>${c.name}</b><br>
        <small>${c.plan}</small><br>
        <button onclick="deleteClientByName('${c.name}')">Delete Client</button>
      </div>`;
  });

  Object.keys(assigned).forEach(client=>{
    box.innerHTML += `<h4>${client} Assigned Content</h4>`;
    assigned[client].forEach(id=>{
      const m=media.find(x=>String(x.id)===String(id));
      if(m){
        box.innerHTML += `
          <div class="mini-item">
            ✓ ${m.title} <small>(${m.category})</small><br>
            <button onclick="removeAssignedContent('${client}','${id}')">Remove Assignment</button>
          </div>`;
      }
    });
  });

  if(!box.innerHTML) box.innerHTML="<p>No clients or assignments yet.</p>";
}

function clearAllDemoData(){
  if(!confirm("This will clear local demo clients, media, plans, carousel and section edits from this browser. Continue?")) return;
  localStorage.removeItem("clients");
  localStorage.removeItem("clientAssignments");
  localStorage.removeItem("mediaLibrary");
  localStorage.removeItem("plans");
  localStorage.removeItem("carousel");
  localStorage.removeItem("sectionContent");
  alert("Demo data cleared");
  location.reload();
}

function showTab(tabId){

  document.querySelectorAll('.tab-box').forEach(tab=>{
    tab.style.display='none';
  });

  const selected=document.getElementById(tabId);

  if(selected){
    selected.style.display='block';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  showTab('profileTab');
});

const ADMIN_API_BASE = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? "http://localhost:3001"
  : "";

const DEFAULT_ADMIN_SITE_CONTENT = {
  hero: {
    brandTitle: "FitnessTrainerArun",
    tagline: "CERTIFIED INTERNATIONAL FITNESS TRAINER",
    eyebrow: "INTERNATIONALLY CERTIFIED FITNESS TRAINER",
    heading: "Transform",
    highlight: "Your Body.",
    headingLine2: "Elevate Your Life.",
    description: "Premium personal training, customized workout schedules, diet plans and result-driven coaching designed to bring out the strongest version of you.",
    buttonText: "Book Your Consultation",
    buttonLink: "https://wa.me/971526120096",
    secondaryText: "About Arun",
    secondaryLink: "#about",
    backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=100"
  },
  about: {
    tag: "About Arun",
    title: "Professional Personal Trainer & Fitness Coach",
    body: "With more than 11 years of experience in the fitness industry, I specialize in helping individuals achieve sustainable results through structured training, proper technique, and personalized coaching.\n\nAs Fitness Incharge at Restart Fitness, Rolla Branch, I work closely with clients to develop customized workout programs, body transformation plans, strength training routines, and practical nutrition strategies tailored to their goals and lifestyle.\n\nMy focus is not only on achieving short-term results, but on building long-term fitness habits that improve strength, confidence, overall health, and quality of life."
  },
  aiAssessment: {
    tag: "AI Assessment",
    title: "Personal Fitness",
    highlight: "Assessment",
    intro: "Enter your current details to receive an initial fitness score, BMI, timeline and coaching recommendation.",
    buttonText: "Start AI Fitness Assessment"
  },
  programs: {
    tag: "Our Programs",
    title: "Training Programs",
    highlight: "Designed for You",
    items: [
      { title: "Personal Training", description: "One-to-one coaching with customized workout schedules." },
      { title: "Body Transformation", description: "Fat loss, strength, muscle gain and complete body shaping." },
      { title: "Diet Consulting", description: "Practical food plans based on your fitness goal and lifestyle." }
    ]
  },
  plans: {
    tag: "Membership",
    title: "Subscription Plans",
    items: [
      { name: "Silver Plan", price: "Starter", details: "Basic workout access, weekly guidance and selected fitness content." },
      { name: "Gold Plan", price: "Popular", details: "Workout + diet support, premium videos and personalized follow-up." },
      { name: "Platinum Plan", price: "Premium", details: "Personal coaching, diet schedule, class sessions and transformation support." }
    ]
  },
  transformations: {
    tag: "Transformations",
    title: "Client Progress Stories",
    items: [
      { title: "Fat Loss Journey", description: "Structured training and nutrition habits for sustainable body composition progress.", image: "" },
      { title: "Strength Comeback", description: "Technique-focused coaching to rebuild confidence, strength and consistency.", image: "" },
      { title: "Lifestyle Reset", description: "A practical routine for busy clients who need fitness to fit real life.", image: "" }
    ]
  },
  testimonials: {
    tag: "Testimonials",
    title: "What Clients Say",
    items: [
      { name: "Client Review", quote: "Arun keeps the training focused, practical and easy to follow." },
      { name: "Transformation Client", quote: "The plan helped me stay consistent and understand what to do every week." },
      { name: "Personal Training Client", quote: "Professional coaching, clear technique support and strong motivation." }
    ]
  },
  trialCta: {
    tag: "Start Today",
    title: "Ready for a guided fitness plan?",
    text: "Book a consultation with Arun and choose the right training direction for your goal, schedule and fitness level.",
    buttonText: "Book Trial Consultation",
    buttonLink: "https://wa.me/971526120096"
  },
  media: {
    tag: "Media",
    title: "Gallery & Updates",
    items: [
      { title: "Training Session", type: "image", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=90" },
      { title: "Nutrition Guidance", type: "image", url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=90" },
      { title: "Mobility Work", type: "image", url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=90" }
    ]
  },
  contact: {
    tag: "Contact",
    title: "Start Your Fitness Journey",
    name: "Arun Personal Trainer",
    role: "Fitness Incharge, Restart Fitness - Rolla Branch",
    address: "11a Street 2, Sector, Dubai, United Arab Emirates",
    email: "arunpersonaltrainerin@gmail.com",
    phone: "+971 52 612 0096",
    buttonText: "Chat on WhatsApp",
    buttonLink: "https://wa.me/971526120096"
  },
  whatsapp: {
    text: "Chat",
    link: "https://wa.me/971526120096"
  }
};

let contentManagerState = structuredClone(DEFAULT_ADMIN_SITE_CONTENT);

function adminEscapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[char]));
}

async function adminGetJson(path){
  const res = await fetch(`${ADMIN_API_BASE}${path}`);
  if(!res.ok) throw new Error("Backend unavailable");
  return await res.json();
}

async function adminPostJson(path, payload){
  const res = await fetch(`${ADMIN_API_BASE}${path}`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  });
  if(!res.ok) throw new Error("Backend unavailable");
  return await res.json();
}

function mergeAdminContent(defaults, incoming){
  if(Array.isArray(defaults)) return Array.isArray(incoming) ? incoming : defaults;
  if(!defaults || typeof defaults !== "object") return incoming ?? defaults;
  const merged = {...defaults};
  Object.keys(incoming || {}).forEach(key => {
    merged[key] = mergeAdminContent(defaults[key], incoming[key]);
  });
  return merged;
}

function renderCountList(targetId, counts){
  const box = document.getElementById(targetId);
  if(!box) return;
  const entries = Object.entries(counts || {});
  box.innerHTML = entries.length ? entries.map(([label,count]) => (
    `<p><b>${adminEscapeHtml(label || "Not specified")}:</b> ${count}</p>`
  )).join("") : "<p>No data yet.</p>";
}

function renderLatestLeads(leads){
  const body = document.getElementById("latestLeads");
  if(!body) return;
  body.innerHTML = "";
  (leads || []).slice(-50).reverse().forEach(lead => {
    const assessment = lead.assessment || lead;
    const status = lead.whatsappShared ? "WhatsApp Shared" : "Assessment Completed";
    body.innerHTML += `
      <tr>
        <td>${adminEscapeHtml(new Date(lead.timestamp || assessment.timestamp || Date.now()).toLocaleString())}</td>
        <td>${adminEscapeHtml(assessment.name)}</td>
        <td>${adminEscapeHtml(assessment.age)}</td>
        <td>${adminEscapeHtml(assessment.gender)}</td>
        <td>${adminEscapeHtml(assessment.nationality)}</td>
        <td>${adminEscapeHtml(assessment.weight)} kg</td>
        <td>${adminEscapeHtml(assessment.height)} cm</td>
        <td>${adminEscapeHtml(assessment.bmi)} / ${adminEscapeHtml(assessment.bmiCategory)}</td>
        <td>${adminEscapeHtml(assessment.goalLabel || assessment.goal)}</td>
        <td>${adminEscapeHtml(assessment.levelLabel || assessment.level)}</td>
        <td>${adminEscapeHtml(assessment.activity)}</td>
        <td>${adminEscapeHtml(assessment.daysLabel || assessment.days)}</td>
        <td>${adminEscapeHtml(assessment.plan)}</td>
        <td>${adminEscapeHtml(assessment.score)}</td>
        <td>${status}</td>
        <td>${adminEscapeHtml(lead.userWhatsapp || assessment.userWhatsapp || "")}</td>
      </tr>`;
  });
  if(!body.innerHTML){
    body.innerHTML = `<tr><td colspan="16">No AI assessment leads yet.</td></tr>`;
  }
}

function buildCounts(items, getter){
  return (items || []).reduce((counts, item) => {
    const key = getter(item) || "Not specified";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

async function loadAssessmentAnalytics(){
  const status = document.getElementById("analyticsStatus");
  if(status) status.innerText = "Loading analytics...";
  try{
    const [visitorStats, leadsResponse] = await Promise.all([
      adminGetJson("/api/visitor-stats"),
      adminGetJson("/api/assessment-leads")
    ]);
    const leads = leadsResponse.leads || [];
    const shared = leads.filter(lead => lead.whatsappShared).length;
    const totalVisitors = visitorStats.totalVisitors || 0;
    const conversion = totalVisitors ? Math.round((leads.length / totalVisitors) * 100) : 0;

    document.getElementById("totalVisitors").innerText = totalVisitors;
    document.getElementById("totalAssessments").innerText = leads.length;
    document.getElementById("sharedAssessments").innerText = shared;
    document.getElementById("conversionRate").innerText = `${conversion}%`;
    renderCountList("goalStats", buildCounts(leads, lead => (lead.assessment || lead).goalLabel || (lead.assessment || lead).goal));
    renderCountList("activityStats", buildCounts(leads, lead => (lead.assessment || lead).activity));
    renderLatestLeads(leads);
    if(status) status.innerText = "";
  }catch(err){
    console.warn(err);
    if(status) status.innerText = "Analytics backend is not available. Start the backend server, then refresh this tab.";
  }
}

function setValue(id, value){
  const el = document.getElementById(id);
  if(el) el.value = value || "";
}

function getValue(id){
  return document.getElementById(id)?.value.trim() || "";
}

function showContentPanel(panelId){
  document.querySelectorAll("#contentTab .content-panel").forEach(panel => {
    panel.style.display = "none";
  });
  const selected = document.getElementById(panelId);
  if(selected) selected.style.display = "block";
}

function contentItemTemplate(type, item, index){
  if(type === "plans"){
    return `
      <div class="content-item" data-index="${index}">
        <input data-field="name" placeholder="Plan name" value="${adminEscapeHtml(item.name)}">
        <input data-field="price" placeholder="Price / label" value="${adminEscapeHtml(item.price)}">
        <textarea data-field="details" placeholder="Plan details">${adminEscapeHtml(item.details)}</textarea>
        <button onclick="removeContentItem('${type}', ${index})">Remove</button>
      </div>`;
  }
  if(type === "programs"){
    return `
      <div class="content-item" data-index="${index}">
        <input data-field="title" placeholder="Program title" value="${adminEscapeHtml(item.title)}">
        <textarea data-field="description" placeholder="Program description">${adminEscapeHtml(item.description)}</textarea>
        <button onclick="removeContentItem('${type}', ${index})">Remove</button>
      </div>`;
  }
  if(type === "transformations"){
    return `
      <div class="content-item" data-index="${index}">
        <input data-field="title" placeholder="Story title" value="${adminEscapeHtml(item.title)}">
        <textarea data-field="description" placeholder="Story description">${adminEscapeHtml(item.description)}</textarea>
        <input data-field="image" placeholder="Image URL or uploaded data URL" value="${adminEscapeHtml(item.image)}">
        <input type="file" accept="image/*" onchange="uploadInlineContentImage(this)">
        <button onclick="removeContentItem('${type}', ${index})">Remove</button>
      </div>`;
  }
  if(type === "testimonials"){
    return `
      <div class="content-item" data-index="${index}">
        <input data-field="name" placeholder="Client name / label" value="${adminEscapeHtml(item.name)}">
        <textarea data-field="quote" placeholder="Testimonial">${adminEscapeHtml(item.quote)}</textarea>
        <button onclick="removeContentItem('${type}', ${index})">Remove</button>
      </div>`;
  }
  return `
    <div class="content-item" data-index="${index}">
      <input data-field="title" placeholder="Media title" value="${adminEscapeHtml(item.title)}">
      <select data-field="type">
        <option value="image" ${item.type === "image" ? "selected" : ""}>Image</option>
        <option value="video" ${item.type === "video" ? "selected" : ""}>Video</option>
      </select>
      <input data-field="url" placeholder="Media URL or uploaded data URL" value="${adminEscapeHtml(item.url)}">
      <input type="file" accept="image/*,video/*" onchange="uploadInlineContentImage(this)">
      <button onclick="removeContentItem('${type}', ${index})">Remove</button>
    </div>`;
}

function renderContentItems(type){
  const section = type === "media" ? contentManagerState.media : contentManagerState[type];
  const box = document.getElementById(`${type}ItemsEditor`);
  if(!box) return;
  box.innerHTML = (section.items || []).map((item, index) => contentItemTemplate(type, item, index)).join("");
}

function collectContentItems(type){
  const box = document.getElementById(`${type}ItemsEditor`);
  if(!box) return [];
  return Array.from(box.querySelectorAll(".content-item")).map(itemEl => {
    const data = {};
    itemEl.querySelectorAll("[data-field]").forEach(field => {
      data[field.dataset.field] = field.value.trim();
    });
    return data;
  }).filter(item => Object.values(item).some(Boolean));
}

function populateContentManager(){
  const c = contentManagerState;
  setValue("contentHeroBrandTitle", c.hero.brandTitle);
  setValue("contentHeroTagline", c.hero.tagline);
  setValue("contentHeroEyebrow", c.hero.eyebrow);
  setValue("contentHeroHeading", c.hero.heading);
  setValue("contentHeroHighlight", c.hero.highlight);
  setValue("contentHeroHeadingLine2", c.hero.headingLine2);
  setValue("contentHeroDescription", c.hero.description);
  setValue("contentHeroButtonText", c.hero.buttonText);
  setValue("contentHeroButtonLink", c.hero.buttonLink);
  setValue("contentHeroSecondaryText", c.hero.secondaryText);
  setValue("contentHeroSecondaryLink", c.hero.secondaryLink);
  setValue("contentHeroBackgroundImage", c.hero.backgroundImage);

  setValue("contentAboutTag", c.about.tag);
  setValue("contentAboutTitle", c.about.title);
  setValue("contentAboutBody", c.about.body);

  setValue("contentPlansTag", c.plans.tag);
  setValue("contentPlansTitle", c.plans.title);
  setValue("contentProgramsTag", c.programs.tag);
  setValue("contentProgramsTitle", c.programs.title);
  setValue("contentProgramsHighlight", c.programs.highlight);
  setValue("contentTransformationsTag", c.transformations.tag);
  setValue("contentTransformationsTitle", c.transformations.title);
  setValue("contentTestimonialsTag", c.testimonials.tag);
  setValue("contentTestimonialsTitle", c.testimonials.title);
  setValue("contentTrialTag", c.trialCta.tag);
  setValue("contentTrialTitle", c.trialCta.title);
  setValue("contentTrialText", c.trialCta.text);
  setValue("contentTrialButtonText", c.trialCta.buttonText);
  setValue("contentTrialButtonLink", c.trialCta.buttonLink);
  setValue("contentMediaTag", c.media.tag);
  setValue("contentMediaTitle", c.media.title);

  setValue("contentContactTag", c.contact.tag);
  setValue("contentContactTitle", c.contact.title);
  setValue("contentContactName", c.contact.name);
  setValue("contentContactRole", c.contact.role);
  setValue("contentContactAddress", c.contact.address);
  setValue("contentContactEmail", c.contact.email);
  setValue("contentContactPhone", c.contact.phone);
  setValue("contentContactButtonText", c.contact.buttonText);
  setValue("contentContactButtonLink", c.contact.buttonLink);

  setValue("contentWhatsappText", c.whatsapp.text);
  setValue("contentWhatsappLink", c.whatsapp.link);

  setValue("contentAiTag", c.aiAssessment.tag);
  setValue("contentAiTitle", c.aiAssessment.title);
  setValue("contentAiHighlight", c.aiAssessment.highlight);
  setValue("contentAiIntro", c.aiAssessment.intro);
  setValue("contentAiButtonText", c.aiAssessment.buttonText);

  ["plans","programs","transformations","testimonials","media"].forEach(renderContentItems);
}

async function loadContentManager(){
  const status = document.getElementById("contentManagerStatus");
  if(status) status.innerText = "Loading website content...";
  try{
    const response = await adminGetJson("/api/site-content");
    contentManagerState = mergeAdminContent(DEFAULT_ADMIN_SITE_CONTENT, response.content || {});
    populateContentManager();
    showContentPanel("heroContent");
    if(status) status.innerText = "Edit public website text, cards, media links and contact details here.";
  }catch(err){
    console.warn(err);
    contentManagerState = structuredClone(DEFAULT_ADMIN_SITE_CONTENT);
    populateContentManager();
    showContentPanel("heroContent");
    if(status) status.innerText = "Backend unavailable. Showing default content; saving needs the backend server.";
  }
}

function addContentItem(type){
  contentManagerState = collectContentManager();
  const defaults = {
    plans:{name:"New Plan", price:"", details:""},
    programs:{title:"New Program", description:""},
    transformations:{title:"New Story", description:"", image:""},
    testimonials:{name:"Client", quote:""},
    media:{title:"New Media", type:"image", url:""}
  };
  const section = type === "media" ? contentManagerState.media : contentManagerState[type];
  section.items = section.items || [];
  section.items.push(defaults[type]);
  renderContentItems(type);
}

function removeContentItem(type, index){
  contentManagerState = collectContentManager();
  const section = type === "media" ? contentManagerState.media : contentManagerState[type];
  section.items = (section.items || []).filter((item, itemIndex) => itemIndex !== index);
  renderContentItems(type);
}

function collectContentManager(){
  return {
    hero:{
      brandTitle:getValue("contentHeroBrandTitle"),
      tagline:getValue("contentHeroTagline"),
      eyebrow:getValue("contentHeroEyebrow"),
      heading:getValue("contentHeroHeading"),
      highlight:getValue("contentHeroHighlight"),
      headingLine2:getValue("contentHeroHeadingLine2"),
      description:getValue("contentHeroDescription"),
      buttonText:getValue("contentHeroButtonText"),
      buttonLink:getValue("contentHeroButtonLink"),
      secondaryText:getValue("contentHeroSecondaryText"),
      secondaryLink:getValue("contentHeroSecondaryLink"),
      backgroundImage:getValue("contentHeroBackgroundImage")
    },
    about:{
      tag:getValue("contentAboutTag"),
      title:getValue("contentAboutTitle"),
      body:document.getElementById("contentAboutBody")?.value || ""
    },
    plans:{
      tag:getValue("contentPlansTag"),
      title:getValue("contentPlansTitle"),
      items:collectContentItems("plans")
    },
    programs:{
      tag:getValue("contentProgramsTag"),
      title:getValue("contentProgramsTitle"),
      highlight:getValue("contentProgramsHighlight"),
      items:collectContentItems("programs")
    },
    transformations:{
      tag:getValue("contentTransformationsTag"),
      title:getValue("contentTransformationsTitle"),
      items:collectContentItems("transformations")
    },
    testimonials:{
      tag:getValue("contentTestimonialsTag"),
      title:getValue("contentTestimonialsTitle"),
      items:collectContentItems("testimonials")
    },
    trialCta:{
      tag:getValue("contentTrialTag"),
      title:getValue("contentTrialTitle"),
      text:document.getElementById("contentTrialText")?.value || "",
      buttonText:getValue("contentTrialButtonText"),
      buttonLink:getValue("contentTrialButtonLink")
    },
    media:{
      tag:getValue("contentMediaTag"),
      title:getValue("contentMediaTitle"),
      items:collectContentItems("media")
    },
    contact:{
      tag:getValue("contentContactTag"),
      title:getValue("contentContactTitle"),
      name:getValue("contentContactName"),
      role:getValue("contentContactRole"),
      address:document.getElementById("contentContactAddress")?.value || "",
      email:getValue("contentContactEmail"),
      phone:getValue("contentContactPhone"),
      buttonText:getValue("contentContactButtonText"),
      buttonLink:getValue("contentContactButtonLink")
    },
    whatsapp:{
      text:getValue("contentWhatsappText"),
      link:getValue("contentWhatsappLink")
    },
    aiAssessment:{
      tag:getValue("contentAiTag"),
      title:getValue("contentAiTitle"),
      highlight:getValue("contentAiHighlight"),
      intro:document.getElementById("contentAiIntro")?.value || "",
      buttonText:getValue("contentAiButtonText")
    }
  };
}

async function saveContentManager(){
  const status = document.getElementById("contentManagerStatus");
  contentManagerState = collectContentManager();
  if(status) status.innerText = "Saving website content...";
  try{
    await adminPostJson("/api/site-content", { content:contentManagerState });
    if(status) status.innerText = "Website content saved. Open Website Preview to view changes.";
    alert("Website content saved");
  }catch(err){
    console.warn(err);
    if(status) status.innerText = "Could not save. Please start the backend server and try again.";
    alert("Could not save content. Backend server is unavailable.");
  }
}

function uploadContentImage(fileInputId, targetInputId){
  const file = document.getElementById(fileInputId)?.files?.[0];
  const target = document.getElementById(targetInputId);
  if(!file || !target){
    alert("Choose an image first");
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    target.value = e.target.result;
    alert("Image loaded into the field. Save Website Content to publish it.");
  };
  reader.readAsDataURL(file);
}

function uploadInlineContentImage(input){
  const file = input.files?.[0];
  const row = input.closest(".content-item");
  const target = row?.querySelector('[data-field="image"], [data-field="url"]');
  if(!file || !target) return;
  const reader = new FileReader();
  reader.onload = e => {
    target.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
