"use client";

import { memo } from "react";
import { StarfieldBackground } from "@/components/ui/starfield-background"; // adjust path if needed

const DiscoverHeader = memo(() => {
  return (
    <section className="relative" style={{ marginBottom: 0 }}>
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: "clamp(280px, 45vh, 500px)",
          paddingTop: "72px",
          borderBottom: "1px dashed var(--border-dashed)",
        }}
      >
        {/* position="absolute" scopes the starfield to this container */}
        <StarfieldBackground
          position="absolute"
          count={300}
          speed={0.4}
          starColor="#ffffff"
          twinkle={true}
        />

        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <h1
            className="select-none text-4xl font-bold tracking-[0.35em] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #b0b0b0 40%, #8a8a8a 70%, #a0a0a0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NOTOSPHERE
          </h1>
          <p
            className="select-none font-mono text-xs tracking-[0.15em] sm:text-sm"
            style={{ color: "rgba(180,180,190,0.7)" }}
          >
            Based in{" "}
            <span style={{ color: "rgba(220,220,230,0.9)" }}>Manila, Philippines.</span>
          </p>
        </div>
      </div>
    </section>
  );
});

DiscoverHeader.displayName = "DiscoverHeader";

export default DiscoverHeader;