// Live data for the Tech Radar section. Every source here is public, needs no API key
// and allows browser (CORS) requests, so it works on a static export.

export const NEWS_COUNT = 5;

export type Release = { id: string; label: string; version: string; date: number; link?: string };
export type JavaInfo = { latest: Release; lts: Release; next: { version: string; expected: number } };
export type NewsItem = {
  id: string;
  title: string;
  url: string;
  domain: string;
  points: number;
  comments: number;
  hnUrl: string;
  time: number;
};

export const STACK = [
  { id: "spring-boot", label: "Spring Boot" },
  { id: "spring-framework", label: "Spring Framework" },
  { id: "hibernate-orm", label: "Hibernate ORM" },
  { id: "apache-kafka", label: "Apache Kafka" },
  { id: "kubernetes", label: "Kubernetes" },
  { id: "docker-engine", label: "Docker Engine" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "nginx", label: "NGINX" },
];

type EolRelease = {
  name: string;
  releaseDate: string;
  isLts?: boolean;
  latest?: { name: string; date: string; link?: string };
};

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json() as Promise<T>;
}

async function eolReleases(product: string, signal?: AbortSignal) {
  const data = await getJson<{ result: { releases: EolRelease[] } }>(
    `https://endoflife.date/api/v1/products/${product}/`,
    signal,
  );
  return data.result.releases;
}

export async function fetchJava(signal?: AbortSignal): Promise<JavaInfo> {
  const releases = await eolReleases("oracle-jdk", signal);
  const toRelease = (r: EolRelease): Release => ({
    id: r.name,
    label: `JDK ${r.name}`,
    version: r.name,
    date: Date.parse(r.releaseDate),
    link: r.latest?.link,
  });
  const latest = releases[0];
  const lts = releases.find((r) => r.isLts) ?? latest;
  // Java ships a feature release every six months (March and September)
  const expected = new Date(latest.releaseDate);
  expected.setMonth(expected.getMonth() + 6);
  return {
    latest: toRelease(latest),
    lts: toRelease(lts),
    next: { version: String(Number(latest.name) + 1), expected: expected.getTime() },
  };
}

export async function fetchStack(signal?: AbortSignal): Promise<Release[]> {
  const results = await Promise.allSettled(
    STACK.map(async ({ id, label }) => {
      const [newest] = await eolReleases(id, signal);
      const latest = newest.latest ?? { name: newest.name, date: newest.releaseDate };
      return { id, label, version: latest.name, date: Date.parse(latest.date), link: latest.link } satisfies Release;
    }),
  );
  const releases = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  if (!releases.length) throw new Error("No release data");
  return releases.sort((a, b) => b.date - a.date);
}

type HnHit = {
  objectID: string;
  title?: string;
  url?: string;
  points?: number;
  num_comments?: number;
  created_at_i: number;
};

function toNews(h: HnHit): NewsItem {
  const hnUrl = `https://news.ycombinator.com/item?id=${h.objectID}`;
  const url = h.url || hnUrl;
  let domain = "news.ycombinator.com";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* keep the HN domain */
  }
  return {
    id: h.objectID,
    title: h.title ?? "",
    url,
    domain,
    points: h.points ?? 0,
    comments: h.num_comments ?? 0,
    hnUrl,
    time: h.created_at_i * 1000,
  };
}

const hnSearch = (endpoint: "search" | "search_by_date", params: Record<string, string>, signal?: AbortSignal) =>
  getJson<{ hits: HnHit[] }>(`https://hn.algolia.com/api/v1/${endpoint}?${new URLSearchParams(params)}`, signal).then(
    (d) => d.hits,
  );

// "java" also prefix-matches "JavaScript", so titles are re-checked with word boundaries
const JAVA_TITLE = /\b(java|jdk|jvm|openjdk|spring boot|graalvm|kotlin|jakarta ee|quarkus|micronaut|hibernate)\b/i;

export async function fetchJavaNews(signal?: AbortSignal): Promise<NewsItem[]> {
  const queries = ["java", "jdk", "jvm", "spring boot", "openjdk", "graalvm"];
  const pages = await Promise.all(
    queries.map((query) =>
      hnSearch(
        "search_by_date",
        { query, tags: "story", hitsPerPage: "40", restrictSearchableAttributes: "title", typoTolerance: "false" },
        signal,
      ),
    ),
  );
  const unique = new Map<string, HnHit>();
  for (const h of pages.flat()) if (h.title && JAVA_TITLE.test(h.title)) unique.set(h.objectID, h);
  return [...unique.values()]
    .filter((h) => (h.points ?? 0) >= 2)
    .sort((a, b) => b.created_at_i - a.created_at_i)
    .slice(0, NEWS_COUNT)
    .map(toNews);
}

export async function fetchTopTech(signal?: AbortSignal): Promise<NewsItem[]> {
  const hits = await hnSearch("search", { tags: "front_page", hitsPerPage: "30" }, signal);
  return hits
    .filter((h) => h.title)
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
    .slice(0, NEWS_COUNT)
    .map(toNews);
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 864e5],
  ["month", 30 * 864e5],
  ["week", 7 * 864e5],
  ["day", 864e5],
  ["hour", 36e5],
  ["minute", 6e4],
];

export function relativeTime(time: number, now: number) {
  const diff = time - now;
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return "just now";
}

export const formatDate = (time: number) =>
  new Date(time).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
