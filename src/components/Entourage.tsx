import { WebsiteContent } from '../types';

export default function Entourage({ content }: { content: WebsiteContent }) {
  const { parents, sponsors, maidOfHonor, bestMan } = content.entourage;
  const parentList = parents.split('/').map((p) => p.trim()).filter(Boolean);
  const sponsorList = sponsors.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <section className="bg-white py-24 relative">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-4xl text-center mb-16 uppercase tracking-widest text-dark reveal">
          Our <span className="font-script text-crimson text-5xl not-italic">Entourage</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center group hover:bg-ivory p-6 rounded-lg transition duration-300 reveal">
            <h3 className="text-crimson font-bold tracking-widest uppercase text-xs mb-6">Parents</h3>
            <ul className="space-y-4 font-serif text-lg">
              {parentList.length > 0 ? (
                parentList.map((p, i) => <li key={i}>{p}</li>)
              ) : (
                <li>
                  <span className="block text-sm text-gray-400 uppercase">Bride's Parents</span> Robert &amp; Maria
                  Santos
                </li>
              )}
            </ul>
          </div>

          <div className="text-center group hover:bg-ivory p-6 rounded-lg transition duration-300 reveal" style={{ transitionDelay: '100ms' }}>
            <h3 className="text-crimson font-bold tracking-widest uppercase text-xs mb-6">Principal Sponsors</h3>
            <ul className="space-y-4 font-serif text-lg">
              {sponsorList.length > 0 ? (
                sponsorList.map((s, i) => <li key={i}>{s}</li>)
              ) : (
                <li>Mr. John Doe</li>
              )}
            </ul>
          </div>

          <div className="text-center group hover:bg-ivory p-6 rounded-lg transition duration-300 reveal" style={{ transitionDelay: '200ms' }}>
            <h3 className="text-crimson font-bold tracking-widest uppercase text-xs mb-6">The Wedding Party</h3>
            <div className="flex justify-center -space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center font-serif font-bold text-crimson shadow-md">MOH</div>
              <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center font-serif font-bold text-crimson shadow-md">BM</div>
              <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center font-serif font-bold text-crimson shadow-md">BG</div>
            </div>
            <p className="font-serif">
              <span>{maidOfHonor ? `Maid of Honor: ${maidOfHonor}` : 'Maid of Honor: Sarah'}</span> <br />
              <span>{bestMan ? `Best Man: ${bestMan}` : 'Best Man: Michael'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <i className="fas fa-spa text-[30rem] text-crimson" />
      </div>
    </section>
  );
}
