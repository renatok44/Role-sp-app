export interface Place {
  id: string;
  name: string;
  instagramUrl: string;
  neighborhood: string;
  mapsUrl: string;
  coords: {
    lat: number;
    lng: number;
  };
  tags: {
    club: boolean;
    boteco: boolean;
    goodFood: boolean;
    date: boolean;
    dancing: boolean;
    birthday: boolean;
    beer600: boolean;
    gayFriendly: boolean;
  };
  inclusionDate: string; // ISO date string
}

export type FilterKey = keyof Place['tags'];

export type Language = 'pt' | 'en';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}