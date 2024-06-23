"use client";
import typographyComponent from "../typography";
import { TypographyType } from "../typography/style";

type ButtonType = "button" | "submit" | "reset";

type ButtonProps = {
  title: string;
  type?: ButtonType;
  disabled?: boolean;
  onPress?: () => void;
  size?: TypographyType;
};

export default function AppButton({
  title,
  onPress,
  size = "base",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const { Typography } = typographyComponent;
  return (
    <button
      type={type}
      onClick={onPress}
      disabled={disabled}
      className={`bg-green-500 w-full px-2 py-2 transition-all delay-75 hover:brightness-110 rounded-md text-white`}
    >
      <Typography title={title} color="white" size={size} />
    </button>
  );
}
