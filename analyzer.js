/* Local skill-gap analysis — used when Lyzr is unavailable or not configured */

const SKILL_ALIASES = {
    "JavaScript": ["javascript", "js", "ecmascript", "node.js", "nodejs"],
    "TypeScript": ["typescript", "ts"],
    "Python": ["python", "django", "flask", "fastapi"],
    "Java": ["java", "spring boot", "spring"],
    "React": ["react", "reactjs", "react.js", "next.js", "nextjs"],
    "Angular": ["angular"],
    "Vue.js": ["vue", "vue.js", "vuejs"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3", "tailwind", "bootstrap", "sass", "scss"],
    "Node.js": ["node.js", "nodejs", "express", "express.js"],
    "SQL": ["sql", "mysql", "postgresql", "postgres", "sqlite", "mssql"],
    "MongoDB": ["mongodb", "mongoose", "nosql"],
    "REST APIs": ["rest api", "restful", "api development", "web api"],
    "GraphQL": ["graphql"],
    "Git": ["git", "github", "gitlab", "bitbucket"],
    "Docker": ["docker", "containerization", "containers"],
    "Kubernetes": ["kubernetes", "k8s"],
    "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda"],
    "Azure": ["azure", "microsoft azure"],
    "CI/CD": ["ci/cd", "jenkins", "github actions", "gitlab ci", "devops"],
    "System Design": ["system design", "microservices", "distributed systems"],
    "Machine Learning": ["machine learning", "ml", "deep learning", "neural network"],
    "Data Analysis": ["data analysis", "data analytics", "pandas", "numpy"],
    "TensorFlow": ["tensorflow", "keras"],
    "PyTorch": ["pytorch"],
    "Agile/Scrum": ["agile", "scrum", "kanban", "jira"],
    "Testing": ["unit testing", "jest", "pytest", "selenium", "cypress", "tdd"],
    "Linux": ["linux", "unix", "bash", "shell scripting"],
    "Communication": ["communication", "collaboration", "teamwork", "leadership"]
};

const ROLE_PROFILES = [
    {
        keywords: ["full stack", "fullstack", "full-stack"],
        skills: ["JavaScript", "HTML", "CSS", "React", "Node.js", "SQL", "REST APIs", "Git", "Docker", "Testing"]
    },
    {
        keywords: ["frontend", "front-end", "front end", "ui developer", "react developer"],
        skills: ["JavaScript", "TypeScript", "HTML", "CSS", "React", "Git", "Testing", "REST APIs"]
    },
    {
        keywords: ["backend", "back-end", "back end", "api developer"],
        skills: ["Python", "Node.js", "SQL", "REST APIs", "Docker", "Git", "System Design", "Testing"]
    },
    {
        keywords: ["data scientist", "data science", "ml engineer", "machine learning engineer"],
        skills: ["Python", "Machine Learning", "SQL", "Data Analysis", "TensorFlow", "PyTorch", "Git"]
    },
    {
        keywords: ["devops", "platform engineer", "cloud engineer", "sre"],
        skills: ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Git", "Python", "System Design"]
    },
    {
        keywords: ["software engineer", "software developer", "developer", "programmer"],
        skills: ["JavaScript", "Python", "Git", "SQL", "REST APIs", "Testing", "Agile/Scrum", "System Design"]
    }
];

