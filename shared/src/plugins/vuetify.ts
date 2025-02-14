// src/plugins/vuetify.ts

// Import MDI CSS: this is a huge import and there may be better ways to do this
import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

const lightTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    backgroundCard: "#dddddd",
    backgroundCardDangerous: "#eedddd",
    surface: "#FFFFFF",
    primary: "#1976D2",
    secondary: "#424242",
    accent: "#82B1FF",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",

    iconDefaultColor: "#263238",
    favoriteIconColor: "#FFFF55", // Gold für gelbe Sterne
    favoriteIconInactiveColor: "#808080", // Grau
    tagChipColor: "#2E7D32",
    platformChipColor: "#37478F",

    badgeBackgroundColor: "#EDEDED",
    sourceBadgeColor: "#2196F3", // Blue
    maskedBadgeColor: "#4CAF50", // Green
    unmaskedBadgeColor: "#FF9800", // Orange
    markedBadgeColor: "#9C27B0", // Purple
    processedBadgeColor: "#2196F3", // Blue

    speechBubbleBackground: "#EDEDED",
    speechBubbleFontColor: "#252525",
    hoverCardColor: "#F2F2F2",
    snackbarButtonColor: "#FFFFFF",

    borderColor: "#e0e0e0",
    formContainerBackground: "#FFFFFF",

    /* MARK sensitive information function */
    highlightBackground: "#FFFF00", // Yellow

    /* Form field colors used throughout the app */
    formFieldBackground: "#F6F6F6",
    formFieldFont: "#1D1D1D",
    formFieldDescriptionFont: "#858585",
    formFieldBackgroundHover: "#EDEDED",
    formFieldBackgroundFocus: "#DBDBDB",
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: "#121212",
    backgroundCard: "#333333",
    backgroundCardDangerous: "#ee3333",
    surface: "#121212",
    primary: "#2196F3",
    secondary: "#424242",
    accent: "#FF4081",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",

    iconDefaultColor: "#E4E4E4",
    favoriteIconColor: "#FFD700",
    favoriteIconInactiveColor: "#808080",
    tagChipColor: "#4E9D52", //
    platformChipColor: "#6787CF",

    badgeBackgroundColor: "#424242",
    sourceBadgeColor: "#BBDEFB", // Light Blue
    maskedBadgeColor: "#A5D6A7", // Light Green
    unmaskedBadgeColor: "#FFCC80", // Light Orange
    markedBadgeColor: "#CE93D8", // Light Purple
    processedBadgeColor: "#2196F3", // Blue

    speechBubbleBackground: "#424242",
    speechBubbleFontColor: "#EDEDED",
    hoverCardColor: "#363636",
    snackbarButtonColor: "#FFFFFF",

    borderColor: "#424242",
    formContainerBackground: "#121212",
    highlightBackground: "#FFFF00", // You may choose a different color for dark mode

    /* Form field colors used throughout the app */
    formFieldBackground: "#1B1B1B",
    formFieldFont: "#FF0000",
    formFieldDescriptionFont: "#ACACAC",
    formFieldBackgroundHover: "#252525",
    formFieldBackgroundFocus: "#383838",
  },
};

const vuetify = createVuetify({
  components, // Register components
  directives, // Register directives
  theme: {
    defaultTheme: "light",
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
});

export default vuetify;
