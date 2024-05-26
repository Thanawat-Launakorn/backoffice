import { TypographyType, TypographyTheme as typography } from "./style";

type textAlign = "start" | "center" | "end";
type textCase = "upper" | "lower" | "capitalize";
type TextOptions = {
  textCase?: textCase;
  textAlign?: textAlign;
};

type TypographyProps = {
  title: string;
  color?: string;
  className?: string;
  onPress?: () => void;
  size?: TypographyType;
  textOptions?: TextOptions;
};
export default function Typography({
  title,
  onPress,
  className,
  textOptions,
  size = "base",
  color = "green",
}: TypographyProps) {
  let useTextOptions;
  if (textOptions) {
    const TextOptions = () => {
      const { textCase, textAlign } = textOptions;
      let result = "";
      if (textCase) {
        switch (textCase) {
          case "upper":
            result += "uppercase";
            break;

          case "lower":
            result += "lowercase";
            break;

          default:
            result += "capitalize";
        }
      }
      if (textAlign) {
        result += " ";

        switch (textAlign) {
          case "start":
            result += "text-start";
            break;

          case "center":
            result += "text-center";
            break;

          default:
            result += "text-end";
        }
      }

      return result;
    };

    useTextOptions = TextOptions();
  }

  return (
    <div style={typography[size]} className={`${className} ${useTextOptions} text-${color}-500`}>
      {title}
    </div>
  );
}
