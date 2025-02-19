declare module 'react-native-speedometer-chart' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  interface SpeedometerProps {
    value: number;
    totalValue: number;
    size?: number;
    outerColor?: string;
    internalColor?: string;
    showText?: boolean;
    text?: string;
    textStyle?: TextStyle;
    showLabels?: boolean;
    labelStyle?: TextStyle;
    style?: ViewStyle;
  }

  export default class Speedometer extends Component<SpeedometerProps> {}
}
