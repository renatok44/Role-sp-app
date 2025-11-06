import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Place, FilterKey, Language } from './types';
import { fetchAndParseSheetData } from './services/sheetService';
import { I18nContext, translations } from './i18n';
import { useFavorites } from './hooks/useFavorites';
import { useGeolocation } from './hooks/useGeolocation';
import { calculateDistance } from './services/locationService';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import PlaceCard from './components/PlaceCard';
import DetailView from './components/DetailView';
import SettingsView from './components/SettingsView';
import { StarIcon, ArrowLeftIcon } from './components/icons';

type View = 'home' | 'details' | 'favorites' | 'settings';

const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState<Language>('pt');
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { coords: userCoords, loading: geoLoading, error: geoError } = useGeolocation();

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);
        const fetchedPlaces = await fetchAndParseSheetData();
        setPlaces(fetchedPlaces);
        setError(null);
      } catch (err) {
        console.error("Failed to load places:", err);
        setError("Failed to load data from the spreadsheet. Please check the link and format.");
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, []);

  const t = useCallback((key: keyof typeof translations) => {
    return translations[key][lang];
  }, [lang]);

  const i18nContextValue = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  
  const filteredPlaces = useMemo(() => {
    return places
      .filter(place => {
        const matchesSearch =
          place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilters = activeFilters.every(filter => place.tags[filter]);

        return matchesSearch && matchesFilters;
      });
  }, [places, searchTerm, activeFilters]);

  const sortedPlaces = useMemo(() => {
    const placesWithDistance = filteredPlaces.map(place => {
        const distance = userCoords 
            ? calculateDistance(userCoords.latitude, userCoords.longitude, place.coords.lat, place.coords.lng)
            : null;
        return { ...place, distance };
    });

    if (userCoords) {
        placesWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else {
        placesWithDistance.sort((a, b) => new Date(b.inclusionDate).getTime() - new Date(a.inclusionDate).getTime());
    }
    
    return placesWithDistance;
  }, [filteredPlaces, userCoords]);
  
  const toggleFilter = (filter: FilterKey) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setCurrentView('details');
  };

  const handleAdminLogin = (pin: string) => {
    if (pin === '1234') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  
  const handleAdminLogout = () => setIsAdmin(false);

  const HomeView = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-screen text-xl">Loading Roles...</div>;
    }
    if (error) {
      return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;
    }

    return (
      <>
        <Header 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          onShowFavorites={() => setCurrentView('favorites')}
          onShowSettings={() => setCurrentView('settings')}
        />
        <FilterBar activeFilters={activeFilters} onToggleFilter={toggleFilter} />
        <main className="container mx-auto p-4 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-2">
              {userCoords ? t('nearbyPlaces') : t('latestAdditions')}
            </h2>
            {geoLoading && <p className="text-center text-brand-light-gray">{t('gettingLocation')}</p>}
            {geoError && <p className="text-center text-yellow-400">{t('locationError')}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {sortedPlaces.map(place => (
                <PlaceCard 
                  key={place.id} 
                  place={place} 
                  distance={place.distance}
                  isFavorite={isFavorite(place.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelectPlace={handleSelectPlace}
                />
              ))}
            </div>
          </section>
        </main>
      </>
    );
  };
  
  const FavoritesView = () => {
    const favoritePlaces = places.filter(place => favorites.includes(place.id));
    return (
      <div className="fixed inset-0 bg-brand-dark z-20 animate-slide-in-right overflow-y-auto">
        <div className="container mx-auto p-4">
            <header className="flex items-center mb-6">
                <button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-brand-gray transition-colors flex items-center">
                    <ArrowLeftIcon className="w-6 h-6" />
                    <span className="ml-2 font-semibold">{t('back')}</span>
                </button>
            </header>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <StarIcon className="w-8 h-8 mr-3 text-yellow-400" filled/>
                {t('myFavorites')}
            </h1>
            {favoritePlaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoritePlaces.map(place => (
                        <PlaceCard 
                          key={place.id} 
                          place={place} 
                          distance={null}
                          isFavorite={isFavorite(place.id)}
                          onToggleFavorite={toggleFavorite}
                          onSelectPlace={handleSelectPlace}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-brand-light-gray text-center mt-10">{t('noFavorites')}</p>
            )}
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <HomeView />;
      case 'details':
        return selectedPlace && <DetailView place={selectedPlace} onBack={() => setCurrentView('home')} isFavorite={isFavorite(selectedPlace.id)} onToggleFavorite={toggleFavorite} />;
      case 'favorites':
        return <FavoritesView />;
      case 'settings':
        return <SettingsView onBack={() => setCurrentView('home')} isAdmin={isAdmin} onAdminLogin={handleAdminLogin} onAdminLogout={handleAdminLogout} />;
      default:
        return <HomeView />;
    }
  }

  return (
    <I18nContext.Provider value={i18nContextValue}>
      <div className="min-h-screen bg-brand-dark">
        {renderView()}
      </div>
    </I18nContext.Provider>
  );
};

export default App;