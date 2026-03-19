// apps/web/app/imoveis/[slug]/components/GalleryClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryClientProps {
  photos: string[];
  title: string;
}

const arrowBtnBase = {
  position: "absolute" as const,
  top: "50%",
  transform: "translateY(-50%)",
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.95)",
  color: "#1a1a1a",
  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
  transition: "background 0.2s, box-shadow 0.2s",
};

export function GalleryClient({ photos, title }: GalleryClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCurrentIndex(0);
    photos.forEach((src, i) => {
      const img = new window.Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(i));
      };
      img.src = src;
    });
  }, [photos]);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (photos.length === 0) {
    return <div><p>Nenhuma foto disponível</p></div>;
  }

  return (
    <div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
        <Image
          src={photos[currentIndex]}
          alt={`${title} - Foto ${currentIndex + 1}`}
          fill
          style={{ objectFit: "cover", borderRadius: 12 }}
          priority={currentIndex === 0}
        />

        <button
          type="button"
          onClick={goPrev}
          aria-label="Foto anterior"
          style={{ ...arrowBtnBase, left: 16 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.95)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Próxima foto"
          style={{ ...arrowBtnBase, right: 16 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.95)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto" }}>
        {photos.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            style={{
              border: i === currentIndex ? "2px solid #1a5fb4" : "2px solid transparent",
              borderRadius: 8,
              padding: 0,
              cursor: "pointer",
              opacity: loadedImages.has(i) ? 1 : 0.5,
              flexShrink: 0,
            }}
          >
            <Image
              src={src}
              alt={`Thumbnail ${i + 1}`}
              width={80}
              height={60}
              style={{ objectFit: "cover", borderRadius: 6 }}
            />
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
        }}
        role="tablist"
        aria-label="Posição das fotos"
      >
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Foto ${i + 1}`}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: i === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === currentIndex ? "#1a5fb4" : "rgba(0,0,0,0.2)",
              transition: "width 0.2s, background 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
