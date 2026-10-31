import RohanImg from './assets/Rohan.png';
import RohanFace from './assets/Rohan_DagaKotowaru.png';
import React, { useState } from 'react';

export default function Radcliff() {
    // Description texts.
    const profile = {
        name: 'Radcliff Jorel B. Flores',
        desc: 'Words',
        picture: '/assets/Rohan_DagaKotowaru.png',
        details: [
            { title: 'ABOUT ME', lines: ['Existing.', 'Rather reserved.'] },
            { title: 'PERSONALITY', lines: ['Enjoys the simplicity.', 'Aaaaaaaa.'] },
            { title: 'LIKES & INTERESTS', lines: ['Drawing.', 'Gaming.', 'Mysterious third thing.'] },
        ],
        featureTitle: 'title',
        featureText: 'test text',
        extraTitle: 'title',
        extraText: 'text text',
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-white font-sans text-neutral-950">
            {/* Rohan image wip */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-14 border-r-4 border-black sm:w-20"
                style={{
                    backgroundColor: '#168ac4',
                    backgroundImage:
                        'radial-gradient(circle at 3px 3px, rgba(0,0,0,.65) 1.2px, transparent 1.5px), repeating-linear-gradient(135deg, transparent 0 13px, rgba(0,0,0,.45) 14px 16px)',
                    backgroundSize: '7px 7px, 100% 100%',
                }}
            />

            {/* Blue manga accent on the right */}
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-sky-400 sm:w-20" />

            <div className="relative z-10 ml-14 mr-10 min-h-screen px-4 pb-10 sm:ml-20 sm:mr-20 sm:px-8">
                {/* Header */}
                <header className="mx-auto flex max-w-5xl items-center gap-4 py-6 sm:gap-6 sm:py-8">
                    <div className="shrink-0 border-[3px] border-violet-500 p-1">
                        {profile.picture ? (
                            <img
                                src={RohanFace}
                                alt="`Rohan`"
                                className="h-16 w-16 rounded-full border-2 border-black object-cover sm:h-20 sm:w-20"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-white text-center text-xs font-black uppercase sm:h-20 sm:w-20 sm:text-sm">
                                PIC<br />HERE
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
                            {profile.name}
                        </h1>
                        <p className="mt-1 max-w-xl text-sm sm:text-lg">{profile.desc}</p>
                    </div>
                </header>

                {/* Manga sound-effect lettering */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2 top-2 rotate-[-10deg] select-none text-5xl font-black italic tracking-tighter text-white sm:right-5 sm:top-3 sm:text-7xl"
                    style={{
                        WebkitTextStroke: '2px #171717',
                        textShadow: '4px 4px 0 #171717, 7px 7px 0 #facc15',
                    }}
                >
                    ゴゴゴ
                </div>

                {/* Main layout: change */}
                <main className="mx-auto grid max-w-5xl grid-cols-1 gap-0 border-[5px] border-black bg-white sm:grid-cols-2">
                    {/* Left column */}
                    <div className="flex flex-col border-b-[5px] border-black sm:border-b-0 sm:border-r-[5px]">
                        {profile.details.map((section, index) => (
                            <section
                                key={section.title}
                                className={`min-h-32 flex-1 p-4 sm:min-h-0 sm:p-5 ${
                                    index !== profile.details.length - 1 ? 'border-b-[5px] border-black' : ''
                                }`}
                            >
                                <h2 className="mb-3 inline-block bg-black px-2 py-1 text-xs font-black tracking-widest text-white sm:text-sm">
                                    {section.title}
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed sm:text-base">
                                    {section.lines.map((line, lineIndex) => (
                                        <p key={lineIndex}>{line}</p>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Right column */}
                    <div className="flex min-h-[420px] flex-col">
                        <section className="relative flex min-h-64 flex-1 items-center justify-center overflow-hidden border-b-[5px] border-black p-6 sm:min-h-0">
                            <div className="relative z-10 max-w-sm bg-white/90 p-4 text-center">
                                <h2 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
                                    {profile.featureTitle}
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed sm:text-base">{profile.featureText}</p>
                            </div>
                        </section>

                        <section className="min-h-40 flex-1 p-5 sm:p-6">
                            <h2 className="mb-3 text-lg font-black uppercase tracking-wide sm:text-xl">
                                {profile.extraTitle}
                            </h2>
                            <p className="text-sm leading-relaxed sm:text-base">{profile.extraText}</p>
                        </section>
                    </div>
                </main>

                <footer className="mx-auto mt-5 flex max-w-5xl items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest">
                    <a href="/" className="underline decoration-2 underline-offset-4 hover:text-sky-700">
                        &larr; Back to Home
                    </a>
                    <span>Thus Spoke Kishibe Rohan: JoJo's Bizarre Adventure</span>
                </footer>
            </div>
        </div>
    );
}