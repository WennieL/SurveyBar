
import React from 'react';
import { Survey, SurveyTheme } from '../types';
import { Clock, ArrowRight, TrendingUp, Edit2, Trash2, Megaphone, AlertCircle, MapPin, Target, Calendar, Globe, Share2, AlertTriangle, Zap, CheckCircle, Ban, CalendarPlus, Archive } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MAX_EXTENSIONS } from '../constants';

interface SurveyCardProps {
    survey: Survey;
    onTakeSurvey: (survey: Survey) => void;
    onPromote?: (survey: Survey) => void;
    onDelete?: (survey: Survey) => void;
    onEdit?: (survey: Survey) => void;
    onShare?: (survey: Survey) => void;
    onCloseSurvey?: (survey: Survey) => void;
    isCompleted: boolean;
    isOwner: boolean;
    id?: string;
}

const ThemeColors: Record<SurveyTheme, string> = {
    [SurveyTheme.EDUCATION]: 'bg-sky-50 text-sky-700',
    [SurveyTheme.PRODUCT_LAUNCH]: 'bg-violet-50 text-violet-700',
    [SurveyTheme.ACADEMIC_RESEARCH]: 'bg-indigo-50 text-indigo-700',
    [SurveyTheme.MARKET_RESEARCH]: 'bg-orange-50 text-orange-700',
    [SurveyTheme.USER_EXPERIENCE]: 'bg-rose-50 text-rose-700',
    [SurveyTheme.FUN_SOCIAL]: 'bg-fuchsia-50 text-fuchsia-700',
    [SurveyTheme.OTHER]: 'bg-stone-100 text-stone-600',
};

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onTakeSurvey, onPromote, onDelete, onEdit, onShare, onCloseSurvey, isCompleted, isOwner, id }) => {
    const { t } = useLanguage();
    const progress = Math.min(100, Math.round((survey.currentResponses / survey.targetResponses) * 100));

    // Calculate days remaining
    const now = new Date();
    const closing = new Date(survey.closingDate);
    const timeDiff = closing.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const isExpiringSoon = daysRemaining <= 3 && daysRemaining > 0;
    const isExpired = daysRemaining <= 0;
    const isGoalReached = survey.currentResponses >= survey.targetResponses;
    
    // Check if "Needs Action" (Owner only: expired or full, but not closed yet)
    const needsAction = isOwner && !survey.isClosed && (isExpired || isGoalReached);

    // Extension limit check
    const extensionsUsed = survey.extensionCount || 0;
    const isMaxExtensionReached = extensionsUsed >= MAX_EXTENSIONS;
    
    // Special state: Expired AND Max Extensions Reached -> Must Close
    const isFinalState = isOwner && !survey.isClosed && isExpired && isMaxExtensionReached;

    // Check if target info exists
    const hasTargetInfo = survey.targetCriteria || survey.targetLocation || survey.targetAge || survey.targetLanguage;
    const isHighReward = survey.pointsReward > 1;

    // Logic for clickable title
    // Only clickable if user can actually take the survey (not owner, not closed, not completed)
    const canTakeSurvey = !isOwner && !isCompleted && !survey.isClosed;

    return (
        <div id={id} className={`group relative bg-white rounded-xl border transition-all duration-300 flex flex-col h-full 
            ${isFinalState ? 'border-rose-200 shadow-sm ring-1 ring-rose-100' : needsAction ? 'border-orange-300 shadow-md ring-1 ring-orange-200' : 'border-stone-100 shadow-sm hover:shadow-lg'}
            ${(isCompleted && !isOwner) || survey.isClosed ? 'opacity-60 grayscale-[0.5]' : ''}
            ${!needsAction && !isFinalState && isHighReward && !survey.isClosed && !isCompleted ? 'border-amber-200 shadow-amber-100' : ''}
        `}>
            {/* Status Badges - Top Right */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                <div className="flex gap-2">
                    {survey.isClosed && (
                         <span className="bg-stone-200 text-stone-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            {t('survey.closed')}
                        </span>
                    )}
                    {!survey.isClosed && survey.isPromoted && (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {t('survey.promoted')}
                        </span>
                    )}
                    {isCompleted && (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            {t('survey.completed')}
                        </span>
                    )}
                    {isOwner && (
                        <span className="bg-stone-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {t('survey.your_survey')}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${ThemeColors[survey.theme] || ThemeColors[SurveyTheme.OTHER]}`}>
                        {t(`theme.${survey.theme}`)}
                    </span>
                    {/* Time Estimate Badge */}
                    <div className="flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2 py-1 rounded-full border border-stone-100 mr-auto ml-2">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{survey.estimatedTime || 1} {t('survey.mins')}</span>
                    </div>
                </div>
                
                {/* Clickable Title */}
                <h3 
                    onClick={() => canTakeSurvey && onTakeSurvey(survey)}
                    className={`text-lg font-bold text-stone-800 mb-2 leading-tight transition-colors
                        ${canTakeSurvey ? 'cursor-pointer hover:text-indigo-600 hover:underline decoration-2 decoration-indigo-200 underline-offset-2' : ''}
                    `}
                >
                    {survey.title}
                </h3>
                
                {/* Target Info Section */}
                {hasTargetInfo && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {survey.targetLocation && (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                {survey.targetLocation}
                            </div>
                        )}
                         {survey.targetAge && (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                <Calendar className="w-3 h-3 text-stone-400" />
                                {survey.targetAge}
                            </div>
                        )}
                        {survey.targetLanguage && (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                <Globe className="w-3 h-3 text-stone-400" />
                                {survey.targetLanguage}
                            </div>
                        )}
                        {survey.targetCriteria && (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                <Target className="w-3 h-3 text-stone-400" />
                                {survey.targetCriteria}
                            </div>
                        )}
                    </div>
                )}
                
                <p className="text-stone-500 text-sm line-clamp-2 mb-4 h-10 leading-relaxed">
                    {survey.description}
                </p>

                {/* Progress Bar & Deadline */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                        <span className="font-medium text-stone-600">{survey.currentResponses} {t('survey.responses')}</span>
                        <span>{t('survey.goal')}: {survey.targetResponses}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${isGoalReached ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    
                    {/* Progress Footer: Percentage & Days Remaining */}
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] font-bold text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded">
                            {progress}%
                        </span>

                        {!survey.isClosed && !isExpired && (
                            <span className={`text-[10px] font-medium flex items-center gap-1.5 
                                ${isExpiringSoon ? 'text-rose-600 font-bold' : 'text-stone-400'}
                            `}>
                                {isExpiringSoon ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {t('survey.ends_in', { days: daysRemaining })}
                            </span>
                        )}
                        {(survey.isClosed || isExpired) && (
                            <span className={`text-[10px] font-medium ${isFinalState ? 'text-rose-500 font-bold' : 'text-stone-400'}`}>
                                {survey.isClosed ? t('survey.closed') : isFinalState ? t('survey.cannot_extend') : t('survey.expired')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-xs font-bold text-indigo-700 border border-white shadow-sm">
                            {survey.creatorName.charAt(0)}
                        </div>
                        <span className="text-xs text-stone-500 truncate max-w-[80px]">{survey.creatorName}</span>
                    </div>

                    {isOwner ? (
                         <div className="flex gap-2">
                             
                             {/* OWNER ACTION BUTTONS */}
                             {isFinalState ? (
                                // Case 1: Max Extensions + Expired -> Force Archive or Delete
                                <div className="flex gap-2">
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); if(onDelete) onDelete(survey); }}
                                        className="p-2 bg-stone-100 text-stone-500 rounded-lg hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                        title={t('survey.delete')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onCloseSurvey && onCloseSurvey(survey)}
                                        className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-1.5"
                                    >
                                        <Archive className="w-3 h-3" />
                                        {t('survey.final_close')}
                                    </button>
                                </div>
                             ) : needsAction ? (
                                // Case 2: Expired/Full but can Extend
                                <div className="flex gap-2">
                                    {/* DELETE Button - Replaces the Close button behavior for the Trash Icon */}
                                    <button
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            if(onDelete) onDelete(survey); 
                                        }}
                                        className="p-2 bg-stone-100 text-stone-500 rounded-lg hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                        title={t('survey.delete')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    
                                    {/* ARCHIVE/CLOSE Button */}
                                    <button
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            if(onCloseSurvey) onCloseSurvey(survey); 
                                        }}
                                        className="p-2 bg-stone-100 text-stone-500 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                                        title={t('survey.btn_close')}
                                    >
                                        <Archive className="w-4 h-4" />
                                    </button>

                                    {/* EXTEND Button */}
                                    <button
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            if(onEdit) onEdit(survey); 
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg hover:bg-orange-200 transition-colors"
                                        title={t('modal.post.title_extend')}
                                    >
                                        <CalendarPlus className="w-4 h-4" />
                                        <span>{t('modal.post.title_extend').split('/')[0]}</span>
                                    </button>
                                </div>
                             ) : (
                                // Case 3: Normal Active -> Standard Management
                                <>
                                    {/* Always show DELETE option for owners */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); if(onDelete) onDelete(survey); }}
                                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title={t('survey.delete')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {!survey.isClosed && (
                                        <>
                                            <button onClick={(e) => { e.stopPropagation(); if(onShare) onShare(survey); }} className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); if(onEdit) onEdit(survey); }} className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); if(onPromote) onPromote(survey); }} className="p-2 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                                <Megaphone className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </>
                             )}
                        </div>
                    ) : isCompleted ? (
                         <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                            <CheckCircle className="w-5 h-5" />
                            {t('survey.completed')}
                        </div>
                    ) : survey.isClosed ? (
                        <div className="flex items-center gap-1 text-stone-400 font-medium text-sm">
                            {t('survey.closed')}
                        </div>
                    ) : (
                        <button 
                            onClick={() => onTakeSurvey(survey)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95
                                ${isHighReward 
                                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-orange-200' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                }
                            `}
                        >
                            {t('survey.take')}
                            {isHighReward ? (
                                <span className="bg-white text-orange-700 px-2 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm">
                                    <Zap className="w-3 h-3 fill-orange-700" /> +{survey.pointsReward}
                                </span>
                            ) : (
                                <ArrowRight className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SurveyCard;
