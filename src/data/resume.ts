export type Job = {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  tech: string[];
};

export type Project = {
  name: string;
  context: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

export const profile = {
  name: "Emil Mohammed",
  firstName: "Emil",
  title: "Senior Java Developer",
  tagline: "Microservices & Cloud-Native Systems",
  location: "Abu Dhabi, UAE",
  email: "ckemil@gmail.com",
  linkedin: "https://www.linkedin.com/in/ckemil/",
  resume: "/Emil_Mohammed_Resume.pdf",
  siteUrl: "https://ckemil.com",
  intro:
    "I engineer Java enterprise applications and cloud-native microservices for high-volume, regulated environments — from financial identity verification to air-cargo logistics.",
};

export const stats = [
  { value: 6, suffix: "+", label: "Years building Java systems" },
  { value: 10, suffix: "K+", label: "KYC transactions per day" },
  { value: 95, suffix: "%+", label: "Unit test coverage sustained" },
  { value: 60, suffix: "%", label: "Manual workload eliminated" },
];

export const summary = [
  "Design and build microservices with Spring Boot, Spring Cloud, JPA and Hibernate — from architecture through production deployment.",
  "Event-driven architecture with Apache Kafka and RabbitMQ, containerized with Docker and Kubernetes.",
  "CI/CD and DevOps practice with Jenkins, SonarQube and Git, consistently keeping automated test coverage above 90%.",
  "Full-stack contributions with React, CSS3 and HTML5.",
  "Six years of Agile/Scrum — grooming, planning and retrospectives.",
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Java", "SQL", "JavaScript", "HTML5", "CSS3"] },
  {
    group: "Frameworks",
    items: [
      "Spring Boot",
      "Spring Cloud",
      "Microservices",
      "JPA",
      "Hibernate",
      "RESTful APIs",
      "WebClient",
      "RestTemplate",
      "Feign",
      "JSP / Servlet",
      "Maven",
      "React",
      "Mockito",
    ],
  },
  {
    group: "Tools & Platforms",
    items: ["Docker", "Kubernetes", "Apache Kafka", "RabbitMQ", "NGINX", "Jenkins", "SonarQube", "Git", "JIRA", "IntelliJ", "Postman"],
  },
  { group: "Databases", items: ["PostgreSQL", "Oracle", "MSSQL", "MySQL", "Liquibase", "Flyway"] },
];

export const experience: Job[] = [
  {
    role: "Senior Java Developer",
    company: "Emirates Face Recognition",
    location: "Abu Dhabi, UAE",
    period: "Feb 2025 — Present",
    highlights: [
      "Designed and developed scalable KYC microservices handling onboarding and identity verification for 10K+ users/transactions per day.",
      "Built the end-to-end KYC lifecycle — OCR validation, identity matching, risk categorization and approval workflows.",
      "Integrated external OCR and identity providers with retries, timeouts and circuit breakers for resilient production operation.",
      "Published KYC events to RabbitMQ for real-time downstream risk analysis, monitoring and alerting.",
      "Co-led high-level architecture with product, security and infrastructure teams; defined routing and load balancing with NGINX, ALB and NLB.",
    ],
    tech: ["Java", "Spring Boot", "Spring Data JPA", "RabbitMQ", "Flyway", "WebClient", "NGINX"],
  },
  {
    role: "Senior Software Developer",
    company: "IBS Software",
    location: "Kochi, India",
    period: "Jun 2021 — May 2024",
    highlights: [
      "Followed TDD with JUnit, sustaining 95%+ unit and 80%+ contract test coverage across delivered features.",
      "Enforced coding standards via SonarQube, keeping technical debt and critical smells below team thresholds.",
      "Shipped features across bi-weekly sprints with cross-functional Agile/Scrum teams, consistently on time.",
    ],
    tech: ["Java 11", "Spring Boot", "Kafka", "Kubernetes", "Jenkins", "Liquibase", "React"],
  },
  {
    role: "Software Developer",
    company: "UST",
    location: "Trivandrum, India",
    period: "Feb 2019 — Jun 2021",
    highlights: [
      "Built Java automation tools that cut manual operational workload by 60%.",
      "Maintained and optimized Java applications through proactive monitoring, improving performance and reducing downtime.",
      "Provided delivery support for IBM WebSphere Commerce services.",
    ],
    tech: ["Java 8", "Spring Boot", "Servlet", "JSP", "SQL", "WebSphere Commerce"],
  },
];

export const projects: Project[] = [
  {
    name: "KYC Platform",
    context: "Emirates Face Recognition",
    summary:
      "Identity-verification microservices powering customer onboarding for a regulated financial environment.",
    highlights: [
      "OCR validation → identity matching → risk categorization → approval",
      "Resilient provider integrations with circuit breakers",
      "Event streaming to RabbitMQ for real-time risk monitoring",
    ],
    tech: ["Java", "Spring Boot", "RabbitMQ", "PostgreSQL", "Flyway"],
  },
  {
    name: "iCargo — Quality Audit",
    context: "IBS Software · Air Cargo",
    summary:
      "Quality Audit module of the iCargo microservices suite, used by airlines and ground-handling agents to validate Air Waybill billing.",
    highlights: [
      "Validates AWB billing records including taxation and charges",
      "Discrepancy logic that automatically flags or clears records as billed",
      "Kafka streaming for async communication between distributed systems",
    ],
    tech: ["Spring Boot", "Apache Kafka", "Microservices", "SQL"],
  },
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "University of Calicut",
  location: "Kerala, India",
  period: "2013 — 2017",
};
