import api from "./api";

//키워드 지역 + 장소 검색
export const getPlaceSearch = async (placeName: string) => {
  try {
    const response = await api.get(`/places?keyword=${placeName}`);
    return response;
  } catch (err) {
    console.error(err);
  }
};

//현재 위치 주변 장소 리스트
export const getNearList = async (lat: string, lng: string) => {
  try {
    const response = await api.get(
      `/places/map?lat=${lat}&lng=${lng}&radius=1000`
    );
    return response;
  } catch (err) {
    console.error(err);
  }
};

//해당 장소 포함된 살구록 리스트 조회
export const getSalguListByPlace = async (placeId: string) => {
  try {
    const response = await api.get(`/places/${placeId}/logs`);
    return response;
  } catch (err) {
    console.error(err);
  }
};

//전체 인기장소
export const getPopularPlace = async () => {
  try {
    const response = await api.get(`/places/popular`);
    return response;
  } catch (err) {
    console.error(err);
  }
};

//지역별 인기 장소 조회
export const getPopularPlaceByRegion = async (regionId: string) => {
  try {
    const response = await api.get(`/places/popular/${regionId}`);
    return response;
  } catch (err) {
    console.error(err);
  }
};

//장소 평점 평균 조회
export const getPlaceRating = async (placeId: string) => {
  try {
    const response = await api.get(`/places/${placeId}/rating`);
    return response;
  } catch (err) {
    console.error(err);
  }
};
