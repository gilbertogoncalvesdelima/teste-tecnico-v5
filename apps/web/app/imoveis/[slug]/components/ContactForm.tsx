// apps/web/app/imoveis/[slug]/components/ContactForm.tsx
// ⛔ NÃO ALTERE ESTE ARQUIVO — testes dependem dele como está.
"use client";

import { useState } from "react";

interface ContactFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Olá, tenho interesse no imóvel "${propertyTitle}".`);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, name, email, phone, message }),
    });
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    boxSizing: "border-box" as const,
    outline: "none",
  };

  if (submitted) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          padding: 32,
          textAlign: "center",
          color: "#059669",
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Mensagem enviada!</p>
        <p style={{ marginTop: 8, color: "#64748b" }}>Entraremos em contato em até 24h.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: "28px 32px",
      }}
    >
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 24px 0" }}>
        Agendar visita
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", minHeight: 88 }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "14px 28px",
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          background: "#1a5fb4",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Enviar
      </button>
    </form>
  );
}
