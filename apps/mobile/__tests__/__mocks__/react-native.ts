// Minimal react-native mock for Vitest (node environment)

import React from "react";

function createMockComponent(name: string) {
  const component = ({ children, ...props }: any) => {
    return React.createElement(name, props, children);
  };
  component.displayName = name;
  return component;
}

export const View = createMockComponent("View");
export const Text = createMockComponent("Text");
export const TouchableOpacity = createMockComponent("TouchableOpacity");
export const Image = createMockComponent("Image");
export const ScrollView = createMockComponent("ScrollView");
export const FlatList = createMockComponent("FlatList");
export const Animated = {
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
};
export const StyleSheet = {
  create: <T extends Record<string, any>>(styles: T): T => styles,
};
export const Platform = {
  OS: "ios",
  select: (obj: any) => obj.ios ?? obj.default,
};

export default {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Animated,
  StyleSheet,
  Platform,
};
