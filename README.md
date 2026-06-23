# LveleUp Analytics (Skill Gap Analyzer) 

A frontend web application that leverages Agentic AI to provide deep career readiness insights. By evaluating a user's uploaded resume alongside a target job role and GitHub profile, the system identifies specific technical gaps and generates actionable learning paths.

## Features
* **AI-Powered Analysis:** Utilizes Lyzr Agentic AI for natural language understanding and skill extraction.
* **Resume Parsing:** Extracts text seamlessly from PDF and DOCX formats directly in the browser.
* **Readiness & ATS Scoring:** Calculates a percentage-based match for specific job roles and provides ATS optimization tips.
* **Automated Workflow Integration:** Built with hooks ready to connect to n8n for advanced career readiness data processing.
* **Personalized Recommendations:** Suggests targeted open-source projects and specific learning paths based on identified skill gaps.

## Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **AI Agent:** Lyzr API
* **Document Parsing:** pdf.js, mammoth.js
* **Automation:** n8n

## Getting Started

### Prerequisites
To run this project locally, you just need a modern web browser. For AI features, you will need a valid Lyzr API key and Agent ID.

### Installation
1. Clone the repository:
```bash
   git clone [https://github.com/yourusername/skill-gap-analyzer.git](https://github.com/yourusername/skill-gap-analyzer.git)
