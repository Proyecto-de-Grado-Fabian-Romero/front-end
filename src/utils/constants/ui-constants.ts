// This enum represents constant neutral
enum NeutralColors {
  BLACK = "#000000",
  WHITE = "#FFFFFF",
}

// This enum represents the color palette constants for the ui
export enum ColorPalette {
  // Primary
  PRIMARY_DEFAULT = "#F24F13",
  PRIMARY_HOVER = "#C43E0F",
  PRIMARY_ACTION = "#F66A33",

  // Secondary
  SECONDARY_DEFAULT = NeutralColors.BLACK,
  SECONDARY_HOVER = "#1C1B1B",
  SECONDARY_ACTION = "#333333",

  // Tertiary
  TERTIARY_DEFAULT = "#7781A4",
  TERTIARY_HOVER = "#626B8C",
  TERTIARY_ACTION = "#8B94B3",

  // Error
  ERROR_DEFAULT = "#DC2626",
  ERROR_HOVER = "#B91C1C",
  ERROR_ACTION = "#EF4444",

  // Warning
  WARNING_DEFAULT = "#F1D950",
  WARNING_HOVER = "#D6B92A",
  WARNING_ACTION = "#FBE456",

  // Success
  SUCCESS_DEFAULT = "#16A34A",
  SUCCESS_HOVER = "#15803D",
  SUCCESS_ACTION = "#22C55E",

  // Background & Neutral
  BACKGROUND = NeutralColors.WHITE,
  NEUTRAL_BLACK = NeutralColors.BLACK,
  NEUTRAL_WHITE = NeutralColors.WHITE,

  // Grey
  GREY_DEFAULT = "#6F6F6F",
  LIGHT_GREY_DEFAULT = "#E0E0E0",
}

export const FONT_FAMILY = "Montserrat, sans-serif";
