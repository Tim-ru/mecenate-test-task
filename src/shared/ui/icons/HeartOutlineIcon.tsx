import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

type HeartOutlineIconProps = {
  size?: number;
  color?: string;
};

export function HeartOutlineIcon({ size = 15, color = '#57626F' }: HeartOutlineIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
      <G clipPath="url(#heart-o-clip)">
        <Path
          d="M6.615 13.716l-.073-.067L1.41 8.882A4.17 4.17 0 010 5.648v-.097c0-2.063 1.465-3.832 3.492-4.219a4.69 4.69 0 013.276.706c.263.188.51.404.732.653a5.3 5.3 0 01.395-.39c.109-.093.22-.181.337-.263a4.69 4.69 0 013.276-.71c2.027.387 3.492 2.16 3.492 4.223v.096a4.17 4.17 0 01-1.41 3.234l-5.132 4.767-.074.067a1.22 1.22 0 01-1.769 0zM7.005 4.247l-.03-.032-.52-.586-.004-.003a3.28 3.28 0 00-2.695-.914 2.93 2.93 0 00-2.35 2.839v.097c0 .835.349 1.635.961 2.203L7.5 12.618l5.133-4.767a3.07 3.07 0 00.961-2.203v-.097a2.93 2.93 0 00-2.347-2.839 3.28 3.28 0 00-2.695.914l-.004.003-.003.003-.524.586-.03.032a.7.7 0 01-.991 0v-.003z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="heart-o-clip">
          <Rect width={15} height={15} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
