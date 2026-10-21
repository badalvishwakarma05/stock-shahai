export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Header & App
    appName: "Apna Digital Khata",
    appSubtitle: "Kirana Stock & Reorder",
    online: "Online",
    offline: "App is Offline - Working Locally",
    themeToggleAria: "Toggle light and dark theme",
    langToggleAria: "Toggle language",

    // Bottom Navigation
    salesEntry: "Sales Entry",
    salesEntrySub: "Record Sale",
    reorderSheet: "Reorder Sheet",
    reorderSheetSub: "Low Stock",

    // Quick Status Bar
    totalItems: "Total Items:",
    itemsCountSuffix: "Items",
    itemsEndingSoon: "Items Need Reorder",
    allStockGood: "All In Stock",

    // Categories
    catAll: "All",
    catLowStock: "⚠️ Low Stock",

    // Item Cards
    reorderLimit: "Reorder:",
    outOfStock: "Low Stock!",
    inStock: "In Stock",
    stockLabel: "Stock:",
    tapToEdit: "Tap to edit",
    decrementAria: "Decrease stock by 1",
    incrementAria: "Increase stock by 1",
    addNewItem: "+ Add New Kirana Item",
    noItemsFound: "No Items Found",
    noItemsSub: "No items found in this category or all items are in stock.",
    viewAllItems: "View All Items",

    // Reorder Screen
    sectionA: "Section A: Low Stock Items",
    targetStock: "Stock ≤ Target",
    allStockFull: "Great Job! All Stock is Full",
    allStockFullSub: "No item is below its reorder target limit.",
    remainingStock: "In Stock:",
    targetLimit: "Target:",
    requireToOrder: "Require:",
    refillBtn: "Refill",
    refillSub: "Arrived? Tap",

    sectionB: "Section B: Idle / Dead Stock",
    daysIdle: "Days Idle",
    daysOldSuffix: "Days Old",
    noDeadStock: "No Dead Stock Found",
    noDeadStockSub: "All items have been sold within the last 20 days.",
    idleInShop: "Stuck in shop:",
    updateBtn: "Update",

    whatsappBtn: "Send WhatsApp Order 🚀",
    whatsappGreeting: "Hello, please deliver the following items:\n",
    whatsappFallbackToast: "Could not open WhatsApp, order summary copied to clipboard",
    allStockPresentToast: "No low stock items! All items are fully stocked.",
    copiedToast: "Order summary copied to clipboard!",

    // Numpad Sheet
    oldStock: "Old Stock:",
    reorderTarget: "Reorder Limit:",
    enterNewStock: "Enter New Stock:",
    lowStockWarning: "⚠️ Low Stock (Reorder)",
    clearBtn: "Clear",
    saleLogBtn: "Save Stock",

    // Add Item Modal
    modalPickTitle: "Select New Item",
    modalStockTitle: "Enter Stock",
    popularPresets: "Popular shop items (1-tap select):",
    selectedItem: "Selected Item:",
    initialStock: "Initial Stock:",
    backBtn: "Back",
    addSaveBtn: "Save Item",
    pickBtn: "Select ➔",

    // Notifications
    itemAdded: "added to list!",
    soldNotice: "1 Sold! Remaining:",
    restockedNotice: "Stock restored:",
    stockUpdatedToast: "Stock updated:",
  },
  hi: {
    // Header & App
    appName: "Apna Digital Khata",
    appSubtitle: "Kirana Stock & Reorder",
    online: "Online",
    offline: "App is Offline - Working Locally",
    themeToggleAria: "Theme badlein",
    langToggleAria: "Bhasha badlein",

    // Bottom Navigation
    salesEntry: "Maal Becha",
    salesEntrySub: "Sales Entry",
    reorderSheet: "Khatam Maal",
    reorderSheetSub: "Reorder Sheet",

    // Quick Status Bar
    totalItems: "Kul Maal (Items):",
    itemsCountSuffix: "Items",
    itemsEndingSoon: "Maal Khatam Hone Wala",
    allStockGood: "Sab Pura Hai",

    // Categories
    catAll: "Sabhi",
    catLowStock: "⚠️ Kam Stock",

    // Item Cards
    reorderLimit: "Reorder:",
    outOfStock: "Kam Hai!",
    inStock: "Pura Hai",
    stockLabel: "Stock:",
    tapToEdit: "Stock badalne ke liye tap karein",
    decrementAria: "Stock 1 ghatao",
    incrementAria: "Stock 1 badhao",
    addNewItem: "+ Naya Kirana Item Jodein",
    noItemsFound: "Koi Maal Nahi Mila",
    noItemsSub: "Is category mein koi item nahi hai ya stock pura hai.",
    viewAllItems: "Sabhi Maal Dekhein",

    // Reorder Screen
    sectionA: "Section A: Khatam Maal",
    targetStock: "Stock ≤ Target",
    allStockFull: "Badhai Ho! Sab Maal Pura Hai",
    allStockFullSub: "Koi bhi item reorder limit se neeche nahi hai.",
    remainingStock: "Bacha:",
    targetLimit: "Target:",
    requireToOrder: "Mangwana Hai:",
    refillBtn: "Naya Maal",
    refillSub: "Aaya? Tap",

    sectionB: "Section B: Ruka Hua Maal",
    daysIdle: "Din Se Na Bika",
    daysOldSuffix: "Din Puraana",
    noDeadStock: "Koi Dead Stock Nahi Hai",
    noDeadStockSub: "Sabhi items pichle 20 din ke andar bike hain.",
    idleInShop: "Dukan par atka stock:",
    updateBtn: "Update",

    whatsappBtn: "WhatsApp pe Order Bhejein 🚀",
    whatsappGreeting: "Bhaiya, kripya niche likha saaman bhej dein:\n",
    whatsappFallbackToast: "WhatsApp open nahi ho paaya, link copy ho gaya hai",
    allStockPresentToast: "Koi bhi maal khatam nahi hai! Sab stock pura hai.",
    copiedToast: "Order summary copy ho gaya!",

    // Numpad Sheet
    oldStock: "Purana Stock:",
    reorderTarget: "Reorder Limit:",
    enterNewStock: "Naya Stock Darj Karein:",
    lowStockWarning: "⚠️ Kam Maal (Reorder)",
    clearBtn: "Saaf",
    saleLogBtn: "Sale Log Karein",

    // Add Item Modal
    modalPickTitle: "Naya Maal Chunein",
    modalStockTitle: "Stock Darj Karein",
    popularPresets: "Dukan ke mashhoor items (1-tap chunein):",
    selectedItem: "Chuna Hua Maal:",
    initialStock: "Shuruaati Stock:",
    backBtn: "Wapas Chalein",
    addSaveBtn: "Log Karein (Add)",
    pickBtn: "Chunein ➔",

    // Notifications
    itemAdded: "list mein jud gaya!",
    soldNotice: "1 Bika! Abhi bacha:",
    restockedNotice: "stock pura ho gaya!",
    stockUpdatedToast: "Stock update ho gaya:",
  },
};
