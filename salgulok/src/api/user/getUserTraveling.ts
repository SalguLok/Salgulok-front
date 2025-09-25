import api from "../api";

export const getUserTraveling = async () => {
  try {
    const response = await api.get(`/users/isTraveling`);
    return response.data;
  } catch (err: any) {
    throw err;
  }
};
