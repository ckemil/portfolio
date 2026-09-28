import { profile } from "@/data/resume";

export default function Footer() {
  return (
    <footer className="border-t border-frame">
      <div className="meta mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-muted sm:flex-row md:px-12">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          Psst — press <kbd className="rounded-[2px] border border-frame px-1.5 text-soft">`</kbd> to open the terminal
        </p>
      </div>
    </footer>
  );
}
