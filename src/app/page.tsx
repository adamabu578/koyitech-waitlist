import Image from 'next/image';
import WaitlistForm from '@/components/WaitlistForm';
import CountdownTimer from '@/components/CountdownTimer';

export default function Home() {
  return (
    <main className="min-h-[100dvh] lg:h-[100dvh] lg:min-h-[520px] lg:overflow-hidden bg-[#181059] text-white relative font-sans flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 lg:py-3 overflow-x-hidden selection:bg-[#5C4FFF] selection:text-white">

      {/* Background abstract shapes for depth */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3 animate-pulse-slow z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#5C4FFF]/20 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3 z-0"></div>

      {/* Rocket Launch Animation */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <div className="absolute text-[40px] sm:text-[60px] animate-rocket drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          🚀
        </div>
      </div>

      {/* Centered Content Container */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 relative z-10">

        {/* Left Column: Logo, Hero Text, Timer & Tracks */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start gap-2.5 sm:gap-3">
          {/* Trimmed Logo (no extra transparent padding) */}
          <div className="w-32 sm:w-36 lg:w-40 mb-0.5 animate-fade-in">
            <Image
              src="/logo-white-trimmed.png"
              alt="Koyitech Africa"
              width={1430}
              height={492}
              className="w-full h-auto object-contain"
              preload
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <span className="inline-flex items-center gap-2 py-1 px-3.5 sm:py-1.5 sm:px-4 rounded-full bg-[#8ec63f]/20 text-[#8ec63f] text-sm sm:text-base font-extrabold tracking-wider mb-2 border border-[#8ec63f]/40 shadow-sm uppercase">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              100% Free Training
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black tracking-tight mb-1.5 leading-[1.08] text-white">
              Master Computer &amp; <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a3b1ff]">IT Fundamentals.</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl leading-relaxed">
              Kickstart your digital journey with Koyitech Africa—completely free. Build practical computer confidence, master everyday office tools, and learn essential IT skills from scratch.
            </p>
          </div>

          {/* Banner for Countdown */}
          <div className="animate-fade-in-up w-full max-w-xl" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="bg-[#5C4FFF] p-2.5 sm:px-4 sm:py-2.5 rounded-xl shadow-[0_10px_30px_rgba(92,79,255,0.2)] relative z-20 border border-[#5C4FFF]/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <p className="font-black text-white text-xs sm:text-sm lg:text-base uppercase tracking-tight leading-tight drop-shadow-sm">
                  Cohort I <br className="hidden sm:block" />Starts In:
                </p>
                <CountdownTimer />
              </div>
            </div>
          </div>

          {/* Tracks - Vertical Slider */}
          <div className="animate-fade-in-up w-full max-w-xl" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <h3 className="text-[#a3b1ff] font-semibold text-[10px] sm:text-xs mb-1.5 tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              What You&apos;ll Learn
            </h3>
            <div className="relative h-[58px] sm:h-[64px] overflow-hidden rounded-xl">
              {/* Top/Bottom Fade Masks */}
              <div className="absolute inset-x-0 top-0 h-3.5 bg-gradient-to-b from-[#181059] to-transparent z-10 pointer-events-none rounded-t-xl"></div>
              <div className="absolute inset-x-0 bottom-0 h-3.5 bg-gradient-to-t from-[#181059] to-transparent z-10 pointer-events-none rounded-b-xl"></div>

              {/* Scrolling Container */}
              <div className="flex flex-col gap-1.5 p-1 animate-marquee-vertical hover:[animation-play-state:paused]">
                {[
                  { title: 'Computer Basics & OS', desc: 'Windows Navigation, Files & Shortcuts' },
                  { title: 'Office Suite Mastery', desc: 'Word Docs, Spreadsheets & Presentations' },
                  { title: 'Internet & Cloud Tools', desc: 'Email, Online Collaboration & Cyber Safety' },
                  { title: 'IT Hardware & Troubleshooting', desc: 'System Setup & Everyday Tech Support' },
                  { title: 'Computer Basics & OS', desc: 'Windows Navigation, Files & Shortcuts' },
                  { title: 'Office Suite Mastery', desc: 'Word Docs, Spreadsheets & Presentations' },
                  { title: 'Internet & Cloud Tools', desc: 'Email, Online Collaboration & Cyber Safety' },
                  { title: 'IT Hardware & Troubleshooting', desc: 'System Setup & Everyday Tech Support' }
                ].map((skill, i) => (
                  <div key={i} className="flex flex-col px-2.5 py-1.5 rounded-lg bg-white shadow-sm shrink-0 transition-transform hover:scale-[1.01] cursor-default border border-gray-100">
                    <span className="block text-xs sm:text-sm font-black text-[#5C4FFF] tracking-wide leading-tight">{skill.title}</span>
                    <span className="block text-[10px] font-bold text-[#181059]/60">{skill.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Form */}
        <div className="lg:col-span-5 w-full max-w-md lg:max-w-none mx-auto flex flex-col justify-center animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>

          {/* Top Image */}
          <div className="relative w-full h-20 sm:h-24 rounded-t-2xl sm:rounded-t-3xl overflow-hidden shadow-2xl border-b-4 border-[#5C4FFF]">
            <Image
              src="/pc-guys.jpg"
              alt="Tech Students"
              fill
              sizes="(max-width: 1024px) 448px, 480px"
              className="object-cover object-[center_20%] hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181059] to-transparent opacity-40"></div>
          </div>

          {/* Submission Card */}
          <div className="bg-white text-[#181059] rounded-b-2xl sm:rounded-b-3xl p-4 sm:px-5 sm:py-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col justify-center w-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5C4FFF]/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>

            <h2 className="text-xl sm:text-2xl font-black mb-0.5 text-[#181059] tracking-tight">Enroll for Free</h2>
            <p className="text-gray-500 font-medium mb-2.5 text-xs leading-snug">
              Create your free student account to join Cohort I, log in to Koyitech Africa, and attend classes.
            </p>

            <WaitlistForm />

            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-gray-100 pt-2.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Over 500+ joined
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-gray-400">@</span>
                <span className="font-black text-[#5C4FFF]">koyitech.africa</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
