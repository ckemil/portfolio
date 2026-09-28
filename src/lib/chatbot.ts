import { education, experience, profile, projects, skills, summary, type Job } from "@/data/resume";

export type Action = { label: string; href: string };
export type Answer = { text: string; actions?: Action[] };

export const suggestions = [
  "Who is Emil?",
  "What's his tech stack?",
  "Where has he worked?",
  "Does he know Kafka?",
  "How can I contact him?",
];

const contactActions: Action[] = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "LinkedIn", href: profile.linkedin },
];
const resumeAction: Action = { label: "Download resume", href: profile.resume };

const bullets = (xs: string[]) => xs.map((x) => `• ${x}`).join("\n");

function describeJob(j: Job): Answer {
  return {
    text: `${j.role} at ${j.company} (${j.location}), ${j.period}.\n\n${bullets(j.highlights)}\n\nTech: ${j.tech.join(", ")}`,
  };
}

type Intent = { keywords: string[]; answer: () => Answer };

const intents: Record<string, Intent> = {
  greeting: {
    keywords: ["hi", "hello", "hey", "salam", "hola", "good morning", "good evening", "yo"],
    answer: () => ({
      text: `Hi! 👋 I can answer questions about ${profile.firstName} — his experience, skills, projects, education or how to reach him.`,
    }),
  },
  about: {
    keywords: ["who", "about", "yourself", "himself", "summary", "introduce", "introduction", "profile", "background", "tell me"],
    answer: () => ({
      text: `${profile.name} is a ${profile.title} based in ${profile.location}, focused on ${profile.tagline.toLowerCase()}.\n\n${profile.intro}\n\n${bullets(summary.slice(0, 3))}`,
      actions: [resumeAction],
    }),
  },
  experience: {
    keywords: ["experience", "work", "worked", "job", "jobs", "career", "companies", "company", "employer", "history", "years", "roles", "senior"],
    answer: () => ({
      text: `${profile.firstName} has 6+ years of experience building Java enterprise systems:\n\n${experience
        .map((j) => `• ${j.role} — ${j.company}, ${j.period}`)
        .join("\n")}\n\nAsk about any company for details.`,
    }),
  },
  current: {
    keywords: ["current", "currently", "now", "present", "presently", "today"],
    answer: () => describeJob(experience[0]),
  },
  skills: {
    keywords: ["skill", "skills", "stack", "tech", "technology", "technologies", "tools", "languages", "frameworks", "databases", "expertise", "good at"],
    answer: () => ({ text: skills.map((g) => `${g.group}: ${g.items.join(", ")}`).join("\n\n") }),
  },
  projects: {
    keywords: ["project", "projects", "built", "build", "portfolio", "icargo", "kyc", "cargo"],
    answer: () => ({
      text: projects.map((p) => `▸ ${p.name} (${p.context})\n${p.summary}\n${bullets(p.highlights)}`).join("\n\n"),
    }),
  },
  education: {
    keywords: ["education", "degree", "study", "studied", "university", "college", "graduate", "graduated", "btech", "b.tech", "qualification"],
    answer: () => ({
      text: `${education.degree} — ${education.school}, ${education.location} (${education.period}).`,
    }),
  },
  contact: {
    keywords: ["contact", "email", "mail", "reach", "hire", "hiring", "linkedin", "connect", "available", "availability", "talk", "phone", "call"],
    answer: () => ({
      text: `The best way to reach ${profile.firstName} is by email at ${profile.email} or on LinkedIn.`,
      actions: contactActions,
    }),
  },
  location: {
    keywords: ["where", "location", "located", "based", "live", "lives", "country", "city", "relocate", "uae", "dubai", "abu dhabi"],
    answer: () => ({ text: `${profile.firstName} is based in ${profile.location}.` }),
  },
  resume: {
    keywords: ["resume", "cv", "download", "pdf"],
    answer: () => ({ text: `Here's ${profile.firstName}'s full resume as a PDF.`, actions: [resumeAction] }),
  },
  testing: {
    keywords: ["test", "tests", "testing", "tdd", "coverage", "junit", "quality", "sonarqube"],
    answer: () => ({
      text: `Quality is a big focus: ${profile.firstName} follows TDD with JUnit and Mockito, sustained 95%+ unit and 80%+ contract test coverage at IBS Software, and enforces standards with SonarQube.`,
    }),
  },
  thanks: {
    keywords: ["thanks", "thank", "thx", "great", "awesome", "cool", "nice", "bye", "goodbye"],
    answer: () => ({ text: "Happy to help! Anything else you'd like to know?", actions: contactActions }),
  },
};

