import { cn } from "@/lib/utils/format";

/**
 * The Smiling Pets brand mark, inlined as SVG (crisp at any size, zero
 * extra network request, themeable). Paired with the wordmark rendered as
 * real HTML text in the app's own Poppins font — sharper and more
 * accessible than baking text into a raster/vector image.
 */
export function LogoMark({ className, tone = "green" }: { className?: string; tone?: "green" | "white" }) {
  if (tone === "white") {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className} role="img" aria-label="Smiling Pets">
        <ellipse cx="32" cy="36.5" rx="15.5" ry="12.6" fill="currentColor" />
        <circle cx="10.4" cy="18.4" r="4.2" fill="currentColor" />
        <circle cx="24.2" cy="12.3" r="4.2" fill="currentColor" />
        <circle cx="39.8" cy="12.3" r="4.2" fill="currentColor" />
        <circle cx="53.6" cy="18.4" r="4.2" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} role="img" aria-label="Smiling Pets">
      <rect x="0" y="0" width="64" height="64" rx="14" fill="#3fa24f" />
      <ellipse cx="32" cy="36.5" rx="14.1" ry="11.5" fill="#ffffff" />
      <circle cx="12.2" cy="19.6" r="3.8" fill="#ffffff" />
      <circle cx="24.6" cy="14.1" r="3.8" fill="#ffffff" />
      <circle cx="39.4" cy="14.1" r="3.8" fill="#ffffff" />
      <circle cx="51.8" cy="19.6" r="3.8" fill="#ffffff" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName = "h-9 w-9",
  wordmarkClassName = "text-lg",
  tone = "default",
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  /** "default": dark ink wordmark for light backgrounds. "white": full white lockup for the brand-green/dark backgrounds (splash, footer banners, etc). */
  tone?: "default" | "white";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={cn("shrink-0 rounded-[22%]", markClassName)} tone={tone === "white" ? "white" : "green"} />
      <span
        className={cn(
          "font-sans font-extrabold tracking-tight",
          tone === "white" ? "text-white" : "text-ink",
          wordmarkClassName
        )}
      >
        Smiling <span className={tone === "white" ? "text-white/90" : "text-brand-600"}>Pets</span>
      </span>
    </span>
  );
}
