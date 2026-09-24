'use client';

import { useEffect, useRef } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { Howl } from 'howler';

// ─── Audio file paths ────────────────────────────────────────────────────────
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

    const mainHowlRef = useRef<Howl | null>(null);
    const prevKeyRef = useRef<string>('');
    const prevPlayRef = useRef<boolean>(isPlaying);
    const isSwitchingRef = useRef<boolean>(false);
    const volumeRef = useRef<number>(volume);

    // Keep global volume in sync
    useEffect(() => {
        volumeRef.current = volume;
        if (mainHowlRef.current) {
            mainHowlRef.current.volume(volume);
        }
    }, [volume]);

    useEffect(() => {
        const keyChanged = itemKey !== prevKeyRef.current;
        const playChanged = isPlaying !== prevPlayRef.current;

        if (!keyChanged && !playChanged) return;

        // ── PAUSE / RESUME (no track switch) ─────────────────────────────────
        if (!keyChanged && playChanged) {
            prevPlayRef.current = isPlaying;
            if (!mainHowlRef.current) return;

            if (isPlaying) {
                mainHowlRef.current.play();
                mainHowlRef.current.fade(0, volumeRef.current, 200);
            } else {
                const howl = mainHowlRef.current;
                howl.fade(volumeRef.current, 0, 200);
                setTimeout(() => howl.pause(), 200);
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
            isSwitchingRef.current = false;
            return;
        }

        const switchTrack = () => {
            // 1. Fade out current main track if playing
            if (mainHowlRef.current) {
                const oldHowl = mainHowlRef.current;
                oldHowl.fade(volumeRef.current, 0, 250);
                setTimeout(() => {
                    oldHowl.stop();
                    oldHowl.unload(); // Destroy from memory
                }, 250);
                mainHowlRef.current = null;
            }

            if (!isPlaying) {
                isSwitchingRef.current = false;
                return;
            }

            // 2. Load new Howl instance (Lazy Instantiation)
            const mainHowl = new Howl({
                src: [audioPath],
                html5: true,          // CRITICAL: Streams the MP3 to bypass 50MB RAM crashes
                preload: 'metadata',  // Fetches header for instant preparation
                loop: true,
                volume: 0,            // Start at 0 for latency-mask fading
            });

            mainHowlRef.current = mainHowl;

            // Release lock instantly so users can rapidly spam-click records without buffering lag
            isSwitchingRef.current = false;

            // 3. Play with AutoPlay fallback resilience
            mainHowl.play();

            // Howler triggers 'playerror' natively instead of promise rejection if Chrome/Safari block it
            mainHowl.once('playerror', () => {
                const playOnInteract = () => {
                    if (useMusicStore.getState().isPlaying && mainHowlRef.current === mainHowl) {
                        mainHowl.play();
                        mainHowl.fade(0, volumeRef.current, 800);
                    }
                    window.removeEventListener('pointerdown', playOnInteract);
                    window.removeEventListener('keydown', playOnInteract);
                };
                window.addEventListener('pointerdown', playOnInteract);
                window.addEventListener('keydown', playOnInteract);
            });

            // 4. Fade mask (swells to full volume over 800ms)
            mainHowl.fade(0, volumeRef.current, 800);
        };

        // Standard event loop push
        setTimeout(() => switchTrack(), 10);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemKey, isPlaying]);

    // ── Cleanup on unmount ────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (mainHowlRef.current) {
                mainHowlRef.current.unload();
            }
        };
    }, []);
}
