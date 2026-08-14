import { useState } from 'react';

export default function IntroOverlay({ onComplete, onSealClick }: { onComplete: () => void; onSealClick?: () => void }) {
  const [broken, setBroken] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleStamp = () => {
    if (broken) return;
    setBroken(true);
    onSealClick?.();
    window.setTimeout(() => setOpen(true), 700);
    window.setTimeout(() => {
      setHidden(true);
      onComplete();
    }, 2800);
  };

  if (hidden) return null;

  return (
    <div id="introOverlay" className={open ? 'open' : ''}>
      <div id="scene">
        <div className="curtain left" />
        <div className="curtain right" />
        <img
          id="stamp"
          src="/uploads/c-stamp-web.png"
          alt="seal"
          className={broken ? 'break' : ''}
          onClick={handleStamp}
        />
      </div>
    </div>
  );
}

