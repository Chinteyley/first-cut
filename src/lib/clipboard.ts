export type CopyResult = "copied" | "fallback";

export function shouldUseClipboardApi(isSecureContext: boolean, hasWriteText: boolean): boolean {
  return isSecureContext && hasWriteText;
}

export async function copyText(text: string): Promise<CopyResult> {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "fallback";
  const clipboard = navigator.clipboard;
  const canWrite = typeof clipboard?.writeText === "function";
  if (!shouldUseClipboardApi(window.isSecureContext, canWrite) || !clipboard?.writeText) {
    return "fallback";
  }
  try {
    await withTimeout(clipboard.writeText(text), 1200);
    return "copied";
  } catch {
    return "fallback";
  }
}

function withTimeout(work: Promise<void>, ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("clipboard timeout")), ms);
    work.then(
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      (error: unknown) => {
        window.clearTimeout(timer);
        reject(error instanceof Error ? error : new Error("clipboard failed"));
      },
    );
  });
}
