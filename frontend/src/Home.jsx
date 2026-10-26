import React from 'react';

export default function Home() {
    const teamMembers = [
        { name: "Rheician", role: "Developer", link: "/portfolio/rhei" },
        { name: "Chelsy", role: "Developer", link: "/portfolio/chelsy" },
        { name: "Olivenn", role: "Developer", link: "/portfolio/oli" },
        { name: "Radcliff", role: "Developer", link: "/portfolio/rad" }
    ];

    const highlights = [
        { title: "1", description: "dfdsfdsf" },
        { title: "2", description: "sdfdsfdsf" },
        { title: "3", description: "dsfdsfdsf" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* 1. Homepage Hero Section */}
            <header className="bg-indigo-900 text-white py-24 px-6 text-center">
                <h1 className="text-5xl font-extrabold mb-4">Welcome to Our Workspace</h1>
                <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
                    AET GROUP 4 PROFILING WEBSITE
                </p>
            </header>

            {/* 1.1 Get to know the Team */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Get to Know the Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <a
                            key={index}
                            href={member.link}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-300 transition-all text-center flex flex-col items-center group"
                        >
                            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                {member.name.charAt(0)}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800">{member.name}</h3>
                            <p className="text-slate-500 text-sm mt-2">{member.role}</p>
                            <span className="mt-4 text-indigo-600 text-sm font-medium">View Portfolio &rarr;</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* 1.2 Highlights */}
            <section className="bg-white py-20 px-6 border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Project Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {highlights.map((item, index) => (
                            <div key={index} className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}