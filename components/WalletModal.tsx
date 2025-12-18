
import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPoints: number;
    onPurchase: (amount: number) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, currentPoints, onPurchase }) => {
    const { t } = useLanguage();
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [successId, setSuccessId] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleBuy = (amount: number, id: number) => {
        setProcessingId(id);
        // Simulate API call
        setTimeout(() => {
            setProcessingId(null);
            setSuccessId(id); // Show success checkmark inside the button
            
            // Wait a moment for the user to see the checkmark before closing
            setTimeout(() => {
                onPurchase(amount);
                setSuccessId(null);
            }, 600);
        }, 1200);
    };

    const packages = [
        { id: 1, points: 50, price: '$5.00', popular: false },
        { id: 2, points: 120, price: '$10.00', popular: true },
        { id: 3, points: 500, price: '$35.00', popular: false },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
                
                {/* Left Side: Stats - Updated to Indigo/Violet Gradient */}
                <div className="bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 text-white p-8 md:w-1/3 flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-fuchsia-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h3 className="text-indigo-200 font-medium mb-2">{t('modal.wallet.balance')}</h3>
                        <div className="text-4xl font-bold mb-1 tracking-tight">{currentPoints}</div>
                        <span className="text-sm text-indigo-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {t('modal.wallet.subtitle')}
                        </span>
                    </div>
                    
                    <div className="mt-8 relative z-10">
                        <h4 className="font-semibold mb-4 flex items-center gap-2 text-white">
                            <ShieldCheck className="w-5 h-5 text-indigo-300" />
                            {t('modal.wallet.why')}
                        </h4>
                        <ul className="text-sm text-indigo-100 space-y-3">
                            <li className="flex gap-2">
                                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                                <span>{t('modal.wallet.reason1')}</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                                <span>{t('modal.wallet.reason2')}</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                                <span>{t('modal.wallet.reason3')}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-auto pt-8 text-[10px] text-indigo-400/60 uppercase tracking-widest">
                        {t('modal.wallet.ssl_mock')}
                    </div>
                </div>

                {/* Right Side: Packages */}
                <div className="p-8 md:w-2/3">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-stone-800">{t('modal.wallet.topup')}</h2>
                        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {packages.map((pkg) => (
                            <div 
                                key={pkg.id}
                                className={`relative border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group 
                                    ${pkg.popular 
                                        ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500/20' 
                                        : 'border-stone-200 hover:border-indigo-300'
                                    }`}
                                onClick={() => !processingId && !successId && handleBuy(pkg.points, pkg.id)}
                            >
                                {pkg.popular && (
                                    <span className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        {t('modal.wallet.popular')}
                                    </span>
                                )}
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${pkg.popular ? 'bg-indigo-100 text-indigo-600' : 'bg-stone-100 text-stone-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-stone-800 text-lg">{pkg.points} <span className="text-sm font-normal text-stone-500">{t('nav.points')}</span></div>
                                        <div className="text-xs text-stone-400 font-medium tracking-wide uppercase">{t('modal.wallet.instant')}</div>
                                    </div>
                                </div>
                                
                                <button 
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all min-w-[100px] flex items-center justify-center
                                        ${successId === pkg.id 
                                            ? 'bg-emerald-500 text-white' 
                                            : processingId === pkg.id 
                                                ? 'bg-stone-100 text-stone-500 cursor-wait' 
                                                : 'bg-indigo-600 text-white group-hover:bg-indigo-700 shadow-md group-hover:shadow-lg'
                                        }
                                    `}
                                >
                                    {successId === pkg.id ? (
                                        <CheckCircle className="w-5 h-5 animate-in zoom-in" />
                                    ) : processingId === pkg.id ? (
                                        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-500 rounded-full animate-spin"></div>
                                    ) : (
                                        pkg.price
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-center text-xs text-stone-400 mt-6 bg-stone-50 py-2 rounded-lg border border-stone-100">
                        {t('modal.wallet.disclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WalletModal;
