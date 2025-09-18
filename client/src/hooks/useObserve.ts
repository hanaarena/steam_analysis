import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * A custom hook to observe an element's intersection with the viewport.
 * @param callback 
 * @param isLoading [boolean=false] avoid multiple trigger 
 * @returns A ref related to the element
 */
export function useIntersectionObserver<T extends HTMLElement>(
  callback: () => void,
  isLoading = false
): RefObject<T | null>  {
  const eleRef = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!eleRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading) {
            callback();
          }
        });
      },
      {
        root: null,
        rootMargin: "5px",
        threshold: 1.0,
      }
    );

    observerRef.current.observe(eleRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, isLoading]);

  return eleRef;
};
