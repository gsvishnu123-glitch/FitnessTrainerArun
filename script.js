const API_BASE = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? "http://localhost:3001"
  : "";

const TRAINER_WHATSAPP = "971526120096";

const DEFAULT_SITE_CONTENT = {
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

let siteContent = structuredClone(DEFAULT_SITE_CONTENT);
let latestAssessment = null;
let latestLeadId = null;

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[char]));
}

function mergeContent(defaults, incoming){
  if(Array.isArray(defaults)) return Array.isArray(incoming) ? incoming : defaults;
  if(!defaults || typeof defaults !== "object") return incoming ?? defaults;
  const merged = {...defaults};
  Object.keys(incoming || {}).forEach(key => {
    merged[key] = mergeContent(defaults[key], incoming[key]);
  });
  return merged;
}

async function getJson(path){
  try{
    const res = await fetch(`${API_BASE}${path}`);
    if(!res.ok) throw new Error("Request failed");
    return await res.json();
  }catch(err){
    console.warn("Backend request failed", err);
    return null;
  }
}

async function postJson(path, payload){
  try{
    const res = await fetch(`${API_BASE}${path}`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    if(!res.ok) throw new Error("Request failed");
    return await res.json();
  }catch(err){
    console.warn("Backend request failed", err);
    return null;
  }
}

async function patchJson(path, payload){
  try{
    const res = await fetch(`${API_BASE}${path}`, {
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    if(!res.ok) throw new Error("Request failed");
    return await res.json();
  }catch(err){
    console.warn("Backend request failed", err);
    return null;
  }
}

function renderCards(containerId, items, renderer){
  const box = document.getElementById(containerId);
  if(!box) return;
  box.innerHTML = (items || []).map(renderer).join("");
}

function setHeroBackground(imageUrl){
  const hero = document.querySelector(".hero");
  if(hero && imageUrl) hero.style.setProperty("--hero-bg", `url("${imageUrl}")`);
}

function renderSiteContent(){
  const c = siteContent;
  const brandTitle = document.querySelector(".brand-title");
  const brandTagline = document.querySelector(".brand-text p");
  const eyebrow = document.querySelector(".hero .eyebrow");
  const heroHeading = document.querySelector(".hero h2");
  const heroText = document.querySelector(".hero-text");
  const heroButton = document.querySelector(".hero-actions .primary-btn");
  const heroSecondary = document.querySelector(".hero-actions .play-btn");

  if(brandTitle) brandTitle.innerHTML = escapeHtml(c.hero.brandTitle);
  if(brandTagline) brandTagline.innerText = c.hero.tagline;
  if(eyebrow) eyebrow.innerText = c.hero.eyebrow;
  if(heroHeading) heroHeading.innerHTML = `${escapeHtml(c.hero.heading)} <span>${escapeHtml(c.hero.highlight)}</span><br>${escapeHtml(c.hero.headingLine2)}`;
  if(heroText) heroText.innerText = c.hero.description;
  if(heroButton){
    heroButton.innerText = c.hero.buttonText;
    heroButton.href = c.hero.buttonLink;
  }
  if(heroSecondary){
    heroSecondary.href = c.hero.secondaryLink || "#about";
    heroSecondary.innerHTML = `${escapeHtml(c.hero.secondaryText || "About Arun")}<br><small>Certified trainer</small>`;
  }
  setHeroBackground(c.hero.backgroundImage);

  const about = document.getElementById("about");
  if(about){
    about.innerHTML = `
      <div>
        <p class="section-tag">${escapeHtml(c.about.tag)}</p>
        <h2>${escapeHtml(c.about.title)}</h2>
        ${String(c.about.body || "").split("\n").filter(Boolean).map(p => `<p>${escapeHtml(p)}</p>`).join("")}
      </div>`;
  }

  const assessmentTag = document.querySelector("#assessment .section-tag");
  const assessmentTitle = document.querySelector("#assessment h2");
  const assessmentIntro = document.querySelector("#assessment .finder-intro");
  const assessmentButton = document.querySelector("#assessment .finder-grid button");
  if(assessmentTag) assessmentTag.innerText = c.aiAssessment.tag;
  if(assessmentTitle) assessmentTitle.innerHTML = `${escapeHtml(c.aiAssessment.title)} <span>${escapeHtml(c.aiAssessment.highlight)}</span>`;
  if(assessmentIntro) assessmentIntro.innerText = c.aiAssessment.intro;
  if(assessmentButton) assessmentButton.innerText = c.aiAssessment.buttonText;

  const programsTag = document.querySelector("#programs .section-tag");
  const programsTitle = document.querySelector("#programs h2");
  if(programsTag) programsTag.innerText = c.programs.tag;
  if(programsTitle) programsTitle.innerHTML = `${escapeHtml(c.programs.title)} <span>${escapeHtml(c.programs.highlight)}</span>`;
  renderCards("programList", c.programs.items, item => `<div class="card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div>`);

  const plansTag = document.querySelector("#plans .section-tag");
  const plansTitle = document.querySelector("#plans h2");
  if(plansTag) plansTag.innerText = c.plans.tag;
  if(plansTitle) plansTitle.innerText = c.plans.title;
  renderCards("plansList", c.plans.items, item => `
    <div class="card">
      <h3>${escapeHtml(item.name)}</h3>
      <p><b>${escapeHtml(item.price)}</b></p>
      <p>${escapeHtml(item.details)}</p>
      <a class="primary-btn" href="${escapeHtml(c.contact.buttonLink)}">Subscribe</a>
    </div>`);

  const transformationsTag = document.querySelector("#transformations .section-tag");
  const transformationsTitle = document.querySelector("#transformations h2");
  if(transformationsTag) transformationsTag.innerText = c.transformations.tag;
  if(transformationsTitle) transformationsTitle.innerText = c.transformations.title;
  renderCards("transformationList", c.transformations.items, item => `
    <div class="card">
      ${item.image ? `<img class="card-media" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">` : ""}
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </div>`);

  const testimonialsTag = document.querySelector("#testimonials .section-tag");
  const testimonialsTitle = document.querySelector("#testimonials h2");
  if(testimonialsTag) testimonialsTag.innerText = c.testimonials.tag;
  if(testimonialsTitle) testimonialsTitle.innerText = c.testimonials.title;
  renderCards("testimonialList", c.testimonials.items, item => `
    <div class="card">
      <p>${escapeHtml(item.quote)}</p>
      <h3>${escapeHtml(item.name)}</h3>
    </div>`);

  const trial = document.getElementById("trial");
  if(trial){
    trial.innerHTML = `
      <p class="section-tag">${escapeHtml(c.trialCta.tag)}</p>
      <h2>${escapeHtml(c.trialCta.title)}</h2>
      <p>${escapeHtml(c.trialCta.text)}</p>
      <a class="primary-btn" href="${escapeHtml(c.trialCta.buttonLink)}">${escapeHtml(c.trialCta.buttonText)}</a>`;
  }

  const galleryTag = document.querySelector("#gallery .section-tag");
  const galleryTitle = document.querySelector("#gallery h2");
  if(galleryTag) galleryTag.innerText = c.media.tag;
  if(galleryTitle) galleryTitle.innerText = c.media.title;
  const gallery = document.getElementById("galleryList");
  if(gallery){
    gallery.innerHTML = (c.media.items || []).map(item => {
      if(item.type === "video"){
        return `<video controls src="${escapeHtml(item.url)}" title="${escapeHtml(item.title)}"></video>`;
      }
      return `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.title)}">`;
    }).join("");
  }

  const contact = document.getElementById("contact");
  if(contact){
    contact.innerHTML = `
      <p class="section-tag">${escapeHtml(c.contact.tag)}</p>
      <h2>${escapeHtml(c.contact.title)}</h2>
      <p><b>${escapeHtml(c.contact.name)}</b></p>
      <p>${escapeHtml(c.contact.role)}</p>
      <p>${escapeHtml(c.contact.address)}</p>
      <p>Email: ${escapeHtml(c.contact.email)}</p>
      <p>WhatsApp: ${escapeHtml(c.contact.phone)}</p>
      <a class="primary-btn" href="${escapeHtml(c.contact.buttonLink)}">${escapeHtml(c.contact.buttonText)}</a>`;
  }

  const floatingWhatsapp = document.querySelector(".whatsapp");
  if(floatingWhatsapp){
    floatingWhatsapp.href = c.whatsapp.link;
    floatingWhatsapp.innerText = c.whatsapp.text || "Chat";
  }
}

