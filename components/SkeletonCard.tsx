
import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm flex flex-col h-full overflow-hidden relative">
            {/* Shimmer Effect Container */}
            <div className="animate-pulse flex flex-col h-full p-6">
                
                {/* Header: Theme Badge & Status */}
                <div className="flex justify-between items-start mb-4">
                    <div className="h-6 w-24 bg-stone-200 rounded-md"></div>
                    <div className="h-5 w-16 bg-stone-100 rounded-full"></div>
                </div>

                {/* Title */}
                <div className="h-7 w-3/4 bg-stone-200 rounded-lg mb-3"></div>
                <div className="h-7 w-1/2 bg-stone-200 rounded-lg mb-4"></div>

                {/* Target Info Pills */}
                <div className="flex gap-2 mb-4">
                    <div className="h-5 w-16 bg-stone-100 rounded-md"></div>
                    <div className="h-5 w-20 bg-stone-100 rounded-md"></div>
                    <div className="h-5 w-12 bg-stone-100 rounded-md"></div>
                </div>

                {/* Description Lines */}
                <div className="space-y-2 mb-6 flex-1">
                    <div className="h-3 w-full bg-stone-100 rounded"></div>
                    <div className="h-3 w-11/12 bg-stone-100 rounded"></div>
                    <div className="h-3 w-4/6 bg-stone-100 rounded"></div>
                </div>

                {/* Progress Bar Section */}
                <div className="mt-auto">
                    <div className="flex justify-between mb-2">
                        <div className="h-3 w-16 bg-stone-100 rounded"></div>
                        <div className="h-3 w-10 bg-stone-100 rounded"></div>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 mb-4">
                        <div className="bg-stone-200 h-2.5 rounded-full w-1/3"></div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-stone-50 flex justify-between items-center">
                        <div className="h-3 w-24 bg-stone-100 rounded"></div>
                        <div className="h-8 w-24 bg-stone-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
