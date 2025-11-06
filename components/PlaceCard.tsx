import React from 'react';
import { Place, FilterKey } from '../types';
import { StarIcon, MapPinIcon, CheckIcon, AlertTriangleIcon } from './icons';
import { useI18n } from '../i18n';

interface PlaceCardProps {
  place: Place;
  distance: number | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectPlace: (place: Place) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, distance, isFavorite, onToggleFavorite, onSelectPlace }) => {
  const { t } = useI18n();
  const needsReview = (new Date().getTime() - new Date(place.inclusionDate).getTime()) / (1000 * 3600 * 24) > 180;
  
  const tagsToShow: FilterKey[] = ['club', 'boteco', 'goodFood', 'dancing', 'beer600'];
  const activeTags = tagsToShow.filter(tag => place.tags[tag]);

  return (
    <div 
      className="bg-brand-gray rounded-lg overflow-hidden shadow-lg hover:shadow-brand-accent/30 transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
      onClick={() => onSelectPlace(place)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-brand-white">{place.name}</h3>
            <p className="text-sm text-brand-light-gray flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1 inline-block"/>
              {place.neighborhood}
              {distance !== null && (
                <span className="ml-2 font-semibold text-brand-white">{`${distance.toFixed(1)} km`}</span>
              )}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(place.id);
            }}
            className="p-1 -mr-1 -mt-1 text-brand-light-gray hover:text-yellow-400 transition-colors"
          >
            <StarIcon filled={isFavorite} className={`w-6 h-6 ${isFavorite ? 'text-yellow-400' : ''}`} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {activeTags.map(tag => (
            <span key={tag} className="flex items-center text-xs bg-brand-dark text-brand-light-gray px-2 py-1 rounded-full">
              <CheckIcon className="w-3 h-3 mr-1 text-brand-accent"/>
              {t(`tag_${tag}`)}
            </span>
          ))}
        </div>
      </div>
      {needsReview && (
        <div className="bg-yellow-600/20 text-yellow-300 text-xs px-4 py-1 flex items-center">
          <AlertTriangleIcon className="w-4 h-4 mr-2" />
          {t('needsReview')}
        </div>
      )}
    </div>
  );
};

export default PlaceCard;