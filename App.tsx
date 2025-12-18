
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import SurveyCard from './components/SurveyCard';
import SkeletonCard from './components/SkeletonCard';
import PostSurveyModal from './components/PostSurveyModal';
import SurveyActionModal from './components/SurveyActionModal';
import WalletModal from './components/WalletModal';
import PromoteModal from './components/PromoteModal';
import WaitlistModal from './components/WaitlistModal';
import ShareModal from './components/ShareModal';
import TourOverlay from './components/TourOverlay';
import { StorageService } from './services/storageService';
import { Survey, User, SurveyTheme, ToastMessage } from './types';
import { Filter, Info, LayoutGrid, UserCircle, X, Sparkles, CheckCircle, AlertTriangle, Search, MapPin, Globe, Calendar, SlidersHorizontal, ChevronDown, PlayCircle, AlertOctagon, Archive, TrendingUp, Zap, Users, ShieldCheck, Gift } from 'lucide-react';
import { PROMOTION_COST, GOOGLE_SCRIPT_URL } from './constants';
import { useLanguage } from './contexts/LanguageContext';
import confetti from 'canvas-confetti';

// --- Internal Helper Component for Auto-Suggestion Input ---
interface SuggestionInputProps {
    icon: React.ElementType;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    data: string[];
}

const SuggestionInput: React.FC<SuggestionInputProps> = ({ icon: Icon, placeholder, value, onChange, data }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const suggestions = useMemo(() => {
        if (!value) return [];
        const lowerValue = value.toLowerCase();
        const matches = Array.from(new Set(data.filter(item => 
            item && item.toLowerCase().includes(lowerValue) && item.toLowerCase() !== lowerValue
        )));
        return matches.slice(0, 5);
    }, [value, data]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="group relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="w-4 h-4 text-stone-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input 
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white/80 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all text-stone-900 placeholder-stone-400"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-stone-100 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                    {suggestions.map((item, idx) => (
                        <div 
                            key={idx}
                            onClick={() => {
                                onChange(item);
                                setShowSuggestions(false);
                            }}
                            className="px-4 py-2 text-sm text-stone-600 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer flex items-center gap-2 transition-colors"
                        >
                            <Search className="w-3 h-3 opacity-50" />
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [promotingSurvey, setPromotingSurvey] = useState<Survey | null>(null);
  const [sharingSurvey, setSharingSurvey] = useState<Survey | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-surveys'>('browse');
  const [mySurveySubTab, setMySurveySubTab] = useState<'active' | 'attention' | 'closed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterTheme, setFilterTheme] = useState<string>('All');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    StorageService.init();
    const timer = setTimeout(() => {
        refreshData();
        setIsLoading(false);
    }, 800);
    if (localStorage.getItem('surveybar_waitlist')) setJoinedWaitlist(true);
    const tourCompleted = localStorage.getItem('surveybar_main_tour_completed');
    if (!tourCompleted) setTimeout(() => setTourStep(0), 1500);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
      if (!user) return;
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
  }, [searchQuery, filterTheme, filterLocation, filterLanguage, filterAge, activeTab, mySurveySubTab]);

  const refreshData = () => {
    setUser(StorageService.getUser());
    setSurveys(StorageService.getSurveys());
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const triggerConfetti = () => {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#a855f7', '#ec4899'] });
  };

  const handlePostOrUpdateSurvey = (data: any) => {
    if (!user) return;
    if (editingSurvey) {
        const updatedSurvey: Survey = {
            ...editingSurvey,
            title: data.title,
            description: data.description,
            link: data.link,
            theme: data.theme,
            targetCriteria: data.targetCriteria,
            targetLocation: data.targetLocation,
            targetAge: data.targetAge,
            targetLanguage: data.targetLanguage,
            targetResponses: data.targetResponses,
            closingDate: data.closingDate,
            verificationCode: data.verificationCode // Pass verification code
        };
        const result = StorageService.updateSurvey(updatedSurvey, data.costDeducted || 0);
        if (result.success) {
            addToast(t('toast.survey_updated'), 'success');
            refreshData();
        } else {
            addToast(result.message, 'error');
        }
        setEditingSurvey(null);
    } else {
        const newSurvey: Survey = {
            id: `s-${Date.now()}`,
            title: data.title,
            description: data.description,
            link: data.link,
            theme: data.theme,
            creatorName: user.name,
            targetResponses: data.targetResponses,
            currentResponses: 0,
            pointsReward: data.pointsReward || 1,
            closingDate: data.closingDate,
            createdAt: new Date().toISOString(),
            isPromoted: data.isPromoted,
            targetCriteria: data.targetCriteria,
            targetLocation: data.targetLocation,
            targetAge: data.targetAge,
            targetLanguage: data.targetLanguage,
            estimatedTime: data.estimatedTime,
            verificationCode: data.verificationCode // Set verification code
        };
        const result = StorageService.addSurvey(newSurvey);
        if (result.success) {
            triggerConfetti();
            addToast(t('toast.post_success'), 'success');
            setActiveTab('my-surveys');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            refreshData();
        } else {
            addToast(result.message, 'error');
        }
    }
  };

  const handleCompleteSurvey = (surveyId: string, providedCode?: string) => {
    const result = StorageService.completeSurvey(surveyId, providedCode);
    if (result.success) {
      triggerConfetti();
      addToast(result.message, 'success');
      refreshData();
      setSelectedSurvey(null);
    } else {
      addToast(result.message, 'error');
    }
  };

  const handlePurchasePoints = (amount: number) => {
    if (!user) return;
    StorageService.purchasePoints(amount);
    triggerConfetti();
    addToast(t('toast.purchased', { amount }), 'success');
    refreshData();
    setIsWalletModalOpen(false);
  };

  const handlePromoteClick = (survey: Survey) => setPromotingSurvey(survey);

  const handleCloseSurvey = (survey: Survey) => {
      if(window.confirm(t('confirm.close_survey'))) {
          const result = StorageService.closeSurvey(survey.id);
          if (result.success) {
              addToast(t('toast.survey_closed'), 'success');
              refreshData();
          }
      }
  };

  const handleConfirmPromote = () => {
      if (!promotingSurvey) return;
      const result = StorageService.promoteSurvey(promotingSurvey.id);
      if (result.success) {
          triggerConfetti();
          addToast(result.message, 'success');
          refreshData();
      } else {
          addToast(result.message, 'error');
      }
      setPromotingSurvey(null);
  };

  const handleDeleteSurvey = (survey: Survey) => {
      if(window.confirm(t('confirm.delete_survey', { title: survey.title }))) {
          const result = StorageService.deleteSurvey(survey.id);
          if (result.success) {
              addToast(result.message, 'info');
              refreshData();
          }
      }
  };

  const handleEditClick = (survey: Survey) => {
      setEditingSurvey(survey);
      setIsPostModalOpen(true);
  };

  const handleShare = (survey: Survey) => setSharingSurvey(survey);

  const handlePostModalClose = () => {
      setIsPostModalOpen(false);
      setEditingSurvey(null);
  };

  const handleJoinWaitlist = async (name: string, email: string) => {
      localStorage.setItem('surveybar_waitlist', email);
      setJoinedWaitlist(true);
      triggerConfetti();
      addToast(t('toast.joined_waitlist'), 'success');
      if (GOOGLE_SCRIPT_URL) {
          try {
              const params = new URLSearchParams();
              params.append('name', name);
              params.append('email', email);
              params.append('source', 'SurveyBar_App');
              await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: params });
          } catch (error) { console.error(error); }
      }
  };

  const resetFilters = () => {
      setSearchQuery('');
      setFilterTheme('All');
      setFilterLocation('');
      setFilterLanguage('');
      setFilterAge('');
  };

  const handleLogoClick = () => {
      setActiveTab('browse');
      resetFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTourNext = () => setTourStep(prev => (prev !== null ? prev + 1 : null));
  const handleTourSkip = () => {
      setTourStep(null);
      localStorage.setItem('surveybar_main_tour_completed', 'true');
  };
  const handleTourFinish = () => {
      setTourStep(null);
      localStorage.setItem('surveybar_main_tour_completed', 'true');
      triggerConfetti();
  };

  const handleNotificationClick = () => {
      setActiveTab('my-surveys');
      setMySurveySubTab('attention');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSurveys = surveys
    .filter(survey => {
        if (activeTab === 'my-surveys') {
            const isMine = user?.surveysPostedIds.includes(survey.id);
            if (!isMine) return false;
            const isClosed = survey.isClosed;
            const isExpired = new Date(survey.closingDate).getTime() < Date.now();
            const isGoalReached = survey.currentResponses >= survey.targetResponses;
            if (mySurveySubTab === 'closed') return isClosed;
            if (mySurveySubTab === 'attention') return !isClosed && (isExpired || isGoalReached);
            return !isClosed && !isExpired && !isGoalReached;
        }
        return !survey.isClosed && new Date(survey.closingDate).getTime() > Date.now() && survey.currentResponses < survey.targetResponses;
    })
    .filter(survey => {
        if (activeTab === 'my-surveys') return true;
        const matchesSearch = !searchQuery || survey.title.toLowerCase().includes(searchQuery.toLowerCase()) || survey.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTheme = filterTheme === 'All' || survey.theme === filterTheme;
        const matchesLocation = !filterLocation || (survey.targetLocation && survey.targetLocation.toLowerCase().includes(filterLocation.toLowerCase())) || survey.targetLocation === 'Global';
        const matchesLanguage = !filterLanguage || (survey.targetLanguage && survey.targetLanguage.toLowerCase().includes(filterLanguage.toLowerCase()));
        const matchesAge = !filterAge || (survey.targetAge && survey.targetAge.toLowerCase().includes(filterAge.toLowerCase())) || survey.targetAge === 'All';
        return matchesSearch && matchesTheme && matchesLocation && matchesLanguage && matchesAge;
    })
    .sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const activeFiltersCount = (filterLocation ? 1 : 0) + (filterLanguage ? 1 : 0) + (filterAge ? 1 : 0);
  const allLocations = useMemo(() => surveys.map(s => s.targetLocation).filter(Boolean) as string[], [surveys]);
  const allLanguages = useMemo(() => surveys.map(s => s.targetLanguage).filter(Boolean) as string[], [surveys]);
  const allAges = useMemo(() => surveys.map(s => s.targetAge).filter(Boolean) as string[], [surveys]);

  const attentionCount = useMemo(() => {
      if (!user) return 0;
      return surveys.filter(s => user.surveysPostedIds.includes(s.id) && !s.isClosed && (new Date(s.closingDate).getTime() < Date.now() || s.currentResponses >= s.targetResponses)).length;
  }, [user, surveys]);

  const tourSteps = [
      { title: t('tour.main.welcome_title'), description: t('tour.main.welcome_desc') },
      { title: t('tour.main.step1_title'), description: t('tour.main.step1_desc'), targetId: 'tour-survey-card' },
      { title: t('tour.main.step2_title'), description: t('tour.main.step2_desc'), targetId: 'tour-wallet' },
      { title: t('tour.main.step3_title'), description: t('tour.main.step3_desc'), targetId: isMobile ? 'tour-post-mobile' : 'tour-post-btn' }
  ];

  if (!user && isLoading) return (
      <div className="flex flex-col h-screen items-center justify-center bg-stone-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
          <div className="text-stone-500 font-medium animate-pulse">{t('common.loading')}</div>
      </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen relative flex flex-col w-full overflow-x-hidden">
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-[-1] bg-stone-50">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-stone-50 to-stone-100 pointer-events-none opacity-60"></div>
      </div>

      <Navbar 
        user={user} 
        onPostClick={() => setIsPostModalOpen(true)}
        onWalletClick={() => setIsWalletModalOpen(true)}
        notificationCount={attentionCount}
        onNotificationClick={handleNotificationClick}
        onLogoClick={handleLogoClick}
      />

      {activeTab === 'browse' && (
        <div className="bg-white/40 backdrop-blur-sm border-b border-stone-200/60 overflow-hidden w-full relative">
            {/* Background Decorations for Mobile */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none md:hidden"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="text-center md:text-left z-10 flex flex-col items-center md:items-start">
                         <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                             <Sparkles className="w-3.5 h-3.5" />
                             {t('hero.badge3')}
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 mb-6 md:mb-10 tracking-tight leading-[1.2] md:leading-[1.1] animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                            {language === 'zh-TW' ? (
                                <>
                                    {t('hero.title').split('，')[0]}，<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                                        {t('hero.title').split('，')[1]}
                                    </span>
                                </>
                            ) : (
                                <>
                                    {t('hero.title').split('.')[0]}.<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                                        {t('hero.title').split('.')[1].trim()}.
                                    </span>
                                </>
                            )}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-stone-500 mb-8 md:mb-10 max-w-sm sm:max-w-xl mx-auto md:mx-0 leading-relaxed px-2 sm:px-0 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                            {t('hero.subtitle')}
                        </p>
                        
                        <div className="flex flex-col items-center md:items-start gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                             {/* Feature Tags Row */}
                             <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mb-1">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100/50 border border-stone-200/50 rounded-full text-[10px] sm:text-xs font-bold text-stone-600 transition-colors hover:bg-white hover:border-indigo-200">
                                    <ShieldCheck className="w-3 h-3 text-indigo-500" />
                                    {t('hero.feature1')}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100/50 border border-stone-200/50 rounded-full text-[10px] sm:text-xs font-bold text-stone-600 transition-colors hover:bg-white hover:border-orange-200">
                                    <Zap className="w-3 h-3 text-orange-500" />
                                    {t('hero.feature2')}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100/50 border border-stone-200/50 rounded-full text-[10px] sm:text-xs font-bold text-stone-600 transition-colors hover:bg-white hover:border-fuchsia-200">
                                    <Gift className="w-3 h-3 text-fuchsia-500" />
                                    {t('hero.feature3')}
                                </div>
                             </div>

                             <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full sm:w-auto">
                                {!joinedWaitlist ? (
                                    <button 
                                        onClick={() => setIsWaitlistModalOpen(true)}
                                        className="w-4/5 sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold shadow-xl shadow-indigo-200 transition-all hover:scale-105 hover:shadow-indigo-300 active:scale-95 flex items-center justify-center gap-3 text-sm sm:text-base mx-auto md:mx-0"
                                    >
                                        {t('hero.waitlist_btn')}
                                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <div className="w-4/5 sm:w-auto bg-green-50 text-green-700 border border-green-200 px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 text-sm sm:text-base mx-auto md:mx-0">
                                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> {t('hero.waitlist_joined')}
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2.5">
                                        {[1,2,3,4].map((i) => (
                                            <div key={i} className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white
                                                ${i===1 ? 'bg-indigo-500' : i===2 ? 'bg-fuchsia-500' : i===3 ? 'bg-orange-500' : 'bg-emerald-500'}
                                            `}>
                                                {String.fromCharCode(64+i)}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs sm:text-sm md:text-base font-medium text-stone-400">
                                        {t('hero.community_count')}
                                    </span>
                                </div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="relative hidden md:block h-[450px]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-100/30 rounded-full blur-[80px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
                            <div className="bg-white/90 backdrop-blur-2xl border border-white/50 p-8 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transform -rotate-3 hover:rotate-0 transition-transform duration-700 relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-indigo-100/80 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">Market Research</div>
                                    <div className="bg-orange-100/80 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                                        <TrendingUp className="w-3.5 h-3.5" /> Boosted
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl text-stone-800 mb-3">{t('hero.floating_card.title')}</h3>
                                <p className="text-stone-400 text-sm mb-6 leading-relaxed">{t('hero.floating_card.desc')}</p>
                                <div className="w-full bg-stone-100 h-2.5 rounded-full mb-3 overflow-hidden">
                                    <div className="bg-indigo-500 w-3/4 h-full rounded-full"></div>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                                    <span>75% Reached</span>
                                    <span>Goal: 100</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-8 bg-white p-4 rounded-2xl shadow-2xl border border-stone-50 flex items-center gap-4 animate-bounce duration-[2000ms]">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Zap className="w-5 h-5 fill-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-extrabold text-stone-800">+10 {t('nav.points')}</div>
                                    <div className="text-xs text-stone-400">Just Earned</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 flex-1 pb-24 md:pb-8 w-full overflow-hidden">
        {activeTab === 'my-surveys' && (
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">{t('nav.my_surveys')}</h1>
                <p className="text-stone-500 text-sm md:text-base mb-6">{t('survey.manage_desc')}</p>
                {/* Fix: Added pt-2 and px-2 to ensure absolute badges are not clipped by overflow-x-auto */}
                <div className="flex overflow-x-auto gap-2 pb-2 pt-2 px-2 -mx-2 no-scrollbar scroll-smooth">
                    <button 
                        onClick={() => setMySurveySubTab('active')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap
                        ${mySurveySubTab === 'active' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'}
                    `}><PlayCircle className="w-4 h-4" />{t('tabs.active')}</button>
                    <button 
                        onClick={() => setMySurveySubTab('attention')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all relative whitespace-nowrap
                        ${mySurveySubTab === 'attention' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'}
                    `}>{attentionCount > 0 && <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold z-10 leading-none">{attentionCount}</div>}<AlertOctagon className="w-4 h-4" />{t('tabs.attention')}</button>
                    <button 
                        onClick={() => setMySurveySubTab('closed')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap
                        ${mySurveySubTab === 'closed' ? 'bg-stone-600 text-white shadow-md' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'}
                    `}><Archive className="w-4 h-4" />{t('tabs.closed')}</button>
                </div>
            </div>
        )}

        <div className="hidden md:flex gap-8 border-b border-stone-200/60 mb-8">
            <button onClick={() => setActiveTab('browse')} className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'browse' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}><LayoutGrid className="w-5 h-5" />{t('nav.browse')}</button>
            <button onClick={() => setActiveTab('my-surveys')} className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 relative ${activeTab === 'my-surveys' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}><UserCircle className="w-5 h-5" />{t('nav.my_surveys')}<span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{user.surveysPostedIds.length}</span></button>
        </div>

        {activeTab === 'browse' && (
            <div className="mb-8 space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-stone-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <input type="text" placeholder={t('common.search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-stone-900 text-sm" />
                    </div>
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-bold transition-all shrink-0 ${isFilterOpen || activeFiltersCount > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-stone-200 text-stone-600'}`}>
                        <SlidersHorizontal className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm">{t('filter.toggle')}</span>
                        {activeFiltersCount > 0 && <span className="bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{activeFiltersCount}</span>}
                    </button>
                </div>
                <div className="relative overflow-x-auto flex gap-2 no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                    <button onClick={() => setFilterTheme('All')} className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border shrink-0 ${filterTheme === 'All' ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white text-stone-600 border-stone-200'}`}>{t('common.all')}</button>
                    {Object.values(SurveyTheme).map(theme => (
                        <button key={theme} onClick={() => setFilterTheme(theme)} className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border shrink-0 ${filterTheme === theme ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-stone-600 border-stone-200'}`}>{t(`theme.${theme}`)}</button>
                    ))}
                </div>
                {isFilterOpen && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 md:p-5 shadow-lg animate-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-stone-700 flex items-center gap-2 text-sm"><Filter className="w-4 h-4 text-indigo-600" />{t('filter.advanced')}</h3>
                            {activeFiltersCount > 0 && <button onClick={resetFilters} className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-md">{t('filter.reset')}</button>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <SuggestionInput icon={MapPin} placeholder={t('filter.location_ph')} value={filterLocation} onChange={setFilterLocation} data={allLocations} />
                            <SuggestionInput icon={Globe} placeholder={t('filter.language_ph')} value={filterLanguage} onChange={setFilterLanguage} data={allLanguages} />
                            <SuggestionInput icon={Calendar} placeholder={t('filter.age_ph')} value={filterAge} onChange={setFilterAge} data={allAges} />
                        </div>
                    </div>
                )}
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {isLoading ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />) : (
                <>
                    {filteredSurveys.map((survey, index) => (
                        <SurveyCard 
                            key={survey.id} 
                            id={index === 0 ? 'tour-survey-card' : undefined}
                            survey={survey}
                            onTakeSurvey={setSelectedSurvey}
                            onPromote={handlePromoteClick}
                            onDelete={handleDeleteSurvey}
                            onEdit={handleEditClick}
                            onShare={handleShare}
                            onCloseSurvey={handleCloseSurvey}
                            isCompleted={user.completedSurveyIds.includes(survey.id)}
                            isOwner={user.surveysPostedIds.includes(survey.id)}
                        />
                    ))}
                    {filteredSurveys.length === 0 && (
                        <div className="col-span-full text-center py-20 px-4">
                            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4"><Info className="w-8 h-8 text-stone-400" /></div>
                            <h3 className="text-lg font-bold text-stone-700">{t('survey.no_surveys')}</h3>
                            <p className="text-stone-500 mt-2 text-sm max-w-xs mx-auto">{activeTab === 'my-surveys' ? t('survey.no_surveys_mine') : t('survey.no_surveys_browse')}</p>
                            {activeTab === 'my-surveys' && <button onClick={() => setIsPostModalOpen(true)} className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md">{t('survey.post_first')}</button>}
                        </div>
                    )}
                </>
            )}
        </div>
      </main>

      <Footer />

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onPostClick={() => setIsPostModalOpen(true)}
        onWalletClick={() => setIsWalletModalOpen(true)}
        notificationCount={attentionCount}
      />

      <PostSurveyModal isOpen={isPostModalOpen} onClose={handlePostModalClose} onSubmit={handlePostOrUpdateSurvey} userPoints={user.points} initialData={editingSurvey} hasUsedFreeBoost={user.hasUsedFreeBoost} />
      <SurveyActionModal isOpen={!!selectedSurvey} onClose={() => setSelectedSurvey(null)} survey={selectedSurvey} onComplete={handleCompleteSurvey} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} currentPoints={user.points} onPurchase={handlePurchasePoints} />
      <PromoteModal isOpen={!!promotingSurvey} onClose={() => setPromotingSurvey(null)} onConfirm={handleConfirmPromote} survey={promotingSurvey} cost={PROMOTION_COST} userPoints={user.points} isFreeBoostAvailable={!user.hasUsedFreeBoost} />
      <ShareModal isOpen={!!sharingSurvey} onClose={() => setSharingSurvey(null)} survey={sharingSurvey} />
      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)} onJoin={handleJoinWaitlist} />
      {tourStep !== null && <TourOverlay steps={tourSteps} currentStep={tourStep} onNext={handleTourNext} onSkip={handleTourSkip} onFinish={handleTourFinish} />}

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 items-center">
        {toasts.map(toast => (
            <div key={toast.id} className={`pointer-events-auto px-6 py-4 rounded-xl shadow-2xl text-white font-bold text-base flex items-center gap-3 animate-in zoom-in fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-rose-600' : 'bg-indigo-600'}`}>
                {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {toast.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                {toast.type === 'info' && <Info className="w-5 h-5" />}
                <span>{toast.message}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default App;
