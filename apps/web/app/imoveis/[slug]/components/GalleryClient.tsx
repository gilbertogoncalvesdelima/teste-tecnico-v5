// apps/web/app/imoveis/[slug]/components/GalleryClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryClientProps {
  photos: string[];
  title: string;
}

/**
 * ⚠️ BUGS:
 * 1. useEffect com dependência faltando (photos) — se photos mudar, não atualiza
 * 2. Não trata array vazio (crash no acesso a index 0)
 * 3. Preloads TODAS as imagens de uma vez, destruindo performance
 * 4. Estado do index pode ficar inválido se photos mudar com menos itens
 * 5. Keyboard navigation não funciona (onKeyDown no div sem tabIndex)
 */
export function GalleryClient({ photos, title }: GalleryClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // BUG 1: Preload de TODAS as imagens de uma vez
  useEffect(() => {
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

        {/* Navigation buttons */}
        <button
          onClick={goPrev}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            cursor: "pointer",
          }}
          aria-label="Foto anterior"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            cursor: "pointer",
          }}
          aria-label="Próxima foto"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto" }}>
        {photos.map((src, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              border: i === currentIndex ? "2px solid #0f172a" : "2px solid transparent",
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

      <p style={{ textAlign: "center", color: "#64748b", marginTop: 8 }}>
        {currentIndex + 1} / {photos.length}
      </p>
    </div>
  );
}
