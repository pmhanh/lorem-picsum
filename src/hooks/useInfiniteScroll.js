import { useEffect, useRef } from "react";

export default function useInfiniteScroll(onLoadMore, disabled = false, rootMargin = "200px") {
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const el = sentinelRef.current;
    if (!el) return;

    // cleanup cũ
    if (observerRef.current) observerRef.current.disconnect();

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { root: null, rootMargin, threshold: 0.1 }
    );

    io.observe(el);
    observerRef.current = io;

    return () => {
      io.disconnect();
    };
  }, [onLoadMore, disabled, rootMargin]);
  return sentinelRef;
}