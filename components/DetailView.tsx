import React, { useMemo } from 'react';
import { Place, FilterKey } from '../types';
import { StarIcon, MapPinIcon, InstagramIcon, ArrowLeftIcon, TagIcon, AlertTriangleIcon } from './icons';
import { useI18n } from '../i18n';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../services/locationService';

interface DetailViewProps {
  place: Place;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ place, onBack, isFavorite, onToggleFavorite }) => {
  const { t } = useI18n();
  const { coords: userCoords, loading: geoLoading } = useGeolocation();

  const distance = useMemo(() => {
    if (userCoords && place.coords) {
      return calculateDistance(userCoords.latitude, userCoords.longitude, place.coords.lat, place.coords.lng);
    }
    return null;
  }, [userCoords, place.coords]);

  const needsReview = (new Date().getTime() - new Date(place.inclusionDate).getTime()) / (1000 * 3600 * 24) > 180;

  const allTags: FilterKey[] = [
    'club',
    'boteco',
    'goodFood',
    'date',
    'dancing',
    'birthday',
    'beer600',
    'gayFriendly',
  ];

  return (
    <div className="fixed inset-0 bg-brand-dark z-20 animate-slide-in-right overflow-y-auto">
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-gray transition-colors flex items-center">
            <ArrowLeftIcon className="w-6 h-6" />
            <span className="ml-2 font-semibold">{t('back')}</span>
          </button>
          <button
            onClick={() => onToggleFavorite(place.id)}
            className="p-2 rounded-full hover:bg-brand-gray transition-colors"
          >
            <StarIcon filled={isFavorite} className={`w-7 h-7 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-brand-light-gray'}`} />
          </button>
        </header>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
          <p className="text-lg text-brand-light-gray flex items-center mb-6">
            <MapPinIcon className="w-5 h-5 mr-2" />
            {place.neighborhood}
          </p>

          {needsReview && (
            <div className="mb-6 bg-yellow-600/20 text-yellow-300 text-sm p-3 rounded-lg flex items-center">
              <AlertTriangleIcon className="w-5 h-5 mr-3" />
              <span>{t('needsReview')}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a href={place.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-brand-gray hover:bg-white/20 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <InstagramIcon className="w-5 h-5" />
              {t('openInstagram')}
            </a>
            <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-brand-gray hover:bg-white/20 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              {t('viewOnMaps')}
            </a>
          </div>

          <div className="bg-brand-gray p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center"><TagIcon className="w-5 h-5 mr-2"/>Tags</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allTags.map(tag => (
                <div key={tag} className={`flex items-center text-sm ${place.tags[tag] ? 'text-brand-white' : 'text-brand-light-gray/50 line-through'}`}>
                  {place.tags[tag] ?
                    <span className="w-5 h-5 mr-2 rounded-full bg-brand-accent flex items-center justify-center text-brand-dark text-xs font-bold">✓</span>
                    :
                    <span className="w-5 h-5 mr-2 rounded-full bg-brand-dark flex items-center justify-center text-brand-light-gray/50 text-xs font-bold">×</span>
                  }
                  {t(`tag_${tag}`)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-brand-gray p-4 rounded-lg mb-6">
             <h2 className="text-xl font-semibold mb-2">{t('distance')}</h2>
             <p className="text-brand-light-gray">
              {geoLoading ? t('calculating') : distance !== null ? `${distance.toFixed(2)} km` : 'Location not available'}
             </p>
             {distance !== null && userCoords && (
                 <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.latitude},${userCoords.longitude}&destination=${place.coords.lat},${place.coords.lng}`} 
                    target="_blank" rel="noopener noreferrer" 
                    className="mt-4 inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                     {t('routeOnMaps')}
                 </a>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;