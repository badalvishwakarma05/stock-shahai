export type Language = 'en' | 'hi';

export const ITEM_NAME_TRANSLATIONS: Record<string, string> = {
  'Aashirvaad Shudh Chakki Aata 10kg': 'आशीर्वाद शुद्ध चक्की आटा 10 किलो',
  'Tata Salt (Namak) 1kg': 'टाटा नमक 1 किलो',
  'Maggi Masala 2-Min Noodles 70g': 'मैगी मसाला 2-मिनट नूडल्स 70 ग्राम',
  'Fortune Kachi Ghani Mustard Oil 1L': 'फॉर्च्यून कच्ची घानी सरसों का तेल 1 लीटर',
  'Amul Pasteurised Butter 500g': 'अमूल मक्खन (बटर) 500 ग्राम',
  'MDH Deggi Mirch Powder 100g': 'एमडीएच देगी मिर्च पाउडर 100 ग्राम',
  'Lux Rose Soap 100g (Pack of 3)': 'लक्स रोज़ साबुन 100 ग्राम (3 का पैक)',
  'Madhur Pure Sugar (Chini) 1kg': 'मधुर शुद्ध चीनी 1 किलो',
  'Red Label Tea (Chai Patti) 250g': 'रेड लेबल चाय पत्ती 250 ग्राम',
  'India Gate Basmati Rice 1kg': 'इंडिया गेट बासमती चावल 1 किलो',
  'Everest Turmeric (Haldi) 100g': 'एवरेस्ट हल्दी पाउडर 100 ग्राम',
  'Parle-G Gold Biscuits 100g': 'पारले-जी गोल्ड बिस्कुट 100 ग्राम',
  'Dettol Original Soap 75g': 'डेटॉल ओरिजिनल साबुन 75 ग्राम',
  'Rin Detergent Bar 250g': 'रिन डिटर्जेंट बार 250 ग्राम',
  'Good Day Butter Cookies 100g': 'गुड डे बटर कुकीज 100 ग्राम',
  'Vim Dishwash Bar 300g': 'विम डिशवॉश बार 300 ग्राम',
};

export const UNIT_TRANSLATIONS: Record<string, Record<Language, string>> = {
  pkt: { en: 'pkt', hi: 'पैकेट' },
  packet: { en: 'pkt', hi: 'पैकेट' },
  kg: { en: 'kg', hi: 'किलो' },
  l: { en: 'L', hi: 'लीटर' },
  liter: { en: 'L', hi: 'लीटर' },
  litre: { en: 'L', hi: 'लीटर' },
  pcs: { en: 'pcs', hi: 'पीस' },
  pc: { en: 'pc', hi: 'पीस' },
  box: { en: 'box', hi: 'डिब्बा' },
  bottle: { en: 'bottle', hi: 'बोतल' },
};

export const formatUnit = (unit?: string, lang: Language = 'hi'): string => {
  if (!unit) return '';
  const clean = unit.trim().toLowerCase();
  const entry = UNIT_TRANSLATIONS[clean];
  if (entry) return entry[lang];
  return unit;
};

export const getItemName = (item: { name: string; nameHi?: string }, lang: Language = 'hi'): string => {
  if (!item) return '';
  if (lang === 'hi') {
    return item.nameHi || ITEM_NAME_TRANSLATIONS[item.name] || item.name;
  }
  return item.name;
};

