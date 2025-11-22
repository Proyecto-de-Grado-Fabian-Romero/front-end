import { OptionItem } from "@/types/OptionItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OptionsState {
  areas: OptionItem[];
  services: OptionItem[];
}

const initialState: OptionsState = {
  areas: [],
  services: [],
};

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setAreas: (state, action: PayloadAction<OptionItem[]>) => {
      state.areas = action.payload;
    },
    setServices: (state, action: PayloadAction<OptionItem[]>) => {
      state.services = action.payload;
    },
  },
});

export const { setAreas, setServices } = optionsSlice.actions;
export default optionsSlice.reducer;
