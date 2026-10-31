import React, { useState, useEffect } from 'react';
import rj1 from './assets/rj1.jpg';
import rj2 from './assets/rj2.jpg';
import rj3 from './assets/rj3.jpg';
import rj4 from './assets/rj4.jpg';
import rj5 from './assets/rj5.jpg';
import rj6 from './assets/rj6.jpg';

export default function Rheician() {
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showQuickPop, setShowQuickPop] = useState(false);
    const [portfolioUnlocked, setPortfolioUnlocked] = useState(false);

    // Interactive & Chaos states
    const [activeMemeIndex, setActiveMemeIndex] = useState(0);
    const [isEvading, setIsEvading] = useState(false);
    const [isBreakdown, setIsBreakdown] = useState(false); // New Screen Shake state
    const [submitHover, setSubmitHover] = useState(false); // Humor form state

    // Form states
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const memeList = [
        { title: "cno ba naman ako para piliin mo", desc: "Sino nga ba naman? E nag-iisa lang naman ako sa tabi.", img: rj2 },
        { title: "jo pagod ka na ba?", desc: "Nasusuka na ako sa pinaggagagawa ko sa buhay kaso kailangan pumasa.", img: rj3 },
        { title: "Miss u lods", desc: "Asukal sa kape ko ang pait parang tadhana natin.", img: rj1 },
        { title: "ako na lang kasi :(", desc: "Aaaaah hays nvm napagod na naman ako kakatingin sa screen.", img: rj4 },
        { title: "si ano poh", desc: "Seenzone na naman tayo mga lods.", img: rj5 }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setLoading(false);
                    setShowModal(true);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
        return () => clearInterval(timer);
    }, []);

    const handleConfirmModal = () => {
        setShowModal(false);
        setShowQuickPop(true);
        setTimeout(() => {
            setShowQuickPop(false);
            setPortfolioUnlocked(true);
        }, 800);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const triggerBreakdown = () => {
        setIsBreakdown(true);
        setTimeout(() => {
            setIsBreakdown(false);
        }, 800); // Shakes aggressively
    };

    return (
        <div className={`relative min-h-screen font-sans overflow-x-hidden selection:bg-amber-400 selection:text-zinc-900 transition-colors duration-100 ${
            isBreakdown ? 'bg-red-950 text-red-200 animate-breakdown' : 'bg-zinc-950 text-zinc-100'
        }`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
                .calligraphic { font-family: 'Great Vibes', cursive; }
                
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                /* The Shake Animation */
                @keyframes breakdownShake {
                    0% { transform: translate(2px, 2px) rotate(0deg); }
                    10% { transform: translate(-3px, -2px) rotate(-2deg); filter: contrast(200%) hue-rotate(90deg); }
                    20% { transform: translate(-2px, 4px) rotate(2deg); }
                    30% { transform: translate(4px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -3px) rotate(2deg); filter: contrast(150%) blur(2px); }
                    50% { transform: translate(-4px, 2px) rotate(-2deg); }
                    60% { transform: translate(-2px, 1px) rotate(0deg); }
                    70% { transform: translate(4px, 1px) rotate(-2deg); filter: invert(100%); }
                    80% { transform: translate(-2px, -2px) rotate(2deg); }
                    90% { transform: translate(2px, 4px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-2deg); }
                }
                /* Jitter for the footer */
                @keyframes jitter {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px) rotate(-1deg); }
                    50% { transform: translateX(2px) rotate(1deg); }
                    75% { transform: translateX(-1px) rotate(0.5deg); }
                }
                /* Slow Marquee */
                @keyframes scrollMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                
                .animate-fade-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-breakdown { animation: breakdownShake 0.15s infinite; }
                .animate-jitter:hover { animation: jitter 0.2s infinite; color: #f59e0b; }
                .animate-scroll { display: inline-block; white-space: nowrap; animation: scrollMarquee 30s linear infinite; }
                
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
            `}</style>

            {/* INITIAL LOADING STATE */}
            {loading && (
                <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center font-mono">
                    <div className="relative z-10 text-center px-4 w-full max-w-sm">
                        <span className="text-zinc-500 text-[10px] tracking-widest uppercase block mb-3 animate-pulse">l0@diNg n@ ppoh...</span>
                        <h1 className="text-2xl font-bold text-zinc-200 tracking-wider mb-6 flex justify-between">
                            <span>LOADING</span> <span>[{loadingProgress}%]</span>
                        </h1>
                        <div className="w-full h-1 bg-zinc-900 overflow-hidden rounded-full">
                            <div className="h-full bg-amber-400 transition-all duration-75 ease-linear" style={{ width: `${loadingProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRMATION MODAL */}
            {showModal && (
                <div onClick={handleConfirmModal} className="fixed inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-md bg-zinc-950/80 cursor-pointer animate-fade-up">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-md w-full text-center shadow-2xl transition-transform hover:scale-105">
                        <h2 className="text-xl text-zinc-200 mb-8 italic font-light tracking-wide leading-relaxed">
                            "Are you ready to move forward without looking back sa past?"
                        </h2>
                        <div className="inline-block px-6 py-2 border border-zinc-700 rounded-full text-[10px] text-zinc-400 font-mono uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-colors">
                            Click to confirm
                        </div>
                    </div>
                </div>
            )}

            {showQuickPop && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 pointer-events-none">
                    <div className="bg-amber-500/10 border border-amber-500/50 px-8 py-6 rounded-2xl text-center shadow-[0_0_60px_rgba(245,158,11,0.2)] animate-pulse">
                        <h3 className="text-xl font-bold text-amber-300 tracking-widest uppercase">Ngi!</h3>
                    </div>
                </div>
            )}

            {/* MAIN PORTFOLIO CONTENT */}
            <div className={`transition-opacity duration-1000 ${portfolioUnlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="max-w-7xl mx-auto pt-3 pb-3">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-amber-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full transition-colors shadow-sm"
                    >
                        <span>←</span> Back to Dashboard
                    </a>
                </div>

                {/* HERO SECTION */}
                <header className="relative min-h-screen flex flex-col justify-end pb-24 px-6 md:px-20 overflow-hidden">
                    <div className="absolute inset-0 z-0 scale-105 animate-[float_20s_ease-in-out_infinite]">
                        <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80" alt="Background" className="w-full h-full object-cover filter brightness-[0.2] contrast-125 saturate-50" />
                        <div className={`absolute inset-0 transition-colors duration-300 ${isBreakdown ? 'bg-red-950/80 mix-blend-color' : 'bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent'}`}></div>
                    </div>

                    <div className="relative z-10 max-w-5xl">
                        <h1 className="text-7xl md:text-[10rem] calligraphic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 leading-none py-2 animate-fade-up">
                            Rheician <span className="text-amber-300/80">Jhoy</span>
                        </h1>
                        <p className="text-amber-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-4 animate-fade-up delay-100">
                            UI/UX Developer sa umaga // Yearner sa gabi :&lt;
                        </p>

                        <div
                            className="mt-5 h-16 flex items-center justify-start animate-fade-up delay-300 relative z-20 w-72"
                            onMouseEnter={() => setIsEvading(true)}
                            onMouseLeave={() => setIsEvading(false)}
                        >
                            <button
                                className={`font-mono text-xs uppercase px-8 py-3 rounded-full border transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) backdrop-blur-sm absolute left-0
                                ${isEvading
                                    ? 'translate-x-24 opacity-0 scale-75 blur-md pointer-events-none bg-zinc-900 border-zinc-700'
                                    : 'translate-x-0 opacity-100 scale-100 bg-amber-400/10 text-amber-400 border-amber-400/50 hover:bg-amber-400 hover:text-zinc-950'}`}
                            >
                                Pangalan ni loml ko
                            </button>
                            <span className={`absolute left-4 text-zinc-500 font-mono text-xs transition-opacity duration-500 uppercase tracking-widest ${isEvading ? 'opacity-100 delay-100' : 'opacity-0'}`}>
                                Loh!
                            </span>
                        </div>
                    </div>
                </header>

                {/* CAROUSEL SECTION */}
                <section className="px-6 py-32 max-w-7xl mx-auto">
                    <div className="mb-20 text-center animate-fade-up relative">
                        <h2 className="text-xs font-mono text-amber-500 uppercase tracking-[0.3em] mb-4">Archives</h2>
                        <h3 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-100 uppercase">
                            Different types of <span className="font-bold text-amber-300">Rhei</span>
                        </h3>
                        <button
                            onClick={triggerBreakdown}
                            className="absolute -top-10 right-0 md:right-10 bg-red-950 border border-red-800 text-red-500 hover:bg-red-600 hover:text-white font-mono text-[10px] uppercase px-4 py-2 rounded-full transition-all active:scale-75 shadow-lg opacity-50 hover:opacity-100"
                        >
                            ⚠️ Emotional Breakdown
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-5 space-y-4">
                            {memeList.map((meme, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => setActiveMemeIndex(index)}
                                    className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                                        activeMemeIndex === index ? 'bg-zinc-900 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)] -rotate-1 scale-105' : 'bg-zinc-950 border-zinc-800/50 hover:border-zinc-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <span className={`font-mono text-xs ${activeMemeIndex === index ? 'text-amber-400' : 'text-zinc-600'}`}>00{index + 1}</span>
                                        <span className={`font-medium tracking-wide uppercase text-sm ${activeMemeIndex === index ? 'text-zinc-100' : 'text-zinc-500'}`}>{meme.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-7 relative h-[500px] flex items-center justify-center">
                            {memeList.map((meme, index) => {
                                const offset = index - activeMemeIndex;
                                const isActive = index === activeMemeIndex;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => setActiveMemeIndex(index)}
                                        style={{
                                            transform: `translateX(${offset * 40}px) scale(${1 - Math.abs(offset) * 0.08})`,
                                            zIndex: memeList.length - Math.abs(offset),
                                            opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.4
                                        }}
                                        className={`absolute w-full max-w-lg h-[450px] rounded-3xl overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
                                            isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'filter brightness-[0.25]'
                                        }`}
                                    >
                                        <img src={meme.img} alt={meme.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                                        <div className="absolute bottom-8 left-8 right-8">
                                            <h4 className="text-2xl font-bold text-white uppercase mb-2 leading-tight">{meme.title}</h4>
                                            <p className="text-sm text-zinc-400 font-light line-clamp-2">{meme.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* MUSIC & DIALOGUE*/}
                <section className="relative py-32 overflow-hidden border-y border-zinc-900">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left*/}
                        <div className="relative h-[400px] md:h-[600px] flex items-center">
                            <div className={`absolute -left-1/4 md:-left-40 w-[120%] md:w-[800px] aspect-square rounded-full bg-zinc-950 border-[16px] border-zinc-900 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex items-center justify-center ${isBreakdown ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_15s_linear_infinite]'}`}>
                                <div className="absolute inset-8 rounded-full border border-zinc-800/50"></div>
                                <div className="absolute inset-24 rounded-full border border-zinc-800/30"></div>
                                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-600 to-amber-200 flex items-center justify-center border-8 border-zinc-950 shadow-inner">
                                    <div className="w-8 h-8 rounded-full bg-zinc-950"></div>
                                </div>
                            </div>
                            <div className="relative z-10 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 px-6 py-3 rounded-full shadow-xl animate-float">
                                <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase">♫ Playing: Ben&Ben — Lifetime</span>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col justify-center space-y-8 animate-fade-up">
                            <div className="relative h-64 md:h-[360px] w-full rounded-3xl overflow-hidden border border-zinc-800/50 shadow-2xl">
                                <img src={rj6} alt="Jo Dialogue Scene" className="w-full h-full object-cover filter contrast-125 brightness-75" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/40 to-transparent mix-blend-overlay"></div>
                            </div>
                            <div className="space-y-6 w-full">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-amber-100 italic leading-snug">
                                    "Ohh you were a good dream, WAS THERE A LIFETIME?"
                                </h3>
                                <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light border-l-2 border-amber-500/30 pl-6">
                                    "Tangina Primo, ang talino kong tao, pero pagdating sayo ewan ko, natatanga ako."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROFESSIONAL PORTFOLIO SECTION */}
                <section className="px-6 py-32 max-w-7xl mx-auto font-mono">
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-amber-300 uppercase">
                            Proof of Rays (siryuz i2 opo)
                        </h2>
                    </div>

                    <div className="w-full">
                        <a
                            href="https://platypus-vdj9t9.my.canva.site/rheician/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col md:flex-row items-start md:items-center justify-between border-y border-zinc-800 py-6 transition-colors hover:bg-zinc-900/50 px-2 cursor-pointer"
                        >
                            {/* Number Col */}
                            <div className="text-zinc-500 font-mono text-sm w-full md:w-32 mb-2 md:mb-0 group-hover:text-amber-400 transition-colors">
                                001
                            </div>

                            {/* Title Col */}
                            <div className="text-zinc-200 font-bold uppercase text-base md:text-lg flex-1 mb-2 md:mb-0 tracking-wide group-hover:text-white transition-colors">
                                Professional Portfolio
                            </div>

                            {/* Description Col */}
                            <div className="text-zinc-500 font-mono text-xs uppercase text-left md:text-right max-w-lg leading-relaxed group-hover:text-zinc-400 transition-colors">
                                BUILDING RELIABLE, SCALABLE APPLICATIONS FROM IDEA TO PRODUCTION.<br className="hidden md:block" />
                                FOCUSED ON PERFORMANCE, STRUCTURE, AND LONG-TERM MAINTAINABILITY.
                            </div>
                        </a>
                    </div>
                </section>

                {/* THE OVERTHINKING MARQUEE */}
                <div className="w-full overflow-hidden bg-zinc-900 border-y border-zinc-800 py-2">
                    <div className="whitespace-nowrap font-mono text-[10px] text-amber-500/60 uppercase tracking-[0.2em] animate-scroll">
                        {/* Repeat content to create seamless loop */}
                        <span className="mx-8">{'< 404: WILL TO LIVE NOT FOUND />'}</span>
                        <span className="mx-8">{'// ERROR: ASUKAL SA KAPE AY MAPAIT'}</span>
                        <span className="mx-8">{'/* TODO: MOVE ON SA PAST */'}</span>
                        <span className="mx-8">{'GIT COMMIT -M "PAGOD NA PO AKO"'}</span>
                        <span className="mx-8">{'< 404: WILL TO LIVE NOT FOUND />'}</span>
                        <span className="mx-8">{'// ERROR: ASUKAL SA KAPE AY MAPAIT'}</span>
                        <span className="mx-8">{'/* TODO: MOVE ON SA PAST */'}</span>
                        <span className="mx-8">{'GIT COMMIT -M "PAGOD NA PO AKO"'}</span>
                        <span className="mx-8">{'< 404: WILL TO LIVE NOT FOUND />'}</span>
                        <span className="mx-8">{'// ERROR: ASUKAL SA KAPE AY MAPAIT'}</span>
                        <span className="mx-8">{'/* TODO: MOVE ON SA PAST */'}</span>
                        <span className="mx-8">{'GIT COMMIT -M "PAGOD NA PO AKO"'}</span>
                    </div>
                </div>

                {/* CONTACT FORM */}
                <section className="px-6 py-32 bg-zinc-900/30 border-b border-zinc-900">
                    <div className="max-w-xl mx-auto font-mono">
                        <div className="mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-3 uppercase tracking-tight">Let's Connect</h2>
                            <p className="text-zinc-500 text-xs tracking-wide">Send feedback o kaya ay mandamay sa kalungkutan.</p>
                        </div>

                        {submitted ? (
                            <div className="bg-zinc-900/80 border border-amber-500/30 p-8 rounded-2xl text-amber-400 text-sm text-center shadow-lg animate-fade-up">
                                STATUS: Message successfully sent to the void. Goodluck.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-12 animate-fade-up">
                                <div className="relative group">
                                    <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2 transition-colors group-hover:text-amber-400">NAME*</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent text-zinc-100 text-sm border-b border-zinc-800 focus:border-amber-400 py-2 focus:outline-none placeholder:text-zinc-700 transition-colors" placeholder="JHON DOE" />
                                </div>
                                <div className="relative group">
                                    <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2 transition-colors group-hover:text-amber-400">EMAIL*</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent text-zinc-100 text-sm border-b border-zinc-800 focus:border-amber-400 py-2 focus:outline-none placeholder:text-zinc-700 transition-colors" placeholder="EXAMPLE@EMAIL.COM" />
                                </div>
                                <div className="relative group">
                                    <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2 transition-colors group-hover:text-amber-400">WHAT ARE YOU BUILDING?*</label>
                                    <textarea required rows="1" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-transparent text-zinc-100 text-sm border-b border-zinc-800 focus:border-amber-400 py-2 focus:outline-none resize-none placeholder:text-zinc-700 transition-colors" placeholder="DESCRIBE YOUR PROJECT IN A FEW WORDS" />
                                </div>
                                <button
                                    type="submit"
                                    onMouseEnter={() => setSubmitHover(true)}
                                    onMouseLeave={() => setSubmitHover(false)}
                                    className="w-full bg-zinc-100 hover:bg-amber-400 text-zinc-950 font-bold py-5 rounded-xl transition-all duration-300 text-xs uppercase tracking-[0.2em] cursor-pointer shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]"
                                >
                                    {submitHover ? 'Mandamay ng Iba...' : 'Submit'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                <footer className="bg-zinc-950 px-6 py-12 text-center">
                    <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase mb-4 group cursor-pointer inline-block">
                        <span className="inline-block animate-jitter transition-colors duration-200">Developed with Panic & Tailwind</span>
                    </p>
                    <p className="text-[10px] text-zinc-700 font-mono tracking-widest">© 2026 RHEICIAN JHOY BUENO GONZALES. ALL RIGHTS RESERVED.</p>
                </footer>

            </div>
        </div>
    );
}