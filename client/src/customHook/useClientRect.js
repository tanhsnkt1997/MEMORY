import { useState, useCallback, useEffect } from "react";

export const useClientRect = () => {
  const [rect, setRect] = useState({ width: 0, height: 0 });
  const [node, setNode] = useState(null);

  const ref = useCallback((node) => {
    if (node !== null) {
      setNode(node);
      const { width, height } = node.getBoundingClientRect();
      setRect({ width, height });
    }
  }, []);

  useEffect(() => {
    const handle = () => {
      if (node) {
        const { width, height } = node.getBoundingClientRect();
        setRect({ width, height });
      }
    };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [node]);

  return [rect, ref];
};

// export const useClientRect = () => {
//   const [rect, setRect] = useState({ width: 0, height: 0 });
//   const ref = useCallback((node) => {
//     if (node !== null) {
//       const { width, height } = node.getBoundingClientRect();
//       setRect({ width, height });
//     }
//   }, []);
//   return [rect, ref];
// };
