import React from 'react';
import { FilterKey } from '../types';
import { useI18n } from '../i18n';

interface FilterBarProps {
  activeFilters: FilterKey[];
  onToggleFilter: (filter: FilterKey) => void;
}

const filterOptions: FilterKey[] = [
  'club',
  'boteco',
  'goodFood',
  'date',
  'dancing',
  'birthday',
  'beer600',
  'gayFriendly',
];

const FilterBar: React.FC<FilterBarProps> = ({ activeFilters, onToggleFilter }) => {
  const { t } = useI18n();

  return (
    <div className="p-4 bg-brand-dark sticky top-[80px] z-10 backdrop-blur-sm bg-brand-dark/80">
      <div className="container mx-auto">
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
          {filterOptions.map(filter => (
            <button
              key={filter}
              onClick={() => onToggleFilter(filter)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                activeFilters.includes(filter)
                  ? 'bg-brand-accent text-brand-dark'
                  : 'bg-brand-gray text-brand-light-gray hover:bg-white/20'
              }`}
            >
              {t(`tag_${filter}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;