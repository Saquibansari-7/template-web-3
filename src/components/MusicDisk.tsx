import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface MusicDiskHandle {
  play: () => void;
  pause: () => void;
}

const MusicDisk = forwardRef<MusicDiskHandle>((_props, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const music = new Audio('/uploads/Ed%20Sheeran%20-wedding%20(mp3cut.net).mp3');
    music.loop = true;
    music.volume = 0.5;
    audioRef.current = music;
    return () => {
      music.pause();
    };
  }, []);

  const start = () => {
    const music = audioRef.current;
    if (!music) return;
    music.play().then(() => setPlaying(true)).catch(() => {});
  };

  const stop = () => {
    const music = audioRef.current;
    if (!music) return;
    music.pause();
    setPlaying(false);
  };

  useImperativeHandle(ref, () => ({ play: start, pause: stop }), []);

  const toggle = () => {
    const music = audioRef.current;
    if (!music) return;
    if (music.paused) start();
    else stop();
  };

  return (
    <div
      id="musicDisk"
      className={`music-disk${playing ? ' playing' : ''}`}
      title="Play/Pause Music"
      onClick={toggle}
    >
      <div className="music-disk-label">
        <span className="music-disk-icon">♪</span>
      </div>
    </div>
  );
});

MusicDisk.displayName = 'MusicDisk';

export default MusicDisk;

