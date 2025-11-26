'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

const SONGS = [
    { id: 'rA3NF0gCu8Y', name: 'Fon Müziği 1' },
    { id: 'EFJ7kDva7JE', name: 'Fon Müziği 2' },
];

export function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(SONGS[0].id);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '0',
                width: '0',
                videoId: currentSong,
                playerVars: {
                    'autoplay': 1,
                    'controls': 0,
                    'loop': 1,
                    'playlist': currentSong, // Required for loop to work
                    'playsinline': 1,
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                },
            });
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, []);

    const changeSong = (songId: string) => {
        if (currentSong === songId) return;

        setCurrentSong(songId);
        if (playerRef.current && playerRef.current.loadVideoById) {
            playerRef.current.loadVideoById({
                videoId: songId,
            });
        }
    };

    const onPlayerReady = (event: any) => {
        event.target.playVideo();
    };

    const onPlayerStateChange = (event: any) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
        } else if (event.data === window.YT.PlayerState.ENDED) {
            // Manual loop fallback
            event.target.playVideo();
        }
    };

    const togglePlay = () => {
        if (!playerRef.current) return;

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex gap-2">
            <div id="youtube-player" className="hidden" />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border-gray-200 dark:border-gray-700"
                    >
                        <Music className="h-5 w-5 text-primary" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {SONGS.map((song) => (
                        <DropdownMenuItem
                            key={song.id}
                            onClick={() => changeSong(song.id)}
                            className={currentSong === song.id ? "bg-accent font-medium" : ""}
                        >
                            {song.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="outline"
                size="icon"
                className={`rounded-full shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border-gray-200 dark:border-gray-700 ${isPlaying ? 'animate-pulse' : ''}`}
                onClick={togglePlay}
            >
                {isPlaying ? (
                    <Volume2 className="h-5 w-5 text-primary" />
                ) : (
                    <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
            </Button>
        </div>
    );
}