const LEARNING_TIPS = {
    "JavaScript": "Complete the JavaScript modules on freeCodeCamp or MDN, then build a small interactive web app.",
    "TypeScript": "Add TypeScript to an existing JavaScript project and practice typing APIs and components.",
    "Python": "Work through Python basics on Codecademy or Automate the Boring Stuff, then solve HackerRank problems.",
    "Java": "Take a Spring Boot crash course and build a REST API with a database.",
    "React": "Follow the official React tutorial and rebuild a todo app with hooks and component state.",
    "Angular": "Complete the Angular getting-started guide and build a dashboard with routing.",
    "Vue.js": "Build a Vue 3 project with Vite and practice component composition.",
    "HTML": "Practice semantic HTML by recreating a landing page without CSS frameworks.",
    "CSS": "Rebuild a responsive layout using Flexbox and Grid on Frontend Mentor.",
    "Node.js": "Create a REST API with Express, add validation, and connect it to a database.",
    "SQL": "Practice joins and aggregations on SQLBolt, then design schemas for a real-world app.",
    "MongoDB": "Build a CRUD app with MongoDB Atlas and learn indexing basics.",
    "REST APIs": "Design and document an API with OpenAPI/Swagger and implement auth.",
    "GraphQL": "Convert a small REST API to GraphQL using Apollo Server or similar.",
    "Git": "Practice branching workflows on a personal repo and contribute to open source.",
    "Docker": "Containerize a web app and run it with docker-compose including a database.",
    "Kubernetes": "Deploy a containerized app to Minikube and learn pods, services, and deployments.",
    "AWS": "Earn AWS Cloud Practitioner cert and deploy a static site plus Lambda function.",
    "Azure": "Complete Azure Fundamentals and deploy a web app on App Service.",
    "CI/CD": "Set up GitHub Actions to lint, test, and deploy your project automatically.",
    "System Design": "Study common patterns (caching, load balancing) and design a URL shortener on paper.",
    "Machine Learning": "Take Andrew Ng's ML course and implement regression/classification on a dataset.",
    "Data Analysis": "Analyze a public dataset with Pandas and present insights in a Jupyter notebook.",
    "TensorFlow": "Build an image classifier using a pre-trained model and fine-tune it.",
    "PyTorch": "Follow a PyTorch beginner tutorial and train a simple neural network.",
    "Agile/Scrum": "Read the Scrum Guide and practice writing user stories for your projects.",
    "Testing": "Add unit tests to an existing project using Jest or pytest with good coverage.",
    "Linux": "Set up a Linux VM and practice file management, permissions, and shell scripts.",
    "Communication": "Practice explaining technical decisions in writing and present a project demo."
};

const PROJECT_IDEAS = {
    "JavaScript": "Build a browser-based expense tracker with local storage and charts.",
    "TypeScript": "Create a typed CLI tool that fetches and summarizes GitHub repo stats.",
    "Python": "Build a CLI automation tool that organizes files or sends scheduled reports.",
    "Java": "Create a Spring Boot library management API with JWT authentication.",
    "React": "Build a weather dashboard that consumes a public API with search and favorites.",
    "Angular": "Develop an employee directory app with filtering, sorting, and routing.",
    "Vue.js": "Create a recipe manager with Vue 3 composition API and Pinia state.",
    "HTML": "Clone a product landing page with accessible forms and semantic structure.",
    "CSS": "Recreate a Dribbble design with responsive breakpoints and animations.",
    "Node.js": "Build a real-time chat server with WebSockets and message persistence.",
    "SQL": "Design a database for an e-commerce store and write complex analytical queries.",
    "MongoDB": "Build a blog platform with comments, tags, and full-text search.",
    "REST APIs": "Create a bookmark manager API with CRUD, pagination, and OpenAPI docs.",
    "GraphQL": "Build a movie database API with GraphQL queries, mutations, and subscriptions.",
    "Git": "Contribute documentation fixes or tests to an open-source project you use.",
    "Docker": "Package a full-stack app (frontend + API + DB) with Docker Compose.",
    "Kubernetes": "Deploy a microservices demo on Kubernetes with health checks and scaling.",
    "AWS": "Host a serverless photo gallery using S3, Lambda, and API Gateway.",
    "Azure": "Deploy a containerized API to Azure Container Apps with monitoring.",
    "CI/CD": "Add a pipeline that runs tests, builds Docker images, and deploys on merge.",
    "System Design": "Design and prototype a rate-limited URL shortener with Redis caching.",
    "Machine Learning": "Train a sentiment classifier on product reviews and expose it via API.",
    "Data Analysis": "Analyze COVID or stock market data and publish an interactive dashboard.",
    "TensorFlow": "Build a handwritten digit recognizer with a simple web upload UI.",
    "PyTorch": "Create an image style transfer app using a pre-trained model.",
    "Agile/Scrum": "Run a two-week sprint on a side project using Scrum boards and retrospectives.",
    "Testing": "Add integration and E2E tests to an open-source project and submit a PR.",
    "Linux": "Set up a home server with Nginx, SSL, and automated backups via cron.",
    "Communication": "Write a technical blog post explaining a project architecture you built."
};

