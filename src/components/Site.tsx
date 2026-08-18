import { useCallback, useEffect, useRef, useState } from 'react';
import { WebsiteContent } from '../types';
import { cacheBust } from '../utils/cacheImage';
import IntroOverlay from './IntroOverlay';
import ParticleCanvas from './ParticleCanvas';
import MusicDisk, { MusicDiskHandle } from './MusicDisk';
import Hero from './Hero';
import Countdown from './Countdown';
import LoveStory from './LoveStory';
import Entourage from './Entourage';
import CeremonyReception from './CeremonyReception';
import Timeline from './Timeline';
import Closing from './Closing';
import SiteModal from './SiteModal';

export default function Site({ content }: { content: WebsiteContent }) {
  const [modalHtml, setModalHtml] = useState<React.ReactNode | null>(null);
  const burstRef = useRef<((x: number, y: number) => void) | null>(null);
  const musicRef = useRef<MusicDiskHandle | null>(null);

  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdmin]);

  const handleIntroComplete = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  // Parallax effect
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      document.querySelectorAll('.parallax-section').forEach((el) => {
        (el as HTMLElement).style.backgroundPositionY = `-${scrolled * 0.5}px`;
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMap = useCallback(() => {
    const ceremony = content.events?.ceremony ?? { time: '', venue: '', location: '', mapCoords: { latitude: '', longitude: '' } };
    const { latitude, longitude } = ceremony.mapCoords || { latitude: '', longitude: '' };
    const address = ceremony.location;
    let url: string;
    if (latitude && longitude) {
      url = `https://www.google.com/maps?q=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&z=17&output=embed`;
    } else if (address) {
      url = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
    } else {
      setModalHtml(<p className="text-center">No location coordinates or address available.</p>);
      return;
    }
    setModalHtml(<iframe src={url} className="w-full h-96 border-0" title="Map" />);
  }, [content]);

  const openMenu = useCallback(() => {
    const menu = cacheBust(content.events.menuImage);
    if (menu) {
      setModalHtml(<img src={menu} alt="Menu" className="w-full h-auto object-contain" />);
    } else {
      setModalHtml(<p className="text-center">Menu image not set yet.</p>);
    }
  }, [content]);

  const handleBurst = useCallback((x: number, y: number) => {
    burstRef.current?.(x, y);
  }, []);

  // Scroll reveal: add `.active` to `.reveal` elements as they enter the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content]);

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <IntroOverlay onComplete={handleIntroComplete} onSealClick={() => musicRef.current?.play()} />
      <ParticleCanvas onReady={(fn) => (burstRef.current = fn)} />
      <MusicDisk ref={musicRef} />

      <Hero content={content} />
      <Countdown content={content} />
      <LoveStory content={content} />
      <Entourage content={content} />
      <CeremonyReception content={content} onViewMap={openMap} onViewMenu={openMenu} />
      <Timeline content={content} />
      <Closing content={content} onBurst={handleBurst} />

      <SiteModal open={modalHtml !== null} onClose={() => setModalHtml(null)}>
        {modalHtml}
      </SiteModal>
    </>
  );
}
