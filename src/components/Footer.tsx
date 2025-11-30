import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="px-6">
        <div className="mx-auto max-w-xl">
          <div className="rounded-full border border-emerald-800/20 bg-white text-slate-700 px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm shadow-sm">
            <span className="font-semibold" style={{ color: "#0E6A52" }}>Alma de Luz</span>
            <span className="opacity-40">·</span>
            <Link href="https://instagram.com/almadeluz71" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700">@almadeluz71</Link>
            <span className="opacity-40">·</span>
            <Link href="https://instagram.com/almadeluz.sahumerios" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700">@almadeluz.sahumerios</Link>
            <span className="opacity-40">·</span>
            <a href="mailto:almadeluz@gmail.com" className="hover:text-emerald-700">almadeluz@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
