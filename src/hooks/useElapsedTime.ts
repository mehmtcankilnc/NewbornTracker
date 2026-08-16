import { useEffect, useState } from 'react';

export function useElapsedTime(startedAtIso: string | undefined): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!startedAtIso) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [startedAtIso]);

  if (!startedAtIso) return '00:00:00';

  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(startedAtIso).getTime()) / 1000));
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
