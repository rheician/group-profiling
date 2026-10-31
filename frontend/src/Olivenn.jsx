import React from "react";

const SKILLS = [
    { title: "XXXXXXX", detail: "Secret" },
    { title: "XXXXXXX", detail: "Level X" },
    { title: "Secret", detail: "22" },
];

function PlaceholderScene() {
    return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
            <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b9e2fb" />
                    <stop offset="100%" stopColor="#f2fbff" />
                </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#sky)" />
            <g fill="#fff">
                <ellipse cx="38" cy="22" rx="14" ry="6" />
                <circle cx="33" cy="17" r="7" />
                <circle cx="44" cy="16" r="6" />
            </g>
            <path d="M0 70 Q30 55 70 66 T100 62 V100 H0Z" fill="#c8e08a" />
            <path d="M20 100 Q40 62 80 72 Q95 76 100 82 V100Z" fill="#8aa300" />
        </svg>
    );
}

export default function Portfolio({ name = "Jahn Olivenn Esmarin", avatar = "", onBackHome }) {
    const handleBack = (e) => {
        if (onBackHome) {
            e.preventDefault();
            onBackHome();
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#0a1520] font-sans text-white">
            <header className="border-b-2 border-[#e8c53a] px-6 py-3 text-sm font-medium tracking-wide">
                PROFILE
            </header>

            <div className="flex flex-1 flex-col md:flex-row md:px-[7%] md:pb-12">
                {/* Left panel */}
                <aside className="flex w-full flex-col items-center bg-[#2e855a] px-4 pb-8 pt-16 md:w-[23%] md:min-w-[190px] md:rounded-b-[6rem] md:pt-20">
                    <div className="h-32 w-32 overflow-hidden rounded-full bg-white sm:h-36 sm:w-36">
                        {avatar ? (
                            <img src={avatar} alt={name} className="h-full w-full object-cover" />
                        ) : (
                            <PlaceholderScene />
                        )}
                    </div>

                    <h1 className="mt-8 text-center text-base font-medium">{name}</h1>

                    <a
                        href="/"
                        onClick={handleBack}
                        className="mt-auto pt-24 text-sm text-[#e8c53a] hover:underline md:pt-40"
                    >
                        Back to Home
                    </a>
                </aside>

                {/* Right side: empty top space, skills at the bottom */}
                <main className="flex flex-1 flex-col justify-end px-6 md:px-10">
                    <section
                        id="skills"
                        className="mt-12 grid grid-cols-1 gap-10 pb-10 sm:grid-cols-3 md:mt-0 md:pb-0"
                    >
                        {SKILLS.map((skill) => (
                            <div key={skill.title} className="flex flex-col items-center">
                                <p className="text-base">{skill.title}</p>
                                <p className="text-sm text-[#e8c53a]">{skill.detail}</p>
                                <div
                                    className="mt-3 h-24 w-24 rounded-full bg-[#00c060] sm:h-[100px] sm:w-[100px]"
                                    title={`${skill.title}: ${skill.detail}`}
                                />
                            </div>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
}