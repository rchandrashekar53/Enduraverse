declare module 'react-native-svg-charts' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';
  import { PathProps } from 'react-native-svg';

  interface ProgressCircleProps {
    style?: ViewStyle;
    progress?: number;
    progressColor?: string;
    backgroundColor?: string;
    startAngle?: number;
    endAngle?: number;
    strokeWidth?: number;
    cornerRadius?: number;
    animate?: boolean;
    animationDuration?: number;
    children?: React.ReactNode;
  }

  export class ProgressCircle extends Component<ProgressCircleProps> {}
}
