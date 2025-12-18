
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { PlusCircle, BarChart2, Coins, Globe, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
    user: User;
    onPostClick: () => void;
    onWalletClick: () => void;
    notificationCount?: number;
    onNotificationClick?: () => void;
    onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onPostClick, onWalletClick, notificationCount = 0, onNotificationClick, onLogoClick }) => {
    const { t, language, setLanguage } = useLanguage();
    const [pointDiff, setPointDiff] = useState<{ value: number; id: number } | null>(null);
    const prevPointsRef = useRef(user.points);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'zh-TW' : 'en');
    };

    // Watch for point changes to trigger animation
    useEffect(() => {
        if (prevPointsRef.current !== user.points) {
            const diff = user.points - prevPointsRef.current;
            // Only animate if there is a difference
            if (diff !== 0) {
                setPointDiff({ value: diff, id: Date.now() });
                
                const timer = setTimeout(() => {
                    setPointDiff(null);
                }, 2000); 
                
                prevPointsRef.current = user.points;
                return () => clearTimeout(timer);
            }
            prevPointsRef.current = user.points;
        }
    }, [user.points]);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Height increased from h-16 to h-20 for a more spacious feel */}
                <div className="flex justify-between h-20 items-center">
                    <div 
                        className="flex items-center gap-2 cursor-pointer group flex-shrink-1 min-w-0" 
                        onClick={onLogoClick}
                    >
                        {/* Logo Icon */}
                        <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 group-hover:bg-indigo-100 transition-colors duration-300 flex-shrink-0">
                            <BarChart2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 transform group-hover:-rotate-6 transition-transform duration-300" />
                        </div>
                        {/* App Name */}
                        <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 truncate">
                            {t('app.name')}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-2">
                         {/* Notification Bell - Desktop Only */}
                         <button 
                            onClick={onNotificationClick}
                            className="hidden md:block relative p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-indigo-600 transition-colors mr-1"
                            title="Notifications"
                        >
                            <Bell className={`w-5 h-5 ${notificationCount > 0 ? 'text-stone-600' : 'text-stone-400'}`} />
                            {notificationCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-300 leading-none">
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </span>
                            )}
                        </button>

                         {/* Language Switcher */}
                         <button 
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors border border-transparent hover:border-stone-200"
                            title="Switch Language"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="text-xs md:text-sm font-medium whitespace-nowrap">{language === 'en' ? 'EN' : '中'}</span>
                        </button>

                        {/* Points Display */}
                        <div 
                            id="tour-wallet"
                            onClick={onWalletClick}
                            className="relative flex items-center gap-1.5 md:gap-2 bg-amber-50 border border-amber-100 text-amber-900 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full cursor-pointer hover:bg-amber-100 transition-colors shadow-sm select-none group whitespace-nowrap"
                        >
                            {pointDiff && (
                                <div 
                                    key={pointDiff.id}
                                    className={`absolute left-1/2 -translate-x-1/2 font-bold text-sm whitespace-nowrap pointer-events-none z-50
                                        ${pointDiff.value > 0 ? 'text-emerald-600' : 'text-rose-600'}
                                    `}
                                    style={{
                                        animation: pointDiff.value > 0 ? 'floatUp 1.5s ease-out forwards' : 'floatDown 1.5s ease-out forwards',
                                        textShadow: '0 2px 4px rgba(255,255,255,0.8)'
                                    }}
                                >
                                     {pointDiff.value > 0 ? `+${pointDiff.value}` : pointDiff.value}
                                </div>
                            )}
                            
                            <Coins className={`w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 transition-transform duration-300 ${pointDiff ? 'scale-125' : 'group-hover:scale-110'}`} />
                            <span className={`text-xs md:text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${pointDiff ? (pointDiff.value > 0 ? 'text-emerald-600' : 'text-rose-600') : ''}`}>
                                {user.points} {t('nav.points')}
                            </span>
                        </div>

                        {/* Post Button - Desktop Only */}
                        <button
                            id="tour-post-btn"
                            onClick={onPostClick}
                            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 whitespace-nowrap"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>{t('nav.post')}</span>
                        </button>
                        
                        {/* User Avatar */}
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-white shadow-sm flex-shrink-0">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes floatUp {
                    0% { opacity: 0; transform: translate(-50%, 0) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -15px) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -30px) scale(1); }
                }
                @keyframes floatDown {
                    0% { opacity: 0; transform: translate(-50%, 0) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, 15px) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, 30px) scale(1); }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
