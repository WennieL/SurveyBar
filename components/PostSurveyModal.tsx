
import React, { useState, useEffect, useRef } from 'react';
import { SurveyTheme, Survey } from '../types';
import { X, Megaphone, AlertCircle, Ticket, Target, MapPin, Globe, Users, Calendar, ArrowRight, ChevronDown, ChevronUp, Zap, Timer, Plus, Coins, Key } from 'lucide-react';
import { COST_PER_POST, PROMOTION_COST, EXTENSION_COST, MAX_EXTENSIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface PostSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    userPoints: number;
    initialData?: Survey | null;
    hasUsedFreeBoost: boolean;
}

// --- Internal Tag Input Component ---
interface TagInputProps {
    label: string;
    icon: React.ElementType;
    placeholder: string;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    suggestions?: string[];
}

const TagInput: React.FC<TagInputProps> = ({ label, icon: Icon, placeholder, tags, onTagsChange, suggestions = [] }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onTagsChange([...tags, trimmed]);
        }
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(t => t !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-[10px] md:text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Icon className="w-3.5 h-3.5" /> {label}
            </label>
            <div 
                className="min-h-[42px] md:min-h-[46px] p-2 flex flex-wrap gap-1.5 bg-stone-50 border border-stone-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 focus-within:bg-white transition-all cursor-text shadow-sm"
                onClick={() => inputRef.current?.focus()}
            >
                {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-stone-700 text-[11px] font-bold rounded-lg border border-stone-200 shadow-sm animate-in zoom-in-95 duration-200 group">
                        {tag}
                        <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                            className="text-stone-300 hover:text-rose-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => addTag(inputValue)}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[60px] bg-transparent outline-none text-sm text-stone-800 placeholder-stone-400 py-1 px-1"
                />
            </div>
            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5 ml-1">
                    {suggestions.filter(s => !tags.includes(s)).map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => addTag(s)}
                            className="text-[9px] md:text-[10px] font-bold text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 px-2 py-0.5 rounded-full border border-stone-200 transition-all flex items-center gap-1 bg-white"
                        >
                            <Plus className="w-2.5 h-2.5" />
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const PostSurveyModal: React.FC<PostSurveyModalProps> = ({ isOpen, onClose, onSubmit, userPoints, initialData, hasUsedFreeBoost }) => {
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [linkError, setLinkError] = useState('');
    const [theme, setTheme] = useState<SurveyTheme>(SurveyTheme.OTHER);
    const [targetResponses, setTargetResponses] = useState(50);
    const [isPromoted, setIsPromoted] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    
    const [targetCriteria, setTargetCriteria] = useState<string[]>([]);
    const [targetLocation, setTargetLocation] = useState<string[]>([]);
    const [targetAge, setTargetAge] = useState<string[]>([]);
    const [targetLanguage, setTargetLanguage] = useState<string[]>([]);
    
    const [closingDate, setClosingDate] = useState('');
    const [estimatedTime, setEstimatedTime] = useState<number>(3);
    const [pointsReward, setPointsReward] = useState<number>(1);
    const [isAdvancedTargetingOpen, setIsAdvancedTargetingOpen] = useState(false);

    const isEditing = !!initialData;
    const isFreeBoostAvailable = !hasUsedFreeBoost;
    
    const extensionsUsed = initialData?.extensionCount || 0;
    const isMaxExtensionReached = extensionsUsed >= MAX_EXTENSIONS;
    const isExpired = initialData && new Date(initialData.closingDate).getTime() < Date.now();
    const isGoalReached = initialData && initialData.currentResponses >= initialData.targetResponses;
    const isExtensionMode = isExpired || isGoalReached;
    
    let baseCost = isExtensionMode ? EXTENSION_COST : (!isEditing ? COST_PER_POST : 0);
    let rewardPoolCost = !isEditing ? (targetResponses * pointsReward) : (Math.max(0, targetResponses - (initialData?.targetResponses || 0)) * (initialData?.pointsReward || 1));
    const currentBoostCost = isFreeBoostAvailable ? 0 : PROMOTION_COST;
    const shouldChargeBoost = isPromoted && (!initialData || !initialData.isPromoted);
    const totalCost = baseCost + rewardPoolCost + (shouldChargeBoost ? currentBoostCost : 0);

    const canSubmit = userPoints >= totalCost;
    const isBlockedByExtensionLimit = isExtensionMode && isMaxExtensionReached;

    useEffect(() => {
        if (isOpen) {
            setLinkError('');
            if (initialData) {
                setTitle(initialData.title);
                setDescription(initialData.description);
                setLink(initialData.link);
                setTheme(initialData.theme);
                setTargetResponses(initialData.targetResponses);
                setIsPromoted(!!initialData.isPromoted);
                setVerificationCode(initialData.verificationCode || '');
                const toTags = (str?: string) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];
                setTargetCriteria(toTags(initialData.targetCriteria));
                setTargetLocation(toTags(initialData.targetLocation));
                setTargetAge(toTags(initialData.targetAge));
                setTargetLanguage(toTags(initialData.targetLanguage));
                setEstimatedTime(initialData.estimatedTime || 3);
                setPointsReward(initialData.pointsReward || 1);
                
                if (isExpired || isGoalReached) {
                    const d = new Date();
                    d.setDate(d.getDate() + 30);
                    setClosingDate(d.toISOString().split('T')[0]);
                } else {
                    const date = new Date(initialData.closingDate);
                    setClosingDate(date.toISOString().split('T')[0]);
                }
                const hasAdvanced = initialData.targetCriteria || initialData.targetLocation || initialData.targetAge || initialData.targetLanguage;
                setIsAdvancedTargetingOpen(!!hasAdvanced);
            } else {
                setTitle(''); setDescription(''); setLink(''); setTheme(SurveyTheme.OTHER); setTargetResponses(50); setIsPromoted(false); setVerificationCode(''); setTargetCriteria([]); setTargetLocation([]); setTargetAge([]); setTargetLanguage([]); setEstimatedTime(3); setPointsReward(1);
                const date = new Date();
                date.setDate(date.getDate() + 30);
                setClosingDate(date.toISOString().split('T')[0]);
                setIsAdvancedTargetingOpen(false);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isBlockedByExtensionLimit) return;
        let validLink = link;
        if (!link.startsWith('http')) validLink = `https://${link}`;
        onSubmit({
            title, description, link: validLink, theme, targetResponses, isPromoted, verificationCode,
            targetCriteria: targetCriteria.join(', '), targetLocation: targetLocation.join(', '), targetAge: targetAge.join(', '), targetLanguage: targetLanguage.join(', '),
            closingDate: new Date(closingDate).toISOString(), estimatedTime, pointsReward, costDeducted: totalCost
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-y-auto max-h-[95vh] md:max-h-[90vh] animate-in fade-in zoom-in duration-200 relative border border-stone-100 no-scrollbar">
                
                <div className="flex justify-between items-center p-5 md:p-8 pb-3 md:pb-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-stone-50 md:border-none">
                    <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                        {isExtensionMode ? t('modal.post.title_extend') : isEditing ? t('modal.post.title_edit') : t('modal.post.title_new')}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-8 pt-4 space-y-6 md:space-y-8">
                    {/* Basic Info Section */}
                    <div className="space-y-4 md:space-y-5">
                         <div className="relative">
                            <label className="block text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5 ml-1">{t('modal.post.link')}</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Globe className="w-4 h-4 text-stone-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="text" required placeholder={t('modal.post.link_placeholder')} value={link}
                                    onChange={(e) => { setLink(e.target.value); if (linkError) setLinkError(''); }}
                                    className={`w-full pl-10 pr-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl border bg-stone-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-stone-900 text-sm placeholder-stone-300 ${linkError ? 'border-rose-300' : 'border-stone-200'}`}
                                />
                            </div>
                        </div>

                        {/* Verification Code Section */}
                        <div className="relative">
                            <label className="block text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5">
                                <Key className="w-3.5 h-3.5" /> {t('modal.post.verification_code')}
                            </label>
                            <input
                                type="text" placeholder={t('modal.post.verification_code_ph')} value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full px-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-stone-900 text-sm placeholder-stone-300 font-bold tracking-widest"
                            />
                            <p className="mt-1.5 text-[10px] text-stone-400 leading-tight ml-1">
                                {t('modal.post.verification_help')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5 ml-1">{t('modal.post.title_label')}</label>
                                <input
                                    type="text" required placeholder={t('modal.post.title_placeholder')} value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-stone-900 text-sm placeholder-stone-300"
                                />
                            </div>
                            <div className="grid grid-cols-2 md:contents gap-4">
                                <div>
                                    <label className="block text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5 ml-1">{t('modal.post.category')}</label>
                                    <div className="relative">
                                        <select
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value as SurveyTheme)}
                                            className="w-full pl-3 md:pl-4 pr-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-stone-900 text-sm appearance-none"
                                        >
                                            {Object.values(SurveyTheme).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5">
                                        <Timer className="w-3.5 h-3.5" /> {t('modal.post.est_time')}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={estimatedTime}
                                            onChange={(e) => setEstimatedTime(Number(e.target.value))}
                                            className="w-full pl-3 md:pl-4 pr-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-stone-900 text-sm appearance-none"
                                        >
                                            <option value={1}>&lt; 1 min</option>
                                            <option value={3}>1-3 min</option>
                                            <option value={5}>3-5 min</option>
                                            <option value={10}>5-10 min</option>
                                            <option value={15}>10+ min</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest">{t('modal.post.desc_label')}</label>
                            </div>
                            <textarea
                                required rows={3} placeholder={t('modal.post.desc_placeholder')} value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none outline-none text-stone-900 text-sm placeholder-stone-300"
                            />
                        </div>
                    </div>

                    {/* Target Audience Section */}
                    <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-50/50 border border-indigo-100 shadow-sm relative">
                        <div className="flex items-center justify-between mb-5 md:mb-6">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-sm md:text-base">
                                <Users className="w-5 h-5" /> {t('modal.post.target_section')}
                            </h3>
                        </div>
                        <div className="space-y-6 md:space-y-8">
                             <div>
                                <label className="block text-[10px] md:text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> {t('modal.post.goal')}</label>
                                <div className="bg-white p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] border border-indigo-100 shadow-sm">
                                    <div className="flex items-baseline gap-1.5 mb-4 md:mb-5">
                                        <span className="text-3xl md:text-4xl font-black text-indigo-600 tracking-tight leading-none">{targetResponses}</span>
                                        <span className="text-xs md:text-sm font-bold text-stone-400 uppercase tracking-widest">{t('modal.post.people')}</span>
                                    </div>
                                    <input 
                                        type="range" max="200" step="5" min={isEditing && initialData ? Math.max(10, initialData.targetResponses) : 10}
                                        value={targetResponses} onChange={(e) => setTargetResponses(Number(e.target.value))}
                                        className="w-full h-1.5 md:h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between gap-1.5 md:gap-2 mt-5 md:mt-6">
                                        {[25, 50, 100, 200].map(val => (
                                            <button key={val} type="button" disabled={isEditing && initialData && val < initialData.targetResponses}
                                                onClick={() => setTargetResponses(val)}
                                                className={`flex-1 py-1.5 md:py-2.5 text-[10px] md:text-xs font-bold rounded-lg md:rounded-xl transition-all border ${targetResponses === val ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-stone-500 border-stone-100 hover:border-indigo-200 hover:text-indigo-600'}`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-indigo-100/50 pt-4 md:pt-6">
                                <button type="button" onClick={() => setIsAdvancedTargetingOpen(!isAdvancedTargetingOpen)} className="flex items-center justify-between w-full text-left group">
                                    <span className="text-[13px] md:text-sm font-bold text-indigo-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                                        {t('modal.post.advanced_targeting')}
                                        {(targetLocation.length > 0 || targetAge.length > 0 || targetLanguage.length > 0 || targetCriteria.length > 0) && (
                                            <span className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-indigo-600 text-white text-[9px] md:text-[10px] font-bold animate-in zoom-in duration-300">
                                                {[targetLocation, targetAge, targetLanguage, targetCriteria].filter(a => a.length > 0).length}
                                            </span>
                                        )}
                                    </span>
                                    <div className="p-1 bg-white border border-indigo-100 rounded-lg shadow-sm">
                                        {isAdvancedTargetingOpen ? <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" /> : <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />}
                                    </div>
                                </button>
                                {isAdvancedTargetingOpen && (
                                    <div className="space-y-5 md:space-y-6 mt-5 md:mt-6 animate-in slide-in-from-top-4 fade-in duration-300">
                                        <TagInput label={t('modal.post.location_label')} icon={MapPin} placeholder="Global, Taiwan..." tags={targetLocation} onTagsChange={setTargetLocation} suggestions={['Global', 'Taiwan', 'USA', 'Hong Kong', 'Singapore']} />
                                        <TagInput label={t('modal.post.language_label')} icon={Globe} placeholder="English, Mandarin..." tags={targetLanguage} onTagsChange={setTargetLanguage} suggestions={['English', 'Mandarin', 'Cantonese', 'Japanese']} />
                                        <TagInput label={t('modal.post.age_label')} icon={Calendar} placeholder="18-24, All..." tags={targetAge} onTagsChange={setTargetAge} suggestions={['All', '18-24', '25-34', '35-44', '45+']} />
                                        <TagInput label={t('modal.post.criteria_label')} icon={Users} placeholder="Students, Renters..." tags={targetCriteria} onTagsChange={setTargetCriteria} suggestions={['Students', 'Freelancers', 'Renters', 'Dog Owners']} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Promotion & Rewards Section */}
                    <div className="space-y-4 md:space-y-5">
                        {!isEditing && (
                            <div className={`p-4 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] border transition-all duration-300 relative group ${isPromoted ? 'border-orange-500 bg-orange-50/50' : 'border-stone-200 hover:border-orange-300'}`}>
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className={`mt-0.5 p-2 rounded-xl transition-colors ${isPromoted ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-orange-100 group-hover:text-orange-500'}`}><Megaphone className="w-4 h-4 md:w-5 md:h-5" /></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center gap-3 mb-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-stone-900 text-sm md:text-base">{t('modal.post.boost_title')}</h3>
                                                {isFreeBoostAvailable && <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[9px] md:text-[10px] font-black px-2 py-0.5 md:py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap"><Ticket className="w-3 h-3 md:w-3.5 md:h-3.5" />{t('modal.post.free')}</span>}
                                            </div>
                                            <div className="relative inline-block w-10 md:w-12 h-5 md:h-6 shrink-0">
                                                <input type="checkbox" checked={isPromoted} onChange={(e) => setIsPromoted(e.target.checked)} className="sr-only peer" id="boost-toggle" />
                                                <label htmlFor="boost-toggle" className="absolute cursor-pointer inset-0 bg-stone-200 peer-checked:bg-orange-500 rounded-full transition-colors duration-300 before:content-[''] before:absolute before:w-4 md:before:w-5 before:h-4 md:before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform before:duration-300 peer-checked:before:translate-x-5 md:peer-checked:before:translate-x-6 shadow-inner"></label>
                                            </div>
                                        </div>
                                        <p className="text-[11px] md:text-xs text-stone-500 leading-relaxed">{t('modal.post.boost_desc')}</p>
                                        {isPromoted && <div className="mt-2 text-orange-600 text-[10px] md:text-xs font-black inline-flex items-center gap-1.5 px-2.5 py-1 md:py-1.5 bg-white border border-orange-100 rounded-lg md:rounded-xl shadow-sm animate-in slide-in-from-left-2 duration-300"><Zap className="w-3 h-3 fill-orange-500" /> {isFreeBoostAvailable ? t('modal.post.free_boost_applied') : `+ ${PROMOTION_COST} ${t('nav.points')}`}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isEditing && (
                            <div className={`p-4 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] border transition-all duration-300 group ${pointsReward > 1 ? 'border-amber-400 bg-amber-50/50' : 'border-stone-200 hover:border-amber-300'}`}>
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className={`mt-0.5 p-2 rounded-xl transition-colors ${pointsReward > 1 ? 'bg-amber-500 text-white shadow-md' : 'bg-stone-100 text-stone-400 group-hover:bg-amber-100 group-hover:text-amber-500'}`}><Zap className="w-4 h-4 md:w-5 md:h-5" /></div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-stone-900 mb-1 text-sm md:text-base">{t('modal.post.reward_per_response')}</h3>
                                        <p className="text-[11px] md:text-xs text-stone-500 mb-4">{t('modal.post.reward_help')}</p>
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map((val) => (
                                                <button key={val} type="button" onClick={() => setPointsReward(val)} className={`flex-1 py-2.5 md:py-3 px-1 text-[10px] md:text-xs font-black rounded-lg md:rounded-xl border transition-all ${pointsReward === val ? 'bg-amber-500 text-white border-amber-500 shadow-md transform scale-105' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'}`}>
                                                    {val === 1 && t('modal.post.reward_1')}
                                                    {val === 2 && t('modal.post.reward_2')}
                                                    {val === 3 && t('modal.post.reward_3')}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-4 text-amber-700 text-[10px] md:text-[11px] font-bold flex justify-between bg-white border border-amber-100 px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl shadow-sm">
                                            <span className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> {t('modal.post.reward_pool_calculation', { count: targetResponses, reward: pointsReward })}</span>
                                            <span className="text-amber-600 font-black">{targetResponses * pointsReward} {t('nav.points')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Section - Optimized for Mobile */}
                    {(totalCost > 0 || isPromoted) && (
                        <div className="bg-indigo-50/50 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-indigo-100 shadow-inner group relative overflow-hidden">
                             <h4 className="text-[9px] md:text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3 md:mb-4 border-b border-indigo-100/50 pb-2 md:pb-3">{t('modal.post.total_cost')}</h4>
                             
                             <div className="space-y-2 md:space-y-3 mb-5 md:mb-6">
                                {!isEditing && <div className="flex justify-between text-[11px] md:text-xs font-bold text-stone-500"><span>{t('modal.post.listing_fee')}</span><span className="text-stone-900">{COST_PER_POST} {t('nav.points')}</span></div>}
                                {isEditing && baseCost > 0 && <div className="flex justify-between text-[11px] md:text-xs font-bold text-stone-500"><span>{t('modal.post.extension_cost')}</span><span className="text-stone-900">{baseCost} {t('nav.points')}</span></div>}
                                {rewardPoolCost > 0 && <div className="flex justify-between text-[11px] md:text-xs font-bold text-amber-600"><span>{t('modal.post.respondent_rewards')}</span><span>{rewardPoolCost} {t('nav.points')}</span></div>}
                                {shouldChargeBoost && (
                                    <div className="flex justify-between text-[11px] md:text-xs font-bold text-orange-600">
                                        <span>{t('survey.promoted')}</span>
                                        <span>{isFreeBoostAvailable ? 'FREE' : `${PROMOTION_COST} ${t('nav.points')}`}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-between items-end border-t border-indigo-100 pt-4 md:pt-5">
                                <div className="space-y-0.5 md:space-y-1">
                                    <div className="text-[9px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('nav.wallet')}</div>
                                    <div className="text-xs md:text-sm font-black text-stone-900 flex items-center gap-1.5">
                                        <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${userPoints >= totalCost ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        {userPoints} {t('nav.points')}
                                    </div>
                                </div>
                                <div className="text-right">
                                     <div className={`text-2xl md:text-4xl font-black transition-colors duration-300 ${canSubmit && !isBlockedByExtensionLimit ? 'text-indigo-600' : 'text-rose-500'}`}>
                                        {totalCost} 
                                        <span className="text-[10px] md:text-xs text-stone-400 font-bold uppercase ml-1 md:ml-2 tracking-widest">{t('nav.points')}</span>
                                     </div>
                                </div>
                            </div>
                            {(!canSubmit || isBlockedByExtensionLimit) && (
                                <p className="text-[9px] md:text-[10px] text-rose-500 font-black mt-3 flex items-center justify-end gap-1 animate-pulse">
                                    <AlertCircle className="w-3 h-3" />
                                    {isBlockedByExtensionLimit ? t('modal.post.max_extensions') : t('modal.post.insufficient_points')}
                                </p>
                             )}
                        </div>
                    )}

                    <button
                        type="submit" disabled={!canSubmit || isBlockedByExtensionLimit}
                        className="w-full h-14 md:h-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl md:rounded-[1.5rem] font-black text-base md:text-lg shadow-xl shadow-indigo-200/50 hover:shadow-indigo-300 active:scale-[0.98] disabled:from-stone-300 disabled:to-stone-400 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 md:gap-3 group"
                    >
                        {isExtensionMode ? t('modal.post.extend_update') : isEditing ? t('modal.post.update') : t('modal.post.submit')}
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostSurveyModal;
