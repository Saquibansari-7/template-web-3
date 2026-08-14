import { useEffect, useRef } from 'react';
import { WebsiteContent } from '../types';
import { cacheBust } from '../utils/cacheImage';

export default function LoveStory({ content }: { content: WebsiteContent }) {
  const storyImgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    if (storyImgRef.current) storyImgRef.current.src = cacheBust(content.story.image);
  }, [content.story.image]);

  return (
    <section id="story" className="bg-crimson text-white py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 opacity-10">
        <i className="fas fa-heart text-white text-[20rem]" />
      </div>

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left reveal">
          <h2 className="font-script text-5xl mb-2 text-blush">Our</h2>
          <h3 className="font-display text-4xl md:text-6xl font-bold mb-8 uppercase italic">{content.story.heading}</h3>

          <div className="font-serif text-lg space-y-6 text-gray-100 leading-relaxed">
            <p>{content.story.paragraph1}</p>
            <p>{content.story.paragraph2}</p>
            <p>
              Three years later, under a canopy of autumn leaves, Kevin got down on one knee. With tears of joy and a
              resounding &ldquo;Yes!&rdquo;, we began this beautiful journey toward our wedding day.
            </p>
          </div>

          <div className="mt-8 inline-flex items-center bg-white/10 px-4 py-2 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition">
            <i className="fas fa-heart text-blush mr-2" /> <span className="font-display font-bold">LOVE</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center relative reveal">
          <div className="relative w-72 h-96 transform rotate-3 hover:rotate-0 transition duration-500 shadow-2xl img-placeholder">
            <img
              ref={storyImgRef}
              src={cacheBust(content.story.image)}
              alt="Love Story"
              className="w-full h-full object-cover border-8 border-white/90"
              id="storyImg"
              loading="lazy"
            />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 transform rotate-2 shadow-sm" />
          </div>
        </div>
      </div>

      <div className="torn-paper-bottom text-white w-full absolute bottom-0" />
    </section>
  );
}
