'use client';

import dynamic from 'next/dynamic';


const PixelRoom = dynamic(() => import('@/components/PixelRoom'), { ssr: false });
const ProjectModal = dynamic(() => import('@/components/ProjectModal'), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full" style={{ minHeight: '100dvh' }}>
      <PixelRoom />
      <ProjectModal />
    </main>
  );
}
