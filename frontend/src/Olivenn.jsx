import React, { useEffect, useRef, useState } from "react";
import Lightfall from "./Lightfall.jsx";

/* ------------------------------------------------------------------ */
/*  Design tokens (from Figma: Group Profiling 1-3)                    */
/* ------------------------------------------------------------------ */
const PINK = "#ff0077"; // main text colour
const PINK_GLINT = "#ffb3d6"; // lighter pink used by the shimmer
const BG = "#0d1a15"; // page background

const NAME = "Jahn Olivenn Esmarin";

// The three frames: each one is the same text in a different typeface.
const FRAMES = [
    { id: "frame-1", font: "'Sekuya', sans-serif" },
    { id: "frame-2", font: "'Sarina', cursive" },
    { id: "frame-3", font: "'Reenie Beanie', cursive" },
];

const SPIN_MS = 5000;   // rotate for 5 seconds
const FRAME_MS = 250;   // each font shows for 0.4s (was 1800)
const FINAL_FRAME = 0;  // settle on Sekuya

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=NATS&family=Reenie+Beanie&family=Sarina&family=Sekuya&display=swap');
@keyframes olivenn-shimmer {
  from { background-position: 100% 0; }
  to   { background-position: 0% 0; }
}`;

function ShimmeringText({ text, color, shimmeringColor, duration = 1.2, className, style }) {
    return (
        <span
            className={className}
            style={{
                ...style,
                color: "transparent",
                backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} 40%, ${shimmeringColor} 50%, ${color} 60%, ${color} 100%)`,
                backgroundSize: "250% 100%",
                backgroundRepeat: "no-repeat",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `olivenn-shimmer ${duration}s linear infinite`,
            }}
        >
            {text}
        </span>
    );
}

export default function Olivenn({ onBackHome }) {
    const heroRef = useRef(null);
    const [frame, setFrame] = useState(0);
    // true while the landing page is (mostly) on screen, i.e. the user has not scrolled down
    const [onLanding, setOnLanding] = useState(true);

    const handleBack = (e) => {
        if (onBackHome) {
            e.preventDefault();
            onBackHome();
        }
    };

    // Track whether the user is still on the landing screen.
    useEffect(() => {
        const node = heroRef.current;
        if (!node) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => setOnLanding(entry.intersectionRatio >= 0.5),
            { threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (!onLanding || reduce) return undefined;

        // swap to the next font every FRAME_MS
        const cycle = setInterval(() => {
            setFrame((current) => (current + 1) % FRAMES.length);
        }, FRAME_MS);

        // after SPIN_MS, stop swapping and lock onto the final font
        const stop = setTimeout(() => {
            clearInterval(cycle);
            setFrame(FINAL_FRAME);
        }, SPIN_MS);

        return () => {
            clearInterval(cycle);
            clearTimeout(stop);
        };
    }, [onLanding]);

    const titleStyle = { fontFamily: FRAMES[frame].font, color: PINK };
    const titleClass =
        "whitespace-nowrap text-center leading-[normal] text-[5.5vw]";

    return (
        <section
            ref={heroRef}
            className="relative h-dvh w-full overflow-hidden"
            style={{ backgroundColor: BG, color: PINK }}
        >
            <style>{FONTS_CSS}</style>

            {/* Background animation: Lightfall, in lighter shades of the title pink */}
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
                <Lightfall
                    colors={["#ffc2dd", "#ff7ab8", PINK]}
                    backgroundColor="#9CB080"
                    backgroundGlow={0.12}
                    headGlow={0.3}
                    glow={0.9}
                    bloom={0.35}
                    opacity={0.7}
                    speed={0.3}
                    density={1.6}
                    twinkle={0.4}
                    zoom={3}
                />
            </div>

            {/* Top bar */}
            <header
                className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-[1.67vw] pt-[1.875vw] leading-[1.15] text-[clamp(8px,1.458vw,28px)]"
                style={{ fontFamily: "'Sekuya', sans-serif" }}
            >
                <a
                    href="/"
                    onClick={handleBack}
                    className="rounded-sm outline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2"
                    style={{ color: "#618764", outlineColor: "#618764" }}
                >
                    [ BACK TO DECEMBER ]
                </a>
                <span style={{ color: "#618764"}}>[ NOVEMBER 2026 ]</span>
            </header>

            {/* Main name, pinned to the bottom edge */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex h-[6.8vw] items-center justify-center px-[1.67vw] mb-[1.25vw]">
                <h1 className="m-0 font-normal">
                    {onLanding ? (
                        <ShimmeringText
                            text={NAME}
                            color={PINK}
                            shimmeringColor={PINK_GLINT}
                            duration={4.2}
                            className={titleClass}
                            style={titleStyle}
                        />
                    ) : (
                        <span className={titleClass} style={titleStyle}>
                            {NAME}
                        </span>
                    )}
                </h1>
            </div>
        </section>
    );
}
