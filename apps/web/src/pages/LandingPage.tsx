import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Magnetic Element Wrapper ──────────────────────── */
const Magnetic = ({ children }: { children: React.ReactElement }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const dots: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
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

        if (d.x < 0 || d.x > canvas.offsetWidth) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.offsetHeight) d.vy *= -1;

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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/* ── Interactive Showcase Panel ─────────────────────── */
const ShowcaseSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const tabs = [
    {
      title: "Realtime Streams",
      desc: "Instantly ingest and visualize live websocket payloads and latency spikes.",
      badge: "LIVE TRAFFIC",
      render: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 bg-brand-surface border border-white/5 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow opacity-30" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] tracking-widest uppercase text-brand-primary font-mono">// PORTAL STREAMS</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
          </div>
          <div className="my-auto space-y-3 z-10">
            {[92, 42, 118, 64].map((latency, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-mono text-white/50">POST /api/v1/auth/session</span>
                <span className={`text-xs font-mono ${latency > 100 ? "text-brand-primary" : "text-brand-secondary"}`}>{latency}ms</span>
              </div>
            ))}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-white/30 font-mono z-10">active ws listeners: 2,401/sec</div>
        </div>
      ),
    },
    {
      title: "Distributed Maps",
      desc: "Trace network topology automatically and detect bottlenecks on map nodes.",
      badge: "SERVICE MAP",
      render: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 bg-brand-surface border border-white/5 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow-cyan opacity-20" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] tracking-widest uppercase text-brand-secondary font-mono">// SERVICE TOPOLOGY</span>
            <span className="text-[9px] font-mono text-white/40">3 ACTIVE EDGES</span>
          </div>
          <div className="my-auto flex justify-around items-center z-10 relative h-24">
            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-brand-void text-[9px] font-mono text-white/80">Gateway</div>
            <div className="h-1 text-white/10 w-12 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-2 bg-brand-secondary animate-[ping_1.5s_infinite]" />
            </div>
            <div className="h-12 w-12 rounded-full border border-brand-primary/30 flex items-center justify-center bg-brand-void text-[9px] font-mono text-brand-primary">AuthSvc</div>
            <div className="h-1 text-white/10 w-12 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-2 bg-white/40 animate-[ping_2s_infinite]" />
            </div>
            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-brand-void text-[9px] font-mono text-white/80">DB</div>
          </div>
          <div className="text-[9px] uppercase tracking-widest text-white/30 font-mono z-10">status: system healthy</div>
        </div>
      ),
    },
    {
      title: "Trace Waterfalls",
      desc: "Reconstruct client calls across databases and microservices down to milliseconds.",
      badge: "TRACE EXPLORER",
      render: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 bg-brand-surface border border-white/5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] tracking-widest uppercase text-white/40 font-mono">// DISTRIBUTED WATERFALL</span>
            <span className="text-[9px] font-mono text-brand-primary">12ms avg</span>
          </div>
          <div className="my-auto space-y-2.5 z-10 w-full">
            {[
              { label: "gateway", w: "w-full", color: "bg-white/40" },
              { label: "auth-verify", w: "w-3/4 ml-[10%]", color: "bg-brand-secondary/80" },
              { label: "db-query", w: "w-1/4 ml-[75%]", color: "bg-brand-primary" },
            ].map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-white/30">
                  <span>{t.label}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${t.w} ${t.color}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-white/30 font-mono z-10">span id: tr_01j09f48h</div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Fade animation on active panel change
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
      {/* Selector */}
      <div className="space-y-6">
        <span className="text-[10px] tracking-[0.3em] text-brand-primary uppercase font-mono font-bold block">// DESIGNED FOR PRECISION</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          A sleek approach to telemetry.
        </h2>
        <div className="space-y-3 pt-4">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`w-full text-left p-5 rounded-xl border transition-all duration-300 block relative overflow-hidden ${
                activeTab === idx
                  ? "border-brand-primary bg-brand-surface/80 shadow-[0_0_30px_rgba(255,107,53,0.05)]"
                  : "border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-mono tracking-widest text-white/40">{tab.badge}</span>
                {activeTab === idx && <span className="h-1 w-1 rounded-full bg-brand-primary" />}
              </div>
              <h3 className="text-sm font-semibold text-white">{tab.title}</h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">{tab.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Visualizer Panel */}
      <div ref={panelRef} className="h-72 sm:h-80 w-full">
        {tabs[activeTab].render()}
      </div>
    </div>
  );
};

/* ── Main Landing Page ──────────────────────────────── */
export const LandingPage = () => {
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Header Fade In
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 }
    );

    // Hero Text Splitting and Reveals
    const heroTitleWords = heroRef.current?.querySelectorAll(".hero-reveal-word");
    if (heroTitleWords && heroTitleWords.length > 0) {
      gsap.fromTo(
        heroTitleWords,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }

    // Hero Subtext and CTAs
    const heroFadeContent = heroRef.current?.querySelector(".hero-fade-in-content");
    if (heroFadeContent) {
      gsap.fromTo(
        heroFadeContent,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.8 }
      );
    }

    // Scroll Triggered Entrances
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.querySelectorAll(".stat-item"),
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
        }
      );
    }

    if (showcaseRef.current) {
      gsap.fromTo(
        showcaseRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: "top 80%",
          },
        }
      );
    }

    if (sdkRef.current) {
      gsap.fromTo(
        sdkRef.current.querySelectorAll(".grid-block"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sdkRef.current,
            start: "top 80%",
          },
        }
      );
    }

    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-void text-brand-text font-body selection:bg-brand-primary/20 selection:text-white">
      {/* Particle Field Canvas */}
      <ParticleField />

      {/* Cinematic Ambient Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#E0F7FA]/[0.03] blur-[150px]" />
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#FF6B35]/[0.02] blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] rounded-full bg-[#E0F7FA]/[0.02] blur-[180px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 py-8 sm:py-12">
        {/* ─── Navigation Bar ─── */}
        <header ref={headerRef} className="flex items-center justify-between mb-24 opacity-0">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-brand-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,107,53,0.3)]">
              <span className="text-brand-void text-xs font-black">G</span>
            </div>
            <span className="text-base font-semibold tracking-widest uppercase text-white font-mono">Graphora</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-white/50 uppercase">
            <a href="#features" className="hover:text-brand-primary transition-colors">observability</a>
            <a href="#showcase" className="hover:text-brand-primary transition-colors">showcase</a>
            <a href="#sdk" className="hover:text-brand-primary transition-colors">developer api</a>
          </div>

          <Magnetic>
            <Link
              to="/auth"
              className="rounded-full border border-white/10 bg-white/[0.02] px-6 py-2 text-[11px] font-mono tracking-widest text-white uppercase hover:border-brand-primary hover:bg-brand-primary/5 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)] transition-all duration-300"
            >
              Sign In
            </Link>
          </Magnetic>
        </header>

        {/* ─── Hero Section ─── */}
        <section ref={heroRef} className="max-w-4xl mb-32 z-10 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.01] px-4 py-1.5 mb-8">
            <span className="h-1 w-1 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/60">VERSION 1.0 NOW ACTIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight text-white select-none">
            <span className="inline-block overflow-hidden pb-1">
              <span className="hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3">Observe</span>
            </span>
            <span className="inline-block overflow-hidden pb-1">
              <span className="hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-brand-primary">every</span>
            </span>
            <span className="inline-block overflow-hidden pb-1">
              <span className="hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3">call.</span>
            </span>
            <span className="inline-block overflow-hidden pb-1">
              <span className="hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3">In</span>
            </span>
            <span className="inline-block overflow-hidden pb-1">
              <span className="hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-brand-secondary">real</span>
            </span>
            <span className="inline-block overflow-hidden pb-1">
              <span className="hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-brand-secondary">time.</span>
            </span>
            <br />
            <span className="inline-block overflow-hidden pb-1">
              <span className="hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-white/50">Without</span>
            </span>
            <span className="inline-block overflow-hidden pb-1">
              <span className="hero-reveal-word inline-block opacity-0 translate-y-[35px] mr-3 text-white/50">compromise.</span>
            </span>
          </h1>

          <div className="hero-fade-in-content opacity-0 mt-8 space-y-8 max-w-xl">
            <p className="text-base sm:text-lg leading-relaxed text-brand-muted">
              Stream distributed traces, visualize infrastructure links, and respond to anomalies instantly. Redefining system monitoring for high-load tech environments.
            </p>

            <div className="flex flex-wrap gap-5 pt-2">
              <Magnetic>
                <Link
                  to="/auth"
                  className="rounded-full bg-brand-primary px-8 py-4 text-xs font-bold text-brand-void tracking-widest uppercase hover:shadow-[0_0_35px_rgba(255,107,53,0.35)] transition-all duration-300 block active:scale-95"
                >
                  Get Started Free
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/auth"
                  className="rounded-full border border-white/10 px-8 py-4 text-xs font-bold tracking-widest uppercase text-white/80 hover:border-white/20 hover:text-white transition-colors duration-300 block active:scale-95"
                >
                  View Live Demo →
                </Link>
              </Magnetic>
            </div>
          </div>
        </section>

        {/* ─── Swiss Stats Grid ─── */}
        <section ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5 mb-36 pt-12 gap-8">
          {[
            { value: "2,400+", label: "traces / second" },
            { value: "12ms", label: "avg ingest latency" },
            { value: "99.9%", label: "uptime reliability" },
            { value: "50K", label: "events processed / min" },
          ].map((stat, idx) => (
            <div key={idx} className="stat-item opacity-0 space-y-1">
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-brand-muted font-mono">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* ─── Interactive Showcase Section ─── */}
        <section id="showcase" ref={showcaseRef} className="opacity-0 mb-36">
          <ShowcaseSection />
        </section>

        {/* ─── SDK and Preview Grid ─── */}
        <section id="sdk" ref={sdkRef} className="grid gap-6 md:grid-cols-2 mb-36">
          <div className="grid-block opacity-0 p-8 rounded-2xl bg-brand-surface border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[9px] tracking-widest text-brand-primary uppercase font-mono block mb-3">// INTEGRATION PREVIEW</span>
              <h3 className="text-lg font-bold text-white mb-2">Instrument in minutes</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Add our lightweight SDK to any Node.js, Go, or Python microservice to automatically export standard traces.
              </p>
            </div>
            <pre className="mt-8 rounded-xl border border-white/5 bg-brand-void p-5 text-[11px] leading-relaxed font-mono overflow-x-auto text-white/70">
              <span className="text-brand-primary">import</span>{" { track } from \"@graphyn/sdk\";\n\n"}
              <span className="text-brand-primary">track</span>{"({\n  traceId: \"tr_01j09f\",\n  service: \"auth-svc\",\n  latency: 12\n});"}
            </pre>
          </div>

          <div className="grid-block opacity-0 p-8 rounded-2xl bg-brand-surface border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[9px] tracking-widest text-brand-secondary uppercase font-mono block mb-3">// ARCHITECTURE TOPOLOGY</span>
              <h3 className="text-lg font-bold text-white mb-2">Simulated client mapping</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Render node connection lines dynamically and evaluate system health metrics in realtime.
              </p>
            </div>
            <div className="mt-8 h-40 rounded-xl border border-white/5 bg-brand-void flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 80" className="w-2/3 h-auto opacity-30">
                {[[25,45,75,25],[75,25,135,55],[135,55,175,25],[75,25,45,65]].map(([x1,y1,x2,y2],i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF6B35" strokeWidth="0.8" />
                ))}
                {[[25,45],[75,25],[135,55],[175,25],[45,65]].map(([cx,cy],i) => (
                  <circle key={i} cx={cx} cy={cy} r="3" fill="#E0F7FA" />
                ))}
              </svg>
            </div>
          </div>
        </section>

        {/* ─── Editorial CTA Section ─── */}
        <section ref={ctaRef} className="opacity-0 mb-24 relative rounded-3xl border border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-secondary/5" />
          <div className="relative p-12 sm:p-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Ready to claim complete systems control?
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
              Experience the power of zero-overhead, real-time distributed tracing. Deploy in minutes.
            </p>
            <div className="mt-10">
              <Magnetic>
                <Link
                  to="/auth"
                  className="inline-block rounded-full bg-brand-primary px-10 py-4 text-xs font-bold text-brand-void tracking-widest uppercase hover:shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300 active:scale-95"
                >
                  Enter Command Center
                </Link>
              </Magnetic>
            </div>
          </div>
        </section>

        {/* ─── Minimal Footer ─── */}
        <footer className="border-t border-white/5 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/30 font-mono tracking-widest uppercase gap-4">
          <div>© 2026 Graphora Corp. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">terms</a>
            <a href="#" className="hover:text-white transition-colors">privacy</a>
            <a href="#" className="hover:text-white transition-colors">security</a>
          </div>
        </footer>
      </div>
    </div>
  );
};
