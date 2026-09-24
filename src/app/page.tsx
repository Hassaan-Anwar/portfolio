'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Preloader from '@/components/Preloader';

const PixelRoom = dynamic(() => import('@/components/PixelRoom'), { ssr: false });
const ProjectModal = dynamic(() => import('@/components/ProjectModal'), { ssr: false });

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <main className="relative w-full" style={{ minHeight: '100dvh' }}>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      <PixelRoom />
      <ProjectModal />
    </main>
  );
}
