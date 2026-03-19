"use client";

import { GalleryClient } from "./GalleryClient";
import { PriceCalculator } from "./PriceCalculator";
import { ContactForm } from "./ContactForm";
import type { Property } from "@repo/shared/domain/Property";

interface PropertyPageClientProps {
  property: Property;
}

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  overflow: "hidden" as const,
};

export function PropertyPageClient({ property }: PropertyPageClientProps) {
  return (
    <div
      style={{
        width: "100%",
        padding: "0 8px 48px",
        background: "#f8fafc",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div style={{ ...cardStyle, marginBottom: 24, padding: 20 }}>
        <GalleryClient photos={property.photos} title={property.title} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ ...cardStyle, padding: "28px 32px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            {property.title}
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", marginTop: 8, marginBottom: 0 }}>
            {property.neighborhood} · {property.area} m² · {property.suites} suítes
          </p>
          <p
            style={{
              fontSize: 15,
              color: "#475569",
              marginTop: 20,
              marginBottom: 0,
              lineHeight: 1.7,
            }}
          >
            {property.description}
          </p>
        </div>
        <div>
          <PriceCalculator property={property} />
        </div>
      </div>

      <div>
        <ContactForm propertyId={property.id} propertyTitle={property.title} />
      </div>
    </div>
  );
}
