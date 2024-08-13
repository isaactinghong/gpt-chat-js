/*
{
  "Personal Information": {
    Name: null,
    Sex: null,
    Birthday: null,
    "Living Place": null,
    "Marital Status": {
      Status: null,
    },
  },
};
*/

import { MyProfile } from "../../models/my-profile";

export interface SettingsState {
  openAiApiKey: string;
  newsApiKey: string;
  modelName: string;
  systemMessage: string;
  myProfile: string; // deprecated
  myProfileJson: MyProfile;
  showMarkdown: boolean;
}
