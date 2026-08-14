import { useEffect, useRef, useState } from 'react';
import { WebsiteContent } from '../types';
import { cacheBust } from '../utils/cacheImage';

export default function Closing({ content, onBurst }: { content: WebsiteContent; onBurst: (x: number, y: number) => void }) {
  const finalImgRef = useRef<HTMLImageElement | null>(null);
  const [loveCount, setLoveCount] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('loveCount') || '0', 10);
    setLoveCount(stored);
  }, []);

  useEffect(() => {
    if (finalImgRef.current) finalImgRef.current.src = cacheBust(content.footer.image || content.invitationCard.image);
  }, [content.footer.image, content.invitationCard.image]);

  const handleSendLove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    onBurst(x, y);
    const next = loveCount + 1;
    setLoveCount(next);
    localStorage.setItem('loveCount', String(next));
  };

  return (
    <>
      <section className="relative bg-crimson min-h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-crimson/60 via-transparent to-crimson/90" />

        <div className="relative z-10 container mx-auto px-6">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-blush p-1 animate-float img-placeholder">
            <img ref={finalImgRef} src={cacheBust(content.footer.image || content.invitationCard.image)} className="w-full h-full object-cover rounded-full grayscale" id="finalImg" loading="lazy" />
          </div>

          <h2 className="font-display text-5xl md:text-7xl mb-4">
            {content.couple.name1} &amp; {content.couple.name2}
          </h2>
          <p className="font-script text-3xl md:text-4xl text-blush mb-12">Can't wait to see you!</p>

          <div className="flex justify-center -space-x-4 mb-12">
            <div className="w-10 h-10 rounded-full border border-white bg-gray-400" />
            <div className="w-10 h-10 rounded-full border border-white bg-gray-500" />
            <div className="w-10 h-10 rounded-full border border-white bg-gray-400" />
            <div className="w-10 h-10 rounded-full border border-white bg-crimson flex items-center justify-center text-xs font-bold">+100</div>
          </div>

          <button
            className="px-10 py-4 border border-white text-white font-serif uppercase tracking-widest hover:bg-white hover:text-crimson transition duration-300"
            onClick={handleSendLove}
          >
            Send Love <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">{loveCount}</span>
          </button>
        </div>
      </section>

      <footer className="bg-dark text-white/50 py-8 text-center text-sm font-serif">
        <p>&copy; 2026 webforwedd.com</p>
      </footer>
    </>
  );
}
