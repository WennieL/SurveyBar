
import React from 'react';
import { Home, UserCircle, PlusCircle, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
    activeTab: 'browse' | 'my-surveys';
    onTabChange: (tab: 'browse' | 'my-surveys') => void;
    onPostClick: () => void;
    onWalletClick: () => void;
    notificationCount?: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onPostClick, onWalletClick, notificationCount = 0 }) => {
    const { t } = useLanguage();

    // Helper for consistent styling
    const getNavItemClass = (isActive: boolean) => 
        `flex flex-col items-center justify-center gap-1 w-full py-1 transition-colors duration-200 relative ${
            isActive ? 'text-indigo-600' : 'text-stone-400 hover:text-indigo-600 hover:bg-stone-50'
        }`;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-5 pt-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-4 h-full">
                <button
                    onClick={() => onTabChange('browse')}
                    className={getNavItemClass(activeTab === 'browse')}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">{t('nav.browse')}</span>
                </button>

                <button
                    onClick={() => onTabChange('my-surveys')}
                    className={getNavItemClass(activeTab === 'my-surveys')}
                >
                    <div className="relative">
                        <UserCircle className="w-6 h-6" />
                        {/* Notification Badge - Refined positioning and centering */}
                        {notificationCount > 0 && (
                            <div className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in z-50 leading-none">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">{t('nav.my_surveys')}</span>
                </button>

                <button
                    id="tour-post-mobile"
                    onClick={onPostClick}
                    className={getNavItemClass(false)}
                >
                    <PlusCircle className="w-6 h-6" />
                    <span className="text-[10px] font-medium">{t('nav.post')}</span>
                </button>

                <button
                    onClick={onWalletClick}
                    className={getNavItemClass(false)}
                >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">{t('nav.wallet')}</span>
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
