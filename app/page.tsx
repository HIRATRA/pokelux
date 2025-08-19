"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial page load animation
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );
  }, []);

  const handleGoClick = () => {
    setIsLoading(true);

    // GSAP loading animation
    const tl = gsap.timeline();

    // Fade out current content
    tl.to([titleRef.current, subtitleRef.current, buttonRef.current], {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: "power2.in",
    })
      // Show loading animation
      .to(loadingRef.current, {
        opacity: 1,
        duration: 0.3,
      })
      // Animate loading elements
      .to(".loading-dot", {
        scale: 1.5,
        duration: 0.4,
        stagger: 0.1,
        repeat: 3,
        yoyo: true,
        ease: "power2.inOut",
      })
      // Redirect to main site
      .call(() => {
        window.location.href = "/search";
      });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-accent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-chart-1 blur-3xl opacity-20"></div>
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto px-6">
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          PokéLux
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed"
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
          className="px-12 py-6 text-xl font-semibold bg-primary hover:bg-primary/90 glow-primary rounded-full transition-all duration-300 transform hover:scale-105"
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
