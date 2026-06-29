/* LOCAL SKILL GAP ANALYZER — Fallback when Lyzr agent is unavailable */

/* SKILL DATABASES */
const SKILL_DATABASE = {
    "Senior Full Stack Developer": {
        required: ["JavaScript", "React", "Node.js", "SQL", "Docker", "Git", "REST APIs", "TypeScript", "MongoDB", "AWS"],
        nice_to_have: ["GraphQL", "Kubernetes", "CI/CD", "Testing", "Agile"]
    },
    "Frontend Developer": {
        required: ["JavaScript", "React", "CSS", "HTML", "Git", "REST APIs"],
        nice_to_have: ["TypeScript", "Vue.js", "Angular", "Responsive Design", "SEO"]
    },
    "Backend Developer": {
        required: ["Node.js", "SQL", "REST APIs", "Git", "Database Design"],
        nice_to_have: ["Docker", "Microservices", "GraphQL", "caching", "Message Queues"]
    },
    "Data Scientist": {
        required: ["Python", "Machine Learning", "Data Analysis", "SQL", "Statistics"],
        nice_to_have: ["TensorFlow", "PyTorch", "Tableau", "Apache Spark", "R"]
    },
    "DevOps Engineer": {
        required: ["Docker", "Kubernetes", "AWS", "Git", "CI/CD", "Linux"],
        nice_to_have: ["Terraform", "Jenkins", "Monitoring", "Nginx", "Load Balancing"]
    },
    "Product Manager": {
        required: ["Product Strategy", "Analytics", "Communication", "Roadmapping"],
        nice_to_have: ["Agile", "SQL", "User Research", "Wireframing", "JIRA"]
    }
};

function normalizeText(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/[^\w\s]/g, " ").trim();
}

function resumeContainsSkill(resumeText, skill) {
    if (!resumeText || !skill) return false;
    const normalized = normalizeText(resumeText);
    const skillNorm = normalizeText(skill);
    return normalized.includes(skillNorm);
}

function getRequiredSkills(jobRole) {
    let role = jobRole;
    // Fuzzy match for role
    for (const key in SKILL_DATABASE) {
        if (key.toLowerCase().includes(jobRole.toLowerCase()) || jobRole.toLowerCase().includes(key.toLowerCase())) {
            role = key;
            break;
        }
    }
    return SKILL_DATABASE[role] || SKILL_DATABASE["Senior Full Stack Developer"];
}

function analyzeSkillGap(resumeText, jobRole) {
    if (!resumeText || !jobRole) {
        throw new Error("Resume and job role are required");
    }

    const requirements = getRequiredSkills(jobRole);
    const allSkills = [...requirements.required, ...requirements.nice_to_have];
    
    const matchedSkills = [];
    const missingSkills = [];

    allSkills.forEach(skill => {
        if (resumeContainsSkill(resumeText, skill)) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });

    // Calculate readiness score
    const readinessScore = Math.round((matchedSkills.length / allSkills.length) * 100);

    // Calculate ATS score (text-based simple metric)
    const hasCommonAtsKeywords = [
        "skills",
        "experience",
        "education",
        "projects",
        "accomplishments",
        "technical"
    ].filter(keyword => resumeText.toLowerCase().includes(keyword)).length;
    
    const atsScore = Math.round(50 + (hasCommonAtsKeywords * 5));

    // Generate learning path
    const learningPath = missingSkills.slice(0, 5).map(skill => {
        const resources = {
            "Python": "Complete Python course on Coursera or freeCodeCamp",
            "JavaScript": "JavaScript Fundamentals - MDN Web Docs",
            "React": "React Official Tutorial + React Query",
            "Angular": "Angular Official Documentation & Tutorials",
            "Vue.js": "Vue.js 3 Composition API Guide",
            "Node.js": "Node.js for Backend Development",
            "SQL": "SQL fundamentals + database design",
            "MongoDB": "MongoDB University Free Courses",
            "AWS": "AWS Cloud Practitioner Certification",
            "Docker": "Docker for Developers - Complete Guide",
            "Kubernetes": "Kubernetes Official Documentation",
            "Git": "Pro Git Book + GitHub Guides",
            "TypeScript": "TypeScript Handbook",
            "GraphQL": "GraphQL Official Tutorial",
            "Machine Learning": "Machine Learning Specialization on Coursera",
            "Data Analysis": "Data Analysis with Python - freeCodeCamp",
            "CI/CD": "Jenkins Tutorial for DevOps",
            "Testing": "Testing JavaScript - Frontend Masters",
            "REST APIs": "REST API Design Best Practices",
            "Product Strategy": "Cracking the PM Interview",
            "Analytics": "Google Analytics Academy"
        };
        
        return `Learn ${skill}: ${resources[skill] || `Explore online courses for ${skill}`}`;
    });

    // ATS Tips
    const atsTips = [
        "Use standard section headers like Skills, Experience, Education",
        "Include relevant keywords from the job description",
        "Use standard date formats (MM/YYYY)",
        "Avoid graphics, images, and unusual formatting",
        "Use common fonts like Arial, Calibri, or Times New Roman",
        "Save as PDF to preserve formatting",
        "Include full job titles and company names",
        "Quantify accomplishments with metrics"
    ];

    // GitHub recommendations
    const projectIdeas = [
        `Build a full-stack ${jobRole} portfolio project showcasing your top 3 skills`,
        `Create a GitHub project demonstrating ${matchedSkills[0] || 'your strongest skill'} mastery`,
        `Contribute to open source projects related to ${requirements.required[0]}`,
        `Document your learning journey for ${missingSkills[0] || 'a new technology'}`,
        `Build a mini SaaS or web app using your matched skills`,
        `Create a comprehensive tutorial blog on a topic you know well`,
        `Develop an API or microservice using modern best practices`
    ];

    return {
        readiness_score: readinessScore,
        ats_score: atsScore,
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        learning_path: learningPath,
        ats_score_improving_tips: atsTips,
        github_recommendations: projectIdeas.slice(0, 5),
        areta_message: `Based on your resume, you're ${readinessScore}% ready for a ${jobRole} role. You have strong experience with ${matchedSkills.slice(0, 3).join(", ")}. Focus on developing skills in ${missingSkills.slice(0, 2).join(" and ")} to increase your competitiveness. Your ATS score is ${atsScore}% — make sure your resume follows standard formatting. Keep building projects to showcase your expertise!`
    };
}

/* PUBLIC INTERFACE */
function analyzeSkillGapLocally(resumeText, jobRole) {
    return analyzeSkillGap(resumeText, jobRole);
}
