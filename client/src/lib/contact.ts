// Single source of truth for Jotah contact details.
export const PHONE_E164 = "919205617375";
export const PHONE_DISPLAY = "+91 92056 17375";
export const PREFILL = "What The Fun";
export const EMAIL = "shourya.pandey.ai@gmail.com";
export const ADDRESS = "Jotah Pvt. Ltd., WeWork Forum, Cybercity, Gurugram 122002";

export function whatsappLink(text: string = PREFILL) {
  return `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_URL = whatsappLink();
export const CALL_URL = `tel:+${PHONE_E164}`;

export const STORES = [
  { name: "Zepto", tagline: "Search “Jotah” on Zepto", href: "https://www.zeptonow.com/search?query=jotah", color: "#5B1D8F" },
  { name: "Blinkit", tagline: "Search “Jotah” on Blinkit", href: "https://blinkit.com/s/?q=jotah", color: "#F8CB46", ink: true },
  { name: "Instamart", tagline: "Search “Jotah” on Swiggy Instamart", href: "https://www.swiggy.com/instamart/search?query=jotah", color: "#FC8019" },
];
