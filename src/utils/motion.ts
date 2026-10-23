import { useCallback, useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Counts from 0 up to `target` with an ease-out, restarting whenever target changes.
// Calls onDone when it lands (used to trigger the slam).
export function useCountUp(
  target: number,
  duration = 900,
  onDone?: () => void,
) {
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
      else onDoneRef.current?.();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

// FLIP reorder animation: call capture() right before the state change that reorders,
// then play() in a layout effect after it. Elements slide from their old spot to the new.
// Table rows animate their cells, since transforms on <tr> are unreliable across browsers.
export function useFlip() {
  const nodes = useRef(new Map<string, HTMLElement>());
  const refCallbacks = useRef(
    new Map<string, (el: HTMLElement | null) => void>(),
  );
  const first = useRef<Map<string, number> | null>(null);

  const register = useCallback((key: string) => {
    let cb = refCallbacks.current.get(key);
    if (!cb) {
      cb = (el) => {
        if (el) nodes.current.set(key, el);
        else nodes.current.delete(key);
      };
      refCallbacks.current.set(key, cb);
    }
    return cb;
  }, []);

  const capture = useCallback(() => {
    if (prefersReducedMotion()) return;
    first.current = new Map(
      Array.from(nodes.current, ([key, el]) => [
        key,
        el.getBoundingClientRect().top,
      ]),
    );
  }, []);

  const play = useCallback(() => {
    const before = first.current;
    first.current = null;
    if (!before) return;
    nodes.current.forEach((el, key) => {
      const prevTop = before.get(key);
      if (prevTop === undefined) return;
      const delta = prevTop - el.getBoundingClientRect().top;
      if (Math.abs(delta) < 1) return;
      const targets = el.tagName === "TR" ? Array.from(el.children) : [el];
      targets.forEach((t) =>
        t.animate(
          [{ transform: `translateY(${delta}px)` }, { transform: "none" }],
          { duration: 600, easing: "cubic-bezier(.2,.9,.3,1.12)" },
        ),
      );
    });
  }, []);

  return { register, capture, play };
}

// True once the element has scrolled into view (and stays true). Reduced motion,
// or a browser without IntersectionObserver, shows it straight away.
export function useInViewOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (inView || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return { ref, inView };
}
