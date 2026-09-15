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

export default function Crate({ title, items: initialItems }: CrateProps) {
    const [items, setItems] = useState<CrateItem[]>(initialItems);
    const [slidingOutId, setSlidingOutId] = useState<string | number | null>(null);
    const [draggingId, setDraggingId] = useState<string | number | null>(null);

    const handleNext = () => {
        if (items.length <= 1 || slidingOutId !== null) return;

        const frontItem = items[0];
        setSlidingOutId(frontItem.id);

        setTimeout(() => {
            setItems((prev) => {
                const newItems = [...prev];
                const shifted = newItems.shift();
                if (shifted) newItems.push(shifted);
                return newItems;
            });
            setSlidingOutId(null);
        }, 400);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>

            {/* Elegant Header */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span className="font-pixel text-[10px] tracking-[4px]" style={{ color: '#F4F1EA' }}>
                    {title}
                </span>
            </div>

            {/* The 3D Crate Viewport */}
            <div
                style={{
                    position: 'relative',
                    width: '160px',
                    height: '180px',
                    perspective: '1000px',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center'
                }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {items.map((item, index) => {
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
                                dragElastic={1}
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
                                    // Grow to full disc size while dragging; regular depth scale otherwise
                                    scale: isSlidingOut ? 0.9 : scale,
                                    opacity: isSlidingOut ? 0 : opacity,
                                    rotateZ: isSlidingOut ? -15 : 0,
                                    // REMOVED rotateX — it caused hardware-accelerated blur on the disc CSS gradients
                                    zIndex: isSlidingOut ? 50 : 20 - visualIndex,
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 24,
                                    mass: 0.8
                                }}
                                style={{
                                    position: 'absolute',
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
        </div>
    );
}
