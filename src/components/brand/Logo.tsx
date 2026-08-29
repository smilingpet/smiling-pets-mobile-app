import Image from "next/image";
import { cn } from "@/lib/utils/format";

/**
 * The official Smiling Pets logo, saved locally at
 * public/brand/smiling-pets-logo.png so the app never depends on the
 * external smilingpets.in site to load its own branding. Used at its
 * native aspect ratio (240x225, ~1.07:1) everywhere — never stretched,
 * cropped, or redrawn.
 */
const LOGO_SRC = "/brand/smiling-pets-logo.png";
const LOGO_ASPECT = 240 / 225;

export function Logo({
  className,
  height = 40,
  priority = false,
}: {
  className?: string;
  /** Rendered height in px; width is derived from the logo's real aspect ratio. */
  height?: number;
  priority?: boolean;
}) {
  const width = Math.round(height * LOGO_ASPECT);
  return (
    <Image
      src={LOGO_SRC}
      alt="Smiling Pets — My Pet. My World."
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto object-contain", className)}
      style={{ height, width: "auto" }}
    />
  );
}

/**
 * A round white "badge" wrapper for placing the logo on a solid brand-green
 * background (splash screen, install prompt) where the logo — which has
 * its own multi-colour palette designed for a white background — needs a
 * white backdrop to stay true to the brand and remain clearly legible.
 */
export function LogoBadge({
  size = 72,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("flex items-center justify-center rounded-full bg-white shadow-lg", className)}
      style={{ width: size, height: size, padding: size * 0.16 }}
    >
      <Logo height={size * 0.68} />
    </span>
  );
}
