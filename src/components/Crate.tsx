'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';

export interface CrateItem {
    id: string | number;
    content: React.ReactNode;
    onPlay?: () => void;
}

interface CrateProps {
    title: string;
    items: CrateItem[];
}

export default function Crate({ title, items }: CrateProps) {
    const [itemOrder, setItemOrder] = useState(() => items.map(i => i.id));
    const [slidingOutId, setSlidingOutId] = useState<string | number | null>(null);
    const [draggingId, setDraggingId] = useState<string | number | null>(null);

    const handleNext = () => {
        if (itemOrder.length <= 1 || slidingOutId !== null) return;

        const frontId = itemOrder[0];
        setSlidingOutId(frontId);

        setTimeout(() => {
            setItemOrder((prev) => {
                const newOrder = [...prev];
                const shifted = newOrder.shift();
                if (shifted !== undefined) newOrder.push(shifted);
                return newOrder;
            });
            setSlidingOutId(null);
        }, 400);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>

            {/* Elegant Header */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span className="font-pixel text-[10px] tracking-[4px]" style={{ color: '#F4F1EA' }}>
                    {title}
                </span>
            </div>


            {/* The 3D Crate Viewport (Acrylic Bin Container) */}
            <div
                style={{
                    position: 'relative',
                    width: '180px',
                    height: '175px',
                    perspective: '1200px',
                    marginTop: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: '40px' // Lift records up a bit inside the bin
                }}
            >
                {/* 1. Crate Back Wall */}
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    width: '180px',
                    height: '140px',
                    background: 'linear-gradient(to bottom, transparent, rgba(5,3,10,0.8))',
                    borderLeft: '1px solid rgba(255,255,255,0.05)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px 16px 0 0',
                    zIndex: 0
                }} />

                {/* 2. Crate Inner Shadow/Glow (Amber) */}
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    width: '170px',
                    height: '20px',
                    background: 'rgba(160, 180, 255, 0.15)',
                    filter: 'blur(20px)',
                    zIndex: 1
                }} />

                {/* 3. The actual records */}
                <div style={{ position: 'absolute', bottom: '15px', left: '10px', width: '160px', height: '160px', zIndex: 10 }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                        {itemOrder.map((id, index) => {
                            const item = items.find(i => i.id === id);
                            if (!item) return null;

                            const isSlidingOut = item.id === slidingOutId;
                            const isDragging = item.id === draggingId;

                            const visualIndex = isSlidingOut ? 0 : index;

                            const scale = Math.max(1 - visualIndex * 0.06, 0.5);
                            const translateY = -visualIndex * 15;
                            const opacity = visualIndex > 4 ? 0 : 1 - (visualIndex * 0.15);

                            // Target scale: when dragging, grow the record to ~240px (NowPlayingPanel disc size).
                            // The VinylRecord disc is 92px inside a 96px sleeve, so scale factor ≈ 240/96 = 2.5
                            const DRAG_SCALE = 2.5;

                            return (
                                <motion.div
                                    key={item.id}

                                    initial={false}
                                    drag={visualIndex === 0 ? true : false}
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    dragElastic={0.8}
                                    dragSnapToOrigin
                                    whileDrag={{ scale: DRAG_SCALE, zIndex: 9999 }}
                                    onDragStart={() => {
                                        setDraggingId(item.id);
                                        useMusicStore.getState().setDragging(true);
                                    }}
                                    onDragEnd={(e, info) => {
                                        setDraggingId(null);
                                        useMusicStore.getState().setDragging(false);

                                        if (info.offset.x < -100) {
                                            handleNext();
                                        } else if (info.offset.x > 200) {
                                            if (item.onPlay) item.onPlay();
                                            handleNext();
                                        }
                                    }}
                                    animate={{
                                        x: isSlidingOut ? -200 : 0,
                                        y: isSlidingOut ? -40 : translateY,
                                        scale: isSlidingOut ? 0.9 : scale,
                                        opacity: isSlidingOut ? 0 : opacity,
                                        rotateZ: isSlidingOut ? -15 : 0,
                                        zIndex: isSlidingOut ? 50 : 20 - visualIndex,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 220,
                                        damping: 28,
                                        mass: 1.0
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0, width: '100%', height: '100%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transformOrigin: 'center center',
                                        cursor: visualIndex === 0 ? 'grab' : 'default',
                                        pointerEvents: visualIndex === 0 ? 'auto' : 'none',
                                    }}
                                    whileTap={visualIndex === 0 ? { cursor: 'grabbing' } : {}}
                                >
                                    {/* No inner box shadow wrapper — sleeve and disc handle their own shadows */}
                                    {item.content}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* 4. Acrylic Front Glass Panel */}
                <div
                    className="backdrop-blur-md"
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        width: '180px',
                        height: '70px',
                        background: 'linear-gradient(135deg, rgba(160, 165, 175, 0.2) 0%, rgba(80, 85, 95, 0.45) 50%, rgba(10, 15, 20, 0.7) 100%)',
                        border: '1px solid rgba(200, 205, 215, 0.3)',
                        borderTop: '2px solid rgba(220, 225, 235, 0.5)',
                        borderBottom: '4px solid rgba(160, 165, 175, 0.4)',
                        borderRadius: '0 0 16px 16px',
                        boxShadow: '0 -10px 40px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.2), inset 0 -4px 10px rgba(0,0,0,0.6)',
                        zIndex: 60, // Above resting records
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Glass glare effect */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)', borderRadius: '0 0 16px 16px' }} />

                    {/* Handle/Label plate */}
                    <div style={{
                        width: '40px',
                        height: '6px',
                        background: 'linear-gradient(to bottom, #9ca3af, #4b5563)',
                        border: '1px solid rgba(0,0,0,0.8)',
                        borderRadius: '4px',
                        boxShadow: 'inset 0 1px 4px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.5)'
                    }} />
                </div>
            </div>

        </div>
    );
}
