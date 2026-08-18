import { useEffect, useRef, useState } from "react";

const useCanvasVisibility = (rootMargin = "240px") => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      setHasEntered(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { containerRef, isVisible, shouldRender: hasEntered };
};

export default useCanvasVisibility;
