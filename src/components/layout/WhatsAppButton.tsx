import { whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/Icons";

export function WhatsAppButton({ message }: { message?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Smiling Pets on WhatsApp"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-hover active:scale-95"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
