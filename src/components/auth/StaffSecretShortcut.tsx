"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function StaffSecretShortcut() {
  const router = useRouter();

  useEffect(() => {
    // 1. Keyboard shortcut listener: Ctrl+Shift+A or Cmd+Shift+A, or Ctrl+Shift+S
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key.toLowerCase() === "a" || e.key.toLowerCase() === "s") {
          e.preventDefault();
          router.push("/redaksi");
        }
      }
    };

    // 2. Custom event listener from mobile/touch triple-tap
    const handleOpenPortal = () => {
      router.push("/redaksi");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-staff-secret-portal", handleOpenPortal);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-staff-secret-portal", handleOpenPortal);
    };
  }, [router]);

  return null;
}
