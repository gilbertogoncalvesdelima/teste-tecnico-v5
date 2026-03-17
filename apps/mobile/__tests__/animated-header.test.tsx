// apps/mobile/__tests__/animated-header.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

/**
 * Estes testes verificam que o AnimatedHeader:
 * 1. Usa Reanimated (não Animated da RN)
 * 2. Interpola com clamp correto
 * 3. Exporta um componente funcional
 *
 * Para que passem, o candidato deve reescrever o header com Reanimated 3.
 */

const mockUseAnimatedStyle = vi.fn((fn) => fn());
const mockInterpolate = vi.fn((value, inputRange, outputRange, extrapolation) => {
  const t = Math.max(0, Math.min(1,
    (value - inputRange[0]) / (inputRange[1] - inputRange[0])
  ));
  return outputRange[0] + t * (outputRange[1] - outputRange[0]);
});

// Mock react-native-reanimated
vi.mock("react-native-reanimated", () => ({
  default: {
    View: ({ children }: any) => children,
    createAnimatedComponent: (c: any) => c,
  },
  useAnimatedStyle: mockUseAnimatedStyle,
  useSharedValue: vi.fn((val) => ({ value: val })),
  interpolate: mockInterpolate,
  Extrapolation: {
    CLAMP: "clamp",
    EXTEND: "extend",
    IDENTITY: "identity",
  },
  withTiming: vi.fn((val) => val),
  withSpring: vi.fn((val) => val),
  useAnimatedScrollHandler: vi.fn(() => vi.fn()),
}));

beforeEach(() => {
  mockUseAnimatedStyle.mockClear();
  mockInterpolate.mockClear();
});

describe("AnimatedHeader", () => {
  // ❌ FALHA — o componente atual importa de "react-native" não "react-native-reanimated"
  it("usa Reanimated em vez de Animated nativo", async () => {
    // Importa o componente — se ele usa react-native-reanimated, o mock será chamado
    const mod = await import("../src/components/AnimatedHeader");
    expect(mod.AnimatedHeader).toBeDefined();
    expect(typeof mod.AnimatedHeader).toBe("function");

    // Renderiza para acionar os hooks
    const { useSharedValue } = await import("react-native-reanimated");
    const scrollY = (useSharedValue as any)(0);
    mod.AnimatedHeader({ title: "Test", scrollY });

    // Se the component uses Reanimated, useAnimatedStyle should have been called
    expect(mockUseAnimatedStyle).toHaveBeenCalled();
  });

  // ❌ FALHA — interpolações atuais não usam CLAMP
  it("usa extrapolation CLAMP em todas as interpolações", async () => {
    const mod = await import("../src/components/AnimatedHeader");
    const { useSharedValue, Extrapolation } = await import("react-native-reanimated");
    const scrollY = (useSharedValue as any)(0);

    mod.AnimatedHeader({ title: "Test", scrollY });

    // interpolate deve ter sido chamado pelo menos uma vez
    expect(mockInterpolate).toHaveBeenCalled();

    // Cada chamada de interpolate deve usar Extrapolation.CLAMP
    for (const call of mockInterpolate.mock.calls) {
      const extrapolation = call[3];
      expect(extrapolation).toBe((Extrapolation as any).CLAMP);
    }
  });

  // ❌ FALHA — deve usar useAnimatedStyle
  it("usa useAnimatedStyle para estilos animados", async () => {
    const mod = await import("../src/components/AnimatedHeader");
    const { useSharedValue } = await import("react-native-reanimated");
    const scrollY = (useSharedValue as any)(0);

    mockUseAnimatedStyle.mockClear();
    mod.AnimatedHeader({ title: "Test", scrollY });

    expect(mockUseAnimatedStyle).toHaveBeenCalled();
  });
});
