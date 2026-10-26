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
    await clipboard.writeText(text);
    return "copied";
  } catch {
    return "fallback";
  }
}
