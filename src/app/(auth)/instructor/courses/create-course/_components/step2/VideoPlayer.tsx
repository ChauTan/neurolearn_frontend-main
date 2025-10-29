"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/common/ui/Button2";

type VideoPlayerProps = {
    url: string;
    onProgress?: (progress: number) => void;
    onDuration?: (duration: number) => void;
    onEnded?: () => void;
    controls?: boolean;
    light?: boolean | string;
    previewMode?: boolean;
    locked?: boolean;
    className?: string;
};

const isValidUrl = (urlString: string) => {
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
};

function VideoPlayer({
    url,
    onProgress,
    onDuration,
    onEnded,
    controls = true,
    light = false,
    locked = false,
    className = "",
}: VideoPlayerProps) {
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showLock, setShowLock] = useState(locked);
    const playerRef = useRef<ReactPlayer>(null);

    useEffect(() => {
        setIsReady(false);
        setIsPlaying(url.startsWith("blob:"));
    }, [url]);

    const handleReady = () => {
        setIsReady(true);
    };

    const handleProgress = (state: { played: number, playedSeconds: number, loaded: number }) => {
        if (onProgress) {
            onProgress(state.played * 100);
        }
    };

    const handleDuration = (duration: number) => {
        if (onDuration) {
            onDuration(duration);
        }
    };

    const handlePlay = () => {
        if (locked) {
            setShowLock(true);
            return;
        }
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        if (onEnded) onEnded();
    };

    useEffect(() => {
        setIsReady(false);
        setIsPlaying(false);
    }, [url]);

    return (
        <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            )}

            {showLock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                    <div className="text-center p-6 bg-background rounded-lg max-w-md">
                        <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            Content Locked
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            This lesson is part of the premium content. Upgrade your plan to access.
                        </p>
                        <Button className="w-full">Upgrade Now</Button>
                        <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => setShowLock(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}

            {url && isValidUrl(url) ? (
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    controls={controls}
                    light={light}
                    playing={isPlaying && !locked}
                    onReady={handleReady}
                    onStart={handlePlay}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    config={{
                        file: {
                            attributes: {
                                controlsList: 'nodownload',
                                disablePictureInPicture: true,
                            },
                            tracks: [], // Always use empty array instead of undefined
                            forceVideo: true,
                        },
                        youtube: {
                            playerVars: {
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 0,
                            },
                        },
                        vimeo: {
                            playerOptions: {
                                byline: false,
                                portrait: false,
                                title: false,
                            },
                        },
                    }}
                    style={{
                        opacity: isReady ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    {url ? "Invalid video URL" : "No video available"}
                </div>
            )}
        </div>
    );
}

export default VideoPlayer;