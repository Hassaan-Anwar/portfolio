'use client';

import { useEffect, useRef } from 'react';
import { useMusicStore } from '@/store/musicStore';

// ─── Audio file paths ────────────────────────────────────────────────────────

// Map every section+index combination to a unique audio file.
const AUDIO_MAP: Record<string, string> = {
    'about:0': '/audio/Sufjan Stevens - Mystery of Love (Official Instrumental).mp3',
    'bestsellers:0': '/audio/Frank Ocean - Nights (Instrumental).mp3',
    'bestsellers:1': '/audio/Radiohead - Weird Fishes Arpeggi (Instrumental Original).mp3',
    'experience:0': '/audio/Daft Punk - Instant Crush ft. Julian Casablancas (Instrumental).mp3',
    'experience:1': '/audio/KIDS SEE GHOSTS - Reborn (Official Instrumental).mp3',
    'projects:0': '/audio/Travis Scott - 90210 (Official Instrumental).mp3',
    'projects:1': '/audio/Metro Boomin, Future - We Still Don\'t Trust You (INSTRUMENTAL).mp3',
    'projects:2': '/audio/Future - Solo (Official Instrumental).mp3',
    'projects:3': '/audio/Nahin Milta Original Karaoke Bayaan HD #bayaan #karaokewithlyrics.mp3',
    'projects:4': '/audio/Joji - SLOW DANCING IN THE DARK (Instrumental).mp3',
};

// ─── Fade utilities (Raw HTML5 Audio) ─────────────────────────────────────────
function fadeAudio(
    audio: HTMLAudioElement,
    fromVal: number,
    toVal: number,
    durationMs: number
): Promise<void> {
    return new Promise((resolve) => {
        const start = performance.now();

        function step(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / durationMs, 1);
            audio.volume = Math.max(0, Math.min(1, fromVal + progress * (toVal - fromVal)));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(step);
    });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAudioEngine() {
    const {
        activeSection,
        currentAboutIndex,
        currentBestsellersIndex,
        currentProjectIndex,
        currentExperienceIndex,
        isPlaying,
        volume,
    } = useMusicStore();

    // Derive current item key
    const currentIndex =
        activeSection === 'about' ? currentAboutIndex :
            activeSection === 'bestsellers' ? currentBestsellersIndex :
                activeSection === 'projects' ? currentProjectIndex :
                    currentExperienceIndex;
    const itemKey = `${activeSection}:${currentIndex}`;

    // Refs — survive re-renders without causing them
    const mainSrcRef = useRef<HTMLAudioElement | null>(null);
    const prevKeyRef = useRef<string>('');
    const prevPlayRef = useRef<boolean>(isPlaying);
    const isSwitchingRef = useRef<boolean>(false);
    const volumeRef = useRef<number>(volume);

    // Keep volumeRef in sync and apply instantly to active audios
    useEffect(() => {
        volumeRef.current = volume;
        if (mainSrcRef.current) mainSrcRef.current.volume = volume;
    }, [volume]);

    // ── Track / play state changes ────────────────────────────────────────────
    useEffect(() => {
        const keyChanged = itemKey !== prevKeyRef.current;
        const playChanged = isPlaying !== prevPlayRef.current;

        if (!keyChanged && !playChanged) return;

        // ── PAUSE / RESUME (no track switch) ─────────────────────────────────
        if (!keyChanged && playChanged) {
            prevPlayRef.current = isPlaying;
            if (!mainSrcRef.current) return;

            if (isPlaying) {
                // If it was paused mid-intro, we just resume main for safety
                mainSrcRef.current.play().catch(() => { });
                fadeAudio(mainSrcRef.current, 0, volumeRef.current, 200).catch(() => { });
            } else {
                const el = mainSrcRef.current;
                fadeAudio(el, el.volume, 0, 200).then(() => el.pause()).catch(() => { });
            }
            return;
        }

        // ── TRACK SWITCH ──────────────────────────────────────────────────────
        if (isSwitchingRef.current) return;
        isSwitchingRef.current = true;

        prevKeyRef.current = itemKey;
        prevPlayRef.current = isPlaying;

        const audioPath = AUDIO_MAP[itemKey];
        if (!audioPath) {
            
            return;
        }

        const switchTrack = async () => {
            // 1. Fade out current main track (if playing)
            if (mainSrcRef.current) {
                const el = mainSrcRef.current;
                await fadeAudio(el, el.volume, 0, 250);
                el.pause();
                el.src = '';
                mainSrcRef.current = null;
            }

            if (!isPlaying) {
                
                return;
            }

            // 2. Prepare main track (load + start silent)
            const mainEl = new Audio(audioPath);
            mainEl.preload = 'auto';
            mainEl.loop = true;
            mainEl.volume = 0;
            mainSrcRef.current = mainEl;

            // 3. Start main track & cross-fade with Autoplay fallback
            isSwitchingRef.current = false;
            try {
                await mainEl.play();
                await fadeAudio(mainEl, 0, volumeRef.current, 600);
            } catch (err) {
                // Browser Autoplay Policy blocked the initial playback.
                // Will securely retry as soon as the user touches/clicks the screen.
                const playOnInteract = () => {
                    if (useMusicStore.getState().isPlaying && mainSrcRef.current === mainEl) {
                        mainEl.play().catch(() => { });
                        fadeAudio(mainEl, 0, volumeRef.current, 600).catch(() => { });
                    }
                    window.removeEventListener('click', playOnInteract);
                    window.removeEventListener('touchstart', playOnInteract);
                    window.removeEventListener('keydown', playOnInteract);
                };
                window.addEventListener('click', playOnInteract);
                window.addEventListener('touchstart', playOnInteract);
                window.addEventListener('keydown', playOnInteract);
            }

            
        };

        // Delay slight amount to let Safari/Chrome register any DOM gestures
        setTimeout(() => {
            switchTrack().catch(() => {  });
        }, 10);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemKey, isPlaying]);

    // ── Cleanup on unmount ────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            mainSrcRef.current?.pause();
        };
    }, []);
}
