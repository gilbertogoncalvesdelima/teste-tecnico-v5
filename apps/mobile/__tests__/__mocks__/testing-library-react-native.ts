// Minimal @testing-library/react-native mock for Vitest (node environment)

import React from "react";

export function render(element: React.ReactElement) {
  // Use a simple recursive renderer
  const container = { children: [] as any[] };

  function processElement(el: any): any {
    if (el == null || typeof el === "boolean") return null;
    if (typeof el === "string" || typeof el === "number") return String(el);

    if (typeof el.type === "function") {
      const result = el.type(el.props);
      return processElement(result);
    }

    const children = React.Children.toArray(el.props?.children ?? []).map(processElement);
    return { type: el.type, props: el.props, children };
  }

  processElement(element);
  return { container };
}

export function act(fn: () => void) {
  fn();
}

export function fireEvent(element: any, event: string, data?: any) {
  // no-op in mock
}
