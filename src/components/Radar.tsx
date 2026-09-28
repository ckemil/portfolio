"use client";

import { useInView } from "framer-motion";
import { ArrowUpRight, Coffee, MessageSquare, RefreshCw, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchJava,
  fetchJavaNews,
  fetchStack,
  fetchTopTech,
  formatDate,
  relativeTime,
  type JavaInfo,
  type NewsItem,
  type Release,
} from "@/lib/radar";
import Reveal from "./Reveal";
import Section from "./Section";

type Tab = "java" | "tech";
type Loadable<T> = { data: T | null; error: boolean };

const REFRESH_MS = 10 * 60 * 1000;
const NEW_MS = 14 * 864e5;
const empty = { data: null, error: false };
const settle = <T,>(r: PromiseSettledResult<T>, prev: Loadable<T>): Loadable<T> =>
  r.status === "fulfilled" ? { data: r.value, error: false } : { data: prev.data, error: !prev.data };

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[4px] bg-slate ${className}`} />;
}

function Failed({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="kicker flex flex-col items-center gap-3 py-10 text-center opacity-80">
      <TriangleAlert className="h-5 w-5" />
      Couldn&apos;t reach the live source.
      <button type="button" onClick={onRetry} className="btn btn-secondary">
        Try again
      </button>
    </div>
  );
}

export default function Radar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "300px" });

  const [java, setJava] = useState<Loadable<JavaInfo>>(empty);
  const [stack, setStack] = useState<Loadable<Release[]>>(empty);
  const [news, setNews] = useState<Record<Tab, Loadable<NewsItem[]>>>({ java: empty, tech: empty });
  const [tab, setTab] = useState<Tab>("java");
  const [updatedAt, setUpdatedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    const [j, s, jn, tt] = await Promise.allSettled([
      fetchJava(signal),
      fetchStack(signal),
      fetchJavaNews(signal),
      fetchTopTech(signal),
    ]);
    if (signal?.aborted) return;
    setJava((prev) => settle(j, prev));
    setStack((prev) => settle(s, prev));
    setNews((prev) => ({ java: settle(jn, prev.java), tech: settle(tt, prev.tech) }));
    const t = Date.now();
    setUpdatedAt(t);
    setNow(t);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const ac = new AbortController();
    // load() only sets state after its fetches resolve, never synchronously
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(ac.signal);
    const refresh = setInterval(() => document.visibilityState === "visible" && load(ac.signal), REFRESH_MS);
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      ac.abort();
      clearInterval(refresh);
      clearInterval(tick);
    };
  }, [inView, load]);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const items = news[tab];

  return (
    <Section
      id="radar"
      eyebrow="Live"
      title={
        <>
          Tech <span className="text-mint">radar</span>.
        </>
      }
    >
      <div ref={ref} className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="kicker inline-flex items-center gap-2 text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          Pulled live
          {updatedAt > 0 && <span className="hidden sm:inline">· updated {relativeTime(updatedAt, now)}</span>}
        </p>
        <button type="button" onClick={refresh} disabled={refreshing || !inView} className="btn btn-outline">
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        {/* Java release tracker — the mint spotlight tile */}
        <Reveal className="rounded-[24px] bg-mint p-8 text-black">
          <p className="kicker inline-flex items-center gap-2">
            <Coffee className="h-4 w-4" /> Latest Java
          </p>
          {java.error ? (
            <Failed onRetry={refresh} />
          ) : !java.data ? (
            <div className="mt-4 space-y-4">
              <Skeleton className="h-16 w-44 bg-black/10" />
              <Skeleton className="h-4 w-48 bg-black/10" />
              <Skeleton className="mt-8 h-16 w-full bg-black/10" />
            </div>
          ) : (
            (() => {
              const { latest, lts, next } = java.data;
              const span = next.expected - latest.date;
              const progress = Math.min(Math.max((now - latest.date) / span, 0), 1);
              return (
                <>
                  <a
                    href={latest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 inline-flex items-start gap-2"
                  >
                    <span className="display text-[clamp(3.75rem,7vw,6rem)]">JDK {latest.version}</span>
                    <ArrowUpRight className="mt-2 h-6 w-6" />
                  </a>
                  <p className="meta mt-3">
                    Released {formatDate(latest.date)} · {relativeTime(latest.date, now)}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-black/20 pt-5">
                    <span className="kicker">Current LTS</span>
                    <a href={lts.link} target="_blank" rel="noopener noreferrer" className="font-bold">
                      JDK {lts.version} <span className="font-medium opacity-60">· {formatDate(lts.date)}</span>
                    </a>
                  </div>

                  <div className="mt-5 border-t border-black/20 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="kicker">Next up</span>
                      <span className="font-bold">
                        JDK {next.version}{" "}
                        <span className="font-medium opacity-60">
                          · {new Date(next.expected).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </span>
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-[2px] bg-black/15">
                      <div
                        className="h-full bg-black transition-[width] duration-1000"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <p className="meta mt-2 opacity-70">
                      In development · GA {relativeTime(next.expected, now)} · six-month cadence
                    </p>
                  </div>
                </>
              );
            })()
          )}
        </Reveal>

        {/* Stack releases */}
        <Reveal delay={0.06} className="tile p-6 sm:p-8">
          <p className="kicker mb-5 text-mint">Latest releases in my stack</p>
          {stack.error ? (
            <Failed onRetry={refresh} />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {!stack.data
                ? Array.from({ length: 9 }, (_, i) => <Skeleton key={i} className="h-[100px] rounded-[20px]" />)
                : stack.data.map((r) => {
                    const fresh = now - r.date < NEW_MS;
                    return (
                      <li key={r.id}>
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group block h-full rounded-[20px] border p-4 ${fresh ? "border-mint" : "border-frame"}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="meta text-muted">{r.label}</p>
                            {fresh && <span className="pill bg-mint px-2 py-0.5 text-[10px] text-black">New</span>}
                          </div>
                          <p className="mt-2 text-xl font-bold group-hover:text-link">{r.version}</p>
                          <p className="meta mt-2 text-muted">{relativeTime(r.date, now)}</p>
                        </a>
                      </li>
                    );
                  })}
            </ul>
          )}
        </Reveal>
      </div>

      {/* News — StoryStream timeline */}
      <Reveal delay={0.1} className="tile mt-4 p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" className="flex gap-6">
            {(
              [
                ["java", "Java & JVM"],
                ["tech", "Top in tech"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`kicker min-h-11 transition-colors ${
                  tab === id ? "text-foreground shadow-[inset_0_-1px_0_0_var(--mint)]" : "text-muted hover:text-link"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="meta text-muted">via Hacker News</span>
        </div>

        {items.error ? (
          <Failed onRetry={refresh} />
        ) : (
          <ol className="space-y-3 border-l border-dashed border-uv-rule pl-5 sm:ml-32 sm:pl-6">
            {!items.data
              ? Array.from({ length: 6 }, (_, i) => (
                  <li key={i} className="space-y-2 py-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </li>
                ))
              : items.data.map((n) => (
                  <li key={n.id} className="relative">
                    <span aria-hidden className="absolute top-5 -left-[25px] h-2 w-2 rounded-full bg-white sm:-left-[29px]" />
                    <p className="meta mb-1.5 text-muted sm:absolute sm:top-[18px] sm:-left-40 sm:mb-0 sm:w-28 sm:text-right">
                      {relativeTime(n.time, now)}
                    </p>
                    <div className="tile-quiet p-4 sm:p-5">
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg leading-[1.2] font-bold"
                      >
                        {n.title}
                      </a>
                      <p className="meta mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
                        <span className="truncate text-mint">{n.domain}</span>
                        <span>▲ {n.points}</span>
                        <a href={n.hnUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {n.comments}
                        </a>
                      </p>
                    </div>
                  </li>
                ))}
            {items.data?.length === 0 && <li className="kicker py-8 text-muted">Nothing new right now.</li>}
          </ol>
        )}
      </Reveal>
    </Section>
  );
}
