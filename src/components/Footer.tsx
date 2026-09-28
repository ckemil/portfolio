import { profile } from "@/data/resume";

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>Built with Next.js & Tailwind CSS</p>
      </div>
    </footer>
  );
}
