import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { backgroundTheme } from "@/constants/Colors";

const initialState = {
  isAppSoundPlaying: false,
  isBoardSoundPlaying: false,
  theme: backgroundTheme[0].colors,
  showLegalMoves: true,
  showCoordinates: true,
};

const saveToStorage = async (key: string, value: any) => {
  try {
    const updatedSetting = { [key]: value };
    await AsyncStorage.mergeItem("settings", JSON.stringify(updatedSetting));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSetting: (
      state,
      action: { payload: { key: keyof typeof initialState; value: any } }
    ) => {
      const { key, value } = action.payload;
      (state as any)[key] = value;
      saveToStorage(key, value);
    },
  },
});

export const { setSetting } = settingsSlice.actions;

export default settingsSlice.reducer;
