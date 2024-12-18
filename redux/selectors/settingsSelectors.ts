import { RootState } from "../store";

export const selectSettingsState = (state: RootState) => state.settings;
export const selectIsAppSoundPlaying = (state: RootState) =>
  state.settings.isAppSoundPlaying;
export const selectIsMoveSoundPlaying = (state: RootState) =>
  state.settings.isMoveSoundPlaying;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectShowLegalMoves = (state: RootState) =>
  state.settings.showLegalMoves;
export const selectShowCoordinates = (state: RootState) =>
  state.settings.showCoordinates;
