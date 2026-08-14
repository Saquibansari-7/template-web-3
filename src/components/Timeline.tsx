import { WebsiteContent } from '../types';

export default function Timeline({ content }: { content: WebsiteContent }) {
  const items = content.timeline.length > 0
    ? content.timeline
    : [
        { event: 'Ceremony', description: 'Exchange of vows and rings', time: '10:00 AM', icon: 'fas fa-church' },
        { event: 'Cocktails', description: 'Drinks and canapes by the garden', time: '12:00 PM', icon: 'fas fa-cocktail' },
        { event: 'Lunch & Program', description: 'Feast, speeches, and dancing', time: '1:00 PM', icon: 'fas fa-utensils' },
        { event: 'Cake Cutting', description: 'Sweet beginnings', time: '3:30 PM', icon: 'fas fa-birthday-cake' },
        { event: 'Farewell', description: 'Grand exit send-off', time: '5:00 PM', icon: 'fas fa-door-open' },
      ];

  return (
    <section id="timeline" className="bg-ivory py-20 overflow-hidden relative">
      <div className="container mx-auto px-6 relative">
        <h2 className="font-display text-4xl text-center mb-20 uppercase tracking-widest text-dark reveal">
          The <span className="font-script text-crimson text-5xl not-italic">Schedule</span>
        </h2>

        <div className="relative">
          <div className="timeline-line hidden md:block" />
          <div className="timeline-left-line md:hidden absolute left-4 top-0 bottom-0 w-1 bg-crimson" />

          <div id="timelineContainer" className="space-y-20">
            <noscript>
              <div className="text-center text-gray-500">Timeline will appear here when JavaScript is enabled.</div>
            </noscript>
            {items.map((item, idx) => {
              const sideLeft = idx % 2 === 0;
              const isBlush = item.icon.includes('blush');
              const nameClasses = sideLeft
                ? 'md:text-right order-2 md:order-1'
                : 'md:text-left';
              const timeClasses = sideLeft ? 'order-3' : 'order-1';
              return (
                <div key={idx} className="flex flex-col md:flex-row items-center w-full reveal timeline-item">
                  <div className={`w-full md:w-1/2 md:px-12 timeline-name ${nameClasses}`}>
                    <h4 className="font-display text-3xl font-bold text-crimson">{item.event}</h4>
                    <p className="font-serif text-lg text-gray-600 italic">{item.description}</p>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`timeline-icon relative z-10 w-12 h-12 rounded-full bg-white border-4 ${
                        isBlush ? 'border-blush' : 'border-crimson'
                      } flex items-center justify-center shadow-md hover:scale-125 transition duration-300 cursor-pointer group`}
                    >
                      <i className={`${item.icon || 'fas fa-star'} text-crimson text-base`} />
                      <div className="sparkle absolute -top-2 -right-2 text-crimson text-sm">✦</div>
                    </div>
                  </div>

                  <div className={`w-full md:w-1/2 md:px-12 font-serif font-bold text-2xl timeline-time ${timeClasses}`}>
                    {item.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
