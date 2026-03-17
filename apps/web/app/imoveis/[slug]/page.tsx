// apps/web/app/imoveis/[slug]/page.tsx
// ⚠️ MÓDULO 2B: Refatore as boundaries server/client
"use client";

import { useEffect, useState } from "react";
import { GalleryClient } from "./components/GalleryClient";
import { PriceCalculator } from "./components/PriceCalculator";
import { ContactForm } from "./components/ContactForm";
import type { Property } from "@repo/shared/domain/Property";

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <p>Carregando...</p>;
  if (!property) return <p>Imóvel não encontrado</p>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      {/* Galeria (deve permanecer client) */}
      <GalleryClient photos={property.photos} title={property.title} />

      {/* Info do imóvel (pode ser server) */}
      <div style={{ marginTop: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>{property.title}</h1>
        <p style={{ fontSize: 18, color: "#64748b", marginTop: 4 }}>
          {property.neighborhood} · {property.area}m² · {property.suites} suítes
        </p>
        <p style={{ fontSize: 14, color: "#475569", marginTop: 16, lineHeight: 1.6 }}>
          {property.description}
        </p>
      </div>

      {/* Calculadora (deve permanecer client) */}
      <div style={{ marginTop: 32 }}>
        <PriceCalculator property={property} />
      </div>

      {/* Contato — NÃO MEXA */}
      <div style={{ marginTop: 32 }}>
        <ContactForm propertyId={property.id} propertyTitle={property.title} />
      </div>
    </div>
  );
}
