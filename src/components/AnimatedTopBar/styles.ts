import { Dimensions, Animated } from 'react-native';
import styled from 'styled-components/native';
import { DataProps, TitleProps } from './types';

const { width, height } = Dimensions.get('window');

export const Container = styled.View`
  flex: 1;
  background-color: #000000;
`;

export const OnboardingPagination = styled(
  Animated.FlatList as new () => Animated.FlatList<DataProps>,
)`
  height: ${height}px;
  width: ${width}px;
  position: absolute;
  top: 0px;
`;

export const ProductImage = styled.Image`
  flex: 1;
`;

export const BottomBar = styled(Animated.View)`
  height: 3px;
  width: 80px;
  background-color: #000;
  position: absolute;
  top: 77px;
  left: 15px;
  border-radius: 2px;
`;

export const OnboardingTopBarPagination = styled(
  Animated.FlatList as new () => Animated.FlatList<TitleProps>
)`
  height: 36px;
  width: ${width}px;
  position: absolute;
  top: 45px;
  margin-left: 15px;
  margin-right: 15px;
`;

export const TitleContent = styled.View`
  align-items: center;
  padding: 0px 10px;
  justify-content: center;
  height: 35px;
`;

export const Title = styled.Text`
  font-size: 18px;
`;
