// settingsReducer.ts
import { MyProfile } from "../../models/my-profile";
import { SettingsActionTypes, SAVE_SETTINGS } from "../actions/settingsActions";
import { SettingsState } from "../states/settings-state";
import { z } from "zod";

export const defaultMyProfile: MyProfile = {
  "Personal Information": {
    Name: null,
    Sex: null,
    Birthday: null,
    "Living Place": null,
  },
};

export const myProfileSample: MyProfile = {
  "Personal Information": {
    Name: "Alex Wong",
    Sex: "Male",
    Birthday: "April 5, 1988",
    "Living Place": "Hong Kong, Sha Tin",
    "Marital Status": {
      Status: "Married",
      Spouse: "Lily",
      "Wedding Date": "June 12, 2023",
      "Wife's Occupation": "Financial Analyst",
    },
    "Family Members": {
      Dad: "John",
      Mom: "Sarah",
      "Younger Brother": {
        Name: "Kevin",
        "Sister-in-law": "Michelle",
        Nephews: [
          {
            Name: "Ethan",
            Attribute: "curious",
          },
          {
            Name: "Leo",
          },
        ],
      },
    },
  },
  Education: {
    "Secondary School": "St. Joseph's College (Form 1 to Form 7)",
    University: {
      Name: "City University of Hong Kong (CityU)",
      Degree: "BBA in Marketing",
    },
    Internship: {
      Company: "Oracle",
      Project: "Cloud Solutions project",
      Duration: "six months",
    },
  },
  "Professional Information": {
    Occupation: {
      Title: "Marketing Professional",
      Roles: ["Brand Manager", "Content Strategist"],
      "Full-Time Job": {
        Company: "Innovate HK",
        Description:
          "Developing and implementing marketing strategies for digital products",
      },
    },
    "Own Companies": [
      {
        Name: "TechConnect",
        Projects: [
          {
            Name: "LaunchPad",
            Description: "Creating mobile apps for startups",
          },
          {
            Name: "MarketPro",
            Description: "Consulting for digital marketing strategies",
          },
        ],
      },
      {
        Name: "PetBuddy",
        Description: "Providing pet care services and dog walking solutions",
      },
    ],
    "Financial Overview": {
      "Monthly Income": {
        "Innovate HK": 40000,
        "LaunchPad Project": 20000,
        "MarketPro Project": 15000,
        PetBuddy: 3000,
        "Wife's Contribution": 10000,
      },
      "Total Monthly Income": 88000,
      "Monthly Expenses": {
        "Annual Tax": 54000,
        Insurance: 4000,
        "Housing Utilities + Government Rates": 2500,
        "Daily Expenses": 15000,
        "Support for Dad": 6000,
        "New Territories Property Mortgage Contribution": 4000,
        "Kowloon Apartment Rent (Net)": 8000,
        "Rent for Sha Tin Apartment": 22000,
      },
      "Total Monthly Expenses": 74500,
      "Monthly Savings Potential": 13500,
    },
    Properties: [
      {
        Name: "New Territories Property",
        "Mortgage Contribution": 4000,
      },
      {
        Name: "Kowloon Apartment (Silver Ridge)",
        "Mortgage Payment": 20000,
        "Rental Income": 11000,
      },
      {
        Name: "Sha Tin Apartment (Garden View)",
        "Rent Payment": 22000,
        "Living With": "Wife",
      },
    ],
  },
  "Hobbies and Interests": {
    Music: {
      Instruments: ["Guitar"],
      Activities: ["Songwriting"],
      Genres: ["indie", "pop"],
    },
    Gaming: "FIFA",
    Sports: ["Football", "Cycling", "Rock Climbing", "Yoga"],
  },
  Pets: [
    {
      Type: "Golden Retriever",
      Birthday: "March 15, 2024",
      Notes: "Enjoys playing fetch and digging in the garden",
    },
    {
      Type: "Siamese Cat",
      Birthday: "December 2, 2023",
      Notes: "Loves to lounge in the sun and chase after strings",
    },
  ],
  "Personal Attributes": {
    Height: "180 cm",
    Weight: "160 pounds",
  },
};

// initialState
const initialState: SettingsState = {
  openAiApiKey: "",
  newsApiKey: "",
  modelName: "gpt-4o-mini",
  systemMessage: `Talk to me like a human being.
Try to reply one or two sentence long each time, unless really necessary.
--------
Any mermaid diagram can be rendered in the app when needed.`,
  myProfile: "",
  myProfileJson: defaultMyProfile,
  showMarkdown: true,
};

// reducer
const settingsReducer = (
  state = initialState,
  action: SettingsActionTypes,
): SettingsState => {
  switch (action.type) {
    case SAVE_SETTINGS: {
      const { settings } = action.payload;
      return {
        ...state,
        ...settings,
      };
    }
    default:
      return state;
  }
};

export default settingsReducer;
