# 🛒 Apna Digital Khata (अपना डिजिटल खाता)
### Offline-First Kirana Reorder & Sales Khata App for Indian Shopkeepers

Designed and built specifically for Indian kirana shopkeepers operating in 30-second windows between customers. Runs 100% offline in browser storage with native Android app ergonomics.

---

## 📱 Mobile-First UX/UI Architecture & Strict Constraints

| Constraint | Implementation | Benefit for Shopkeeper |
| :--- | :--- | :--- |
| **Thumb-Zone Only** | Zero top-screen action buttons. Bottom Nav & floating sheets only. | One-handed single thumb operation while packing bags. |
| **Fat Finger Targets** | Strictly `min-h-14` (56px) and `min-w-14` (56px) touch targets. | Prevents accidental misclicks with busy or dusty fingers. |
| **Ban Native Keyboard** | Zero `<input>` tags. Custom sliding Bottom Sheet Numpad with `.` decimal support. | No keyboard layout jumps, zooming, or viewport shrinkage. |
| **No Scrolling to Save** | 1-tap direct Dexie updates and fixed bottom action bars. | Instant logging between customers. |
| **Anti-Glitch Mobile Styling** | `user-select-none`, `touch-action-manipulation`, disabled overscroll bounce. | Feels identical to a native Android APK. |

---

## 🗄️ Database Schema (`Dexie.js` IndexedDB)

Database Name: `KiranaReorderDB`  
Store: `items` (`++id, name, stock, reorderThreshold, lastSoldDate`)

### Seed Items Included:
1. **Aashirvaad Shudh Chakki Aata 10kg** (Stock: 4, Target: 6) - *Urgent Reorder*
2. **Tata Salt 1kg** (Stock: 14, Target: 10) - *Healthy Stock*
3. **Maggi Masala 2-Min Noodles 70g** (Stock: 2, Target: 20) - *Khatam Maal (Deficit: 18)*
4. **Fortune Mustard Oil 1L** (Stock: 1.5, Target: 8) - *Decimal Stock*
5. **Lux Rose Soap 100g** (Stock: 12, Target: 5, Last Sold: 28 days ago) - *Dead Stock*
6. **MDH Deggi Mirch Powder 100g** (Stock: 9, Target: 4, Last Sold: 35 days ago) - *Dead Stock*
7. **Amul Pasteurised Butter 500g** (Stock: 0.5, Target: 3) - *Partial Weight (0.5 kg)*

---

## 🚀 Screens & Features

### 1. App Shell
- **Top Header**: Brand title "Apna Digital Khata", store badge, and static pulsing green "Offline Mode" badge.
- **Bottom Navigation**: Fixed thumb-zone bar with 2 tabs:
  - `📦 Sales Entry (Maal Becha)`
  - `📝 Reorder Sheet (Khatam Maal)` with real-time badge count of depleted items.

### 2. Screen 1: Sales Entry (The Home Tab)
- High-contrast list group of Kirana items.
- Fat 56px (`h-14 w-14`) `+` and `-` buttons for instant 1-tap quantity updates.
- Tapping the stock number opens the **Custom Sliding Bottom Sheet Numpad** for bulk entry (e.g. entering `15` or `0.5` without a keyboard popup).
- Fast category filter chips (`Sabhi`, `Kam Stock`, `Aata & Dals`, `Snacks`, `Masala & Spices`).

### 3. Screen 2: Reorder Sheet (The Analytics Tab)
- **Section A: Khatam Maal (Fast Movers)**:
  - Items where `stock < reorderThreshold`.
  - Highlighted in subtle red with deficit calculation (`Mangwana Hai: +X`).
- **Section B: Ruka Hua Maal (Dead Stock)**:
  - Items not sold in the last 20 days.
  - Highlighted in subtle amber with idle day tracker (`X Din Se Atka`).
- **Massive Fixed WhatsApp Button**:
  - Full-width button: `"WhatsApp Order Bhejein"`.
  - Automatically formats a professional Hindi/English Kirana order summary.
  - Deep-links to `whatsapp://send?text=...` with web fallback and automatic clipboard copy.

---

## 🛠️ How to Run

### Option 1: Instant Browser Preview (No installation needed)
Open [preview.html](file:///c:/Users/vishw/Desktop/gdg/preview.html) directly in Google Chrome, Microsoft Edge, or Android Chrome.

### Option 2: Full React + Vite App
```bash
# In the project directory:
npm install
npm run dev
```
Open `http://localhost:3000` on your desktop or mobile browser.
