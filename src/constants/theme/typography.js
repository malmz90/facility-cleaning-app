import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { FONT_FAMILY } from "./fontFamily";
import { FONT_SIZES } from "./fontSizes";
import { LINE_HEIGHT } from "./lineHeight";
import { TYPOGRAPHY_BASE } from "./typographyBase";

export const TYPOGRAPHY = {
  screenTitle: {
    ...TYPOGRAPHY_BASE.h1,
    fontFamily: FONT_FAMILY.secondary.medium,
    color: COLORS.primary,
  },
  screenSubtitle: {
    ...TYPOGRAPHY_BASE.h3,
    fontFamily: FONT_FAMILY.secondary.medium,
    color: COLORS.primary,
  },
  cardTitle: {
    ...TYPOGRAPHY_BASE.h3,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.primary,
  },
  bodyText: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.regular,
    color: COLORS.textPrimary,
  },
  bodyTextBold: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.textPrimary,
  },
  bodyTextLink: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.accent,
  },
  smallText: {
    ...TYPOGRAPHY_BASE.small,
    fontFamily: FONT_FAMILY.primary.regular,
    color: COLORS.textPrimary,
    marginBottom: FONT_SIZES.small,
  },
  smallTextBold: {
    ...TYPOGRAPHY_BASE.small,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.textPrimary,
  },
  largeText: {
    ...TYPOGRAPHY_BASE.large,
    fontFamily: FONT_FAMILY.primary.regular,
    color: COLORS.textPrimary,
    marginBottom: FONT_SIZES.large,
  },
  largeTextBold: {
    ...TYPOGRAPHY_BASE.large,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.semiBold,
    fontSize: FONT_SIZES.large,
    lineHeight: FONT_SIZES.body * LINE_HEIGHT.snug,
    color: COLORS.textPrimary,
    marginTop: SPACING.x2,
    marginBottom: SPACING.x3,
  },
};
