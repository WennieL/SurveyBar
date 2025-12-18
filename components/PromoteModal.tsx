
import React from 'react';
import { Survey } from '../types';
import { Megaphone, Zap, Target, TrendingUp, Ticket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PromoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    survey: Survey | null;
    cost: number;
    userPoints: number;
    isFreeBoostAvailable: boolean;
}

const PromoteModal: React.FC<PromoteModalProps> = ({ isOpen, onClose, onConfirm, survey, cost, userPoints, isFreeBoostAvailable }) => {
    const { t } = useLanguage();
    
    if (!isOpen || !survey) return null;

    const actualCost = isFreeBoostAvailable ? 0 : cost;
    const canAfford = userPoints >= actualCost;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-orange-50 p-6 text-center border-b border-orange-100">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Megaphone className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">{t('modal.promote.title')}</h2>
                    <p className="text-orange-800 text-sm mt-1">{t('modal.promote.subtitle')} <span className="font-semibold">"{survey.title}"</span></p>
                </div>

                <div className="p-6">
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">{t('modal.promote.why')}</h3>
                    <div className="space-y-4 mb-8">
                        <div className="flex gap-4">
                            <div className="bg-blue-50 p-2.5 rounded-lg h-fit shrink-0">
                                <Zap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-stone-800 text-sm">{t('modal.promote.reason1_title')}</h4>
                                <p className="text-xs text-stone-500 mt-0.5">{t('modal.promote.reason1_desc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-purple-50 p-2.5 rounded-lg h-fit shrink-0">
                                <Target className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-stone-800 text-sm">{t('modal.promote.reason2_title')}</h4>
                                <p className="text-xs text-stone-500 mt-0.5">{t('modal.promote.reason2_desc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-green-50 p-2.5 rounded-lg h-fit shrink-0">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-stone-800 text-sm">{t('modal.promote.reason3_title')}</h4>
                                <p className="text-xs text-stone-500 mt-0.5">{t('modal.promote.reason3_desc')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-stone-50 rounded-xl p-4 flex justify-between items-center mb-6 border border-stone-100">
                        <span className="text-sm font-medium text-stone-600">{t('modal.promote.cost')}</span>
                        <div className="text-right">
                            {isFreeBoostAvailable ? (
                                <div className="flex flex-col items-end">
                                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-lg">
                                        {t('modal.post.free')} <Ticket className="w-4 h-4" />
                                    </span>
                                    <span className="text-[10px] text-stone-400 line-through">{cost} {t('nav.points')}</span>
                                </div>
                            ) : (
                                <>
                                    <span className={`block font-bold text-lg ${canAfford ? 'text-stone-800' : 'text-rose-500'}`}>{cost} {t('nav.points')}</span>
                                    {!canAfford && <span className="text-[10px] font-semibold text-rose-500">{t('modal.post.insufficient_points')}</span>}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={onClose} 
                            className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-semibold hover:bg-stone-50 transition-colors"
                        >
                            {t('common.cancel')}
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={!canAfford}
                            className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed shadow-lg shadow-orange-200 disabled:shadow-none transition-all"
                        >
                            {isFreeBoostAvailable ? t('modal.promote.btn_free') : t('modal.promote.btn')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoteModal;