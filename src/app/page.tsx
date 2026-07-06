import Image from 'next/image';
import WaitlistForm from '@/components/WaitlistForm';
import CountdownTimer from '@/components/CountdownTimer';

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-[#181059] text-white relative font-sans flex flex-col overflow-x-hidden selection:bg-[#5C4FFF] selection:text-white">

      {/* Background abstract shapes for depth */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3 animate-pulse-slow z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#5C4FFF]/20 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3 z-0"></div>

      {/* Rocket Launch Animation */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <div className="absolute text-[40px] sm:text-[60px] animate-rocket drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          🚀
        </div>
      </div>

      {/* Header / Logo */}
      <header className="w-full px-4 lg:px-8 pt-4 pb-2 z-50 relative">
        <div className="container mx-auto max-w-7xl animate-fade-in">
          <div className="relative w-32 sm:w-48 lg:w-[220px]">
            <Image
              src="/logo-white.png"
              alt="Koyitech Africa"
              width={600}
              height={200}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 lg:px-6 pt-2 pb-4 flex flex-col justify-start relative z-10 max-w-7xl flex-1">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-8 z-20 w-full min-h-0 pt-2 sm:pt-4">

          {/* Left Column: Hero Text & Timer & Tracks */}
          <div className="w-full lg:w-[50%] flex flex-col justify-start gap-2 sm:gap-3">
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <span className="inline-flex items-center gap-1.5 py-0.5 px-3 rounded-full bg-[#8ec63f]/20 text-[#8ec63f] text-[10px] font-bold tracking-widest mb-2 border border-[#8ec63f]/30 shadow-sm uppercase">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Unlock 50% Discount
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight mb-2 leading-[1.1] text-white">
                Launch Your <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a3b1ff]">Tech Career.</span>
              </h1>
              <p className="text-sm text-gray-300 font-light max-w-md leading-relaxed">
                Join Africa's premier technology academy. Master high-demand skills, build real-world projects, and get mentored by industry experts.
              </p>
            </div>

            {/* Banner for Countdown */}
            <div className="animate-fade-in-up w-full max-w-lg" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              <div className="bg-[#5C4FFF] p-2 sm:px-4 sm:py-3 rounded-xl shadow-[0_10px_30px_rgba(92,79,255,0.2)] relative z-20 border border-[#5C4FFF]/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <p className="font-black text-white text-sm lg:text-base uppercase tracking-tight leading-tight drop-shadow-sm">
                    Cohort <br className="hidden md:block" />Starts In:
                  </p>
                  <CountdownTimer />
                </div>
              </div>
            </div>

            {/* Tracks - Vertical Slider */}
            <div className="animate-fade-in-up w-full max-w-lg mt-1" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <h3 className="text-[#a3b1ff] font-semibold text-[10px] sm:text-xs mb-2 tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Available Tracks
              </h3>
              <div className="relative h-[60px] sm:h-[70px] overflow-hidden rounded-xl">
                {/* Top/Bottom Fade Masks */}
                <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#181059] to-transparent z-10 pointer-events-none rounded-t-xl"></div>
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#181059] to-transparent z-10 pointer-events-none rounded-b-xl"></div>

                {/* Scrolling Container */}
                <div className="flex flex-col gap-1.5 p-1 animate-marquee-vertical hover:[animation-play-state:paused]">
                  {[
                    { title: 'Web Development', desc: 'Frontend & Backend Mastery' },
                    { title: 'Cyber Security', desc: 'Ethical Hacking & Defense' },
                    { title: 'Digital Marketing', desc: 'Growth & SEO Strategies' },
                    { title: 'Graphic Design', desc: 'UI/UX & Branding' },
                    { title: 'Web Development', desc: 'Frontend & Backend Mastery' },
                    { title: 'Cyber Security', desc: 'Ethical Hacking & Defense' },
                    { title: 'Digital Marketing', desc: 'Growth & SEO Strategies' },
                    { title: 'Graphic Design', desc: 'UI/UX & Branding' }
                  ].map((skill, i) => (
                    <div key={i} className="flex flex-col p-2 rounded-lg bg-white shadow-sm shrink-0 transition-transform hover:scale-[1.02] cursor-default border border-gray-100">
                      <span className="block text-xs sm:text-sm font-black text-[#5C4FFF] tracking-wide mb-0.5">{skill.title}</span>
                      <span className="block text-[10px] font-bold text-[#181059]/60">{skill.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Submission Form */}
          <div className="w-full lg:w-[45%] flex flex-col justify-start animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>

            {/* Top Image */}
            <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto h-24 sm:h-32 lg:h-36 rounded-t-3xl overflow-hidden shadow-2xl border-b-4 border-[#5C4FFF]">
              <Image
                src="/pc-guys.jpg"
                alt="Tech Students"
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181059] to-transparent opacity-40"></div>
            </div>

            {/* Submission Card */}
            <div className="bg-white text-[#181059] rounded-b-3xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col justify-center w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5C4FFF]/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-1 text-[#181059] tracking-tight">Claim 50% off</h2>
              <p className="text-gray-500 font-medium mb-4 text-xs sm:text-sm leading-relaxed">
                Reserve your spot on the waitlist today and get an exclusive 50% early-bird discount on all courses.
              </p>

              <WaitlistForm />

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>
    </main>
  );
}
