"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-charcoal-900 px-6 text-center">
      <div className="max-w-md">
        <p className="text-[10px] uppercase tracking-[0.3em] text-off-white-muted mb-6">
          System Error
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-off-white mb-4">
          Something Broke
        </h1>
        <p className="text-sm text-off-white-muted leading-relaxed mb-10">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="inline-block px-8 py-3 text-sm uppercase tracking-widest text-off-white border border-off-white/20 hover:bg-off-white hover:text-charcoal-900 transition-all duration-300 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
