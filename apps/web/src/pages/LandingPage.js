import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}
/* ── Magnetic Element Wrapper ──────────────────────── */
const Magnetic = ({ children }) => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const onMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            gsap.to(el, {
                x: x * 0.28,
                y: y * 0.28,
                duration: 0.3,
                ease: "power2.out",
            });
        };
        const onMouseLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)",
            });
        };
        el.addEventListener("mousemove", onMouseMove);
        el.addEventListener("mouseleave", onMouseLeave);
        return () => {
            el.removeEventListener("mousemove", onMouseMove);
            el.removeEventListener("mouseleave", onMouseLeave);
        };
    }, []);
    return React.cloneElement(children, { ref });
};
/* ── Floating Particles Canvas ──────────────────────── */
const ParticleField = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        let animId;
        const dpr = window.devicePixelRatio || 1;
        const resize = () => {
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener("resize", resize);
        const dots = [];
        for (let i = 0; i < 45; i++) {
            dots.push({
                x: Math.random() * canvas.offsetWidth,
                y: Math.random() * canvas.offsetHeight,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                r: Math.random() * 1.5 + 0.5,
                o: Math.random() * 0.3 + 0.1,
            });
        }
        const draw = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            // Draw background noise/glow
            dots.forEach((d) => {
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0 || d.x > canvas.offsetWidth)
                    d.vx *= -1;
                if (d.y < 0 || d.y > canvas.offsetHeight)
                    d.vy *= -1;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(224, 247, 250, ${d.o})`; // Cyan particles
                ctx.fill();
            });
            // Subtle connecting lines
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(224, 247, 250, ${0.04 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);
    return _jsx("canvas", { ref: canvasRef, className: "absolute inset-0 w-full h-full pointer-events-none" });
};
/* ── Interactive Showcase Panel ─────────────────────── */
const ShowcaseSection = () => {
    const [activeTab, setActiveTab] = useState(0);
    const panelRef = useRef(null);
    const tabs = [
        {
            title: "Realtime Streams",
            desc: "Instantly ingest and visualize live websocket payloads and latency spikes.",
            badge: "LIVE TRAFFIC",
            render: () => (_jsxs("div", { className: "w-full h-full flex flex-col justify-between p-6 bg-brand-surface border border-white/5 rounded-2xl relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-radial-glow opacity-30" }), _jsxs("div", { className: "flex justify-between items-center z-10", children: [_jsx("span", { className: "text-[10px] tracking-widest uppercase text-brand-primary font-mono", children: "// PORTAL STREAMS" }), _jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" })] }), _jsx("div", { className: "my-auto space-y-3 z-10", children: [92, 42, 118, 64].map((latency, idx) => (_jsxs("div", { className: "flex justify-between items-center border-b border-white/5 pb-2", children: [_jsx("span", { className: "text-xs font-mono text-white/50", children: "POST /api/v1/auth/session" }), _jsxs("span", { className: `text-xs font-mono ${latency > 100 ? "text-brand-primary" : "text-brand-secondary"}`, children: [latency, "ms"] })] }, idx))) }), _jsx("div", { className: "text-[9px] uppercase tracking-widest text-white/30 font-mono z-10", children: "active ws listeners: 2,401/sec" })] })),
        },
        {
            title: "Distributed Maps",
            desc: "Trace network topology automatically and detect bottlenecks on map nodes.",
            badge: "SERVICE MAP",
            render: () => (_jsxs("div", { className: "w-full h-full flex flex-col justify-between p-6 bg-brand-surface border border-white/5 rounded-2xl relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-radial-glow-cyan opacity-20" }), _jsxs("div", { className: "flex justify-between items-center z-10", children: [_jsx("span", { className: "text-[10px] tracking-widest uppercase text-brand-secondary font-mono", children: "// SERVICE TOPOLOGY" }), _jsx("span", { className: "text-[9px] font-mono text-white/40", children: "3 ACTIVE EDGES" })] }), _jsxs("div", { className: "my-auto flex justify-around items-center z-10 relative h-24", children: [_jsx("div", { className: "h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-brand-void text-[9px] font-mono text-white/80", children: "Gateway" }), _jsx("div", { className: "h-1 text-white/10 w-12 relative overflow-hidden", children: _jsx("div", { className: "absolute top-0 bottom-0 left-0 w-2 bg-brand-secondary animate-[ping_1.5s_infinite]" }) }), _jsx("div", { className: "h-12 w-12 rounded-full border border-brand-primary/30 flex items-center justify-center bg-brand-void text-[9px] font-mono text-brand-primary", children: "AuthSvc" }), _jsx("div", { className: "h-1 text-white/10 w-12 relative overflow-hidden", children: _jsx("div", { className: "absolute top-0 bottom-0 left-0 w-2 bg-white/40 animate-[ping_2s_infinite]" }) }), _jsx("div", { className: "h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-brand-void text-[9px] font-mono text-white/80", children: "DB" })] }), _jsx("div", { className: "text-[9px] uppercase tracking-widest text-white/30 font-mono z-10", children: "status: system healthy" })] })),
        },
        {
            title: "Trace Waterfalls",
            desc: "Reconstruct client calls across databases and microservices down to milliseconds.",
            badge: "TRACE EXPLORER",
            render: () => (_jsxs("div", { className: "w-full h-full flex flex-col justify-between p-6 bg-brand-surface border border-white/5 rounded-2xl relative overflow-hidden", children: [_jsxs("div", { className: "flex justify-between items-center z-10", children: [_jsx("span", { className: "text-[10px] tracking-widest uppercase text-white/40 font-mono", children: "// DISTRIBUTED WATERFALL" }), _jsx("span", { className: "text-[9px] font-mono text-brand-primary", children: "12ms avg" })] }), _jsx("div", { className: "my-auto space-y-2.5 z-10 w-full", children: [
                            { label: "gateway", w: "w-full", color: "bg-white/40" },
                            { label: "auth-verify", w: "w-3/4 ml-[10%]", color: "bg-brand-secondary/80" },
                            { label: "db-query", w: "w-1/4 ml-[75%]", color: "bg-brand-primary" },
                        ].map((t, idx) => (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "flex justify-between text-[9px] font-mono text-white/30", children: _jsx("span", { children: t.label }) }), _jsx("div", { className: "h-1.5 w-full bg-white/5 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full ${t.w} ${t.color}` }) })] }, idx))) }), _jsx("div", { className: "text-[9px] uppercase tracking-widest text-white/30 font-mono z-10", children: "span id: tr_01j09f48h" })] })),
        },
    ];
    useEffect(() => {
        // Fade animation on active panel change
        gsap.fromTo(panelRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }, [activeTab]);
    return (_jsxs("div", { className: "grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("span", { className: "text-[10px] tracking-[0.3em] text-brand-primary uppercase font-mono font-bold block", children: "// DESIGNED FOR PRECISION" }), _jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight", children: "A sleek approach to telemetry." }), _jsx("div", { className: "space-y-3 pt-4", children: tabs.map((tab, idx) => (_jsxs("button", { onClick: () => setActiveTab(idx), className: `w-full text-left p-5 rounded-xl border transition-all duration-300 block relative overflow-hidden ${activeTab === idx
                                ? "border-brand-primary bg-brand-surface/80 shadow-[0_0_30px_rgba(255,107,53,0.05)]"
                                : "border-white/5 hover:border-white/10 hover:bg-white/[0.01]"}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-[9px] font-mono tracking-widest text-white/40", children: tab.badge }), activeTab === idx && _jsx("span", { className: "h-1 w-1 rounded-full bg-brand-primary" })] }), _jsx("h3", { className: "text-sm font-semibold text-white", children: tab.title }), _jsx("p", { className: "text-xs text-brand-muted mt-1.5 leading-relaxed", children: tab.desc })] }, idx))) })] }), _jsx("div", { ref: panelRef, className: "h-72 sm:h-80 w-full", children: tabs[activeTab].render() })] }));
};
/* ── Main Landing Page ──────────────────────────────── */
export const LandingPage = () => {
    const headerRef = useRef(null);
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const showcaseRef = useRef(null);
    const sdkRef = useRef(null);
    const ctaRef = useRef(null);
    useEffect(() => {
        // Header Fade In
        gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 });
        // Hero Text Splitting and Reveals
        const heroTitleWords = heroRef.current?.querySelectorAll(".hero-reveal-word");
        if (heroTitleWords && heroTitleWords.length > 0) {
            gsap.fromTo(heroTitleWords, { opacity: 0, y: 35 }, {
                opacity: 1,
                y: 0,
                duration: 0.85,
                stagger: 0.08,
                ease: "power3.out",
                delay: 0.3,
            });
        }
        // Hero Subtext and CTAs
        const heroFadeContent = heroRef.current?.querySelector(".hero-fade-in-content");
        if (heroFadeContent) {
            gsap.fromTo(heroFadeContent, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.8 });
        }
        // Scroll Triggered Entrances
        if (statsRef.current) {
            gsap.fromTo(statsRef.current.querySelectorAll(".stat-item"), { opacity: 0, y: 25 }, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: "top 85%",
                },
            });
        }
        if (showcaseRef.current) {
            gsap.fromTo(showcaseRef.current, { opacity: 0, y: 30 }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: showcaseRef.current,
                    start: "top 80%",
                },
            });
        }
        if (sdkRef.current) {
            gsap.fromTo(sdkRef.current.querySelectorAll(".grid-block"), { opacity: 0, y: 30 }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sdkRef.current,
                    start: "top 80%",
                },
            });
        }
        if (ctaRef.current) {
            gsap.fromTo(ctaRef.current, { opacity: 0, scale: 0.97 }, {
                opacity: 1,
                scale: 1,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 85%",
                },
            });
        }
    }, []);
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-brand-void text-brand-text font-body selection:bg-brand-primary/20 selection:text-white", children: [_jsx(ParticleField, {}), _jsxs("div", { className: "pointer-events-none absolute inset-0 z-0", children: [_jsx("div", { className: "absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#E0F7FA]/[0.03] blur-[150px]" }), _jsx("div", { className: "absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#FF6B35]/[0.02] blur-[160px]" }), _jsx("div", { className: "absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] rounded-full bg-[#E0F7FA]/[0.02] blur-[180px]" })] }), _jsxs("div", { className: "relative z-10 mx-auto max-w-6xl px-6 sm:px-10 py-8 sm:py-12", children: [_jsxs("header", { ref: headerRef, className: "flex items-center justify-between mb-24 opacity-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-7 w-7 rounded-md bg-brand-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,107,53,0.3)]", children: _jsx("span", { className: "text-brand-void text-xs font-black", children: "G" }) }), _jsx("span", { className: "text-base font-semibold tracking-widest uppercase text-white font-mono", children: "Graphora" })] }), _jsxs("div", { className: "hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-white/50 uppercase", children: [_jsx("a", { href: "#features", className: "hover:text-brand-primary transition-colors", children: "observability" }), _jsx("a", { href: "#showcase", className: "hover:text-brand-primary transition-colors", children: "showcase" }), _jsx("a", { href: "#sdk", className: "hover:text-brand-primary transition-colors", children: "developer api" })] }), _jsx(Magnetic, { children: _jsx(Link, { to: "/auth", className: "rounded-full border border-white/10 bg-white/[0.02] px-6 py-2 text-[11px] font-mono tracking-widest text-white uppercase hover:border-brand-primary hover:bg-brand-primary/5 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)] transition-all duration-300", children: "Sign In" }) })] }), _jsxs("section", { ref: heroRef, className: "max-w-4xl mb-32 z-10 relative", children: [_jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.01] px-4 py-1.5 mb-8", children: [_jsx("span", { className: "h-1 w-1 rounded-full bg-brand-primary animate-pulse" }), _jsx("span", { className: "text-[9px] font-mono uppercase tracking-[0.25em] text-white/60", children: "VERSION 1.0 NOW ACTIVE" })] }), _jsxs("h1", { className: "text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight text-white select-none", children: [_jsx("span", { className: "inline-block overflow-hidden pb-1", children: _jsx("span", { className: "hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3", children: "Observe" }) }), _jsx("span", { className: "inline-block overflow-hidden pb-1", children: _jsx("span", { className: "hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-brand-primary", children: "every" }) }), _jsx("span", { className: "inline-block overflow-hidden pb-1", children: _jsx("span", { className: "hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3", children: "call." }) }), _jsx("span", { className: "inline-block overflow-hidden pb-1", children: _jsx("span", { className: "hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3", children: "In" }) }), _jsx("span", { className: "inline-block overflow-hidden pb-1", children: _jsx("span", { className: "hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-brand-secondary", children: "real" }) }), _jsx("span", { className: "inline-block overflow-hidden pb-1", children: _jsx("span", { className: "hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-brand-secondary", children: "time." }) }), _jsx("br", {}), _jsx("span", { className: "inline-block overflow-hidden pb-1", children: _jsx("span", { className: "hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-white/50", children: "Without" }) }), _jsx("span", { className: "inline-block overflow-hidden pb-1", children: _jsx("span", { className: "hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-white/50", children: "compromise." }) })] }), _jsxs("div", { className: "hero-fade-in-content opacity-0 mt-8 space-y-8 max-w-xl", children: [_jsx("p", { className: "text-base sm:text-lg leading-relaxed text-brand-muted", children: "Stream distributed traces, visualize infrastructure links, and respond to anomalies instantly. Redefining system monitoring for high-load tech environments." }), _jsxs("div", { className: "flex flex-wrap gap-5 pt-2", children: [_jsx(Magnetic, { children: _jsx(Link, { to: "/auth", className: "rounded-full bg-brand-primary px-8 py-4 text-xs font-bold text-brand-void tracking-widest uppercase hover:shadow-[0_0_35px_rgba(255,107,53,0.35)] transition-all duration-300 block active:scale-95", children: "Get Started Free" }) }), _jsx(Magnetic, { children: _jsx(Link, { to: "/auth", className: "rounded-full border border-white/10 px-8 py-4 text-xs font-bold tracking-widest uppercase text-white/80 hover:border-white/20 hover:text-white transition-colors duration-300 block active:scale-95", children: "View Live Demo \u2192" }) })] })] })] }), _jsx("section", { ref: statsRef, className: "grid grid-cols-2 md:grid-cols-4 border-t border-white/5 mb-36 pt-12 gap-8", children: [
                            { value: "2,400+", label: "traces / second" },
                            { value: "12ms", label: "avg ingest latency" },
                            { value: "99.9%", label: "uptime reliability" },
                            { value: "50K", label: "events processed / min" },
                        ].map((stat, idx) => (_jsxs("div", { className: "stat-item opacity-0 space-y-1", children: [_jsx("div", { className: "text-3xl font-extrabold text-white font-mono tracking-tight", children: stat.value }), _jsx("div", { className: "text-[10px] uppercase tracking-widest text-brand-muted font-mono", children: stat.label })] }, idx))) }), _jsx("section", { id: "showcase", ref: showcaseRef, className: "opacity-0 mb-36", children: _jsx(ShowcaseSection, {}) }), _jsxs("section", { id: "sdk", ref: sdkRef, className: "grid gap-6 md:grid-cols-2 mb-36", children: [_jsxs("div", { className: "grid-block opacity-0 p-8 rounded-2xl bg-brand-surface border border-white/5 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[9px] tracking-widest text-brand-primary uppercase font-mono block mb-3", children: "// INTEGRATION PREVIEW" }), _jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Instrument in minutes" }), _jsx("p", { className: "text-xs text-brand-muted leading-relaxed", children: "Add our lightweight SDK to any Node.js, Go, or Python microservice to automatically export standard traces." })] }), _jsxs("pre", { className: "mt-8 rounded-xl border border-white/5 bg-brand-void p-5 text-[11px] leading-relaxed font-mono overflow-x-auto text-white/70", children: [_jsx("span", { className: "text-brand-primary", children: "import" }), " { track } from \"@graphyn/sdk\";\n\n", _jsx("span", { className: "text-brand-primary", children: "track" }), "({\n  traceId: \"tr_01j09f\",\n  service: \"auth-svc\",\n  latency: 12\n});"] })] }), _jsxs("div", { className: "grid-block opacity-0 p-8 rounded-2xl bg-brand-surface border border-white/5 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[9px] tracking-widest text-brand-secondary uppercase font-mono block mb-3", children: "// ARCHITECTURE TOPOLOGY" }), _jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Simulated client mapping" }), _jsx("p", { className: "text-xs text-brand-muted leading-relaxed", children: "Render node connection lines dynamically and evaluate system health metrics in realtime." })] }), _jsx("div", { className: "mt-8 h-40 rounded-xl border border-white/5 bg-brand-void flex items-center justify-center overflow-hidden", children: _jsxs("svg", { viewBox: "0 0 200 80", className: "w-2/3 h-auto opacity-30", children: [[[25, 45, 75, 25], [75, 25, 135, 55], [135, 55, 175, 25], [75, 25, 45, 65]].map(([x1, y1, x2, y2], i) => (_jsx("line", { x1: x1, y1: y1, x2: x2, y2: y2, stroke: "#FF6B35", strokeWidth: "0.8" }, i))), [[25, 45], [75, 25], [135, 55], [175, 25], [45, 65]].map(([cx, cy], i) => (_jsx("circle", { cx: cx, cy: cy, r: "3", fill: "#E0F7FA" }, i)))] }) })] })] }), _jsxs("section", { ref: ctaRef, className: "opacity-0 mb-24 relative rounded-3xl border border-white/5 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-secondary/5" }), _jsxs("div", { className: "relative p-12 sm:p-20 text-center", children: [_jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold text-white leading-tight", children: "Ready to claim complete systems control?" }), _jsx("p", { className: "mt-4 text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed", children: "Experience the power of zero-overhead, real-time distributed tracing. Deploy in minutes." }), _jsx("div", { className: "mt-10", children: _jsx(Magnetic, { children: _jsx(Link, { to: "/auth", className: "inline-block rounded-full bg-brand-primary px-10 py-4 text-xs font-bold text-brand-void tracking-widest uppercase hover:shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300 active:scale-95", children: "Enter Command Center" }) }) })] })] }), _jsxs("footer", { className: "border-t border-white/5 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/30 font-mono tracking-widest uppercase gap-4", children: [_jsx("div", { children: "\u00A9 2026 Graphyn Corp. All rights reserved." }), _jsxs("div", { className: "flex gap-6", children: [_jsx("a", { href: "#", className: "hover:text-white transition-colors", children: "terms" }), _jsx("a", { href: "#", className: "hover:text-white transition-colors", children: "privacy" }), _jsx("a", { href: "#", className: "hover:text-white transition-colors", children: "security" })] })] })] })] }));
};
