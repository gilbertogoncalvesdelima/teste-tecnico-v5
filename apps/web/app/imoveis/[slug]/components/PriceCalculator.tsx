// apps/web/app/imoveis/[slug]/components/PriceCalculator.tsx
"use client";

import { useState, useMemo } from "react";
import type { Property } from "@repo/shared/domain/Property";
import { calculateAcquisitionCosts } from "@repo/shared/domain/PriceEngine";
import { formatPrice } from "@/lib/formatters";

interface PriceCalculatorProps {
  property: Property;
}

/**
 * Calculadora de custos de aquisição.
 *
 * ⚠️ BUGS (consequência do bug no PriceEngine):
 * 1. Chama calculateAcquisitionCosts sem normalizar o preço para centavos
 *    Para imóveis de luxo (priceInReais=true), os valores ficam absurdamente errados
 * 2. O financiamento calcula parcela sobre o preço bruto (sem normalizar)
 * 3. A entrada mínima (20%) é calculada sobre valor errado para luxo
 */
export function PriceCalculator({ property }: PriceCalculatorProps) {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [termYears, setTermYears] = useState(30);
  const annualRate = 0.0999; // 9.99% a.a.

  // BUG: calculateAcquisitionCosts não normaliza preço internamente
  const costs = useMemo(() => calculateAcquisitionCosts(property), [property]);

  const financing = useMemo(() => {
    const downPayment = Math.round(costs.basePrice * (downPaymentPct / 100));
    const principal = costs.basePrice - downPayment;
    const monthlyRate = annualRate / 12;
    const totalMonths = termYears * 12;

    // Parcela pela tabela Price
    const monthlyPayment =
      principal > 0
        ? Math.round(
            (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
              (Math.pow(1 + monthlyRate, totalMonths) - 1)
          )
        : 0;

    return { downPayment, principal, monthlyPayment };
  }, [costs.basePrice, downPaymentPct, termYears, annualRate]);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: "28px 32px",
      }}
    >
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 24px 0" }}>
        Simulação de Custos
      </h3>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>Entrada</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a5fb4" }}>{downPaymentPct}%</span>
        </div>
        <input
          type="range"
          min={20}
          max={80}
          step={5}
          value={downPaymentPct}
          onChange={(e) => setDownPaymentPct(Number(e.target.value))}
          aria-label="Entrada"
          style={{
            width: "100%",
            height: 8,
            borderRadius: 4,
            accentColor: "#1a5fb4",
          }}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>Prazo</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a5fb4" }}>{termYears} anos</span>
        </div>
        <input
          type="range"
          min={5}
          max={35}
          step={5}
          value={termYears}
          onChange={(e) => setTermYears(Number(e.target.value))}
          aria-label="Prazo"
          style={{
            width: "100%",
            height: 8,
            borderRadius: 4,
            accentColor: "#1a5fb4",
          }}
        />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
        <tbody>
          <tr>
            <td style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", color: "#64748b" }}>
              Valor do imóvel
            </td>
            <td style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", textAlign: "right", fontWeight: 600, color: "#0f172a" }}>
              {formatPrice(costs.basePrice)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", color: "#64748b" }}>ITBI (3%)</td>
            <td style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#334155" }}>
              {formatPrice(costs.itbi)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", color: "#64748b" }}>Registro</td>
            <td style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#334155" }}>
              {formatPrice(costs.registryFee)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "14px 0", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#0f172a" }}>Total</td>
            <td style={{ padding: "14px 0", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: 700, fontSize: 18, color: "#0f172a" }}>
              {formatPrice(costs.total)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "12px 0", color: "#64748b" }}>Entrada ({downPaymentPct}%)</td>
            <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 600, color: "#334155" }}>
              {formatPrice(financing.downPayment)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "14px 0", fontWeight: 700, color: "#0f172a" }}>Parcela mensal estimada</td>
            <td style={{ padding: "14px 0", textAlign: "right", fontWeight: 700, fontSize: 18, color: "#059669" }}>
              {formatPrice(financing.monthlyPayment)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
