
import React from 'react';
import { SearchIcon, StarIcon, SettingsIcon } from './icons';
import { useI18n } from '../i18n';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onShowFavorites: () => void;
  onShowSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, onShowFavorites, onShowSettings }) => {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-10 bg-brand-dark/80 backdrop-blur-sm p-4 shadow-lg shadow-black/20">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-white whitespace-nowrap">{t('appName')}</h1>
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-light-gray" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-brand-gray border border-transparent focus:border-brand-accent focus:ring-brand-accent rounded-full py-2 pl-10 pr-4 text-brand-white placeholder-brand-light-gray transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onShowFavorites} className="p-2 rounded-full hover:bg-brand-gray transition-colors">
            <StarIcon className="h-6 w-6 text-brand-white" />
          </button>
          <button onClick={onShowSettings} className="p-2 rounded-full hover:bg-brand-gray transition-colors">
            <SettingsIcon className="h-6 w-6 text-brand-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
