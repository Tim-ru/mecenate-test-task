import Svg, { Path } from 'react-native-svg';

type HeartFilledIconProps = {
  size?: number;
  color?: string;
};

export function HeartFilledIcon({ size = 15, color = '#FFEAF1' }: HeartFilledIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
      <Path
        d="M7.5 13.716l-1.086-.996C2.548 9.273 0 6.958 0 4.124 0 1.81 1.813 0 4.12 0c1.303 0 2.553.607 3.38 1.558C8.327.607 9.577 0 10.88 0 13.187 0 15 1.81 15 4.124c0 2.834-2.548 5.149-5.914 8.596L7.5 13.716z"
        fill={color}
      />
    </Svg>
  );
}