// Companies, matched by name or short form
const companies: { keywords: string[]; job: Job }[] = experience.map((job) => {
  const name = job.company.toLowerCase();
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("");
  // Short initials like "is" (IBS Software) would match ordinary words
  return { keywords: [name, name.split(" ")[0], ...(initials.length >= 3 ? [initials] : [])], job };
});

// Technologies from the skills list, plus common aliases
const aliases: Record<string, string[]> = {
  "Spring Boot": ["spring", "springboot"],
  Kubernetes: ["k8s"],
  PostgreSQL: ["postgres"],
  "Apache Kafka": ["kafka"],
  JavaScript: ["js"],
  Microservices: ["microservice"],
  "JSP / Servlet": ["jsp", "servlet", "servlets"],
  "RESTful APIs": ["rest", "api", "apis"],
};
const techs = skills
  .flatMap((g) => g.items)
  .map((item) => ({ item, keywords: [item.toLowerCase(), ...(aliases[item] ?? [])] }));

function normalize(s: string) {
  return ` ${s.toLowerCase().replace(/[^a-z0-9.+#/ ]+/g, " ").replace(/\s+/g, " ")} `;
}

function hits(text: string, keywords: string[]) {
  return keywords.filter((k) => text.includes(` ${k} `)).length;
}

function techEvidence(item: string, keyword: string): string[] {
  const term = keyword === item.toLowerCase() ? item.toLowerCase().split(" ")[0] : keyword;
  const evidence: string[] = [];
  for (const j of experience) {
    const inTech = j.tech.some((t) => t.toLowerCase().includes(term));
    const highlight = j.highlights.find((h) => h.toLowerCase().includes(term));
    if (highlight) evidence.push(`At ${j.company}: ${highlight}`);
    else if (inTech) evidence.push(`Used at ${j.company} (${j.period}).`);
  }
  for (const p of projects) {
    const highlight = p.highlights.find((h) => h.toLowerCase().includes(term));
    if (highlight || p.tech.some((t) => t.toLowerCase().includes(term))) {
      evidence.push(`${p.name}: ${highlight ?? p.summary}`);
    }
  }
  return evidence;
}

function techAnswer(matches: { item: string; keyword: string }[]): Answer {
  const names = matches.map((m) => m.item);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  const perTech = matches.length === 1 ? 3 : 1;
  const evidence = [...new Set(matches.flatMap((m) => techEvidence(m.item, m.keyword).slice(0, perTech)))];
  const verb = names.length === 1 ? "is part" : names.length === 2 ? "are both part" : "are all part";
  return {
    text: `Yes — ${list} ${verb} of ${profile.firstName}'s toolkit.${evidence.length ? `\n\n${bullets(evidence.slice(0, 4))}` : ""}`,
  };
}

const fallback: Answer = {
  text: `I'm not sure about that one — I only know what's on ${profile.firstName}'s resume. Try asking about his experience, skills, projects, education or how to contact him.`,
  actions: contactActions,
};

export function reply(question: string): Answer {
  const text = normalize(question);

  const company = companies.find((c) => hits(text, c.keywords) > 0);
  if (company) return describeJob(company.job);

  let best = { name: "", score: 0 };
  for (const [name, intent] of Object.entries(intents)) {
    const score = hits(text, intent.keywords);
    if (score > best.score) best = { name, score };
  }

  // A named technology wins over generic intents like "does he know / has he used"
  const matched = techs.flatMap((t) => {
    const keyword = t.keywords.find((kw) => text.includes(` ${kw} `));
    return keyword ? [{ item: t.item, keyword }] : [];
  });
  if (matched.length && !["projects", "testing", "contact", "education"].includes(best.name)) return techAnswer(matched);

  if (best.score > 0) return intents[best.name].answer();
  return fallback;
}
