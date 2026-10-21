import React, { useState } from 'react';
import { X, Check, PackagePlus, Sparkles } from 'lucide-react';
import { KiranaItem } from '../types';
import toast from 'react-hot-toast';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<KiranaItem, 'id'>) => void;
}

// Popular Indian Kirana Item Presets (1-tap selection, no typing required)
const POPULAR_PRESETS = [
  { name: 'Madhur Pure Sugar (Chini) 1kg', unit: 'pkt', category: 'Aata & Dals', threshold: 10, defaultStock: 5 },
  { name: 'Red Label Tea (Chai Patti) 250g', unit: 'pkt', category: 'Snacks', threshold: 8, defaultStock: 4 },
  { name: 'India Gate Basmati Rice 1kg', unit: 'pkt', category: 'Aata & Dals', threshold: 6, defaultStock: 3 },
  { name: 'Everest Turmeric (Haldi) 100g', unit: 'pkt', category: 'Masala & Spices', threshold: 10, defaultStock: 6 },
  { name: 'Parle-G Gold Biscuits 100g', unit: 'pkt', category: 'Snacks', threshold: 24, defaultStock: 12 },
  { name: 'Dettol Original Soap 75g', unit: 'pcs', category: 'Personal Care', threshold: 10, defaultStock: 5 },
  { name: 'Rin Detergent Bar 250g', unit: 'pcs', category: 'Household', threshold: 12, defaultStock: 8 },
  { name: 'Good Day Butter Cookies 100g', unit: 'pkt', category: 'Snacks', threshold: 15, defaultStock: 5 },
  { name: 'Vim Dishwash Bar 300g', unit: 'pcs', category: 'Household', threshold: 10, defaultStock: 4 },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<typeof POPULAR_PRESETS[0] | null>(null);
  const [stockInput, setStockInput] = useState<string>('5');
  const [thresholdInput, setThresholdInput] = useState<string>('10');
  const [activeStep, setActiveStep] = useState<'pick' | 'stock'>('pick');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    setSelectedPreset(preset);
    setStockInput(preset.defaultStock.toString());
    setThresholdInput(preset.threshold.toString());
    setActiveStep('stock');
  };

  const handleNumpadKey = (num: string) => {
    if (stockInput === '0') setStockInput(num);
    else if (stockInput.length < 4) setStockInput((prev) => prev + num);
  };

  const handleBackspace = () => {
    setStockInput((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  };

  const handleSave = () => {
    if (!selectedPreset) return;
    const stock = parseFloat(stockInput) || 0;
    const threshold = parseFloat(thresholdInput) || 5;

    const today = new Date().toISOString().split('T')[0];
    onAdd({
      name: selectedPreset.name,
      unit: selectedPreset.unit,
      category: selectedPreset.category,
      stock,
      reorderThreshold: threshold,
      lastSoldDate: today,
    });

    toast.success(`${selectedPreset.name} list mein jud gaya!`);
    setActiveStep('pick');
    setSelectedPreset(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-sheet overflow-hidden animate-slide-up border-t border-slate-200">
        <div className="pt-2.5 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <PackagePlus className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {activeStep === 'pick' ? 'Naya Maal Chunein' : 'Stock Darj Karein'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 touch-active"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeStep === 'pick' ? (
          <div className="p-4 max-h-[70vh] overflow-y-auto no-scrollbar space-y-2">
            <p className="text-xs text-slate-500 font-medium mb-1">
              Dukan ke mashhoor items (1-tap chunein):
            </p>
            {POPULAR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="w-full min-h-14 p-3 bg-slate-50 hover:bg-emerald-50/60 active:bg-emerald-100/80 rounded-2xl border border-slate-200 flex items-center justify-between text-left touch-active transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{preset.name}</h4>
                  <span className="text-xs text-slate-400">
                    {preset.category} • {preset.unit}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
                  Chunein ➔
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-white space-y-2">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-400 font-semibold">Chuna Hua Maal:</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedPreset?.name}
              </h4>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-xs text-slate-500">Shuruaati Stock:</span>
                <span className="text-2xl font-black text-emerald-700">{stockInput}</span>
                <span className="text-xs font-bold text-slate-600">{selectedPreset?.unit}</span>
              </div>
            </div>

            {/* Quick Numpad for Initial Stock */}
            <div className="grid grid-cols-3 gap-2 py-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleNumpadKey(digit)}
                  className="h-12 min-h-12 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl font-bold rounded-xl flex items-center justify-center touch-active border border-slate-200"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => setStockInput('0')}
                className="h-12 min-h-12 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl flex items-center justify-center touch-active border border-slate-200"
              >
                Saaf
              </button>
              <button
                onClick={() => handleNumpadKey('0')}
                className="h-12 min-h-12 bg-slate-100 text-slate-800 text-xl font-bold rounded-xl flex items-center justify-center touch-active border border-slate-200"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-12 min-h-12 bg-rose-50 text-rose-600 font-bold rounded-xl flex items-center justify-center touch-active border border-rose-200"
              >
                ⌫
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setActiveStep('pick')}
                className="h-14 min-h-14 bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center justify-center text-sm touch-active border border-slate-300"
              >
                Wapas Chalein
              </button>
              <button
                onClick={handleSave}
                className="h-14 min-h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30 touch-active"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Log Karein (Add)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
