import kiyoImg from './assets/kiyo.jpg';
import React, { useState } from 'react';

export default function Chelsy() {
    // Runaway button state
    const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

    // Screen shake state
    const [isShaking, setIsShaking] = useState(false);

    // Active meme modal
    const [popupMeme, setPopupMeme] = useState(null);

    // Moves button randomly when hovered
    const handleRunaway = () => {
        const newX = (Math.random() - 0.5) * 350;
        const newY = (Math.random() - 0.5) * 250;
        setBtnOffset({ x: newX, y: newY });
    };

    // Trigger full screen shake
    const triggerInulti = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
    };

    return (
        <div className={`min-h-screen bg-black text-zinc-100 font-mono pb-24 selection:bg-red-600 selection:text-white overflow-x-hidden ${isShaking ? 'animate-bounce' : ''}`}>

            {/* Top Moving Marquee Ticker */}
            <div className="bg-red-600 text-black py-1 font-black text-xs uppercase tracking-widest overflow-hidden whitespace-nowrap border-b-2 border-black">
                <div className="inline-block animate-pulse">
                    *** Hindi po *** masama ang aking *** ginawa *** dahil ang *** aking *** konsensya *** ay *** clear *** Hindi po *** masama ang aking *** ginawa *** dahil ang *** aking *** konsensya *** ay *** clear ***
                </div>
            </div>

            {/* Nav */}
            <nav className="p-4 max-w-5xl mx-auto flex justify-between items-center border-b border-zinc-800">
                <a
                    href="/"
                    className="text-zinc-400 hover:text-white text-xs underline uppercase tracking-wider"
                >
                    [ &lt;-- BACK TO BASE ]
                </a>
                <span className="text-[11px] bg-zinc-900 border border-zinc-700 text-red-500 px-3 py-1 font-bold">
                    SYSTEM STATUS: INULTIHAN
                </span>
            </nav>

            <main className="max-w-4xl mx-auto px-4 mt-8">

                {/* Hero Header */}
                <section className="text-center py-8 border-b-2 border-zinc-800 relative">
                    <div className="inline-block bg-zinc-900 border-2 border-zinc-700 p-2 mb-4 hover:rotate-3 transition-transform">
                        <img
                            src={kiyoImg}
                            alt="Kiyo"
                            className="w-32 h-32 object-cover border border-zinc-800 filter grayscaleContrast"
                        />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">
                        CHELSY KAYE C. ILAGAN
                    </h1>
                    <p className="text-xs md:text-sm text-red-500 font-bold uppercase tracking-widest bg-zinc-900 inline-block px-3 py-1 border border-zinc-800">
                        OFFICIAL TRIBUTE FOR RENE
                    </p>

                    {/* Runaway Interactive Button */}
                    <div className="mt-8 relative h-16 flex justify-center items-center">
                        <button
                            onMouseEnter={handleRunaway}
                            onClick={handleRunaway}
                            style={{
                                transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                                transition: 'transform 0.15s ease-out'
                            }}
                            className="absolute bg-white text-black font-black text-xs uppercase px-6 py-3 border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:bg-zinc-200 active:translate-x-1 active:translate-y-1"
                        >
                            CLICK HERE TO KNOW CHELSY's SECRET
                        </button>
                    </div>
                </section>

                {/* Viral Comments / Q&A Screenshot Vault */}
                <section className="my-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-4 bg-zinc-900 p-2 border-l-4 border-red-600">
                        Hindi ko rin alam
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Q&A 1: Seaman STD */}
                        <div className="bg-zinc-900 border border-zinc-800 p-4 hover:border-red-600 transition-colors">
                            <p className="text-xs text-zinc-400 mb-2 font-bold">Q: Pag nagka std po ang seaman may posibilidad na pauwiin?</p>
                            <div className="bg-black p-3 border border-zinc-800 text-xs text-white">
                                <span className="text-red-500 font-bold">A:</span> Hindi. Bat ka pauuwin eh std ka nga. Wag ka gumalaw std kalang jan.
                            </div>
                        </div>

                        {/* Q&A 2: Utot at Tula */}
                        <div className="bg-zinc-900 border border-zinc-800 p-4 hover:border-red-600 transition-colors">
                            <p className="text-xs text-zinc-400 mb-2 font-bold">Q: Ano ang similarities ng utot at tula?</p>
                            <div className="bg-black p-3 border border-zinc-800 text-xs text-white">
                                <span className="text-red-500 font-bold">A:</span> Galing sila sa poet.
                            </div>
                        </div>

                        {/* Q&A 3: Tagalog ng Clinic */}
                        <div className="bg-zinc-900 border border-zinc-800 p-4 hover:border-red-600 transition-colors">
                            <p className="text-xs text-zinc-400 mb-2 font-bold">Q: Sige nga ano tagalog ng clinic?</p>
                            <div className="bg-black p-3 border border-zinc-800 text-xs text-white">
                                <span className="text-red-500 font-bold">A:</span> Pinindot.
                            </div>
                        </div>

                    </div>
                </section>

                {/* Hard Truth Skills */}
                <section className="my-10 bg-zinc-900/60 border border-zinc-800 p-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                        PAPANSIN LANG
                    </h2>
                    <ul className="space-y-3 text-xs md:text-sm">
                        <li className="flex items-center gap-3 bg-black p-2 border border-zinc-800">
                            <span className="text-red-500 font-bold">[!]</span>
                            <span><strong>SA UNA LANG MAGALING:</strong> mag paka-.</span>
                        </li>
                        <li className="flex items-center gap-3 bg-black p-2 border border-zinc-800">
                            <span className="text-red-500 font-bold">[!]</span>
                            <span><strong>MATULOG NG ISANG BUONG ARAW:</strong> Palong palo ang palamunin.</span>
                        </li>
                        <li className="flex items-center gap-3 bg-black p-2 border border-zinc-800">
                            <span className="text-red-500 font-bold">[!]</span>
                            <span><strong>GUMASTOS NG ILANG LIBO SA ISANG ARAW:</strong> Hanggat walang pinapadede, gasta lang.</span>
                        </li>
                        <li className="flex items-center gap-3 bg-black p-2 border border-zinc-800">
                            <span className="text-red-500 font-bold">[!]</span>
                            <span><strong>PROGRAMMING LANGUAGE:</strong> Japanese... pwede rin Acts of Service hehe.</span>
                        </li>
                    </ul>
                </section>

                {/* Interactive Meme Grid & Buttons */}
                <section className="my-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-4 bg-zinc-900 p-2 border-l-4 border-red-600">
                        WEIRDO
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            onClick={() => setPopupMeme("DEPENDE KUNG 3 YAN")}
                            className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 text-white text-xs font-bold p-4 uppercase hover:scale-105 transition-all text-center"
                        >
                            May kaliwa ba sa right?!?!
                        </button>
                        <button
                            onClick={() => setPopupMeme("WALANG KANIN BUSSENG!")}
                            className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 text-white text-xs font-bold p-4 uppercase hover:scale-105 transition-all text-center"
                        >
                            Posposro head
                        </button>
                        <button
                            onClick={() => setPopupMeme("KAIN PO TAYO TEAM RYZZA")}
                            className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 text-white text-xs font-bold p-4 uppercase hover:scale-105 transition-all text-center"
                        >
                            Legends lang nakakaalam
                        </button>
                        <button
                            onClick={() => setPopupMeme("DINUROBONG TUBO DANCE")}
                            className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 text-white text-xs font-bold p-4 uppercase hover:scale-105 transition-all text-center"
                        >
                            Alam mo ha
                        </button>
                    </div>
                </section>

                {/* Ultimate Trigger: Screen Shake */}
                <section className="bg-red-950/40 border-2 border-red-600 p-8 text-center my-12">
                    <h3 className="text-xl font-black text-white uppercase mb-2">
                        PRESS BUTTON IF INULTIHAN KA TODAY
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6 uppercase">
                        Warning: wag ka sana magohlat
                    </p>
                    <button
                        onClick={triggerInulti}
                        className="bg-red-600 hover:bg-red-500 active:scale-90 text-white font-black text-sm uppercase px-8 py-4 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                    >
                        INULTIHAN AKO BOSSING
                    </button>
                </section>

                {/* Active Popup Modal */}
                {popupMeme && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-zinc-900 border-2 border-red-600 p-6 max-w-sm w-full text-center relative animate-bounce">
                            <h4 className="text-lg font-black text-white uppercase mb-4">{popupMeme}</h4>
                            <p className="text-xs text-zinc-400 mb-6 uppercase">sana ngayong pasko ay maka uno rin ako</p>
                            <button
                                onClick={() => setPopupMeme(null)}
                                className="bg-red-600 text-white font-bold text-xs uppercase px-4 py-2 border border-white"
                            >
                                CLOSE [ X ]
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="text-center pt-8 border-t border-zinc-800 text-zinc-600 text-xs font-bold uppercase tracking-widest">
                    GG FRICKING EZ
                </footer>

            </main>
        </div>
    );
}