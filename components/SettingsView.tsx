
import React, { useState } from 'react';
import { Language } from '../types';
import { useI18n } from '../i18n';
import { ArrowLeftIcon } from './icons';

interface SettingsViewProps {
  onBack: () => void;
  isAdmin: boolean;
  onAdminLogin: (pin: string) => boolean;
  onAdminLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, isAdmin, onAdminLogin, onAdminLogout }) => {
  const { lang, setLang, t } = useI18n();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (onAdminLogin(pin)) {
      setError('');
      setPin('');
    } else {
      setError(t('wrongPin'));
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark z-20 animate-slide-in-right overflow-y-auto">
      <div className="container mx-auto p-4">
        <header className="flex items-center mb-6">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-gray transition-colors flex items-center">
            <ArrowLeftIcon className="w-6 h-6" />
            <span className="ml-2 font-semibold">{t('back')}</span>
          </button>
        </header>

        <div className="max-w-md mx-auto space-y-8">
          <h1 className="text-3xl font-bold">{t('settings')}</h1>
          
          {/* Language Settings */}
          <div className="bg-brand-gray p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">{t('language')}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setLang('pt')}
                className={`flex-1 py-2 rounded-md transition-colors ${lang === 'pt' ? 'bg-brand-accent text-brand-dark font-bold' : 'bg-brand-dark hover:bg-white/10'}`}
              >
                Português
              </button>
              <button
                onClick={() => setLang('en')}
                className={`flex-1 py-2 rounded-md transition-colors ${lang === 'en' ? 'bg-brand-accent text-brand-dark font-bold' : 'bg-brand-dark hover:bg-white/10'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* Admin Access */}
          <div className="bg-brand-gray p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">{t('adminAccess')}</h2>
            {isAdmin ? (
              <div>
                <p className="text-green-400 mb-3">{t('loggedIn')}</p>
                <button
                  onClick={onAdminLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={t('enterPin')}
                  className="w-full bg-brand-dark border border-transparent focus:border-brand-accent focus:ring-brand-accent rounded-lg py-2 px-4 text-brand-white placeholder-brand-light-gray"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleLogin}
                  className="w-full bg-brand-accent hover:bg-green-500 text-brand-dark font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {t('login')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