export const translations = {
  en: {
    // Header & App Metadata
    title: "Apna Digital Khata",
    appName: "Apna Digital Khata",
    subtitle: "Kirana Stock & Reorder",
    appSubtitle: "Kirana Stock & Reorder",
    online: "Online",
    offline: "Offline Mode",
    offlineMode: "Offline Mode",
    themeToggleAria: "Toggle light and dark theme",
    langToggleAria: "Toggle language",
    langBtnText: "हिंदी",
    themeLightTooltip: "Switch to Dark Mode",
    themeDarkTooltip: "Switch to Light Mode",

    // Bottom Navigation Tabs
    salesTab: "Sales Entry",
    salesEntry: "Sales Entry",
    salesEntrySub: "Record Sale",
    reorderTab: "Reorder Sheet",
    reorderSheet: "Reorder Sheet",
    reorderSheetSub: "Low Stock",

    // Quick Status Bar
    totalItems: "Total Items:",
    totalStock: "Total Stock:",
    itemsCountSuffix: "Items",
    itemsEndingSoon: "Items Need Reorder",
    allStockGood: "All In Stock",

    // Category Filter Chips
    catAll: "All",
    catLowStock: "⚠️ Low Stock",
    catAataDals: "Aata & Dals",
    catSnacks: "Snacks",
    catMasala: "Masala & Spices",
    catOilGhee: "Oils & Ghee",
    catDairy: "Dairy",
    catHousehold: "Household",
    catPersonalCare: "Personal Care",

    // Item Cards
    reorderLimit: "Reorder:",
    lowStock: "Low Stock!",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    stockLabel: "Stock:",
    tapToEdit: "Tap",
    tapToEditFull: "Tap to change stock",
    decrementAria: "Decrease stock by 1",
    incrementAria: "Increase stock by 1",
    addNewItem: "+ Add New Kirana Item",
    noItems: "No items found.",
    noItemsFound: "No items found.",
    noItemsSub: "No items found in this category or all items are well-stocked.",
    viewAllItems: "View All Items",

    // Reorder Screen (Section A & B)
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

    // WhatsApp Order Action & Messages
    whatsappBtn: "Send WhatsApp Order 🚀",
    whatsappGreeting: "Hello, please deliver the following items:\n",
    whatsappRequirePrefix: "Require:",
    whatsappFallbackToast: "Could not open WhatsApp, order summary copied to clipboard",
    allStockPresentToast: "No low stock items! All items are fully stocked.",
    copiedToast: "Order summary copied to clipboard!",

    // Numpad Bottom Sheet
    oldStock: "Old Stock:",
    reorderTarget: "Reorder Limit:",
    enterNewStock: "Enter New Stock:",
    lowStockWarning: "⚠️ Low Stock (Reorder)",
    clearBtn: "Clear",
    saleLogBtn: "Save Stock",
    closeAria: "Close",
    decimalAria: "Decimal",
    backspaceAria: "Backspace",

    // Add Item Modal
    modalPickTitle: "Select New Item",
    modalStockTitle: "Enter Stock",
    popularPresets: "Popular shop items (1-tap select):",
    selectedItem: "Selected Item:",
    initialStock: "Initial Stock:",
    backBtn: "Back",
    addSaveBtn: "Save Item",
    pickBtn: "Select ➔",

    // Units
    unitPkt: "pkt",
    unitKg: "kg",
    unitL: "L",
    unitPcs: "pcs",

    // Toast Notifications
    itemAdded: "added to list!",
    soldNotice: "1 Sold! Remaining:",
    stockRemainingNotice: "left",
    restockedNotice: "Stock restored!",
    stockUpdatedToast: "Stock updated:",

    // Login / Profile
    loginTitle: "Apna Digital Khata",
    loginSubtitle: "Kirana Stock & Reorder",
    loginWelcome: "Connect with your shop",
    loginNameLabel: "Your Name",
    loginNamePlaceholder: "e.g. Rajesh Kumar",
    loginMobileLabel: "Mobile Number",
    loginMobilePlaceholder: "e.g. 9876543210",
    loginBtn: "Login",
    loginError: "Please enter name and 10-digit mobile number",
    greetingPrefix: "Namaste,",
    logoutBtn: "Logout",
    logoutConfirm: "Are you sure you want to logout?",
    loginSuccessToast: "Welcome!",
    logoutSuccessToast: "Logged out successfully",
  },

  hi: {
    // Header & App Metadata (Pure Hindi / Devanagari)
    title: "अपना डिजिटल खाता",
    appName: "अपना डिजिटल खाता",
    subtitle: "किराना स्टॉक और रीऑर्डर",
    appSubtitle: "किराना स्टॉक और रीऑर्डर",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन मोड",
    offlineMode: "ऑफ़लाइन मोड",
    themeToggleAria: "थीम बदलें (लाइट/डार्क)",
    langToggleAria: "भाषा बदलें (अंग्रेजी/हिंदी)",
    langBtnText: "EN",
    themeLightTooltip: "डार्क मोड चालू करें",
    themeDarkTooltip: "लाइट मोड चालू करें",

    // Bottom Navigation Tabs
    salesTab: "बिक्री एंट्री",
    salesEntry: "बिक्री एंट्री",
    salesEntrySub: "बिक्री दर्ज करें",
    reorderTab: "रीऑर्डर लिस्ट",
    reorderSheet: "रीऑर्डर लिस्ट",
    reorderSheetSub: "कमी का सामान",

    // Quick Status Bar
    totalItems: "कुल सामान:",
    totalStock: "कुल स्टॉक:",
    itemsCountSuffix: "सामान",
    itemsEndingSoon: "सामान खत्म होने वाला",
    allStockGood: "सब भरपूर है",

    // Category Filter Chips
    catAll: "सभी",
    catLowStock: "⚠️ कम स्टॉक",
    catAataDals: "आटा और दालें",
    catSnacks: "नमकीन और स्नैक्स",
    catMasala: "मसाले",
    catOilGhee: "तेल और घी",
    catDairy: "डेयरी उत्पाद",
    catHousehold: "घरेलू सामान",
    catPersonalCare: "पर्सनल केयर",

    // Item Cards
    reorderLimit: "रीऑर्डर सीमा:",
    lowStock: "स्टॉक कम है!",
    outOfStock: "माल खत्म",
    inStock: "स्टॉक में है",
    stockLabel: "स्टॉक:",
    tapToEdit: "बदलें",
    tapToEditFull: "स्टॉक बदलने के लिए दबाएं",
    decrementAria: "स्टॉक 1 कम करें",
    incrementAria: "स्टॉक 1 बढ़ाएं",
    addNewItem: "+ नया किराना सामान जोड़ें",
    noItems: "कोई सामान नहीं मिला।",
    noItemsFound: "कोई सामान नहीं मिला।",
    noItemsSub: "इस श्रेणी में कोई सामान नहीं है या सारा स्टॉक भरपूर है।",
    viewAllItems: "सभी सामान देखें",

    // Reorder Screen (Section A & B)
    sectionA: "भाग क: कम स्टॉक वाला सामान",
    targetStock: "स्टॉक ≤ सीमा",
    allStockFull: "बधाई! सारा स्टॉक पूरा है",
    allStockFullSub: "कोई भी सामान रीऑर्डर सीमा से नीचे नहीं है।",
    remainingStock: "बचा हुआ:",
    targetLimit: "लक्ष्य सीमा:",
    requireToOrder: "जरूरत:",
    refillBtn: "नया माल",
    refillSub: "आया? दबाएं",

    sectionB: "भाग ख: रुका हुआ सामान (डेड स्टॉक)",
    daysIdle: "दिन से नहीं बिका",
    daysOldSuffix: "दिन पुराना",
    noDeadStock: "कोई रुका हुआ सामान नहीं है",
    noDeadStockSub: "सभी सामान पिछले 20 दिनों में बिके हैं।",
    idleInShop: "दुकान में अटका स्टॉक:",
    updateBtn: "अपडेट",

    // WhatsApp Order Action & Messages
    whatsappBtn: "WhatsApp पर ऑर्डर भेजें 🚀",
    whatsappGreeting: "नमस्ते, कृपया नीचे लिखा सामान भेज दें:\n",
    whatsappRequirePrefix: "जरूरत:",
    whatsappFallbackToast: "WhatsApp नहीं खुला, ऑर्डर कॉपी कर लिया गया है",
    allStockPresentToast: "कोई भी सामान कम नहीं है! सारा स्टॉक पूरा है।",
    copiedToast: "ऑर्डर क्लिपबोर्ड पर कॉपी हो गया!",

    // Numpad Bottom Sheet
    oldStock: "पुराना स्टॉक:",
    reorderTarget: "रीऑर्डर सीमा:",
    enterNewStock: "नया स्टॉक दर्ज करें:",
    lowStockWarning: "⚠️ कम स्टॉक (रीऑर्डर करें)",
    clearBtn: "साफ़ करें",
    saleLogBtn: "स्टॉक सहेजें",
    closeAria: "बंद करें",
    decimalAria: "दशमलव",
    backspaceAria: "हटाएं",

    // Add Item Modal
    modalPickTitle: "नया सामान चुनें",
    modalStockTitle: "स्टॉक दर्ज करें",
    popularPresets: "दुकान के लोकप्रिय सामान (1-टैप में चुनें):",
    selectedItem: "चुना हुआ सामान:",
    initialStock: "शुरुआती स्टॉक:",
    backBtn: "पीछे जाएं",
    addSaveBtn: "सामान सहेजें",
    pickBtn: "चुनें ➔",

    // Units
    unitPkt: "पैकेट",
    unitKg: "किलो",
    unitL: "लीटर",
    unitPcs: "पीस",

    // Toast Notifications
    itemAdded: "लिस्ट में जुड़ गया!",
    soldNotice: "1 बिका! बाकी बचा:",
    stockRemainingNotice: "बचा",
    restockedNotice: "स्टॉक पूरा हो गया!",
    stockUpdatedToast: "स्टॉक अपडेट हो गया:",

    // Login / Profile
    loginTitle: "अपना डिजिटल खाता",
    loginSubtitle: "किराना स्टॉक और रीऑर्डर",
    loginWelcome: "अपनी दुकान से जुड़ें",
    loginNameLabel: "आपका नाम",
    loginNamePlaceholder: "जैसे: राजेश कुमार",
    loginMobileLabel: "मोबाइल नंबर",
    loginMobilePlaceholder: "जैसे: 9876543210",
    loginBtn: "लॉगिन करें",
    loginError: "कृपया नाम और 10 अंकों का मोबाइल नंबर भरें",
    greetingPrefix: "नमस्ते,",
    logoutBtn: "लॉगआउट",
    logoutConfirm: "क्या आप सच में लॉगआउट करना चाहते हैं?",
    loginSuccessToast: "स्वागत है!",
    logoutSuccessToast: "लॉगआउट हो गया",
  },
};
