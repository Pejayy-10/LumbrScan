import { useColorScheme } from 'react-native';
import { getAppTheme } from '../constants/appTheme';

export const useAppTheme = () => getAppTheme(useColorScheme());
