"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type BootCtx = {
  isBooted: boolean;
  markBooted: () => void;
};

const Ctx = createContext<BootCtx>({
  isBooted: true,
  markBooted: () => {},
});

export const useBootStatus = (): BootCtx => useContext(Ctx);

export function BootStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBooted, setIsBooted] = useState(false);
  const markBooted = useCallback(() => setIsBooted(true), []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isBooted) {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("booting");
    } else {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("booting");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("booting");
    };
  }, [isBooted]);

  return (
    <Ctx.Provider value={{ isBooted, markBooted }}>{children}</Ctx.Provider>
  );
}
