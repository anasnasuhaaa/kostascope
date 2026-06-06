"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: "small" | "medium";
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  distance = "medium",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const translateClass =
    distance === "small" ? "translate-y-3" : "translate-y-6";

  return (
    <div
      ref={elementRef}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={[
        "transition-all duration-700 ease-out",
        "motion-reduce:transform-none motion-reduce:transition-none",
        isVisible
          ? "translate-y-0 opacity-100"
          : `${translateClass} opacity-0`,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}