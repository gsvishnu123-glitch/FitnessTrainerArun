const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "127.0.0.1";
const DATA_DIR = path.join(__dirname, "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const VISITORS_FILE = path.join(DATA_DIR, "visitors.json");
const SITE_CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

app.use(express.json({ limit: "8mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

function ensureFile(filePath) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(filePath)) {
    const initial = filePath === SITE_CONTENT_FILE ? "{}\n" : "[]\n";
    fs.writeFileSync(filePath, initial);
  }
}

function readJson(filePath) {
  ensureFile(filePath);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    return [];
  }
}

function writeJson(filePath, data) {
  ensureFile(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item) || "Not specified";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/site-content", (req, res) => {
  const content = readJson(SITE_CONTENT_FILE);
  res.json({ content });
});

app.post("/api/site-content", (req, res) => {
  const content = req.body?.content || req.body || {};
  writeJson(SITE_CONTENT_FILE, content);
  res.json({ content, savedAt: new Date().toISOString() });
});

app.post("/api/assessment-leads", (req, res) => {
  const leads = readJson(LEADS_FILE);
  const lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    assessment: req.body || {},
    whatsappShared: false,
    userWhatsapp: ""
  };
  leads.push(lead);
  writeJson(LEADS_FILE, leads);
  res.status(201).json({ lead });
});

function markLeadShared(req, res) {
  const leads = readJson(LEADS_FILE);
  const lead = leads.find(item => item.id === req.params.id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  lead.whatsappShared = true;
  lead.sharedAt = new Date().toISOString();
  lead.userWhatsapp = req.body?.userWhatsapp || lead.userWhatsapp || "";
  if (lead.assessment) lead.assessment.userWhatsapp = lead.userWhatsapp;
  writeJson(LEADS_FILE, leads);
  res.json({ lead });
}

app.patch("/api/assessment-leads/:id/share", markLeadShared);

app.post("/api/assessment-leads/:id/share", markLeadShared);

app.get("/api/assessment-leads", (req, res) => {
  const leads = readJson(LEADS_FILE);
  res.json({ leads });
});

app.post("/api/visitor", (req, res) => {
  const visitors = readJson(VISITORS_FILE);
  visitors.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    visitorId: req.body?.visitorId || "",
    sessionCount: Number(req.body?.sessionCount || 1),
    pageUrl: req.body?.pageUrl || "",
    path: req.body?.path || "",
    referrer: req.body?.referrer || "",
    userAgent: req.body?.userAgent || "",
    screenSize: req.body?.screenSize || "",
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""
  });
  writeJson(VISITORS_FILE, visitors);
  res.status(201).json({ ok: true });
});

app.get("/api/visitor-stats", (req, res) => {
  const visitors = readJson(VISITORS_FILE);
  const uniqueVisitors = new Set(visitors.map(item => item.visitorId).filter(Boolean));
  res.json({
    totalVisits: visitors.length,
    totalVisitors: uniqueVisitors.size || visitors.length,
    pathCounts: countBy(visitors, item => item.path),
    referrerCounts: countBy(visitors, item => item.referrer || "Direct"),
    latestVisitors: visitors.slice(-50).reverse()
  });
});

app.listen(PORT, HOST, () => {
  console.log(`FitnessTrainerArun backend running on http://${HOST}:${PORT}`);
});
