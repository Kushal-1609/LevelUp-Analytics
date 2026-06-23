

/* GLOBAL ERROR HANDLER */
window.onerror = function (msg, url, line, col, error) {
    console.error("GLOBAL ERROR:", msg, error);

    document.getElementById('loaderSection').classList.add('hidden');
    document.getElementById('formSection').classList.remove('hidden');

    alert("Something broke. Check console.");
};

/* DOM ELEMENTS */
const analysisForm = document.getElementById('analysisForm');
const resumeUpload = document.getElementById('resumeUpload');
const resumeFileName = document.getElementById('resumeFileName');
const jobRoleInput = document.getElementById('jobRole');
const githubUrlInput = document.getElementById('githubUrl');
const analyzeBtn = document.getElementById('analyzeBtn');

const formSection = document.getElementById('formSection');
const loaderSection = document.getElementById('loaderSection');
const resultsSection = document.getElementById('resultsSection');

const scoreValue = document.getElementById('scoreValue');
const scoreFill = document.getElementById('scoreFill');
const atsScoreValue = document.getElementById('atsScoreValue');
const atsScoreFill = document.getElementById('atsScoreFill');
const matchedSkillsContainer = document.getElementById('matchedSkills');
const missingSkillsContainer = document.getElementById('missingSkills');
const learningPathList = document.getElementById('learningPath');
const atsTipsList = document.getElementById('atsTips');
const githubRecommendationsList = document.getElementById('githubRecommendations');
const backBtn = document.getElementById('backBtn');

/* EVENT LISTENERS */
resumeUpload.addEventListener('change', function (e) {
    if (e.target.files.length > 0) {
        const fileName = e.target.files[0].name;
        resumeFileName.textContent = `✓ ${fileName}`;
        resumeFileName.style.color = '#27ae60';
    } else {
        resumeFileName.textContent = '';
    }
});

analysisForm.addEventListener('submit', function (e) {
    e.preventDefault();
    handleAnalysis();
});

backBtn.addEventListener('click', function () {
    resetForm();
});

/* VALIDATION */
function validateForm() {
    if (!resumeUpload.files || resumeUpload.files.length === 0) {
        return { valid: false, error: 'Please upload your resume (PDF or DOCX)' };
    }

    if (!jobRoleInput.value.trim()) {
        return { valid: false, error: 'Please enter your target job role' };
    }

    return { valid: true };
}

/* MAIN FUNCTION */
async function handleAnalysis() {
    const validation = validateForm();
    if (!validation.valid) {
        alert(validation.error);
        return;
    }

    analyzeBtn.disabled = true;
    showLoader();

    try {
        const file = resumeUpload.files[0];
        const jobRole = jobRoleInput.value.trim();
        const githubUrl = githubUrlInput.value.trim();

        const resumeText = await extractTextFromResume(file);

        if (!resumeText.trim()) {
            throw new Error("Could not extract text from resume. Try a different file.");
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000);

        const data = await analyzeSkillGap(jobRole, resumeText, githubUrl, controller.signal);

        clearTimeout(timeout);

        console.log("PARSED DATA:", data);
        displayResults(data);

    } catch (error) {
        console.error("ERROR:", error);

        loaderSection.classList.add('hidden');
        formSection.classList.remove('hidden');

        alert(error.name === "AbortError"
            ? "Request timed out. The agent may need more time — try again."
            : error.message
        );
    }

    analyzeBtn.disabled = false;
}

/* ANALYSIS — Lyzr agent (no silent fallback when configured) */
async function analyzeSkillGap(jobRole, resumeText, githubUrl, signal) {
    const hasLyzr = LYZR_CONFIG.API_KEY && LYZR_CONFIG.AGENT_ID;

    if (hasLyzr) {
        return await callLyzrAgent(jobRole, resumeText, githubUrl, signal);
    }

    return analyzeSkillGapLocally(resumeText, jobRole);
}

/* LYZR AGENT API */
function buildAnalysisMessage(jobRole, resumeText, githubUrl) {
    let message = `Target Job Role: ${jobRole}`;

    if (githubUrl) {
        message += `\nGitHub Profile: ${githubUrl}`;
    }

    message += `\n\nResume:\n${resumeText}`;
    return message;
}

