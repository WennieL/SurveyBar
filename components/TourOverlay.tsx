
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, X, Check, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TourStep {
    targetId?: string;
    title: string;
    description: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourOverlayProps {
    steps: TourStep[];
    currentStep: number;
    onNext: () => void;
    onSkip: () => void;
    onFinish: () => void;
}

const TourOverlay: React.FC<TourOverlayProps> = ({ steps, currentStep, onNext, onSkip, onFinish }) => {
    const { t } = useLanguage();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const step = steps[currentStep];

    const updatePosition = useCallback(() => {
        if (!step.targetId) {
            setTargetRect(null); // Center mode
            return;
        }

        const element = document.getElementById(step.targetId);
        if (element) {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);
            
            // Scroll into view if needed
            const offset = 100;
            if (rect.top < offset || rect.bottom > window.innerHeight - offset) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
             // Fallback if target not found
             setTargetRect(null);
        }
    }, [step.targetId]);

    useEffect(() => {
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [updatePosition]);

    const isLastStep = currentStep === steps.length - 1;
    const isCenter = !targetRect;

    // Tooltip positioning logic
    const getTooltipStyle = () => {
        if (!targetRect) return {}; // Centered via CSS class

        const margin = 16;
        const tooltipWidth = 320; // Approx max width
        
        // Default to bottom
        let top = targetRect.bottom + margin;
        let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);

        // Adjust horizontally to fit screen
        if (left < margin) left = margin;
        if (left + tooltipWidth > window.innerWidth - margin) left = window.innerWidth - tooltipWidth - margin;

        // Adjust vertically if needed (e.g. if near bottom edge, flip to top)
        if (top + 200 > window.innerHeight) {
             top = targetRect.top - 200; // rough height estimate
        }
        
        return {
            top: `${top}px`,
            left: `${left}px`,
            position: 'fixed' as const,
        };
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-hidden">
            {/* Dimmed Background with Cutout effect via Box Shadow on target element placeholder */}
            {/* Since CSS masks are complex, we use a simple full dim and a highlighted spotlight on top */}
            
            {/* Base Backdrop */}
            <div className="absolute inset-0 bg-stone-900/70 transition-colors duration-500"></div>

            {/* Spotlight Hole (if target exists) */}
            {targetRect && (
                <div 
                    className="absolute rounded-lg transition-all duration-300 ease-out border-2 border-orange-500 shadow-[0_0_0_9999px_rgba(28,25,23,0.7)]"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8,
                        zIndex: 101, // Above backdrop
                        pointerEvents: 'none'
                    }}
                >
                    {/* Pulsing indicator */}
                    <div className="absolute -inset-1 rounded-lg border-2 border-orange-400 opacity-50 animate-ping"></div>
                </div>
            )}

            {/* Content Container */}
            <div 
                className={`absolute z-[102] transition-all duration-300 ${isCenter ? 'inset-0 flex items-center justify-center p-4' : ''}`}
            >
                <div 
                    className={`bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in duration-300 border-2 border-white/20 relative`}
                    style={!isCenter ? getTooltipStyle() : {}}
                >
                    {/* Close Button */}
                    <button 
                        onClick={onSkip}
                        className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Step {currentStep + 1}/{steps.length}
                        </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-stone-800 mb-2">{step.title}</h3>
                    <p className="text-stone-500 mb-6 text-sm leading-relaxed">
                        {step.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {steps.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-orange-500' : 'bg-stone-200'}`}
                                ></div>
                            ))}
                        </div>

                        <button 
                            onClick={isLastStep ? onFinish : onNext}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-200/50 transition-all hover:scale-105
                                ${isLastStep ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-stone-800 hover:bg-black text-white'}
                            `}
                        >
                            {isLastStep ? t('tour.finish') : t('tour.next')}
                            {isLastStep ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TourOverlay;
