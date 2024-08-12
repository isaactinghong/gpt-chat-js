export interface SettingsState {
  openAiApiKey: string;
  modelName: string;
  systemMessage: string;
  myProfile: Record<string, any>;
}