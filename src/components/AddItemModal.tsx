import React, { useState } from 'react';
import { X, Check, PackagePlus } from 'lucide-react';
import { KiranaItem } from '../types';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<KiranaItem, 'id'>) => void;
}

// Popular Indian Kirana Item Presets (1-tap selection, no typing required)
const POPULAR_PRESETS = [
  { name: 'Madhur Pure Sugar (Chini) 1kg', nameHi: 'मधुर शुद्ध चीनी 1 किलो', unit: 'pkt', category: 'Aata & Dals', threshold: 10, defaultStock: 5 },
  { name: 'Red Label Tea (Chai Patti) 250g', nameHi: 'रेड लेबल चाय पत्ती 250 ग्राम', unit: 'pkt', category: 'Snacks', threshold: 8, defaultStock: 4 },
  { name: 'India Gate Basmati Rice 1kg', nameHi: 'इंडिया गेट बासमती चावल 1 किलो', unit: 'pkt', category: 'Aata & Dals', threshold: 6, defaultStock: 3 },
  { name: 'Everest Turmeric (Haldi) 100g', nameHi: 'एवरेस्ट हल्दी पाउडर 100 ग्राम', unit: 'pkt', category: 'Masala & Spices', threshold: 10, defaultStock: 6 },
  { name: 'Parle-G Gold Biscuits 100g', nameHi: 'पारले-जी गोल्ड बिस्कुट 100 ग्राम', unit: 'pkt', category: 'Snacks', threshold: 24, defaultStock: 12 },
  { name: 'Dettol Original Soap 75g', nameHi: 'डेटॉल ओरिजिनल साबुन 75 ग्राम', unit: 'pcs', category: 'Personal Care', threshold: 10, defaultStock: 5 },
  { name: 'Rin Detergent Bar 250g', nameHi: 'रिन डिटर्जेंट बार 250 ग्राम', unit: 'pcs', category: 'Household', threshold: 12, defaultStock: 8 },
  { name: 'Good Day Butter Cookies 100g', nameHi: 'गुड डे बटर कुकीज 100 ग्राम', unit: 'pkt', category: 'Snacks', threshold: 15, defaultStock: 5 },
  { name: 'Vim Dishwash Bar 300g', nameHi: 'विम डिशवॉश बार 300 ग्राम', unit: 'pcs', category: 'Household', threshold: 10, defaultStock: 4 },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const { language, t } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState<typeof POPULAR_PRESETS[0] | null>(null);
  const [stockInput, setStockInput] = useState<string>('5');
  const [thresholdInput, setThresholdInput] = useState<string>('10');
  const [activeStep, setActiveStep] = useState<'pick' | 'stock'>('pick');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    triggerHaptic(50);
    setSelectedPreset(preset);
    setStockInput(preset.defaultStock.toString());
    setThresholdInput(preset.threshold.toString());
    setActiveStep('stock');
  };

  const handleNumpadKey = (num: string) => {
    triggerHaptic(50);
    if (stockInput === '0') setStockInput(num);
    else if (stockInput.length < 4) setStockInput((prev) => prev + num);
  };

  const handleBackspace = () => {
    triggerHaptic(50);
    setStockInput((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Aata & Dals': return t('catAataDals');
      case 'Snacks': return t('catSnacks');
      case 'Masala & Spices': return t('catMasala');
      case 'Oils & Ghee': return t('catOilGhee');
      case 'Dairy': return t('catDairy');
      case 'Household': return t('catHousehold');
      case 'Personal Care': return t('catPersonalCare');
      default: return cat;
    }
  };

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'pkt': return t('unitPkt');
      case 'kg': return t('unitKg');
      case 'L': return t('unitL');
      case 'pcs': return t('unitPcs');
      default: return unit;
    }
  };

  const handleSave = () => {
    triggerHaptic(50);
    if (!selectedPreset) return;
    const stock = parseFloat(stockInput) || 0;
    const threshold = parseFloat(thresholdInput) || 5;

    const today = new Date().toISOString().split('T')[0];
    const itemName = language === 'hi' ? (selectedPreset.nameHi || selectedPreset.name) : selectedPreset.name;

    onAdd({
      name: itemName,
      unit: selectedPreset.unit,
      category: selectedPreset.category,
      stock,
      reorderThreshold: threshold,
      lastSoldDate: today,
    });

    toast.success(`${itemName} ${t('itemAdded')}`);
    setActiveStep('pick');
    setSelectedPreset(null);
    onClose();
  };

  const handleClose = () => {
    triggerHaptic(50);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      <div className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-sheet overflow-hidden animate-slide-up border-t border-slate-200 dark:border-slate-800 transition-colors duration-150">
        <div className="pt-2.5 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <PackagePlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {activeStep === 'pick' ? t('modalPickTitle') : t('modalStockTitle')}
            </h3>
          </div>
          <button
            onClick={handleClose}
            aria-label={t('closeAria')}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 touch-active active:scale-95 duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeStep === 'pick' ? (
          <div className="p-4 max-h-[70vh] overflow-y-auto no-scrollbar space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              {t('popularPresets')}
            </p>
            {POPULAR_PRESETS.map((preset, idx) => {
              const displayName = language === 'hi' ? preset.nameHi : preset.name;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full min-h-14 p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50/60 dark:hover:bg-slate-700/80 active:bg-emerald-100/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left touch-active active:scale-95 duration-150 transition-all"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{displayName}</h4>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {getCategoryLabel(preset.category)} • {getUnitLabel(preset.unit)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-xs">
                    {t('pickBtn')}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-3 bg-white dark:bg-slate-900 space-y-2 transition-colors duration-150">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{t('selectedItem')}</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {language === 'hi' ? (selectedPreset?.nameHi || selectedPreset?.name) : selectedPreset?.name}
              </h4>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">{t('initialStock')}</span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{stockInput}</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {selectedPreset ? getUnitLabel(selectedPreset.unit) : ''}
                </span>
              </div>
            </div>

            {/* Quick Numpad for Initial Stock */}
            <div className="grid grid-cols-3 gap-2 py-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleNumpadKey(digit)}
                  className="h-12 min-h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xl font-bold rounded-xl flex items-center justify-center touch-active active:scale-95 duration-150 border border-slate-200 dark:border-slate-700"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => { triggerHaptic(50); setStockInput('0'); }}
                className="h-12 min-h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center touch-active active:scale-95 duration-150 border border-slate-200 dark:border-slate-700"
              >
                {t('clearBtn')}
              </button>
              <button
                onClick={() => handleNumpadKey('0')}
                className="h-12 min-h-12 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xl font-bold rounded-xl flex items-center justify-center touch-active active:scale-95 duration-150 border border-slate-200 dark:border-slate-700"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-12 min-h-12 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold rounded-xl flex items-center justify-center touch-active active:scale-95 duration-150 border border-rose-200 dark:border-rose-800"
              >
                ⌫
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { triggerHaptic(50); setActiveStep('pick'); }}
                className="h-14 min-h-14 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl flex items-center justify-center text-sm touch-active active:scale-95 duration-150 border border-slate-300 dark:border-slate-700"
              >
                {t('backBtn')}
              </button>
              <button
                onClick={handleSave}
                className="h-14 min-h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30 touch-active active:scale-95 duration-150"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>{t('addSaveBtn')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
