import { useState, useEffect } from "react";

export default function useMedia(queries, values, defaultValue) {
  /* The viewport matches*/
  const match = () => values[queries.findIndex((q) => matchMedia(q).matches)] || defaultValue;
  const [value, set] = useState(match);
  useEffect(() => {
    const handle = () => set(match);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return value;
}
