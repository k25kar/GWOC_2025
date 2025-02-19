import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface TextAnimateProps {
  text: string;
  className?: string;
  shouldAnimate?: boolean;
}

const TextAnimate: React.FC<TextAnimateProps> = ({ text, className, shouldAnimate = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate) return; // Skip animation if not allowed
    const words = containerRef.current?.querySelectorAll(".word");
    if (words) {
      gsap.fromTo(
        words,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [text, shouldAnimate]);

  // Wrap each word for a sliding effect
  const wordSpans = text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden">
      <span className="word inline-block">{word}&nbsp;</span>
    </span>
  ));

  return <div ref={containerRef} className={className}>{wordSpans}</div>;
};

export default TextAnimate;
