import React, { useState } from 'react';
import scary1 from './assets/scary1.jpg';
import steal from './assets/steal.png';

export default function Home() {
    const teamMembers = [
        { name: "Chelsy", role: "Developer", link: "/portfolio/chelsy" },
        { name: "Olivenn", role: "Developer", link: "/portfolio/olivenn" },
        { name: "Rheician", role: "Developer", link: "/portfolio/rheician" },
        { name: "Radcliff", role: "Developer", link: "/portfolio/radcliff" }
    ];

    const games = [
        {
            title: "Steal an Egg: Mamaaaa",
            rating: "95% Rating",
            image: steal,
            link: "/portfolio/chelsy"
        },
        {
            title: "99 Nights ng Pagdurusa",
            rating: "92% Rating",
            image: "https://play-lh.googleusercontent.com/viOjN7Ax5NtKXc3GdhAz4g8Ij8gq9eNnZv5cLFmYbDrQAu49qDuKYZS-kljLOzjefpgnL57CkkMRQKWcydqURA=w526-h296-rw",
            link: "/portfolio/olivenn"
        },

        {
            title: "#UndasDanas",
            rating: "98% Rating",
            image: scary1,
            link: "/portfolio/rheician"
        },
        {
            title: "Radcliff",
            rating: "96% Rating",
            image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
            link: "/portfolio/radcliff"
        }
    ];

    const [dismissBanner, setDismissBanner] = useState(false);

    // Audio notification for unavailable features
    const playFahhhSound = () => {
        const sound = new Audio('https://www.myinstants.com/media/sounds/fahhh.mp3');
        sound.volume = 1.0;
        sound.play().catch(() => {});
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">

            {/* TOP NAVBAR */}
            <nav className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="font-black text-2xl tracking-tighter text-black cursor-pointer">
                        ROLBOX
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600">
                        <span className="text-black border-b-2 border-black pb-5 pt-5 cursor-pointer">Home</span>
                        <span
                            onClick={playFahhhSound}
                            className="hover:text-black transition cursor-pointer"
                        >
                            Discover
                        </span>
                        <span
                            onClick={playFahhhSound}
                            className="hover:text-black transition cursor-pointer"
                        >
                            Avatar Shop
                        </span>
                    </div>
                </div>

                <div className="flex-1 max-w-md mx-6 hidden sm:block">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search portfolios, systems, or features"
                            className="w-full bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white rounded-full py-2 px-4 text-sm outline-none transition"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        onClick={playFahhhSound}
                        className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs cursor-pointer hover:bg-zinc-700 transition"
                        title="Avatar / Profile (Not Available)"
                    >
                        R
                    </div>
                    <button
                        onClick={playFahhhSound}
                        className="text-zinc-600 hover:text-black text-xs font-semibold uppercase tracking-wider px-2 py-1 cursor-pointer"
                    >
                        Settings
                    </button>
                    <button
                        onClick={playFahhhSound}
                        className="text-zinc-600 hover:text-black text-xs font-semibold uppercase tracking-wider px-2 py-1 cursor-pointer"
                    >
                        Alerts
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pt-6">
                <div className="flex gap-6 text-sm font-semibold border-b border-zinc-200 pb-3 mb-6">
                    <span className="text-black border-b-2 border-black pb-3 -mb-3 cursor-pointer">For you</span>
                </div>

                {!dismissBanner && (
                    <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-5 flex justify-between items-center mb-8">
                        <div>
                            <h2 className="font-bold text-zinc-900 text-base">AET Group 4 Profiling System</h2>
                            <p className="text-sm text-zinc-500 mt-1">Explore interactive developer worlds and group project repositories below.</p>
                            <button className="mt-4 bg-zinc-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-zinc-800 transition">
                                Get Started
                            </button>
                        </div>
                        <button
                            onClick={() => setDismissBanner(true)}
                            className="text-zinc-400 hover:text-zinc-700 text-sm font-bold px-3 py-1"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>

            {/* ACTIVE FRIENDS SCROLLER */}
            <section className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex gap-6 overflow-x-auto pb-4" onClick={playFahhhSound}>
                    <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 group-hover:border-black group-hover:text-black transition">
                            <span className="text-lg font-bold">+</span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-600 mt-2">Add Sched</span>
                    </div>

                    {teamMembers.map((member, index) => (
                        <a
                            key={index}
                            href={member.link}
                            className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 text-white p-0.5 shadow-sm group-hover:scale-105 transition">
                                    <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center font-bold text-sm">
                                        {member.name.charAt(0)}
                                    </div>
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-zinc-900 border-2 border-white rounded-full"></span>
                            </div>
                            <span className="text-xs font-semibold text-zinc-800 mt-2 group-hover:underline truncate max-w-[70px]">
                                {member.name}
                            </span>
                        </a>
                    ))}
                </div>
            </section>

            {/* RECOMMENDED GAMES GRID */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <h2 className="text-lg font-bold text-zinc-900 mb-6">Recommended For You</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {games.map((game, index) => (
                        <a
                            key={index}
                            href={game.link}
                            className="group flex flex-col cursor-pointer"
                        >
                            <div className="w-full h-44 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-3 relative">
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 grayscale-[25%] group-hover:grayscale-0"
                                />
                                <div className="absolute top-2 right-2 bg-zinc-900/80 text-white text-[10px] font-semibold px-2 py-1 rounded">
                                    <span>Play</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-sm text-zinc-900 group-hover:underline line-clamp-1">
                                {game.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                                <span>Rating: {game.rating}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-zinc-200 py-6 px-6 text-center text-xs text-zinc-400 font-mono">
                ROLBOX DASHBOARD SIMULATION // AET GROUP 4 PROFILING PORTFOLIO © 2026
            </footer>

        </div>
    );
}