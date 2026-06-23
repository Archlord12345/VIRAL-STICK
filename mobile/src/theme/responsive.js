import { Dimensions, PixelRatio } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export const SCREEN = { width: W, height: H };
export const isSmallScreen = W < 360;

/** width percentage */
export const wp = (pct) => (W * pct) / 100;

/** height percentage */
export const hp = (pct) => (H * pct) / 100;

/** responsive font size — scales with screen width, capped at 1.2× */
export const rs = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * Math.min(W / 390, 1.2)));