async function loadSiteContent(){
  const response = await getJson("/api/site-content");
  if(response?.content){
    siteContent = mergeContent(DEFAULT_SITE_CONTENT, response.content);
  }
  renderSiteContent();
}

function applySavedTheme(){
  const theme=localStorage.getItem("siteTheme") || "theme-ignite";
  document.body.classList.remove("theme-ignite","theme-elite","theme-aqua","theme-nature","theme-power");
  document.body.classList.add(theme);
}

function enableActiveMenu(){
  const menuLinks=document.querySelectorAll('.menu a[href^="#"]');
  menuLinks.forEach(link=>{
    link.addEventListener('click',()=>{
      menuLinks.forEach(x=>x.classList.remove('active'));
      link.classList.add('active');
      applySavedTheme();
    });
  });
}

function getVisitorId(){
  let visitorId = localStorage.getItem("ftaVisitorId");
  if(!visitorId){
    visitorId = `fta-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
    localStorage.setItem("ftaVisitorId", visitorId);
  }
  return visitorId;
}

function trackVisitor(){
  const sessionKey = "ftaSessionCount";
  const sessionCount = Number(localStorage.getItem(sessionKey) || 0) + 1;
  localStorage.setItem(sessionKey, String(sessionCount));
  postJson("/api/visitor", {
    visitorId:getVisitorId(),
    sessionCount,
    pageUrl:location.href,
    path:location.pathname,
    referrer:document.referrer,
    userAgent:navigator.userAgent,
    screenSize:`${window.screen.width}x${window.screen.height}`
  });
}

function collectAssessmentInput(){
  return {
    name:document.getElementById("pfName")?.value.trim(),
    age:Number(document.getElementById("pfAge")?.value || 0),
    gender:document.getElementById("pfGender")?.value,
    nationality:document.getElementById("pfNationality")?.value.trim(),
    weight:Number(document.getElementById("pfWeight")?.value || 0),
    height:Number(document.getElementById("pfHeight")?.value || 0),
    activity:document.getElementById("pfActivity")?.value,
    days:Number(document.getElementById("pfDays")?.value || -1),
    goal:document.getElementById("pfGoal")?.value,
    level:document.getElementById("pfLevel")?.value,
    medical:document.getElementById("pfMedical")?.value.trim() || "None shared"
  };
}

function goalLabel(goal){
  return {fat:"Fat loss", muscle:"Muscle gain", lean:"Lean body", fitness:"General fitness"}[goal] || goal;
}

function levelLabel(level){
  return {beginner:"Beginner", intermediate:"Intermediate", advanced:"Advanced"}[level] || level;
}

function getBmiCategory(bmi){
  if(bmi < 18.5) return "Underweight";
  if(bmi < 25) return "Healthy range";
  if(bmi < 30) return "Overweight";
  return "Obesity range";
}

function buildAssessment(data){
  const heightM = data.height / 100;
  const bmi = Number((data.weight / (heightM * heightM)).toFixed(1));
  const bmiCategory = getBmiCategory(bmi);
  const idealMin = Math.round(18.5 * heightM * heightM);
  const idealMax = Math.round(24.9 * heightM * heightM);
  const idealWeightRange = `${idealMin}-${idealMax} kg`;
  let plan = "Gold Transformation Coaching";
  let timeline = "12-16 weeks";
  let target = "Improve strength, consistency, body composition and overall fitness";
  let roadmap = "Foundation training, nutrition structure, weekly progression and monthly review.";

  if(data.goal === "fat"){
    plan = "Gold Fat Loss Transformation";
    timeline = bmi >= 30 ? "16-24 weeks" : "12-20 weeks";
    target = "Sustainable fat loss, better stamina and improved food discipline";
    roadmap = "Start with movement consistency, calorie control, resistance training and measured cardio progress.";
  }
  if(data.goal === "muscle"){
    plan = "Gold Muscle Gain Program";
    timeline = "16-24 weeks";
    target = "Progressive strength, muscle gain and structured recovery";
    roadmap = "Build technique, progressive overload, protein-focused nutrition and recovery tracking.";
  }
  if(data.goal === "lean"){
    plan = "Gold Lean Body Program";
    timeline = "10-16 weeks";
    target = "Lean body shaping, strength, posture and controlled nutrition";
    roadmap = "Combine strength training, conditioning, posture work and steady nutrition habits.";
  }
  if(data.goal === "fitness"){
    plan = data.level === "beginner" ? "Silver Starter Fitness" : "Gold General Fitness Coaching";
    timeline = data.level === "beginner" ? "8-12 weeks" : "10-16 weeks";
    target = "Routine building, mobility, stamina and healthy habits";
    roadmap = "Create a weekly routine, improve movement quality, build stamina and increase confidence.";
  }
  if(data.level === "advanced" && data.days >= 4){
    plan = "Platinum One-to-One Premium";
    timeline = "12-24 weeks";
    target = "Advanced transformation with priority personal coaching and accountability";
  }

  let score = 70;
  if(bmi >= 18.5 && bmi < 25) score += 8;
  if(data.days >= 3) score += 8;
  if(data.activity === "High activity" || data.activity === "Very active") score += 6;
  if(data.level === "beginner") score -= 4;
  if(data.medical && data.medical.toLowerCase() !== "none shared") score -= 5;
  score = Math.max(45, Math.min(95, score));

  const confidence = data.days >= 3 && data.activity ? "High" : "Moderate";
  return {
    ...data,
    bmi,
    bmiCategory,
    idealWeightRange,
    plan,
    timeline,
    target,
    roadmap,
    score,
    confidence,
    goalLabel:goalLabel(data.goal),
    levelLabel:levelLabel(data.level),
    daysLabel:`${data.days} ${data.days === 1 ? "day" : "days"}`
  };
}

function validateAssessment(data, box){
  if(!data.name || !data.age || !data.gender || !data.nationality || !data.weight || !data.height || !data.activity || data.days < 0 || !data.goal || !data.level || !data.medical){
    box.style.display = "block";
    box.innerHTML = "Please complete all assessment fields before starting.";
    return false;
  }
  if(data.height <= 0 || data.weight <= 0){
    box.style.display = "block";
    box.innerHTML = "Please enter valid height and weight values.";
    return false;
  }
  return true;
}

function renderAssessmentResult(assessment){
  const box = document.getElementById("planResult");
  latestAssessment = assessment;
  box.innerHTML = `
    <h3>AI Fitness Assessment Result</h3>
    <p><b>AI Fitness Score:</b> ${assessment.score}/100</p>
    <p><b>BMI:</b> ${assessment.bmi} (${escapeHtml(assessment.bmiCategory)})</p>
    <p><b>Ideal weight range:</b> ${escapeHtml(assessment.idealWeightRange)}</p>
    <p><b>Recommended plan:</b> ${escapeHtml(assessment.plan)}</p>
    <p><b>Approx timeline:</b> ${escapeHtml(assessment.timeline)}</p>
    <p><b>Target:</b> ${escapeHtml(assessment.target)}</p>
    <p><b>Transformation roadmap:</b> ${escapeHtml(assessment.roadmap)}</p>
    <p><b>Recommendation confidence:</b> ${escapeHtml(assessment.confidence)}</p>
    <hr>
    <p><b>Submitted details:</b> ${escapeHtml(assessment.name)}, ${assessment.age}, ${escapeHtml(assessment.gender)}, ${escapeHtml(assessment.nationality)}, ${assessment.weight} kg, ${assessment.height} cm, ${escapeHtml(assessment.activity)}, ${escapeHtml(assessment.daysLabel)} per week, ${escapeHtml(assessment.goalLabel)}, ${escapeHtml(assessment.levelLabel)}, medical concern: ${escapeHtml(assessment.medical)}.</p>
    <p><small>This is an initial fitness assessment based on submitted details. Final plan will be customized after trainer consultation.</small></p>
    <div class="interest-box">
      <h3>Interested to discuss this with Arun?</h3>
      <input id="interestWhatsapp" placeholder="Your WhatsApp number">
      <button onclick="shareAssessmentOnWhatsApp()">Share Full Assessment on WhatsApp</button>
    </div>
  `;
}

async function saveAssessmentLead(assessment){
  const saved = await postJson("/api/assessment-leads", assessment);
  latestLeadId = saved?.lead?.id || null;
}

function startFitnessAssessment(){
  const box = document.getElementById("planResult");
  const data = collectAssessmentInput();
  if(!box || !validateAssessment(data, box)) return;

  const messages = [
    "Analysing body metrics...",
    "Calculating BMI...",
    "Checking age and activity level...",
    "Assessing goal difficulty...",
    "Reviewing weekly training availability...",
    "Matching suitable coaching plan...",
    "Estimating transformation timeline...",
    "Preparing your personal recommendation...",
    "Report ready in 10 seconds..."
  ];
  const waitMs = Math.floor(18000 + Math.random() * 12001);
  const intervalMs = Math.max(1800, Math.floor(waitMs / messages.length));
  let index = 0;

  box.style.display = "block";
  box.innerHTML = `<b>${messages[index]}</b>`;
  const interval = setInterval(()=>{
    index = Math.min(index + 1, messages.length - 1);
    box.innerHTML = `<b>${messages[index]}</b>`;
  }, intervalMs);

  setTimeout(async ()=>{
    clearInterval(interval);
    const assessment = buildAssessment(data);
    renderAssessmentResult(assessment);
    await saveAssessmentLead(assessment);
  }, waitMs);
}

function buildWhatsAppMessage(assessment, userWhatsapp){
  return [
    "Hi Arun, I completed the AI Fitness Assessment.",
    "",
    `Name: ${assessment.name}`,
    `Age: ${assessment.age}`,
    `Gender: ${assessment.gender}`,
    `Country/Nationality: ${assessment.nationality}`,
    `Weight: ${assessment.weight} kg`,
    `Height: ${assessment.height} cm`,
    `BMI: ${assessment.bmi}`,
    `BMI category: ${assessment.bmiCategory}`,
    `Ideal weight range: ${assessment.idealWeightRange}`,
    `Activity level: ${assessment.activity}`,
    `Training days/week: ${assessment.daysLabel}`,
    `Goal: ${assessment.goalLabel}`,
    `Fitness level: ${assessment.levelLabel}`,
    `Medical concern: ${assessment.medical}`,
    `AI Score: ${assessment.score}/100`,
    `Recommended plan: ${assessment.plan}`,
    `Timeline: ${assessment.timeline}`,
    `Target: ${assessment.target}`,
    `User WhatsApp number: ${userWhatsapp}`
  ].join("\n");
}

async function shareAssessmentOnWhatsApp(){
  const whatsapp = document.getElementById("interestWhatsapp")?.value.trim();
  if(!latestAssessment){
    alert("Please complete the assessment first.");
    return;
  }
  if(!whatsapp){
    alert("Please enter your WhatsApp number.");
    return;
  }
  latestAssessment.userWhatsapp = whatsapp;
  if(latestLeadId){
    await patchJson(`/api/assessment-leads/${latestLeadId}/share`, { userWhatsapp:whatsapp });
  }
  const message = encodeURIComponent(buildWhatsAppMessage(latestAssessment, whatsapp));
  window.open(`https://wa.me/${TRAINER_WHATSAPP}?text=${message}`, "_blank");
}

function recommendPlan(){
  startFitnessAssessment();
}

applySavedTheme();
enableActiveMenu();
renderSiteContent();
loadSiteContent();
trackVisitor();
