export const TypeScale = {
  MinorSecond: 1.067,
  MajorSecond: 1.125,
  MinorThird: 1.2,
  MajorThird: 1.25,
  PerfectFourth: 1.333,
  AugmentedFourth: 1.414,
  PerfectFifth: 1.5,
  GoldenRatio: 1.618,
};

export const setFontSize = (levelOrPx, isPxOrOptions) => {
  const options =
    typeof isPxOrOptions === "boolean"
      ? { isPx: isPxOrOptions }
      : isPxOrOptions;

  const base = options?.baseSize ?? 16;
  const typeScale = options?.scale ?? TypeScale.MinorThird;
  const shouldRound = options?.round ?? true;

  let result;

  if (options?.isPx) {
    const level = Math.log(levelOrPx / base) / Math.log(typeScale);
    result = base * Math.pow(typeScale, Math.round(level));
  } else if (levelOrPx < 0) {
    const scales = [1, 0.875, 0.75, 0.625];
    const index = Math.abs(levelOrPx);
    const multiplier = scales[Math.min(index, scales.length - 1)] ?? 0.625;
    result = base * multiplier;
  } else {
    result = base * Math.pow(typeScale, levelOrPx);
  }

  return shouldRound ? Math.round(result) : result;
};

export const FONT_SIZES = {
  fs_050: setFontSize(-3),
  fs_100: setFontSize(-2),
  fs_200: setFontSize(-1),
  fs_300: setFontSize(0),
  fs_400: setFontSize(1),
  fs_500: setFontSize(2),
  fs_600: setFontSize(3),
  fs_700: setFontSize(4),
  fs_800: setFontSize(5),
  fs_900: setFontSize(6),

  hero1: setFontSize(6),
  hero2: setFontSize(5),
  h1: setFontSize(4),
  h2: setFontSize(3),
  h3: setFontSize(2),

  large: setFontSize(1),
  body: setFontSize(0),
  small: setFontSize(-1),
  xSmall: setFontSize(-2),
  tiny: setFontSize(-3),
};
