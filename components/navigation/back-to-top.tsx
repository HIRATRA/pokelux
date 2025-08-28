"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ArrowUp } from "lucide-react";

gsap.registerPlugin(ScrollToPlugin);

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      gsap.to(btnRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        display: "block",
      });
    } else {
      gsap.to(btnRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: "power3.in",
        onComplete: () => {
          if (btnRef.current) {
            btnRef.current.style.display = "none";
          }
        },
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: true },
      duration: 1,
      ease: "power2.inOut",
    });
  };

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors z-50"
      style={{ opacity: 0, display: "none", transform: "translateY(50px)" }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
