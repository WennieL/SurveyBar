
import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle, X, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (name: string, email: string) => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, onJoin }) => {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    // Anti-Spam States
    const [honeyPot, setHoneyPot] = useState(''); // Hidden field for bots
    const [mathAnswer, setMathAnswer] = useState(''); // User answer
    const [challenge, setChallenge] = useState({ num1: 0, num2: 0 }); // Random numbers
    const [error, setError] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset and generate challenge on open
    useEffect(() => {
        if (isOpen) {
            setChallenge({
                num1: Math.floor(Math.random() * 10) + 1,
                num2: Math.floor(Math.random() * 10) + 1
            });
            setName('');
            setEmail('');
            setHoneyPot('');
            setMathAnswer('');
            setError('');
            setIsSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Honey Pot Check (Silent Fail for Bots)
        // Bots often fill every input they see. If this hidden field has value, it's a bot.
        if (honeyPot) {
            console.log("Bot detected via honeypot.");
            // Fake success to confuse the bot
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSuccess(true);
                setTimeout(() => onClose(), 2000);
            }, 800);
            return;
        }

        // 2. Math Challenge Check
        if (parseInt(mathAnswer) !== challenge.num1 + challenge.num2) {
            setError(t('modal.waitlist.math_error'));
            return;
        }

        setIsSubmitting(true);
        setError('');
        
        // Simulate API call latency for better UX
        setTimeout(() => {
            onJoin(name, email);
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setName('');
                setEmail('');
            }, 2000);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 z-10 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8 text-center">
                    {isSuccess ? (
                        <div className="py-8 animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-stone-800 mb-2">{t('tour.finish')}</h3>
                            <p className="text-stone-500">{t('modal.waitlist.success')}</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-sm">
                                <Mail className="w-8 h-8" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-stone-800 mb-2">{t('modal.waitlist.title')}</h2>
                            <p className="text-stone-500 mb-8 leading-relaxed px-4">
                                {t('modal.waitlist.subtitle')}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Honey Pot Field (Hidden) */}
                                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                                     <input 
                                        type="text" 
                                        tabIndex={-1} 
                                        value={honeyPot} 
                                        onChange={(e) => setHoneyPot(e.target.value)} 
                                        autoComplete="off"
                                        placeholder="Do not fill this field"
                                     />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-stone-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder={t('modal.waitlist.name_ph')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-stone-50 focus:bg-white text-stone-900 placeholder-stone-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-stone-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder={t('modal.waitlist.email_ph')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-stone-50 focus:bg-white text-stone-900 placeholder-stone-400"
                                    />
                                </div>

                                {/* Math Challenge (Visible Captcha) */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ShieldCheck className="w-5 h-5 text-stone-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        placeholder={t('modal.waitlist.math_label', { num1: challenge.num1, num2: challenge.num2 })}
                                        value={mathAnswer}
                                        onChange={(e) => {
                                            setMathAnswer(e.target.value);
                                            setError('');
                                        }}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${error ? 'border-rose-300 ring-1 ring-rose-200' : 'border-stone-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-stone-50 focus:bg-white text-stone-900 placeholder-stone-400`}
                                    />
                                </div>
                                {error && <p className="text-xs text-rose-500 ml-1 text-left">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:bg-stone-300 disabled:shadow-none disabled:translate-y-0"
                                >
                                    {isSubmitting ? t('common.processing') : (
                                        <>
                                            {t('modal.waitlist.btn')} <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                            <p className="text-[10px] text-stone-400 mt-4">
                                No spam, unsubscribe anytime.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WaitlistModal;
