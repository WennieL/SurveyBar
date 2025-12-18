
import React, { useState, useEffect } from 'react';
import { Survey } from '../types';
import { ExternalLink, CheckCircle, Clock, AlertCircle, Key, ShieldCheck, Info, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SurveyActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    survey: Survey | null;
    onComplete: (surveyId: string, providedCode?: string) => void;
}

const SurveyActionModal: React.FC<SurveyActionModalProps> = ({ isOpen, onClose, survey, onComplete }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState<'intro' | 'working' | 'verify'>('intro');
    const [timer, setTimer] = useState(0);
    const [providedCode, setProvidedCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep('intro');
            setTimer(0);
            setProvidedCode('');
            setCopied(false);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (step === 'working') {
            interval = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step]);

    if (!isOpen || !survey) return null;

    const handleStart = () => {
        setStep('working');
        window.open(survey.link, '_blank');
    };

    const handleFinish = () => {
        setStep('verify');
    };

    const handleVerifyConfirm = () => {
        onComplete(survey.id, providedCode);
    };

    const handleCopyDemoCode = () => {
        if (survey.verificationCode) {
            navigator.clipboard.writeText(survey.verificationCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in duration-200">
                
                {/* Intro Step */}
                {step === 'intro' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ExternalLink className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-stone-800">{t('modal.action.intro_title')}</h3>
                        <p className="text-stone-500 mb-6 text-sm leading-relaxed">
                            {t('modal.action.intro_desc')} <strong>{survey.creatorName}</strong>.
                        </p>
                        
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-left text-xs text-orange-800 mb-6 flex gap-2 items-start">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{t('modal.action.honor_note')}</span>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors">
                                {t('common.cancel')}
                            </button>
                            <button onClick={handleStart} className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200/50 transition-all hover:-translate-y-0.5">
                                {t('modal.action.open')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Working Step */}
                {step === 'working' && (
                    <div className="text-center">
                         <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse border border-sky-100 relative">
                            <div className="absolute inset-0 rounded-full border-2 border-sky-200 animate-ping opacity-20"></div>
                            <Clock className="w-8 h-8 text-sky-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-stone-800">{t('modal.action.working_title')}</h3>
                        <p className="text-stone-500 mb-6 text-sm">
                            {t('modal.action.working_desc')}
                        </p>
                        <div className="text-3xl font-mono font-bold text-stone-700 mb-8 bg-stone-100 py-3 rounded-xl tracking-widest border border-stone-200 shadow-inner">
                            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                        </div>

                        <button 
                            onClick={handleFinish} 
                            className="w-full py-3 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            <CheckCircle className="w-5 h-5" />
                            {t('modal.action.complete_btn')}
                        </button>
                    </div>
                )}

                {/* Verification Step */}
                {step === 'verify' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 animate-in zoom-in duration-300">
                            <ShieldCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-stone-800">{t('modal.action.verify_title')}</h3>
                        <p className="text-stone-600 mb-6 text-sm">
                            {t('modal.action.verify_desc')}
                        </p>

                        <div className="relative mb-4 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Key className="w-4 h-4 text-stone-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder={t('modal.action.code_ph')}
                                value={providedCode}
                                onChange={(e) => setProvidedCode(e.target.value)}
                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center font-bold tracking-widest text-lg transition-all text-stone-900 uppercase"
                            />
                        </div>

                        {/* Redesigned Demo Code Helper */}
                        {survey.verificationCode && (
                            <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-500 delay-150">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                                    <div 
                                        onClick={handleCopyDemoCode}
                                        className="relative flex items-center justify-between p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-[1.25rem] cursor-pointer hover:bg-white hover:border-indigo-300 transition-all shadow-sm group"
                                    >
                                        <div className="flex items-start gap-3 text-left">
                                            <div className="p-1.5 bg-white rounded-lg shadow-sm border border-indigo-50">
                                                <Info className="w-3.5 h-3.5 text-indigo-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em] mb-0.5">Demo Mode</p>
                                                <p className="text-xs text-indigo-900/70 font-medium">點擊複製預設驗證碼</p>
                                            </div>
                                        </div>
                                        
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${copied ? 'bg-emerald-500 border-emerald-500 shadow-lg' : 'bg-white border-indigo-100 shadow-sm group-hover:border-indigo-400'}`}>
                                            <span className={`font-mono font-black text-sm tracking-widest ${copied ? 'text-white' : 'text-indigo-600'}`}>
                                                {survey.verificationCode}
                                            </span>
                                            {copied ? (
                                                <Check className="w-3.5 h-3.5 text-white animate-in zoom-in" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5 text-indigo-300 group-hover:text-indigo-500 transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleVerifyConfirm} 
                                className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200/50 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                            >
                                {t('modal.action.confirm_btn', { points: survey.pointsReward })}
                            </button>
                            <button 
                                onClick={() => setStep('working')}
                                className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors py-2"
                            >
                                {t('common.back')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveyActionModal;
