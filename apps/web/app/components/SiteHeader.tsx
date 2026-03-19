"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SiteHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/imoveis?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/imoveis");
    }
  };

  return (
    <header
      style={{
        background: "#1a5fb4",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          flexWrap: "nowrap",
        }}
      >
        <div
          style={{
            width: 304,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link
            href="/imoveis"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                background: "#fff",
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1a5fb4",
                fontSize: 20,
              }}
              aria-hidden
            >
              ⌂
            </span>
            Portal Imobiliário
          </Link>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center", minWidth: 0 }}>
          <form
            onSubmit={handleSearch}
            style={{
              width: "100%",
              maxWidth: 520,
              display: "flex",
              background: "#fff",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            }}
          >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar imóveis, bairros ou cidades"
            style={{
              flex: 1,
              border: "none",
              padding: "12px 16px",
              fontSize: 16,
              outline: "none",
            }}
            aria-label="Buscar imóveis"
          />
          <select
            style={{
              border: "none",
              borderLeft: "1px solid #e2e8f0",
              padding: "0 12px",
              fontSize: 14,
              color: "#666",
              background: "#fff",
              cursor: "pointer",
            }}
            aria-label="Escopo da busca"
          >
            <option>em todo o site</option>
          </select>
          <button
            type="submit"
            style={{
              padding: "12px 16px",
              border: "none",
              background: "#fff",
              cursor: "pointer",
              color: "#333",
            }}
            aria-label="Pesquisar"
          >
            🔍
          </button>
          </form>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#fff",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            <span aria-hidden style={{ fontSize: 22, lineHeight: 1 }}>👤</span>
            Entrar
          </Link>
          <Link
            href="/imoveis"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#fff",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            <span aria-hidden style={{ fontSize: 22, lineHeight: 1 }}>♥</span>
            Favoritos
          </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
