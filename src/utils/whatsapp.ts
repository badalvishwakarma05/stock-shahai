import { KiranaItem } from '../types';
import toast from 'react-hot-toast';

/**
 * Generates a clean, readable text string in Hindi/Hinglish or English
 * formatted specifically for kirana supplier reorders on WhatsApp.
 *
 * Example Output:
 * Bhaiya, kripya niche likha saaman bhej dein:
 * 1. Aashirvaad Aata 10kg - [Require: 2 pkt]
 * 2. Tata Salt 1kg - [Require: 6 pkt]
 */
export const generateWhatsAppOrder = (items: KiranaItem[], greeting?: string): string => {
  if (!items || items.length === 0) return '';

  const headerGreeting = greeting || `Bhaiya, kripya niche likha saaman bhej dein:\n`;
  let message = headerGreeting;

  items.forEach((item, index) => {
    // Calculate required quantity (Target Stock - Current Stock, minimum 1)
    const rawDeficit = item.reorderThreshold - item.stock;
    const requiredQty = Math.max(1, Math.round(rawDeficit * 100) / 100);
    const unitStr = item.unit ? ` ${item.unit}` : ' pkt';

    message += `${index + 1}. ${item.name} - [Require: ${requiredQty}${unitStr}]\n`;
  });

  return message.trim();
};

/**
 * Serverless WhatsApp Sync Handler:
 * Triggers the local device WhatsApp deep link (whatsapp://send?text=...).
 * Works completely offline / in Airplane Mode (WhatsApp queues the message in outbox).
 * Fallback: Copies text to clipboard and shows snappy toast if app fails to launch (e.g. PC testing).
 */
export const sendWhatsAppOrder = async (
  items: KiranaItem[],
  customGreeting?: string,
  fallbackMsg?: string,
  emptyMsg?: string
): Promise<void> => {
  if (!items || items.length === 0) {
    toast(emptyMsg || 'Koi bhi maal khatam nahi hai! Sab stock pura hai.', {
      icon: '✅',
      duration: 2500,
    });
    return;
  }

  const message = generateWhatsAppOrder(items, customGreeting);
  const encodedText = encodeURIComponent(message);
  const deepLink = `whatsapp://send?text=${encodedText}`;

  // 1. Copy message text to clipboard immediately as guaranteed backup
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // ignore clipboard permission error
    }
  }

  // 2. Track window blur to detect if native WhatsApp successfully took focus
  let appOpened = false;
  const onWindowBlur = () => {
    appOpened = true;
    window.removeEventListener('blur', onWindowBlur);
  };
  window.addEventListener('blur', onWindowBlur);

  // 3. Trigger WhatsApp deep link
  try {
    window.location.href = deepLink;
  } catch {
    // Synchronous failure (unsupported protocol)
    toast(fallbackMsg || 'WhatsApp open nahi ho paaya, link copy ho gaya hai', {
      icon: '📋',
      duration: 3500,
    });
    return;
  }

  // 4. Fallback check: If the page still has focus after 1.2s, the protocol handler likely failed
  setTimeout(() => {
    window.removeEventListener('blur', onWindowBlur);
    if (!appOpened && document.hasFocus()) {
      toast(fallbackMsg || 'WhatsApp open nahi ho paaya, link copy ho gaya hai', {
        icon: '📋',
        duration: 3500,
      });
    }
  }, 1200);
};
