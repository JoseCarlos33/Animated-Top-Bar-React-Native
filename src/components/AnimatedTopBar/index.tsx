import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StatusBar, Animated, View, Easing, TouchableOpacity } from 'react-native';;
import { DataPagination } from './data';
import {
  Container,
  OnboardingPagination,
  ProductImage,
  BottomBar,
  OnboardingTopBarPagination,
  TitleContent,
  Title,
} from './styles';

import { DataProps, TitleProps } from './types';

const { width, height } = Dimensions.get('window');

function AnimatedTopBar() {
  const [page, setPage] = useState(1);
  const [positionPagination, setPositionPagination] = useState(0);
  const [refBottomBar, setRefBottomBar] = useState([{
    px: 0,
    py: 0,
    width: 0,
    height: 0,
  },
  {
    px: 0,
    py: 0,
    width: 0,
    height: 0,
  },
  {
    px: 0,
    py: 0,
    width: 0,
    height: 0,
  },
  ]);

  const [firstRender, setFirstRender] = useState(true)
  const ref = useRef(null);
  const scrollTranslateX = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const refTitle1 = useRef(null);
  const refTitle2 = useRef(null);
  const refTitle3 = useRef(null);

  const Titles = [
    {
      key: '1',
      title: 'Headset',
      ref: refTitle1
    },
    {
      key: '2',
      title: 'New Smartphone',
      ref: refTitle2
    },
    {
      key: '3',
      title: 'iPhone',
      ref: refTitle3
    }
  ]

  const changePage = useCallback(
    pageIndex => {
      ref?.current?.scrollToOffset({
        offset: pageIndex * width,
      });
    },
    [ref]
  );

  function getTitlePosition() {
    const infoTitle = []

    Titles.map(item => {
      return new Promise<any>(async (resolve) => {
        await item?.ref?.current.measure((_fx, _fy, width, height, px, py) => {
          infoTitle.push({
            px,
            py,
            width,
            height
          })
          if (infoTitle.length == Titles.length) {
            setRefBottomBar(infoTitle)
          }
        });
      })
    })
  }

  function AnimatedBottomBar() {
    const animatedScroll = useRef(new Animated.Value(0)).current;
    const inputRange = Titles.map((_, i) => i == 2 ? i * width + 15 : i * width + 30)
    const currentPx = refBottomBar.map((item, i) => i == 0 ? item.px - 7 : item.px - 5)
    const currentWidth = refBottomBar.map((item, i) => i == 1 ? item.width - 14 : item.width - 15)

    const translateCurrentX = scrollX.interpolate({
      inputRange,
      outputRange: currentPx,
      easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
    })

    const translateCurrentWidth = scrollX.interpolate({
      inputRange,
      outputRange: currentWidth,
      easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
      extrapolate: 'clamp'
    })

    return (
      <BottomBar
        style={{
          transform: [
            {
              translateX: translateCurrentX
            },
          ],
          width: translateCurrentWidth,
          backgroundColor: '#454545'
        }}
      />
    )

  }

  function getCurrentPage(scrollXOfPage: string) {

    const pageWidth = Number(scrollXOfPage) / width;
    setPositionPagination(pageWidth)
    const currentPage = pageWidth + 1.000001;
    const pageFormatted = Math.floor(currentPage);
    setPage(pageFormatted);
  }

  return (
    <Container>
      <StatusBar
        barStyle={page == 1 ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <OnboardingPagination
        ref={ref}
        data={DataPagination}
        keyExtractor={(item: DataProps) => item.key}
        renderItem={({ item }: { item: DataProps }) => (
          <ProductImage
            source={item.image}
            style={{
              width: width,
              height: height,
              resizeMode: 'cover'
            }}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={e => {
          let contentOffset = e.nativeEvent.contentOffset;
          getCurrentPage(contentOffset.x);
          Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          });
          scrollX.setValue(contentOffset.x)
        }}
      />

      <OnboardingTopBarPagination
        data={Titles}
        keyExtractor={(item: TitleProps) => item.key}
        renderItem={({ item }: { item: TitleProps }) => (
          <>
            <TouchableOpacity
              onPress={() => {
                const indexFormatted = Number(item.key) - 1
                changePage(indexFormatted)
              }}
            >
              <TitleContent
                ref={item.ref}
                onLayout={(e) => {
                  if (firstRender) {
                    getTitlePosition()
                  }
                  setFirstRender(false)
                }}
              >

                <Title
                  style={{
                    color: page == Number(item.key) ? '#454545' : '#727272',
                    fontWeight: page == Number(item.key) ? '700' : '100'
                  }}

                >
                  {item.title}
                </Title>

              </TitleContent>
            </TouchableOpacity>
          </>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      {
        AnimatedBottomBar()
      }
    </Container>
  );
}

export default AnimatedTopBar;