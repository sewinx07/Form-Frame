export function Footer() {
  return (
    <footer className="border-t border-charcoal-700/40 bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-serif text-base tracking-[0.1em] text-off-white">
          Form <span className="text-off-white-dim">&amp;</span> Frame
        </p>
        <p className="text-[9px] uppercase tracking-[0.2em] text-off-white-dim">
          &copy; {new Date().getFullYear()} Form &amp; Frame. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
