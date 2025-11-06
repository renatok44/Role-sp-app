import { createContext, useContext } from 'react';
import { Language, Translations } from '../types';

export const translations: Translations = {
  appName: { pt: 'Roles SP', en: 'SP Hangouts' },
  searchPlaceholder: { pt: 'Buscar por nome ou bairro...', en: 'Search by name or neighborhood...' },
  latestAdditions: { pt: 'Últimos adicionados', en: 'Latest Additions' },
  byNeighborhood: { pt: 'Por bairro', en: 'By Neighborhood' },
  favorites: { pt: 'Favoritos', en: 'Favorites' },
  settings: { pt: 'Configurações', en: 'Settings' },
  myFavorites: { pt: 'Meus Favoritos', en: 'My Favorites' },
  noFavorites: { pt: 'Você ainda não favoritou nenhum lugar.', en: 'You haven\'t favorited any places yet.' },
  language: { pt: 'Idioma', en: 'Language' },
  adminAccess: { pt: 'Acesso de Administrador', en: 'Admin Access' },
  enterPin: { pt: 'Digite o PIN', en: 'Enter PIN' },
  login: { pt: 'Entrar', en: 'Login' },
  logout: { pt: 'Sair', en: 'Logout' },
  wrongPin: { pt: 'PIN incorreto', en: 'Incorrect PIN' },
  loggedIn: { pt: 'Modo admin ativado', en: 'Admin mode enabled' },
  tag_boteco: { pt: 'Boteco', en: 'Pub' },
  tag_beer600: { pt: 'Cerveja 600ml', en: '600ml Beer' },
  tag_club: { pt: 'Balada', en: 'Clubbing' },
  tag_goodFood: { pt: 'Comida Boa', en: 'Good Food' },
  tag_date: { pt: 'Date', en: 'Date Spot' },
  tag_birthday: { pt: 'Aniversário', en: 'Birthday' },
  tag_gayFriendly: { pt: 'Gay Friendly', en: 'Gay Friendly' },
  tag_dancing: { pt: 'Dançar', en: 'Dancing' },
  details: { pt: 'Detalhes', en: 'Details' },
  openInstagram: { pt: 'Abrir Instagram', en: 'Open Instagram' },
  viewOnMaps: { pt: 'Ver no Maps', en: 'View on Maps' },
  routeOnMaps: { pt: 'Rota no Maps', en: 'Route on Maps' },
  distance: { pt: 'Distância', en: 'Distance' },
  calculating: { pt: 'Calculando...', en: 'Calculating...' },
  needsReview: { pt: 'Precisa de revisão', en: 'Needs Review' },
  back: { pt: 'Voltar', en: 'Back' },
  nearbyPlaces: { pt: 'Perto de Você', en: 'Nearby You' },
  gettingLocation: { pt: 'Obtendo sua localização...', en: 'Getting your location...' },
  locationError: { pt: 'Não foi possível obter a localização. Mostrando os mais recentes.', en: 'Could not get location. Showing latest additions.' },
};

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
};

export const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};