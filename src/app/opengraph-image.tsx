import { ImageResponse } from "next/og";
import { profile } from "@/data/resume";

export const dynamic = "force-static";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pull TTF subsets from Google Fonts at build time; fall back to the default font if offline
async function loadFont(family: string, text: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const [first, ...rest] = profile.name.toUpperCase().split(" ");
  const domain = profile.siteUrl.replace("https://", "");
  const [anton, grotesk, groteskBold] = await Promise.all([
    loadFont("Anton", profile.name.toUpperCase()),
    loadFont("Space+Grotesk", profile.location + domain + profile.tagline),
    loadFont("Space+Grotesk:wght@700", profile.title),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#131313",
          color: "#ffffff",
          fontFamily: "Space Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", padding: "8px 20px", borderRadius: 999, background: "#3cffd0", color: "#000", fontSize: 24 }}>
            {profile.location}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#949494" }}>{domain}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontFamily: anton ? "Anton" : "sans-serif", fontSize: 150, lineHeight: 0.95 }}>
          <span>{first}</span>
          <span style={{ color: "#3cffd0" }}>{rest.join(" ")}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>{profile.title}</div>
          <div style={{ display: "flex", fontSize: 28, color: "#e9e9e9" }}>{profile.tagline}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        anton && { name: "Anton", data: anton, style: "normal" as const, weight: 400 as const },
        grotesk && { name: "Space Grotesk", data: grotesk, style: "normal" as const, weight: 400 as const },
        groteskBold && { name: "Space Grotesk", data: groteskBold, style: "normal" as const, weight: 700 as const },
      ].filter((f) => !!f),
    },
  );
}
