"use client";

import type React from "react";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Définis les routes exclues
  const excludedPaths = ["/favorites", "/comparison", "/search"];

  useEffect(() => {
    // Si le pathname fait partie des exceptions, on ne lance pas l’animation
    if (excludedPaths.includes(pathname)) {
      if (containerRef.current) {
        gsap.set(containerRef.current, { opacity: 1 });
      }
      return;
    }
    if (overlayRef.current && containerRef.current) {
      gsap.set(overlayRef.current, { x: "100%" });
      gsap.set(containerRef.current, { opacity: 0 });

      const tl = gsap.timeline();

      // Slide overlay in from right
      tl.to(overlayRef.current, {
        x: "0%",
        duration: 0.4,
        ease: "power2.inOut",
      })
        // Fade in content
        .to(
          containerRef.current,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.2"
        )
        // Slide overlay out to left
        .to(
          overlayRef.current,
          {
            x: "-100%",
            duration: 0.4,
            ease: "power2.inOut",
          },
          "-=0.1"
        );
    }
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 pointer-events-none"
        style={{ transform: "translateX(100%)" }}
      />

      <div ref={containerRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  );
}
