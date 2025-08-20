"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateElement = (
      element: HTMLElement,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions
    ) => {
      if (element) {
        element.animate(keyframes, options);
      }
    };

    // Initial page load animation sequence
    setTimeout(() => {
      animateElement(
        titleRef.current!,
        [
          { opacity: 0, transform: "translateY(50px)" },
          { opacity: 1, transform: "translateY(0px)" },
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          fill: "forwards",
        }
      );
    }, 100);

    setTimeout(() => {
      animateElement(
        subtitleRef.current!,
        [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "translateY(0px)" },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          fill: "forwards",
        }
      );
    }, 600);

    setTimeout(() => {
      animateElement(
        buttonRef.current!,
        [
          { opacity: 0, transform: "scale(0.8)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        {
          duration: 600,
          easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          fill: "forwards",
        }
      );
    }, 900);
  }, []);

  const handleGoClick = () => {
    setIsLoading(true);

    const animateOut = () => {
      const elements = [
        titleRef.current,
        subtitleRef.current,
        buttonRef.current,
      ].filter(Boolean);
      elements.forEach((element) => {
        element?.animate(
          [
            { opacity: 1, transform: "translateY(0px)" },
            { opacity: 0, transform: "translateY(-30px)" },
          ],
          {
            duration: 500,
            easing: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
            fill: "forwards",
          }
        );
      });
    };

    const showLoading = () => {
      loadingRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        fill: "forwards",
      });

      // Animate loading dots
      const dots = document.querySelectorAll(".loading-dot");
      dots.forEach((dot, index) => {
        setTimeout(() => {
          const animation = dot.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(1.5)" },
              { transform: "scale(1)" },
            ],
            {
              duration: 400,
              easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }
          );

          // Repeat animation 3 times
          let repeatCount = 0;
          animation.addEventListener("finish", () => {
            if (repeatCount < 2) {
              repeatCount++;
              dot.animate(
                [
                  { transform: "scale(1)" },
                  { transform: "scale(1.5)" },
                  { transform: "scale(1)" },
                ],
                {
                  duration: 400,
                  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }
              );
            }
          });
        }, index * 100);
      });
    };

    // Execute animation sequence
    animateOut();
    setTimeout(showLoading, 500);
    setTimeout(() => {
      window.location.href = "/search";
    }, 2000);
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
