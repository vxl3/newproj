"use client";
import { useEffect } from "react";

export default function ProvidersClient() {
  useEffect(() => {
    // Initialize card entrance animations on scroll
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all card entrance elements
    document.querySelectorAll(".card-entrance").forEach((el) => {
      (el as HTMLElement).style.animationPlayState = "paused";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
