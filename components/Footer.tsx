
import React from 'react';
import { BarChart2, Github, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-stone-200 mt-auto pb-24 md:pb-0 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 mb-12">
                    {/* Brand Column */}
                    <div className="sm:col-span-2 md:col-span-1 space-y-4">
                        <div className="flex items-center gap-2 cursor-default group">
                            <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                                <BarChart2 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
                                {t('app.name')}
                            </span>
                        </div>
                        <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                            {t('footer.desc')}
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className="md:ml-auto">
                        <h4 className="font-bold text-stone-800 mb-4 text-xs uppercase tracking-wider">{t('footer.product')}</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('footer.how_it_works')}</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('footer.pricing')}</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('nav.browse')}</a></li>
                        </ul>
                    </div>

                    <div className="md:mx-auto">
                        <h4 className="font-bold text-stone-800 mb-4 text-xs uppercase tracking-wider">{t('footer.company')}</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('footer.about')}</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('footer.blog')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-stone-800 mb-4 text-xs uppercase tracking-wider">{t('footer.legal')}</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('footer.privacy')}</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('footer.terms')}</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-stone-400 order-2 md:order-1 text-center md:text-left">
                        &copy; {currentYear} {t('app.name')}. {t('footer.rights')}
                    </p>
                    
                    <div className="flex items-center gap-4 order-1 md:order-2">
                        <a href="#" className="text-stone-400 hover:text-stone-600 hover:bg-stone-50 p-2 rounded-full transition-all">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="text-stone-400 hover:text-stone-600 hover:bg-stone-50 p-2 rounded-full transition-all">
                            <Github className="w-4 h-4" />
                        </a>
                        <a href="#" className="text-stone-400 hover:text-stone-600 hover:bg-stone-50 p-2 rounded-full transition-all">
                            <Linkedin className="w-4 h-4" />
                        </a>
                         <a href="#" className="text-stone-400 hover:text-stone-600 hover:bg-stone-50 p-2 rounded-full transition-all">
                            <Facebook className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
