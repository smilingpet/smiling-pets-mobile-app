/**
 * Smiling Pets icon system.
 *
 * A single, consistent set of line icons (24x24 viewBox, currentColor
 * stroke, rounded caps/joins) used everywhere in the app instead of Unicode
 * emoji. Pass a className to control size/colour, e.g. `className="h-5 w-5
 * text-brand-600"`.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h3a1 1 0 0 0 1-1v-9" stroke="currentColor" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" />
      <path d="M4.8 19.5c1.2-3.3 4-5 7.2-5s6 1.7 7.2 5" stroke="currentColor" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 4h1.8l1 2m0 0 2 8.4a1.6 1.6 0 0 0 1.6 1.3h7.4a1.6 1.6 0 0 0 1.6-1.3L20.5 8H6.3" stroke="currentColor" />
      <circle cx="9.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" stroke="currentColor" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" stroke="currentColor" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 13 4 4L19 7" stroke="currentColor" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.8 21 19H3L12 3.8Z" stroke="currentColor" />
      <path d="M12 10v4" stroke="currentColor" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 14.5 9l6 .9-4.3 4.2 1 6-5.2-2.8L7 20.1l1-6L3.7 9.9l6-.9L12 3.5Z" stroke="currentColor" />
    </svg>
  );
}

export function HeadsetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1M4 13v4a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1Zm16 0v4a2 2 0 0 1-2 2h-1v-6h2a1 1 0 0 1 1 1Z" stroke="currentColor" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 19 6v5.5c0 5-3 8-7 9-4-1-7-4-7-9V6l7-2.5Z" stroke="currentColor" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" />
    </svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="9.5" width="16" height="10.5" rx="1.2" stroke="currentColor" />
      <path d="M4 13h16" stroke="currentColor" />
      <path d="M12 9.5v10.5" stroke="currentColor" />
      <path d="M12 9.5c-1.6 0-4.5-.6-4.5-3.2A2.3 2.3 0 0 1 9.8 4c2.1 0 2.2 3.6 2.2 5.5Zm0 0c1.6 0 4.5-.6 4.5-3.2A2.3 2.3 0 0 0 14.2 4c-2.1 0-2.2 3.6-2.2 5.5Z" stroke="currentColor" />
    </svg>
  );
}

export function PawIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <ellipse cx="12" cy="14.4" rx="5.2" ry="4.1" />
      <circle cx="4.9" cy="8.2" r="1.9" />
      <circle cx="9.4" cy="5.4" r="1.9" />
      <circle cx="14.6" cy="5.4" r="1.9" />
      <circle cx="19.1" cy="8.2" r="1.9" />
    </svg>
  );
}

export function DogIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 10c-1.5-1.7-1.4-4.6.6-5.4 1.4-.6 2 .8 2 2" stroke="currentColor" />
      <path d="M18 10c1.5-1.7 1.4-4.6-.6-5.4-1.4-.6-2 .8-2 2" stroke="currentColor" />
      <path d="M6.5 9.5c0-2.5 2.4-4.3 5.5-4.3s5.5 1.8 5.5 4.3c0 1.6-.7 2.4-1.3 3.3-.5.8-.9 1.6-.9 2.9 0 2.4-1.5 3.8-3.3 3.8s-3.3-1.4-3.3-3.8c0-1.3-.4-2.1-.9-2.9-.6-.9-1.3-1.7-1.3-3.3Z" stroke="currentColor" />
      <circle cx="10.1" cy="10.3" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="13.9" cy="10.3" r="0.7" fill="currentColor" stroke="none" />
      <path d="M11.3 12.4h1.4l-.7 1Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 5 8 10" stroke="currentColor" />
      <path d="M17.5 5 16 10" stroke="currentColor" />
      <path d="M8 10c0-2.2 1.8-3.4 4-3.4s4 1.2 4 3.4-1.6 6.8-4 6.8-4-4.6-4-6.8Z" stroke="currentColor" />
      <path d="M9.2 17c0 2 1.2 3.2 2.8 3.2s2.8-1.2 2.8-3.2" stroke="currentColor" />
      <circle cx="10.2" cy="10.6" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="13.8" cy="10.6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BirdIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 13.5c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.2c0 2.7-2.2 4.8-5.3 5.4l-.7 1.9-1.3-1.7c-3.9-.2-6.7-2.5-6.7-5.3Z" stroke="currentColor" />
      <path d="M19 11c1.2-.4 2-.2 2.5.4-1 .6-1.7.5-2.3.1" stroke="currentColor" />
      <circle cx="15.6" cy="11.3" r="0.75" fill="currentColor" stroke="none" />
      <path d="M9 15.3c1 .5 2.2.7 3.3.5" stroke="currentColor" />
    </svg>
  );
}

export function FishIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12c2.8-3.4 6-5.1 9-5.1 3.6 0 6.4 2.3 7 5.1-.6 2.8-3.4 5.1-7 5.1-3 0-6.2-1.7-9-5.1Z" stroke="currentColor" />
      <path d="M20 12c1 -.9 1.6-.9 2 0-.4.9-1 .9-2 0Z" stroke="currentColor" />
      <circle cx="9.3" cy="10.6" r="0.75" fill="currentColor" stroke="none" />
      <path d="M6.5 12c1 1 1 2 .5 3" stroke="currentColor" />
    </svg>
  );
}

export function PercentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 18 18 6" stroke="currentColor" />
      <circle cx="7.5" cy="7.5" r="2.3" stroke="currentColor" />
      <circle cx="16.5" cy="16.5" r="2.3" stroke="currentColor" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M6.6 10.8c1.2 2.4 3.2 4.3 5.6 5.6l1.9-1.9c.2-.2.6-.3.9-.2 1 .3 2 .5 3.1.5.5 0 .9.4.9.9V19c0 .5-.4.9-.9.9C10 19.9 4.1 14 4.1 5.9c0-.5.4-.9.9-.9h3.3c.5 0 .9.4.9.9 0 1.1.2 2.1.5 3.1.1.3 0 .7-.2.9L6.6 10.8Z"
        stroke="currentColor"
      />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" stroke="currentColor" />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M6 7h12M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M8 7l.7 12a1 1 0 0 0 1 1h4.6a1 1 0 0 0 1-1L16 7"
        stroke="currentColor"
      />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5v11" stroke="currentColor" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" stroke="currentColor" />
      <path d="M5 18.5h14" stroke="currentColor" />
    </svg>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" stroke="currentColor" />
      <path d="M4 8l8 4.5L20 8" stroke="currentColor" />
      <path d="M12 12.5V21" stroke="currentColor" />
    </svg>
  );
}

export function SearchOffIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" />
      <path d="m20 20-3.2-3.2M8.5 8.5l5 5" stroke="currentColor" />
    </svg>
  );
}

export function ImageOffIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" />
      <path d="m6 15 3.5-4 2.5 3 2-2.2L18 15" stroke="currentColor" />
      <circle cx="9" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h7l4 4v13H7z" stroke="currentColor" />
      <path d="M14 3.5v4h4" stroke="currentColor" />
      <path d="M9.5 12.5h5M9.5 15.5h5" stroke="currentColor" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
      <path
        d="M12 3.5v2M12 18.5v2M4.6 6.6l1.4 1.4M18 16l1.4 1.4M3.5 12h2M18.5 12h2M4.6 17.4 6 16M18 8l1.4-1.4"
        stroke="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M14 8.5h2V5.5h-2c-2 0-3.5 1.6-3.5 3.5v2H8.5v3H10.5v7h3v-7h2l.5-3h-2.5v-2c0-.5.4-1 1-1Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" stroke="currentColor" />
      <path d="M7 5H4v1.5A3.5 3.5 0 0 0 7 10" stroke="currentColor" />
      <path d="M17 5h3v1.5A3.5 3.5 0 0 1 17 10" stroke="currentColor" />
      <path d="M12 14v3.5M9 20.5h6M9.5 20.5c0-1.8.5-2.6 1-3h3c.5.4 1 1.2 1 3" stroke="currentColor" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M11 3.5c.6 2.8 1.6 3.8 4.4 4.4-2.8.6-3.8 1.6-4.4 4.4-.6-2.8-1.6-3.8-4.4-4.4 2.8-.6 3.8-1.6 4.4-4.4Z" stroke="currentColor" strokeLinejoin="round" />
      <path d="M18 13c.4 1.7 1 2.3 2.7 2.7-1.7.4-2.3 1-2.7 2.7-.4-1.7-1-2.3-2.7-2.7 1.7-.4 2.3-1 2.7-2.7Z" stroke="currentColor" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C10 9 9.5 7.7 9.3 7.2c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3Z" />
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.6.9 3.4 1.3 5.2 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2Zm0 18.2c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3 1 1-2.9-.2-.3A8.2 8.2 0 0 1 3.8 12c0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8.2-8.2 8.2Z" />
    </svg>
  );
}
