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
    <div style={{ padding: 24, border: "1px solid #e2e8f0", borderRadius: 12 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
        Simulação de Custos
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label>
          Entrada: {downPaymentPct}%
          <input
            type="range"
            min={20}
            max={80}
            step={5}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>
          Prazo: {termYears} anos
          <input
            type="range"
            min={5}
            max={35}
            step={5}
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>Valor do imóvel</td>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9", textAlign: "right", fontWeight: 600 }}>
              {formatPrice(costs.basePrice)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>ITBI (3%)</td>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>
              {formatPrice(costs.itbi)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>Registro</td>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>
              {formatPrice(costs.registryFee)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0", fontWeight: 600 }}>Total</td>
            <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: 700, fontSize: 18 }}>
              {formatPrice(costs.total)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: 8 }}>Entrada ({downPaymentPct}%)</td>
            <td style={{ padding: 8, textAlign: "right" }}>
              {formatPrice(financing.downPayment)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: 8, fontWeight: 600 }}>Parcela mensal estimada</td>
            <td style={{ padding: 8, textAlign: "right", fontWeight: 700, color: "#059669" }}>
              {formatPrice(financing.monthlyPayment)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
