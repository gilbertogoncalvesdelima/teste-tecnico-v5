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

  if (submitted) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#059669" }}>
        <p style={{ fontSize: 18, fontWeight: 600 }}>Mensagem enviada!</p>
        <p>Entraremos em contato em até 24h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 24, border: "1px solid #e2e8f0", borderRadius: 12 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Agendar visita</h3>
      <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
      <button type="submit">Enviar</button>
    </form>
  );
}
