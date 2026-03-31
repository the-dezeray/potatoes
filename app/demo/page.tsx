"use client";
import React, { useEffect, useRef } from 'react';

// 1. Move your videos to the /public folder in your Next.js project
const VIDEO_DATA = [
  { id: 1, url: "/n2.mp4", title: "insight" },
  { id: 2, url: "/a.mp4", title: "figma designs" },
  { id: 3, url: "/b.mp4", title: "framer designs" },
];

const VideoItem = ({ video }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // IntersectionObserver needs to be inside useEffect for Next.js/SSR
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(err => {
            // Chrome/Safari often block auto-play if not muted or no user interaction
            console.log("Autoplay prevented", err);
          });
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
      },
      { threshold: 0.6 } 
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={sectionStyle}>
      <video
        ref={videoRef}
        src={video.url}
        style={videoStyle}
        loop
        muted // Required for autoplay in most browsers
        playsInline // Required for iOS support
      />
      <div style={titleStyle}>{video.title}</div>
    </section>
  );
};

export default function VideoFeed() {
  return (
    <main style={containerStyle}>
      {VIDEO_DATA.map((video) => (
        <VideoItem key={video.id} video={video} />
      ))}
    </main>
  );
}

// --- Styles ---

const containerStyle = {
  height: '100vh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth',
  backgroundColor: '#fff',
  width: '100%',
};

const sectionStyle = {
  height: '100vh',
  width: '100%',
  scrollSnapAlign: 'start',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const videoStyle = {
  height: '80vh', 
  width: 'auto',
  maxWidth: '90%',
  borderRadius: '12px',
  objectFit: 'cover',
  backgroundColor: '#f0f0f0', // Placeholder color while loading
};

const titleStyle = {
  position: 'absolute',
  bottom: '8vh',
  left: '10vw',
  fontSize: '0.75rem',
  letterSpacing: '0.2rem',
  textTransform: 'uppercase',
  color: '#888',
};