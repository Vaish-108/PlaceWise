/**
 * Technical skills dictionary.
 *
 * The list is intentionally broad so that student resumes
 * from CSE / AI / ML / Software Development backgrounds
 * can be analyzed.
 */

const TECHNICAL_SKILLS = [
  // -----------------------------
  // Programming Languages
  // -----------------------------

  "C++",
  "C#",
  "C",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "Go",
  "Golang",
  "Rust",
  "Ruby",
  "PHP",
  "Kotlin",
  "Swift",
  "Dart",
  "R",
  "MATLAB",
  "Scala",
  "Perl",
  "Shell",
  "Bash",
  "PowerShell",

  // -----------------------------
  // DSA / CS Fundamentals
  // -----------------------------

  "Data Structures",
  "Algorithms",
  "Data Structures and Algorithms",
  "DSA",
  "Object Oriented Programming",
  "OOP",
  "Operating Systems",
  "Computer Networks",
  "DBMS",
  "Database Management System",
  "Computer Architecture",
  "Software Engineering",

  // -----------------------------
  // Web Development
  // -----------------------------

  "HTML",
  "HTML5",
  "CSS",
  "CSS3",
  "SASS",
  "SCSS",

  "React",
  "React.js",
  "React Native",

  "Next.js",
  "Next JS",

  "Angular",
  "AngularJS",

  "Vue",
  "Vue.js",

  "Svelte",

  "Node.js",
  "Node JS",

  "Express",
  "Express.js",
  "Express JS",

  "NestJS",

  "Django",
  "Flask",
  "FastAPI",

  "Spring",
  "Spring Boot",
  "Hibernate",
  "JPA",

  "Laravel",
  "Ruby on Rails",
  "Rails",

  // -----------------------------
  // Full Stack
  // -----------------------------

  "Full Stack",
  "MERN",
  "MERN Stack",
  "MEAN",
  "MEAN Stack",

  // -----------------------------
  // Frontend
  // -----------------------------

  "Redux",
  "Context API",
  "Material UI",
  "MUI",
  "Tailwind CSS",
  "Bootstrap",

  "Responsive Design",
  "UI/UX",

  // -----------------------------
  // Backend
  // -----------------------------

  "REST API",
  "REST APIs",
  "API",
  "GraphQL",
  "Microservices",

  // -----------------------------
  // Databases
  // -----------------------------

  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "Oracle",
  "Redis",
  "Firebase",

  "SQL",
  "NoSQL",

  // -----------------------------
  // AI / ML
  // -----------------------------

  "Artificial Intelligence",
  "AI",
  "Machine Learning",
  "Deep Learning",

  "Natural Language Processing",
  "NLP",

  "Computer Vision",

  "Generative AI",
  "GenAI",
  "Large Language Models",
  "LLM",
  "LLMs",

  "Prompt Engineering",

  "OpenAI",
  "OpenAI API",

  "LangChain",
  "LangGraph",

  "Hugging Face",

  "TensorFlow",
  "PyTorch",

  "Scikit-learn",
  "Scikit Learn",

  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",

  // -----------------------------
  // Data
  // -----------------------------

  "Data Science",
  "Data Analytics",

  "Power BI",
  "Tableau",

  // -----------------------------
  // Cloud
  // -----------------------------

  "AWS",
  "Amazon Web Services",

  "Azure",
  "Microsoft Azure",

  "GCP",
  "Google Cloud Platform",

  "Cloud Computing",

  // -----------------------------
  // DevOps
  // -----------------------------

  "Docker",
  "Kubernetes",

  "Jenkins",
  "GitHub Actions",

  "CI/CD",
  "DevOps",

  "Terraform",
  "Ansible",

  "Nginx",
  "Apache",

  // -----------------------------
  // Version Control
  // -----------------------------

  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",

  // -----------------------------
  // Tools
  // -----------------------------

  "Postman",
  "Swagger",
  "Figma",

  "Jira",
  "Agile",
  "Scrum",

  "VS Code",
  "Visual Studio",

  // -----------------------------
  // Testing
  // -----------------------------

  "Jest",
  "Mocha",
  "Cypress",
  "Selenium",
  "Playwright",

  // -----------------------------
  // Build Tools
  // -----------------------------

  "Vite",
  "Webpack",
  "Babel",
  "ESLint",
  "Prettier",

  "npm",
  "yarn",
  "pnpm",

  "Maven",
  "Gradle",

  // -----------------------------
  // APIs / Authentication
  // -----------------------------

  "JSON",
  "XML",
  "YAML",
  "JWT",
  "OAuth",

  "Socket.io",
  "WebSockets",

  // -----------------------------
  // Security / Networking
  // -----------------------------

  "Cybersecurity",
  "Networking",
  "TCP/IP",
  "HTTP",
  "HTTPS",
  "DNS",
  "SSL",
  "TLS",

  // -----------------------------
  // Mobile
  // -----------------------------

  "Android",
  "iOS",
  "Flutter",
  "Dart",

  // -----------------------------
  // Other
  // -----------------------------

  "Blockchain",
  "Solidity",
  "Ethereum",



  "MERN",
"MERN Stack",
"MEAN",
"MEAN Stack",
"Full Stack Development",
"Web Development",
"Frontend Development",
"Backend Development",
"Data Structures and Algorithms",
"Problem Solving",
"Competitive Programming",
"RESTful API",
"RESTful APIs",
"REST APIs",
"Next JS",
"Node JS",
"Mongo DB",
"Machine Learning",
"Deep Learning",
"Artificial Intelligence",
"AI",
"Natural Language Processing",
"Data Science",
"Data Analysis",
"Object Oriented Design",
"Object Oriented Programming",
"Computer Networks",
"Operating Systems",
"Database Management Systems",
"Git",
"GitHub",
"GitLab",
"Visual Studio Code",
"VS Code",
"Postman",
];

