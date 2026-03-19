// vitest.workspace.ts
import { defineWorkspace } from "vitest/config";
import path from "path";

export default defineWorkspace([
  {
    esbuild: {
      jsx: "automatic",
    },
    test: {
      name: "web",
      environment: "jsdom",
      include: ["apps/web/__tests__/**/*.test.{ts,tsx}"],
      globals: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "apps/web"),
        "@repo/shared": path.resolve(__dirname, "packages/shared"),
        "@repo/web": path.resolve(__dirname, "apps/web"),
      },
    },
  },
  {
    esbuild: {
      jsx: "automatic",
    },
    test: {
      name: "mobile",
      environment: "jsdom",
      include: ["apps/mobile/__tests__/**/*.test.{ts,tsx}"],
      globals: true,
      setupFiles: ["apps/mobile/__tests__/setup.ts"],
    },
    resolve: {
      alias: {
        "@repo/shared": path.resolve(__dirname, "packages/shared"),
      },
    },
  },
  {
    test: {
      name: "shared",
      environment: "node",
      include: ["packages/**/__tests__/**/*.test.{ts,tsx}"],
      globals: true,
    },
    resolve: {
      alias: {
        "@repo/shared": path.resolve(__dirname, "packages/shared"),
      },
    },
  },
]);
