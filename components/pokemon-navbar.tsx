"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, Zap, Menu, X } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

export default function PokemonNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );

      gsap.fromTo(
        mobileMenuRef.current.querySelectorAll(".mobile-nav-item"),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [isMobileMenuOpen]);

  const handleLogoHover = () => {
    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  };

  const handleLogoLeave = () => {
    gsap.to(logoRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const navLinks = [
    {
      href: "/search",
      label: "Search",
      icon: Search,
    },
    {
      href: "/comparison",
      label: "Comparison",
      icon: Zap,
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: Heart,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => setIsMobileMenuOpen(false),
      });
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div
                  ref={logoRef}
                  onMouseEnter={handleLogoHover}
                  onMouseLeave={handleLogoLeave}
                  className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  PokéLux
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className={`relative px-4 py-2 rounded-full transition-all duration-200 ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                      }`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                      {link.badge && (
                        <Badge className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                          {link.badge}
                        </Badge>
                      )}
                      {isActive(link.href) && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-primary/10"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          <div
            ref={mobileMenuRef}
            className="fixed top-20 left-4 right-4 bg-card border border-border rounded-lg shadow-xl p-6"
          >
            <div className="space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleMobileMenu}
                  >
                    <Button
                      variant="ghost"
                      className={`mobile-nav-item w-full justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                      }`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="flex-1 text-left">{link.label}</span>
                      {link.badge && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1">
                          {link.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
