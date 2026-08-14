import { useEffect, useMemo, useRef } from 'react';
import { WebsiteContent } from '../types';
import { cacheBust } from '../utils/cacheImage';

function generateCalendar(year: number, month: number, highlightDay: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
  let html = `<div class="uppercase text-xs text-gray-500 font-bold mb-2">${monthName} ${year}</div>`;
  html += '<div class="grid grid-cols-7 gap-1 text-center text-sm font-serif">';
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  dayLabels.forEach((day) => {
    html += `<span class="text-gray-400">${day}</span>`;
  });
  for (let i = 0; i < firstDay; i++) html += '<span></span>';
  for (let day = 1; day <= daysInMonth; day++) {
    if (day === highlightDay) {
      html += `<span class="bg-crimson text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto font-bold">${day}</span>`;
    } else {
      html += `<span>${day}</span>`;
    }
  }
  const totalCells = firstDay + daysInMonth;
  const remainingCells = 42 - totalCells;
  for (let i = 0; i < remainingCells; i++) html += '<span></span>';
  html += '</div>';
  return html;
}

export default function Hero({ content }: { content: WebsiteContent }) {
  const targetDate = content.countdown.targetDate || content.hero.date;
  const dateObj = useMemo(() => new Date(targetDate), [targetDate]);
  const calendarHtml = useMemo(
    () => generateCalendar(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()),
    [dateObj]
  );
  const dateDisplay = useMemo(() => {
    const d = dateObj;
    return (
      (d.getMonth() + 1).toString().padStart(2, '0') +
      '.' +
      d.getDate().toString().padStart(2, '0') +
      '.' +
      (d.getFullYear() % 100).toString().padStart(2, '0')
    );
  }, [dateObj]);
  const dayDisplay = useMemo(
    () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObj.getDay()],
    [dateObj]
  );
  const localeDate = useMemo(
    () => dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    [dateObj]
  );

  const coupleImgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const url = cacheBust(content.hero.image);
    if (coupleImgRef.current) coupleImgRef.current.src = url;
  }, [content.hero.image]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-crimson text-white overflow-hidden parallax-section"
    >
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="mb-8 animate-float">
          <p className="font-script text-3xl md:text-5xl text-blush mb-2">{content.hero.subtitle}</p>
          <h2 className="text-xl md:text-2xl tracking-[0.3em] uppercase border-t border-b border-blush/50 inline-block py-2 px-8">
            {content.saveTheDate.heading}
          </h2>
        </div>

        <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 mb-8 group cursor-pointer reveal img-placeholder rounded-full">
          <div className="absolute inset-0 border-4 border-double border-blush rounded-full transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-105" />
          <div className="absolute -inset-2 border border-white/30 rounded-full animate-pulse-slow" />
          <img
            ref={coupleImgRef}
            src={cacheBust(content.hero.image)}
            alt="Couple"
            className="w-full h-full object-cover rounded-full shadow-2xl filter sepia-[.3]"
            id="coupleImg"
            loading="eager"
          />
          <div className="absolute -bottom-4 right-0 bg-dark text-blush text-xs font-bold px-3 py-1 rounded-full border border-blush">
            {content.couple.hashtag}
          </div>
        </div>

        <h1 id="frontNames" className="font-display text-6xl md:text-8xl mb-2 tracking-wide reveal">
          <span>{content.couple.name1}</span>{' '}
          <span className="font-script text-5xl md:text-7xl text-blush mx-2">&</span>{' '}
          <span>{content.couple.name2}</span>
        </h1>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-8 reveal">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg text-center transform hover:-translate-y-2 transition duration-300">
            <div className="font-display text-4xl font-bold mb-1">{dateDisplay}</div>
            <div className="text-xs uppercase tracking-widest text-blush">{dayDisplay}</div>
          </div>

          <div className="relative bg-white text-dark p-4 rounded shadow-lg transform rotate-2 hover:rotate-0 transition duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-crimson" />
            <div dangerouslySetInnerHTML={{ __html: calendarHtml }} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i className="fas fa-chevron-down text-white/50 text-2xl" />
      </div>

      <span className="hidden">{localeDate}</span>
    </section>
  );
}
