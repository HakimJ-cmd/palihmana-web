"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

export function SecretTriggerCopyright() {
  const router = useRouter();
  const clickCount = useRef(0);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    clickCount.current += 1;

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      router.push("/redaksi");
      return;
    }

    clickTimeout.current = setTimeout(() => {
      clickCount.current = 0;
    }, 800);
  };

  return (
    <span
      onClick={handleClick}
      className="cursor-default select-none transition-colors duration-200"
      title=""
    >
      © {new Date().getFullYear()} PT Palih Mana Multimedia Nusantara. Hak cipta dilindungi Undang-Undang.
    </span>
  );
}
