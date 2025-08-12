"use client";

import { useEffect, useState, RefObject } from 'react';

interface UseElementVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useElementVisibility = (
  elementRef: RefObject<Element | HTMLElement | null>,
  options: UseElementVisibilityOptions = {}
): boolean => {
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0, rootMargin = '0px' } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, rootMargin]);

  return isVisible;
};