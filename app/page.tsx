"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createFloatingOrbs = () => {
      const orbs = backgroundRef.current?.querySelectorAll(".floating-orb");
      if (orbs) {
        orbs.forEach((orb, index) => {
          gsap.set(orb, {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          });

          gsap.to(orb, {
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.5,
          });

          gsap.to(orb, {
            rotation: 360,
            duration: Math.random() * 20 + 20,
            repeat: -1,
            ease: "none",
          });
        });
      }
    };

    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.7)" }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      );

    // Initialize floating background
    setTimeout(createFloatingOrbs, 500);

    gsap.to(".bg-pulse", {
      scale: 1.1,
      opacity: 0.8,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const handleGoClick = () => {
    setIsLoading(true);

    const tl = gsap.timeline();

    tl.to([titleRef.current, subtitleRef.current, buttonRef.current], {
      opacity: 0,
      y: -30,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.in",
    })
      .to(
        loadingRef.current,
        {
          opacity: 1,
          duration: 0.3,
        },
        "-=0.2"
      )
      .fromTo(
        ".loading-dot",
        {
          scale: 1,
        },
        {
          scale: 1.5,
          duration: 0.4,
          stagger: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut",
        }
      );

    setTimeout(() => {
      window.location.href = "/search";
    }, 2500);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div ref={backgroundRef} className="absolute inset-0">
        {/* Floating orbs */}
        <div className="floating-orb absolute w-32 h-32 rounded-full bg-primary/20 blur-3xl bg-pulse"></div>
        <div className="floating-orb absolute w-40 h-40 rounded-full bg-accent/15 blur-3xl bg-pulse"></div>
        <div className="floating-orb absolute w-24 h-24 rounded-full bg-chart-1/25 blur-3xl bg-pulse"></div>
        <div className="floating-orb absolute w-36 h-36 rounded-full bg-primary/10 blur-3xl bg-pulse"></div>
        <div className="floating-orb absolute w-28 h-28 rounded-full bg-accent/20 blur-3xl bg-pulse"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto px-6">
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent opacity-0"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          PokéLux
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed opacity-0"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Experience the world of Pokémon like never before.
          <br />
          Discover, compare, and collect with luxury and style.
        </p>

        <Button
          ref={buttonRef}
          onClick={handleGoClick}
          disabled={isLoading}
          className="px-12 py-6 text-xl font-semibold bg-primary hover:bg-primary/90 glow-primary rounded-full transition-all duration-300 transform hover:scale-105 opacity-0"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {isLoading ? "Loading..." : "Enter PokéLux"}
        </Button>
      </div>

      {/* Loading Animation */}
      <div
        ref={loadingRef}
        className="absolute inset-0 flex items-center justify-center opacity-0 bg-background/80 backdrop-blur-sm"
      >
        <div className="flex space-x-2">
          <div className="loading-dot w-4 h-4 bg-primary rounded-full"></div>
          <div className="loading-dot w-4 h-4 bg-accent rounded-full"></div>
          <div className="loading-dot w-4 h-4 bg-chart-1 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