/**
 * Escape special regex characters.
 */
const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


/**
 * Normalize resume text.
 *
 * This helps matching work even when PDF extraction
 * produces strange spaces or line breaks.
 */
const normalizeText = (text) => {
  return text
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};


/**
 * Build a safe regex for each skill.
 */
const buildSkillPattern = (skill) => {
  const normalizedSkill = skill.toLowerCase().trim();

  const escapedSkill = escapeRegExp(normalizedSkill);

  /**
   * For short skills such as:
   * C
   * R
   * Go
   *
   * word boundaries are important.
   */
  if (normalizedSkill.length <= 3) {
    return new RegExp(
      `(^|[^a-z0-9+#.])${escapedSkill}(?=$|[^a-z0-9+#.])`,
      "i"
    );
  }

  /**
   * For skills containing special characters,
   * use flexible boundary matching.
   */
  return new RegExp(
    `(^|[^a-z0-9])${escapedSkill}(?=$|[^a-z0-9])`,
    "i"
  );
};


/**
 * Extract technical skills from resume text.
 */
const extractSkillsFromText = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const normalizedText = normalizeText(text);

  if (!normalizedText) {
    return [];
  }

  const foundSkills = new Set();

  /**
   * Longest first.
   *
   * Example:
   * "React Native" is checked before "React"
   * "Machine Learning" before "Learning"
   */
  const sortedSkills = [...TECHNICAL_SKILLS].sort(
    (a, b) => b.length - a.length
  );

  for (const skill of sortedSkills) {
    const pattern = buildSkillPattern(skill);

    if (pattern.test(normalizedText)) {
      foundSkills.add(skill);
    }
  }

  return Array.from(foundSkills).sort(
    (a, b) =>
      a.localeCompare(b, undefined, {
        sensitivity: "base",
      })
  );
};

module.exports = {
  extractSkillsFromText,
};