const DEFAULT_SKILLS = ["JavaScript", "Python", "Git", "SQL", "REST APIs", "Testing", "Agile/Scrum"];

function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, " ");
}

function resumeContainsSkill(resumeNorm, skill) {
    const aliases = SKILL_ALIASES[skill] || [skill.toLowerCase()];
    const padded = ` ${resumeNorm} `;

    return aliases.some((alias) => {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`[\\s,./+#\\-]${escaped}[\\s,./+#\\-]`);
        return regex.test(padded);
    });
}

function getRequiredSkills(jobRole) {
    const roleNorm = jobRole.toLowerCase();

    for (const profile of ROLE_PROFILES) {
        if (profile.keywords.some((kw) => roleNorm.includes(kw))) {
            return profile.skills;
        }
    }

    return DEFAULT_SKILLS;
}

function analyzeSkillGapLocally(resumeText, jobRole) {
    const resumeNorm = normalizeText(resumeText);
    const requiredSkills = getRequiredSkills(jobRole);

    const matched = [];
    const missing = [];

    for (const skill of requiredSkills) {
        if (resumeContainsSkill(resumeNorm, skill)) {
            matched.push(skill);
        } else {
            missing.push(skill);
        }
    }

    const readinessScore = requiredSkills.length
        ? Math.round((matched.length / requiredSkills.length) * 100)
        : 0;

    const learningPath = missing.map(
        (skill) => LEARNING_TIPS[skill] || `Study ${skill} through official docs and a hands-on tutorial.`
    );

    const githubRecommendations = missing.map(
        (skill) => PROJECT_IDEAS[skill] || `Build a portfolio project that demonstrates ${skill} in a real app.`
    );

    if (githubRecommendations.length === 0) {
        githubRecommendations.push(
            "Contribute to an open-source project in your target stack to strengthen your profile."
        );
    }

    const atsScore = estimateAtsScore(resumeNorm, jobRole);
    const atsTips = generateAtsTips(resumeNorm, jobRole);

    return {
        readiness_score: readinessScore,
        ats_score: atsScore,
        matched_skills: matched,
        missing_skills: missing,
        learning_path: learningPath,
        ats_score_improving_tips: atsTips,
        github_recommendations: githubRecommendations
    };
}

function estimateAtsScore(resumeNorm, jobRole) {
    let score = 40;
    const checks = [
        { test: () => resumeNorm.length > 300, pts: 10 },
        { test: () => /experience|work history|employment/.test(resumeNorm), pts: 10 },
        { test: () => /education|degree|b\.?s|m\.?s|bachelor|master/.test(resumeNorm), pts: 10 },
        { test: () => /skills|technologies|technical/.test(resumeNorm), pts: 10 },
        { test: () => /project|portfolio|built|developed/.test(resumeNorm), pts: 10 },
        { test: () => jobRole.split(/\s+/).some((w) => w.length > 3 && resumeNorm.includes(w.toLowerCase())), pts: 10 }
    ];

    for (const check of checks) {
        if (check.test()) score += check.pts;
    }

    return Math.min(score, 100);
}

function generateAtsTips(resumeNorm, jobRole) {
    const tips = [];

    if (!/experience|work history|employment/.test(resumeNorm)) {
        tips.push("Add a clear Work Experience section with job titles, companies, dates, and bullet-point achievements.");
    }
    if (!/skills|technologies|technical/.test(resumeNorm)) {
        tips.push("Include a dedicated Skills section listing tools and technologies relevant to the role.");
    }
    if (resumeNorm.length < 300) {
        tips.push("Expand your resume with more detail — ATS systems favor resumes with sufficient keyword density.");
    }
    if (!jobRole.split(/\s+/).some((w) => w.length > 3 && resumeNorm.includes(w.toLowerCase()))) {
        tips.push(`Mirror keywords from the job title "${jobRole}" naturally in your summary and skills sections.`);
    }
    if (!/project|portfolio|built|developed/.test(resumeNorm)) {
        tips.push("Add a Projects section to showcase hands-on work with measurable outcomes.");
    }
    if (tips.length === 0) {
        tips.push("Use standard section headings (Experience, Education, Skills) and save as PDF for best ATS compatibility.");
    }

    return tips;
}
