"use client";

import { Footer } from "@/components/navigation/footer";
import { usePathname } from "next/navigation";

export const FooterWrapper = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return <Footer />;
};
