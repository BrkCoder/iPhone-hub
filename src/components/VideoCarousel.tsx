import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

gsap.registerPlugin(ScrollTrigger);

// VideoCarousel component to display a carousel of videos with progress indicators and controls
// This component uses GSAP for animations and ScrollTrigger for scroll-based interactions
const VideoCarousel = () => {
    const videoRef = useRef<HTMLVideoElement[]>([]);
    const videoSpanRef = useRef<HTMLSpanElement[]>([]);
    const videoDivRef = useRef<HTMLSpanElement[]>([]);

    // State to manage video playback and carousel navigation
    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const [loadedData, setLoadedData] = useState<SyntheticEvent<HTMLVideoElement, Event>[]>([]);
    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useGSAP(() => {
        // Animate carousel slider to move horizontally based on current video index
        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut", // Smooth easing animation - see https://gsap.com/docs/v3/Eases
        });

        // Trigger video playback when carousel enters viewport using ScrollTrigger
        gsap.to("#video", {
            scrollTrigger: {
                trigger: "#video",
                toggleActions: "restart none none none",
            },
            onComplete: () => {
                // Initialize video playback state when animation completes
                setVideo((pre) => ({
                    ...pre,
                    startPlay: true,
                    isPlaying: true,
                }));
            },
        });
    }, [isEnd, videoId]);

    useEffect(() => {
        let currentProgress = 0;
        const span = videoSpanRef.current;

        if (span[videoId]) {
            // Create GSAP animation for the circular progress indicator
            const anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    // Calculate and update progress percentage (0-100%)
                    const progress = Math.ceil(anim.progress() * 100);

                    if (progress != currentProgress) {
                        currentProgress = progress;

                        // Dynamically adjust progress bar width based on screen size
                        gsap.to(videoDivRef.current[videoId], {
                            width:
                                window.innerWidth < 760
                                    ? "10vw" // Mobile devices
                                    : window.innerWidth < 1200
                                        ? "10vw" // Tablet devices
                                        : "4vw", // Desktop/laptop devices
                        });

                        // Fill the progress bar with white color as video plays
                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "white",
                        });
                    }
                },

                // Reset progress bar appearance when video playback completes
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: "12px", // Return to default indicator size
                        });
                        gsap.to(span[videoId], {
                            backgroundColor: "#afafaf", // Change to inactive gray color
                        });
                    }
                },
            });

            // Restart animation for the first video in the sequence
            if (videoId == 0) {
                anim.restart();
            }

            // Function to sync animation progress with actual video playback time
            const animUpdate = () => {
                anim.progress(
                    videoRef.current[videoId].currentTime /
                    hightlightsSlides[videoId].videoDuration
                );
            };

            if (isPlaying) {
                // Add ticker to continuously update progress during playback
                gsap.ticker.add(animUpdate);
            } else {
                // Remove ticker when video is paused to stop progress updates
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoId, startPlay]);

    useEffect(() => {
        // Control video playback based on loading state and user interactions
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            } else if(startPlay) {
                videoRef.current[videoId].play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);

    // Handle different video carousel actions (play, pause, navigation, reset)
    const handleProcess = (type: string, i?: number) => {
        switch (type) {
            case "video-end":
                // Move to next video when current video ends
                setVideo((pre) => ({ ...pre, isEnd: true, videoId: i! + 1 }));
                break;

            case "video-last":
                // Mark when the last video in sequence has finished
                setVideo((pre) => ({ ...pre, isLastVideo: true }));
                break;

            case "video-reset":
                // Reset carousel to first video (replay functionality)
                setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
                break;

            case "pause":
                // Toggle pause state
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            case "play":
                // Toggle play state
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            default:
                return video;
        }
    };

    // Store video metadata events when videos are loaded (unused parameter prefixed with _)
    const handleLoadedMetaData = (_i: number, e: SyntheticEvent<HTMLVideoElement, Event>) => setLoadedData((pre) => [...pre, e]);

    return (
        <>
            {/* Main video carousel container with horizontal scrolling */}
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            {/* Video player container with rounded corners and black background */}
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline={true}
                                    className={`${
                                        list.id === 2 && "translate-x-44" // Special positioning for video 2
                                    } pointer-events-none`}
                                    preload="auto"
                                    muted
                                    ref={(el) => {
                                        if (el) videoRef.current[i] = el;
                                    }}
                                    onEnded={() =>
                                        i !== 3
                                            ? handleProcess("video-end", i)
                                            : handleProcess("video-last")
                                    }
                                    onPlay={() =>
                                        setVideo((pre) => ({ ...pre, isPlaying: true }))
                                    }
                                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>

                            {/* Text overlay positioned over the video */}
                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text, i) => (
                                    <p key={i} className="md:text-2xl text-xl font-medium">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress indicators and control button section */}
            <div className="relative flex-center mt-10">
                {/* Circular progress indicators for each video */}
                <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                    {videoRef.current.map((_, i) => (
                        <span
                            key={i}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                            ref={(el) => {
                                if (el) videoDivRef.current[i] = el;
                            }}
                        >
              <span
                  className="absolute h-full w-full rounded-full"
                  ref={(el) => {
                      if (el) videoSpanRef.current[i] = el;
                  }}
              />
            </span>
                    ))}
                </div>

                {/* Play/Pause/Replay control button */}
                <button className="control-btn">
                    <img
                        src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                        onClick={
                            isLastVideo
                                ? () => handleProcess("video-reset")
                                : !isPlaying
                                    ? () => handleProcess("play")
                                    : () => handleProcess("pause")
                        }
                    />
                </button>
            </div>
        </>
    );
};

export default VideoCarousel;