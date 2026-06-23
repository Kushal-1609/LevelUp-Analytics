import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:8080";
let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    console.log(`PASS: ${name}`);
    passed++;
  } else {
    console.log(`FAIL: ${name}`);
    failed++;
  }
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    }).on("error", reject);
  });
}

// --- Static asset tests ---
console.log("=== Static Assets ===");
const indexRes = await fetchText(`${BASE}/index.html`);
const scriptRes = await fetchText(`${BASE}/script.js`);
const analyzerRes = await fetchText(`${BASE}/analyzer.js`);
const configRes = await fetchText(`${BASE}/config.js`);

assert("index.html → 200", indexRes.status === 200);
assert("script.js → 200", scriptRes.status === 200);
assert("analyzer.js → 200", analyzerRes.status === 200);
assert("config.js → 200", configRes.status === 200);
assert("index loads analyzer.js", indexRes.body.includes("analyzer.js"));
assert("index loads mammoth.js", indexRes.body.includes("mammoth"));
assert("index sets pdf.js worker", indexRes.body.includes("pdf.worker.min.js"));

// --- Local analyzer logic (evaluated from file) ---
console.log("\n=== Local Analyzer Logic ===");
const analyzerCode = fs.readFileSync(path.join(__dirname, "analyzer.js"), "utf8");
const wrapped = `${analyzerCode}\nreturn { analyzeSkillGapLocally, getRequiredSkills, resumeContainsSkill, normalizeText };`;
const analyzer = new Function(wrapped)();

const resumeText = `
John Doe - Software Developer
Skills: JavaScript, React, Node.js, HTML, CSS, Git, REST APIs, SQL
Experience: 3 years building web applications with React and Express.
`;

const result = analyzer.analyzeSkillGapLocally(resumeText, "Senior Full Stack Developer");

assert("returns readiness_score", typeof result.readiness_score === "number");
assert("readiness_score in range 0-100", result.readiness_score >= 0 && result.readiness_score <= 100);
assert("full stack resume scores > 50%", result.readiness_score > 50);
assert("matched_skills is array", Array.isArray(result.matched_skills));
assert("matched JavaScript", result.matched_skills.includes("JavaScript"));
assert("matched React", result.matched_skills.includes("React"));
assert("missing_skills is array", Array.isArray(result.missing_skills));
assert("has missing skills when gaps exist", result.missing_skills.length > 0);
assert("learning_path matches missing count", result.learning_path.length === result.missing_skills.length);
assert("github_recommendations populated", result.github_recommendations.length > 0);

const dataScience = analyzer.analyzeSkillGapLocally(resumeText, "Data Scientist");
assert("data scientist role detects ML gap", dataScience.missing_skills.includes("Machine Learning"));

// --- Response parser logic ---
console.log("\n=== Lyzr Response Parser ===");

function parseAgentResponse(payload) {
    if (payload && typeof payload === "object" && payload.readiness_score !== undefined) {
        return payload;
    }

    let text = payload;
    if (typeof payload === "object" && payload !== null) {
        text = payload.response || payload.output || payload.message || payload.text;
        if (!text && payload.data) {
            return parseAgentResponse(payload.data);
        }
    }

    if (typeof text !== "string") {
        throw new Error("Invalid data from Lyzr agent");
    }

    try {
        const parsed = JSON.parse(text);
        if (parsed.readiness_score !== undefined || parsed.matched_skills) {
            return parsed;
        }
        if (parsed.response) {
            return parseAgentResponse(parsed.response);
        }
    } catch (e) {
        // not plain JSON
    }

    const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) {
        return JSON.parse(codeBlock[1].trim());
    }

    const jsonMatch = text.match(/\{[\s\S]*"readiness_score"[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Could not parse Lyzr agent response");
}

const directJson = parseAgentResponse({
  readiness_score: 80,
  matched_skills: ["Python"],
  missing_skills: ["Docker"],
  learning_path: ["Learn Docker"],
  github_recommendations: ["Containerize an app"]
});
assert("parses direct JSON payload", directJson.readiness_score === 80);

const nestedResponse = parseAgentResponse({
  response: JSON.stringify({
    readiness_score: 65,
    matched_skills: ["Git"],
    missing_skills: ["Kubernetes"],
    learning_path: ["Study K8s"],
    github_recommendations: ["Deploy with K8s"]
  })
});
assert("parses nested response string", nestedResponse.readiness_score === 65);

const markdownResponse = parseAgentResponse({
  response: 'Here is the analysis:\n```json\n{"readiness_score": 70, "matched_skills": ["SQL"], "missing_skills": ["AWS"], "learning_path": ["Learn AWS"], "github_recommendations": ["S3 project"]}\n```'
});
assert("parses markdown JSON block", markdownResponse.readiness_score === 70);

// --- Sample PDF exists ---
console.log("\n=== Sample Resume ===");
const pdfPath = path.join(__dirname, "sample-resume.pdf");
assert("sample-resume.pdf exists", fs.existsSync(pdfPath));
assert("sample-resume.pdf has content", fs.statSync(pdfPath).size > 500);

console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
