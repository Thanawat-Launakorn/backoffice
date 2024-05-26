
export type TypographyType = "tiny" | "small" | "base" | "large" | "huge";

interface TypographyOptions {
  fontSize: number;
  color?: string;
  fontWeight: string;
}
export const TypographyTheme: { [T in TypographyType]: TypographyOptions } = {
  tiny: {
    fontSize: 13,
    fontWeight: "100",
  },
  small: {
    fontSize: 14,
    fontWeight: "300",
  },
  base: {
    fontSize: 20,
    fontWeight: "400",
  },
  large: {
    fontSize: 36,
    fontWeight: "500",
  },
  huge: {
    fontSize: 52,
    fontWeight: "800",
  },
};
