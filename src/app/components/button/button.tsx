import typographyComponent from "../typography";

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export default function AppButton({ title, onPress }: ButtonProps) {
  const { Typography } = typographyComponent;
  return (
    <button
      onClick={onPress}
      className={`bg-green-500 w-full px-2 py-2 transition-all delay-75 hover:brightness-110 rounded-md`}
    >
      <Typography title={title} color="white" />
    </button>
  );
}
