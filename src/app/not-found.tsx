import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-charcoal-900 px-6 text-center">
      <div className="max-w-md">
        <p className="text-[10px] uppercase tracking-[0.3em] text-off-white-muted mb-6">
          Error 404
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-off-white mb-4">
          Out of Frame
        </h1>
        <p className="text-sm text-off-white-muted leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 text-sm uppercase tracking-widest text-off-white border border-off-white/20 hover:bg-off-white hover:text-charcoal-900 transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
