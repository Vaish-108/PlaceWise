/**
 * Curated technical skills commonly found on student and engineering resumes.
 * Sorted longest-first at runtime to prefer multi-word matches (e.g. "React Native" before "React").
 */
const TECHNICAL_SKILLS = [
  "Amazon Web Services",
  "Google Cloud Platform",
  "Microsoft Azure",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Data Structures",
  "Object Oriented Programming",
  "Software Development",
  "Full Stack",
  "Front End",
  "Back End",
  "React Native",
  "Next.js",
  "Node.js",
  "Express.js",
  "Vue.js",
  "AngularJS",
  "TypeScript",
  "JavaScript",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "SQLite",
  "Firebase",
  "GraphQL",
  "REST API",
  "Spring Boot",
  "Tailwind CSS",
  "Bootstrap",
  "Material UI",
  "Redux",
  "Context API",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Power BI",
  "Tableau",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitHub Actions",
  "CI/CD",
  "Linux",
  "Ubuntu",
  "Windows",
  "macOS",
  "Postman",
  "Swagger",
  "Jest",
  "Mocha",
  "Cypress",
  "Selenium",
  "Playwright",
  "Webpack",
  "Vite",
  "Babel",
  "ESLint",
  "Prettier",
  "Agile",
  "Scrum",
  "Jira",
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "HTML",
  "CSS",
  "SASS",
  "SCSS",
  "PHP",
  "Laravel",
  "Django",
  "Flask",
  "FastAPI",
  "Ruby",
  "Rails",
  "Go",
  "Golang",
  "Rust",
  "Swift",
  "Kotlin",
  "Scala",
  "Perl",
  "Shell",
  "Bash",
  "PowerShell",
  "Assembly",
  "MATLAB",
  "R",
  "Java",
  "Python",
  "C++",
  "C#",
  "C",
  "React",
  "Angular",
  "Vue",
  "Svelte",
  "Express",
  "NestJS",
  "Spring",
  "Hibernate",
  "JPA",
  "Microservices",
  "Redis",
  "Elasticsearch",
  "Kafka",
  "RabbitMQ",
  "AWS",
  "Azure",
  "GCP",
  "Terraform",
  "Ansible",
  "Nginx",
  "Apache",
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Jenkins",
  "Maven",
  "Gradle",
  "npm",
  "yarn",
  "pnpm",
  "Webpack",
  "Babel",
  "SQL",
  "NoSQL",
  "Oracle",
  "DBMS",
  "OOP",
  "DSA",
  "API",
  "JSON",
  "XML",
  "YAML",
  "JWT",
  "OAuth",
  "Socket.io",
  "WebSockets",
  "HTML5",
  "CSS3",
  "Responsive Design",
  "UI/UX",
  "Android",
  "iOS",
  "Flutter",
  "Dart",
  "Xamarin",
  ".NET",
  "ASP.NET",
  "Blazor",
  "Unity",
  "Unreal Engine",
  "Blockchain",
  "Solidity",
  "Ethereum",
  "Hadoop",
  "Spark",
  "Hive",
  "Airflow",
  "Snowflake",
  "BigQuery",
  "Redshift",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "Networking",
  "TCP/IP",
  "DNS",
  "HTTP",
  "HTTPS",
  "SSL",
  "TLS",
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSkillPattern = (skill) => {
  const normalized = skill.toLowerCase();

  // Skills with dots or slashes need flexible boundary matching
  if (/[./]/.test(normalized)) {
    return new RegExp(escapeRegExp(normalized), "i");
  }

  // Short tokens (e.g. C, R, Go) need word boundaries to reduce false positives
  if (normalized.length <= 3) {
    return new RegExp(`\\b${escapeRegExp(normalized)}\\b`, "i");
  }

  return new RegExp(`\\b${escapeRegExp(normalized)}\\b`, "i");
};

/**
 * Scans resume text for known technical skills and returns a deduplicated list.
 * @param {string} text - Plain text extracted from a resume
 * @returns {string[]} Matched skill names (canonical casing from dictionary)
 */
const extractSkillsFromText = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const foundSkills = new Set();
  const sortedSkills = [...TECHNICAL_SKILLS].sort(
    (a, b) => b.length - a.length
  );

  for (const skill of sortedSkills) {
    const pattern = buildSkillPattern(skill);

    if (pattern.test(text)) {
      foundSkills.add(skill);
    }
  }

  return Array.from(foundSkills).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
};

module.exports = {
  extractSkillsFromText,
};
