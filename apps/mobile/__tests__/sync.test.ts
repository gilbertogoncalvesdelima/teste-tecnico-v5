// apps/mobile/__tests__/sync.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOfflineQueue, type ProcessResult } from "../src/hooks/useOfflineQueue";

describe("useOfflineQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("enqueues and processes operation with success → status DONE", async () => {
    const executor = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useOfflineQueue({ executor, maxRetries: 2 })
    );

    act(() => {
      result.current.enqueue({
        type: "UPDATE_STATUS",
        entityId: "1",
        payload: { status: "reserved" },
      });
    });

    expect(result.current.pending).toHaveLength(1);
    expect(result.current.pending[0].status).toBe("PENDING");

    let processPromise: Promise<unknown>;
    act(() => {
      processPromise = result.current.processQueue();
    });

    await act(async () => {
      await processPromise;
    });

    expect(executor).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toHaveLength(0);
  });

  it("retries with backoff after executor failure", async () => {
    const executor = vi.fn().mockRejectedValueOnce(new Error("fail")).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() =>
      useOfflineQueue({ executor, maxRetries: 3 })
    );

    act(() => {
      result.current.enqueue({ type: "ADD_NOTE", entityId: "1", payload: { note: "x" } });
    });

    let processPromise: Promise<unknown>;
    act(() => {
      processPromise = result.current.processQueue();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(executor).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(executor).toHaveBeenCalledTimes(2);

    await act(async () => {
      await processPromise;
    });

    expect(executor).toHaveBeenCalledTimes(2);
    expect(result.current.pending).toHaveLength(0);
  });

  it("does not duplicate operation with same entityId + type (idempotence)", () => {
    const executor = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useOfflineQueue({ executor }));

    act(() => {
      result.current.enqueue({ type: "UPDATE_STATUS", entityId: "1", payload: {} });
      result.current.enqueue({ type: "UPDATE_STATUS", entityId: "1", payload: {} });
    });

    expect(result.current.pending).toHaveLength(1);
  });

  it("marks as FAILED after maxRetries attempts", async () => {
    const executor = vi.fn().mockRejectedValue(new Error("always fail"));
    const { result } = renderHook(() =>
      useOfflineQueue({ executor, maxRetries: 5 })
    );

    act(() => {
      result.current.enqueue({ type: "ADD_PHOTO", entityId: "1", payload: { url: "x" } });
    });

    let processPromise: Promise<unknown>;
    act(() => {
      processPromise = result.current.processQueue();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000);
    });

    let processResult: { processed: number; failed: number; skipped: number };
    await act(async () => {
      processResult = await processPromise as { processed: number; failed: number; skipped: number };
    });

    expect(executor).toHaveBeenCalledTimes(5);
    expect(processResult!.failed).toBe(1);
    expect(processResult!.processed).toBe(0);
  });

  it("skips processing when processQueue is already running", async () => {
    let resolveFirst: () => void;
    const firstPromise = new Promise<void>((r) => {
      resolveFirst = r;
    });
    const executor = vi.fn().mockImplementation(() => firstPromise);
    const { result } = renderHook(() => useOfflineQueue({ executor }));

    act(() => {
      result.current.enqueue({ type: "UPDATE_STATUS", entityId: "1", payload: {} });
    });

    let p1: Promise<ProcessResult>;
    let p2: Promise<ProcessResult>;
    act(() => {
      p1 = result.current.processQueue();
      p2 = result.current.processQueue();
    });

    const r2 = await p2;
    expect(r2.skipped).toBe(1);
    expect(r2.processed).toBe(0);

    act(() => {
      resolveFirst!();
    });
    const r1 = await p1;
    expect(r1.processed).toBe(1);
    expect(r1.skipped).toBe(0);
  });
});
