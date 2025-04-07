'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TimeRedirectionProps {
  redirectTo: string;
  seconds: number;
}

export default function TimeRedirection({
  redirectTo,
  seconds,
}: TimeRedirectionProps) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      router.push(redirectTo);
    }
  }, [secondsLeft, redirectTo, router]);

  return (
    <p>
      Przekierowanie za {secondsLeft}{' '}
      {secondsLeft === 1 ? 'sekundę' : 'sekundy'}
    </p>
  );
}
