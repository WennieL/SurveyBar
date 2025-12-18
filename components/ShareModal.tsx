
import React, { useState } from 'react';
import { Survey } from '../types';
import { X, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle, Link as LinkIcon, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    survey: Survey | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, survey }) => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    if (!isOpen || !survey) return null;

    // Generate a mock shareable link for the app
    const shareLink = `${window.location.origin}/?id=${survey.id}`;
    const shareText = `Check out this survey: ${survey.title}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${shareText}\n${shareLink}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleSocialShare = (platform: string) => {
        let url = '';
        const encodedUrl = encodeURIComponent(shareLink);
        const encodedText = encodeURIComponent(shareText);

        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'email':
                url = `mailto:?subject=${encodeURIComponent(survey.title)}&body=${encodedText}%0A%0A${encodedUrl}`;
                break;
            default:
                return;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-5 border-b border-stone-100">
                    <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-indigo-600" />
                        {t('modal.share.title')}
                    </h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-stone-500 text-sm mb-2">{t('modal.share.subtitle')}</p>
                    <p className="font-semibold text-stone-800 mb-6 line-clamp-1">"{survey.title}"</p>

                    {/* Social Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <button 
                            onClick={() => handleSocialShare('facebook')}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-200">
                                <Facebook className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-stone-500 font-medium">Facebook</span>
                        </button>
                        <button 
                            onClick={() => handleSocialShare('twitter')}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm group-hover:shadow-stone-300">
                                <Twitter className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-stone-500 font-medium">X</span>
                        </button>
                        <button 
                            onClick={() => handleSocialShare('whatsapp')}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-green-200">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-stone-500 font-medium">WhatsApp</span>
                        </button>
                        <button 
                            onClick={() => handleSocialShare('linkedin')}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-700 group-hover:text-white transition-all shadow-sm group-hover:shadow-sky-200">
                                <Linkedin className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-stone-500 font-medium">LinkedIn</span>
                        </button>
                        <button 
                            onClick={() => handleSocialShare('email')}
                            className="flex flex-col items-center gap-2 group col-span-4 mt-2"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-orange-200">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-stone-500 font-medium">Email</span>
                        </button>
                    </div>

                    {/* Copy Link Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="w-4 h-4 text-stone-400" />
                        </div>
                        <input 
                            type="text" 
                            readOnly 
                            value={shareLink} 
                            className="w-full pl-9 pr-24 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-600 outline-none"
                        />
                        <button 
                            onClick={handleCopy}
                            className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5
                                ${copied 
                                    ? 'bg-emerald-500 text-white shadow-emerald-200' 
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                                }
                            `}
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? t('modal.share.copied') : t('modal.share.copy_link')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
