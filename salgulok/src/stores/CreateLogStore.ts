import { create } from "zustand";

interface LogState {
  regionId: number | null;
  startDate: string | null;
  endDate: string | null;
  title: string;
  isPublic: boolean;
  imgFile?: File;
  oneReview?: string;

  setStep1: (regionId: number) => void;
  setStep2: (startDate: string, endDate: string) => void;
  setStep3: (data: {
    title: string;
    isPublic: boolean;
    imgFile?: File;
    oneReview?: string;
  }) => void;
  reset: () => void;
}

export const useCreateLogStore = create<LogState>((set) => ({
  regionId: null,
  startDate: null,
  endDate: null,
  title: "",
  isPublic: true,
  imgFile: undefined,
  oneReview: undefined,

  setStep1: (regionId) => set({ regionId }),
  setStep2: (startDate, endDate) => set({ startDate, endDate }),
  setStep3: (data) =>
    set({
      title: data.title,
      isPublic: data.isPublic,
      imgFile: data.imgFile,
      oneReview: data.oneReview,
    }),
  reset: () =>
    set({
      regionId: null,
      startDate: null,
      endDate: null,
      title: "",
      isPublic: true,
      imgFile: undefined,
      oneReview: undefined,
    }),
}));
