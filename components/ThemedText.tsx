import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'numLineaDettagliComponent' | 'dettagliLineaDettagliComponent' | 'fermateLineaDettagliComponent';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'numLineaDettagliComponent' ? styles.numLineaDettagliComponent : undefined,
        type === 'dettagliLineaDettagliComponent' ? styles.dettagliLineaDettagliComponent : undefined,
        type === 'fermateLineaDettagliComponent' ? styles.fermateLineaDettagliComponent : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: 'Nunito', // Nunito-Regular
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'NunitoSemiBold', // Usa Nunito-SemiBold
  },
  title: {
    fontFamily: 'NunitoBold', // Usa Nunito-Bold
    fontSize: 32,
    lineHeight: 38
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'NunitoBold', // Usa Nunito-Bold
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: 'Nunito',
  },
  numLineaDettagliComponent: {
    fontSize: 50,
    color: 'white',
    fontFamily: 'NunitoBold', // Usa Nunito-Bold
  },
  dettagliLineaDettagliComponent: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'NunitoSemiBold', // Usa Nunito-Bold
  },
  fermateLineaDettagliComponent: {
    fontSize: 15,
    fontFamily: 'NunitoSemiBold', // Usa Nunito-Bold
  },
});
