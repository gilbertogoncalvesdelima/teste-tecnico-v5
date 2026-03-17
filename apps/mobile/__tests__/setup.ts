// apps/mobile/__tests__/setup.ts
// Global mocks for React Native modules in Vitest (node environment)

import { vi } from "vitest";
import React from "react";

// Suppress known noisy warnings from react-test-renderer (used to mock
// @testing-library/react-native in a node environment). These do not
// affect test correctness.
const _originalConsoleError = console.error;
const _originalConsoleWarn = console.warn;
const _suppressedPatterns = [
  /react-test-renderer is deprecated/,
  /inside a test was not wrapped in act/,
  /not configured to support act/,
  /Cannot log after tests are done/,
];
function _filtered(original: (...a: unknown[]) => void) {
  return (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (_suppressedPatterns.some((p) => p.test(msg))) return;
    original(...args);
  };
}
console.error = _filtered(_originalConsoleError) as typeof console.error;
console.warn = _filtered(_originalConsoleWarn) as typeof console.warn;

function createMockComponent(name: string) {
  const component = ({ children, ...props }: any) => {
    return React.createElement(name, props, children);
  };
  component.displayName = name;
  return component;
}

vi.mock("react-native", () => ({
  View: createMockComponent("View"),
  Text: createMockComponent("Text"),
  TouchableOpacity: createMockComponent("TouchableOpacity"),
  Image: createMockComponent("Image"),
  ScrollView: createMockComponent("ScrollView"),
  FlatList: createMockComponent("FlatList"),
  Animated: {
    View: createMockComponent("Animated.View"),
    Text: createMockComponent("Animated.Text"),
    Value: class AnimatedValue {
      _value: number;
      constructor(val: number) {
        this._value = val;
      }
      interpolate(config: any) {
        return this;
      }
    },
    event: () => () => {},
    createAnimatedComponent: (c: any) => c,
  },
  StyleSheet: {
    create: <T extends Record<string, any>>(styles: T): T => styles,
  },
  Platform: {
    OS: "ios",
    select: (obj: any) => obj.ios ?? obj.default,
  },
}));

vi.mock("react-native-reanimated", () => {
  const Animated = {
    View: createMockComponent("Animated.View"),
    Text: createMockComponent("Animated.Text"),
    createAnimatedComponent: (c: any) => c,
  };

  function useAnimatedStyle(fn: () => any) {
    return fn();
  }

  function interpolate(
    value: number,
    inputRange: number[],
    outputRange: number[],
    _extrapolation?: any
  ): number {
    if (value <= inputRange[0]) return outputRange[0];
    if (value >= inputRange[inputRange.length - 1])
      return outputRange[outputRange.length - 1];
    for (let i = 0; i < inputRange.length - 1; i++) {
      if (value >= inputRange[i] && value <= inputRange[i + 1]) {
        const ratio =
          (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
        return outputRange[i] + ratio * (outputRange[i + 1] - outputRange[i]);
      }
    }
    return outputRange[0];
  }

  const Extrapolation = { CLAMP: "clamp" };

  function useSharedValue(initial: number) {
    return { value: initial };
  }

  return {
    __esModule: true,
    default: Animated,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    useSharedValue,
  };
});

vi.mock("@shopify/flash-list", () => ({
  FlashList: createMockComponent("FlashList"),
}));

vi.mock("@testing-library/react-native", () => {
  const React = require("react");
  const TestRenderer = require("react-test-renderer");

  function render(element: React.ReactElement) {
    let renderer: any;
    TestRenderer.act(() => {
      renderer = TestRenderer.create(element);
    });
    return {
      ...renderer,
      unmount: () => renderer.unmount(),
      rerender: (el: React.ReactElement) => {
        TestRenderer.act(() => {
          renderer.update(el);
        });
      },
    };
  }

  function act(fn: () => void) {
    return TestRenderer.act(fn);
  }

  return { render, act, fireEvent: {} };
});
