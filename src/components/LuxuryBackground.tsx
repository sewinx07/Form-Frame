"use client";

import { useEffect, useRef } from "react";

function generatePattern(size: number): string {
  const elements: string[] = [];
  const cols = 10;
  const rows = 10;
  const cell = size / cols;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell + cell / 2;
      const y = r * cell + cell / 2;
      const rot = ((r * 25 + c * 35) % 360) - 180;

      /* 8-pointed star on alternating cells */
      if ((r + c) % 2 === 0) {
        const s = cell * 0.28;
        const pts = [
          [x, y - s],
          [x + s * 0.38, y - s * 0.38],
          [x + s, y],
          [x + s * 0.38, y + s * 0.38],
          [x, y + s],
          [x - s * 0.38, y + s * 0.38],
          [x - s, y],
          [x - s * 0.38, y - s * 0.38],
        ];
        elements.push(
          `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke-width="0.5" opacity="0.5"/>`
        );
      }

      /* interlocking diamond */
      const d = cell * 0.15;
      elements.push(
        `<rect x="${x - d}" y="${y - d}" width="${d * 2}" height="${d * 2}" transform="rotate(45 ${x} ${y})" fill="none" stroke-width="0.3" opacity="0.4"/>`
      );

      /* smaller diamond */
      const sd = cell * 0.06;
      elements.push(
        `<rect x="${x - sd}" y="${y - sd}" width="${sd * 2}" height="${sd * 2}" transform="rotate(45 ${x} ${y})" fill="none" stroke-width="0.2" opacity="0.3"/>`
      );

      /* F&F branding micro-text */
      elements.push(
        `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${cell * 0.09}" font-family="serif" font-weight="bold" transform="rotate(${rot} ${x} ${y})" opacity="0.5">F&amp;F</text>`
      );

      /* connecting dots */
      elements.push(
        `<circle cx="${x}" cy="${y}" r="1" opacity="0.2"/>`
      );
    }
  }

  /* diagonal interlace lines */
  for (let i = -cols; i < rows + cols; i++) {
    const y1 = i * cell;
    const x1 = 0;
    const y2 = i * cell + size;
    const x2 = size;
    elements.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="0.1" opacity="0.12"/>`,
      `<line x1="${x1}" y1="${y1 + size}" x2="${x2}" y2="${y2 - size}" stroke-width="0.1" opacity="0.12"/>`
    );
  }

  return elements.join("\n");
}

export function LuxuryBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let lastMove = Date.now();
    let idle = true;

    const update = () => {
      const now = Date.now();
      const sinceMove = now - lastMove;

      const speed = isMobile ? 0.08 : 0.05;
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      if (sinceMove > 2000 && !idle) {
        idle = true;
      }
      if (idle && !prefersReduced) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        currentX += (cx - currentX) * 0.006;
        currentY += (cy - currentY) * 0.006;
        currentX += Math.sin(now * 0.0004) * 8;
        currentY += Math.cos(now * 0.00035) * 8;
      }

      const idleActive = sinceMove > 2000;
      const idlePulse = idleActive
        ? 0.35 + Math.sin(now * 0.0008) * 0.12
        : 1;

      const radius = isMobile ? 130 : 200;
      const bloomExtra = isMobile ? 70 : 120;

      const gradient = `radial-gradient(circle ${radius + bloomExtra}px at ${currentX}px ${currentY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) ${radius * 0.3}px, rgba(0,0,0,0.15) ${radius * 0.65}px, rgba(0,0,0,0.03) ${radius * 0.85}px, rgba(0,0,0,0) ${radius + bloomExtra}px)`;
      spotlight.style.maskImage = gradient;
      spotlight.style.setProperty("-webkit-mask-image", gradient);
      spotlight.style.setProperty("-webkit-mask-repeat", "no-repeat");
      spotlight.style.opacity = String(Math.max(0.2, idlePulse));

      rafRef.current = requestAnimationFrame(update);
    };

    const onMouse = (e: MouseEvent) => {
      idle = false;
      lastMove = Date.now();
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      idle = false;
      lastMove = Date.now();
      targetX = t.clientX;
      targetY = t.clientY;
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const patternSize = 900;
  const patternSvg = generatePattern(patternSize);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${patternSize}" height="${patternSize}" fill="none" stroke="currentColor" color="#fff">${patternSvg}</svg>`
          )}")`,
          backgroundSize: `${patternSize}px ${patternSize}px`,
          opacity: 0.05,
          color: "#ffffff",
        }}
      />

      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${patternSize}" height="${patternSize}" fill="none" stroke="currentColor" color="#D4AF37">${patternSvg}</svg>`
          )}")`,
          backgroundSize: `${patternSize}px ${patternSize}px`,
          maskImage: "none",
          maskRepeat: "no-repeat",
          opacity: 0,
          color: "#D4AF37",
        }}
      />
    </div>
  );
}
