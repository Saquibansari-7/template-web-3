import { useEffect, useRef, useState } from 'react';
import { WebsiteContent } from '../types';

export default function Countdown({ content }: { content: WebsiteContent }) {
  const targetDate = content.countdown.targetDate || content.hero.date;
  const [time, setTime] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [expired, setExpired] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const distance = target - new Date().getTime();
      if (distance < 0) {
        setExpired(true);
        return;
      }
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTime({
        days: d < 10 ? '0' + d : String(d),
        hours: h < 10 ? '0' + h : String(h),
        minutes: m < 10 ? '0' + m : String(m),
        seconds: s < 10 ? '0' + s : String(s),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="relative bg-ivory min-h-screen flex flex-col justify-center items-center py-24 overflow-hidden">
      <div className="torn-paper-top text-crimson w-full" />

      <div className="container mx-auto px-6 text-center z-10">
        <div className="max-w-2xl mx-auto mb-16 reveal">
          <h2 className="font-script text-4xl text-crimson mb-4">Welcome</h2>
          <p className="font-serif text-xl italic text-gray-700 leading-relaxed">
            &ldquo;Two souls with but a single thought, two hearts that beat as one.&rdquo; <br />
            {content.quote.text}
          </p>
        </div>

        {expired ? (
          <div className="text-2xl font-bold text-crimson">HAPPILY EVER AFTER!</div>
        ) : (
          <div
            ref={containerRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto"
            id="countdown"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-crimson transform transition hover:-translate-y-2 duration-300">
              <div className="font-display text-4xl md:text-5xl text-crimson font-bold mb-1">{time.days}</div>
              <div className="uppercase text-xs tracking-widest text-gray-500 font-bold">Days</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-crimson transform transition hover:-translate-y-2 duration-300">
              <div className="font-display text-4xl md:text-5xl text-crimson font-bold mb-1">{time.hours}</div>
              <div className="uppercase text-xs tracking-widest text-gray-500 font-bold">Hours</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-crimson transform transition hover:-translate-y-2 duration-300">
              <div className="font-display text-4xl md:text-5xl text-crimson font-bold mb-1">{time.minutes}</div>
              <div className="uppercase text-xs tracking-widest text-gray-500 font-bold">Minutes</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-crimson transform transition hover:-translate-y-2 duration-300">
              <div className="font-display text-4xl md:text-5xl text-crimson font-bold mb-1 animate-pulse">{time.seconds}</div>
              <div className="uppercase text-xs tracking-widest text-gray-500 font-bold">Seconds</div>
            </div>
          </div>
        )}
      </div>

      <div className="torn-paper-bottom text-crimson w-full absolute bottom-0" />
    </section>
  );
}