async function callLyzrAgent(jobRole, resumeText, githubUrl, signal) {
    const url = `${LYZR_CONFIG.API_BASE}/v3/inference/chat/`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": LYZR_CONFIG.API_KEY
        },
        body: JSON.stringify({
            user_id: "skill-gap-analyzer-user",
            agent_id: LYZR_CONFIG.AGENT_ID,
            session_id: crypto.randomUUID(),
            message: buildAnalysisMessage(jobRole, resumeText, githubUrl)
        }),
        signal
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Lyzr API error (${res.status}): ${errText.slice(0, 200)}`);
    }

    const raw = await res.json();
    console.log("LYZR RAW RESPONSE:", raw);
    return parseAgentResponse(raw);
}

function normalizeResult(data) {
    const tips = data.ats_score_improving_tips
        || data.ats_improving_tips
        || data.ats_tips
        || [];

    return {
        readiness_score: data.readiness_score ?? 0,
        ats_score: data.ats_score ?? data.atsScore ?? null,
        matched_skills: data.matched_skills || [],
        missing_skills: data.missing_skills || [],
        learning_path: data.learning_path || [],
        ats_score_improving_tips: Array.isArray(tips) ? tips : [tips],
        github_recommendations: data.github_recommendations || []
    };
}

function parseAgentResponse(payload) {
    if (payload && typeof payload === "object" && payload.readiness_score !== undefined) {
        return normalizeResult(payload);
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
            return normalizeResult(parsed);
        }
        if (parsed.response) {
            return parseAgentResponse(parsed.response);
        }
    } catch (e) {
        // not plain JSON — try extracting from markdown or embedded object
    }

    const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) {
        try {
            return normalizeResult(JSON.parse(codeBlock[1].trim()));
        } catch (e) {
            // continue
        }
    }

    const jsonMatch = text.match(/\{[\s\S]*"readiness_score"[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return normalizeResult(JSON.parse(jsonMatch[0]));
        } catch (e) {
            // continue
        }
    }

    throw new Error(
        "Could not parse Lyzr agent response. Enable Structured Output on your agent or ask it to return JSON."
    );
}

/* RESUME TEXT EXTRACTION */
async function extractTextFromResume(file) {
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "pdf") {
        return extractTextFromPDF(file);
    }
    if (ext === "docx") {
        return extractTextFromDOCX(file);
    }

    throw new Error("Unsupported file type. Please upload a PDF or DOCX resume.");
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        text += strings.join(" ") + " ";
    }

    return text;
}

async function extractTextFromDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

/* UI FUNCTIONS */
function showLoader() {
    formSection.classList.add('hidden');
    loaderSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
}

function displayResults(data) {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid data from backend");
    }

    loaderSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    animateScore(data.readiness_score || 0, scoreValue, scoreFill);

    if (data.ats_score !== null && data.ats_score !== undefined) {
        animateScore(data.ats_score, atsScoreValue, atsScoreFill);
    } else {
        atsScoreValue.textContent = '—';
        atsScoreFill.style.width = '0%';
    }

    renderSkills(
        Array.isArray(data.matched_skills) ? data.matched_skills : [],
        matchedSkillsContainer,
        'matched'
    );

    renderSkills(
        Array.isArray(data.missing_skills) ? data.missing_skills : [],
        missingSkillsContainer,
        'missing'
    );

    renderList(
        Array.isArray(data.learning_path) && data.learning_path.length
            ? data.learning_path
            : ["⚠️ AI couldn't generate learning path"],
        learningPathList
    );

    renderList(
        Array.isArray(data.ats_score_improving_tips) && data.ats_score_improving_tips.length
            ? data.ats_score_improving_tips
            : ["⚠️ AI couldn't generate ATS tips"],
        atsTipsList
    );

    renderList(
        Array.isArray(data.github_recommendations) && data.github_recommendations.length
            ? data.github_recommendations
            : ["⚠️ AI couldn't generate ideas"],
        githubRecommendationsList
    );
}

function animateScore(targetScore, valueEl, fillEl) {
    const duration = 1500;
    const steps = 60;
    const increment = targetScore / steps;
    let currentValue = 0;

    const scoreInterval = setInterval(() => {
        currentValue += increment;

        if (currentValue >= targetScore) {
            currentValue = targetScore;
            clearInterval(scoreInterval);
        }

        valueEl.textContent = Math.round(currentValue) + '%';
        fillEl.style.width = Math.round(currentValue) + '%';
    }, duration / steps);
}

function renderSkills(skills, container, type) {
    container.innerHTML = '';

    if (skills.length === 0) {
        container.innerHTML = "<p>No skills detected</p>";
        return;
    }

    skills.forEach((skill, index) => {
        const badge = document.createElement('div');
        badge.className = `skill-badge ${type}`;
        badge.textContent = skill;

        setTimeout(() => {
            container.appendChild(badge);
        }, index * 100);
    });
}

function renderList(items, listElement) {
    listElement.innerHTML = '';

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;

        setTimeout(() => {
            listElement.appendChild(li);
        }, index * 100);
    });
}

function resetForm() {
    analysisForm.reset();
    resumeFileName.textContent = '';

    formSection.classList.remove('hidden');
    loaderSection.classList.add('hidden');
    resultsSection.classList.add('hidden');

    analyzeBtn.disabled = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* INIT */
if (LYZR_CONFIG.API_KEY && LYZR_CONFIG.AGENT_ID) {
    console.log("Skill Gap Analyzer ready — Lyzr agent configured (local fallback enabled)");
} else {
    console.log("Skill Gap Analyzer ready — using local analysis (add Lyzr credentials in config.js for AI-powered results)");
}
