export type APIPlace = {
  place_id: number;
  placeName: string;
  mapx: number;
  mapy: number;
  content_type_id: number;
  image_url?: string;
  addr1?: string;
  addr2?: string;
  tel?: string;
  overview?: string;
  star?: number;
};

export type PlaceSearchItem = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  imageUrl?: string;
  tel?: string;
  overview?: string;
  star?: number;
};
