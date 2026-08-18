import { WebsiteContent } from '../types';

export default function CeremonyReception({
  content,
  onViewMap,
  onViewMenu,
}: {
  content: WebsiteContent;
  onViewMap: () => void;
  onViewMenu: () => void;
}) {
  const ceremony = content.events?.ceremony ?? { time: '', venue: '', location: '', mapCoords: { latitude: '', longitude: '' } };
  const reception = content.events?.reception ?? { time: '', venue: '', location: '', mapCoords: { latitude: '', longitude: '' } };
  return (
    <section id="rsvp" className="bg-dark text-white py-24 min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-0 shadow-2xl rounded-sm overflow-hidden max-w-4xl mx-auto">
          <div className="w-full md:w-1/2 p-12 text-center border-r border-gray-700 bg-burgundy">
            <h3 className="font-display text-3xl uppercase tracking-widest mb-6">Ceremony</h3>
            <div className="space-y-4 font-serif text-lg text-gray-200 mb-8">
              <p className="font-bold text-white">{ceremony.venue}</p>
              <p>{ceremony.location}</p>
              <p>{ceremony.time}</p>
            </div>
            <button
              onClick={onViewMap}
              className="px-8 py-3 bg-crimson text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-red-800 transition duration-300 transform hover:scale-105"
            >
              <i className="fas fa-map-marker-alt mr-2" /> View Map
            </button>
            <div className="mt-12 text-blush/50 text-4xl">
              <i className="fas fa-church" />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-12 text-center bg-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-burgundy/20 to-transparent" />

            <h3 className="font-display text-3xl uppercase tracking-widest mb-6 relative z-10">Reception</h3>
            <div className="space-y-4 font-serif text-lg text-gray-200 mb-8 relative z-10">
              <p className="font-bold text-white">{reception.venue}</p>
              <p>{reception.location}</p>
              <p>{reception.time}</p>
            </div>
            <button
              onClick={onViewMenu}
              className="px-8 py-3 bg-white text-dark font-bold uppercase tracking-widest text-xs rounded hover:bg-gray-100 transition duration-300 transform hover:scale-105 relative z-10"
            >
              <i className="fas fa-glass-cheers mr-2" /> Menu
            </button>
            <div className="mt-12 text-blush/50 text-4xl relative z-10">
              <i className="fas fa-glass-martini-alt" />
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-blush text-2xl tracking-[1em] opacity-50 animate-pulse">
          ✦ ✧ ✶ ✦ ✧
        </div>
      </div>
    </section>
  );
}
