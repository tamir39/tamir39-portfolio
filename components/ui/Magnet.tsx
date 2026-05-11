"use client";

import { useRef, useState, useCallback } from "react";
import { useHoverDevice } from "@/lib/hooks/useHoverDevice";

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate(0px, 0px)");
  const [transition, setTransition] = useState(inactiveTransition);
  const isHoverDevice = useHoverDevice();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      setTransition(activeTransition);
      setTransform(`translate(${dx / strength}px, ${dy / strength}px)`);
    },
    [activeTransition, strength]
  );

  const handleMouseLeave = useCallback(() => {
    setTransition(inactiveTransition);
    setTransform("translate(0px, 0px)");
  }, [inactiveTransition]);

  if (!isHoverDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
        willChange: "transform",
        display: "inline-block",
      }}
    >
      {children}
    </div>
  );
}
