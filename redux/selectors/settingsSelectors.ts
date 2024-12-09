import { RootState } from "../store";

export const selectSettingsState = (state: RootState) => state.settings;
export const selectIsAppSoundPlaying = (state: RootState) =>
  state.settings.isAppSoundPlaying;
export const selectIsBoardSoundPlaying = (state: RootState) =>
  state.settings.isBoardSoundPlaying;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectShowLegalMoves = (state: RootState) =>
  state.settings.showLegalMoves;
export const selectShowCoordinates = (state: RootState) =>
  state.settings.showCoordinates;
