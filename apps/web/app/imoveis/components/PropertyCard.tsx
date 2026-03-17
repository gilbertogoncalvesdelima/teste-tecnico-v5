// apps/web/app/imoveis/components/PropertyCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { PropertySummary } from "@repo/shared/domain/Property";
import { normalizePriceToCents } from "@repo/shared/domain/PriceEngine";
import { formatPrice, formatArea, formatRooms } from "@/lib/formatters";

interface PropertyCardProps {
  property: PropertySummary;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

/**
 * ⚠️ BUGS neste componente:
 * 1. Não normaliza preço antes de formatar (luxo em reais vs centavos)
 * 2. Cria objetos inline no style que causam re-renders desnecessários
 * 3. A função onFavorite não previne propagação do evento (navega + favorita ao mesmo tempo)
 * 4. Imagem sem fallback se photos array estiver vazio
 */
export function PropertyCard({ property, onFavorite, isFavorited }: PropertyCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}
    >
      <Link href={`/imoveis/${property.slug}`}>
        <Image
          src={property.photos[0] ?? "/placeholder.jpg"}
          alt={property.title}
          width={400}
          height={300}
          style={{ objectFit: "cover", width: "100%", height: 200 }}
        />

        <div style={{ padding: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
            {property.title}
          </h3>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>
            {property.neighborhood}
          </p>

          <p style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
            {formatPrice(normalizePriceToCents(property))}
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 8, color: "#64748b", fontSize: 13 }}>
            <span>{formatArea(property.area)}</span>
            <span>{formatRooms(property.suites, "suite")}</span>
          </div>
        </div>
      </Link>

      {onFavorite && (
        <button
          onClick={() => onFavorite(property.id)}
          style={{
            margin: "0 16px 16px",
            padding: "8px 16px",
            background: isFavorited ? "#ef4444" : "#f1f5f9",
            color: isFavorited ? "#fff" : "#334155",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {isFavorited ? "♥ Favoritado" : "♡ Favoritar"}
        </button>
      )}
    </div>
  );
}
