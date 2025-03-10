import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  items: string[];
  onItemChange: (item: string) => void;
  itemWidth: number;
  initValue?: string;
  containerStyle?: ViewStyle;
}

const WheelPicker: React.FC<Props> = (props) => {
  const { items, onItemChange, itemWidth, initValue } = props;
  const scrollX = useRef(new Animated.Value(0)).current;
  const initValueIndex = initValue ? items.indexOf(initValue) : 0;
  const [selectedIndex, setSelectedIndex] = useState(
    initValueIndex >= 0 ? items[initValueIndex] : items[0]
  );

  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    const inputRange = [
      (index - 2) * itemWidth,
      (index - 1) * itemWidth, 
      index * itemWidth,
    ];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 2, 0.5],
    });

    return (
      <Animated.View
        style={[
          {
            width: itemWidth * 1.0,
            height: itemWidth * 1.5,
            transform: [{ scale }],
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text
          style={{
            // color: 'white',
            color: selectedIndex === item ? 'rgba(210, 192, 229, 1)' : 'white' ,
            fontSize: 15,
            fontWeight: '300',
          }}
        >
          {item}
        </Text>
      </Animated.View>
    );
  };

  const modifiedItems = ['', ...items, ''];

  const momentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / itemWidth);
    setSelectedIndex(items[index]);
  };

  useEffect(() => {
    onItemChange(selectedIndex);
  }, [selectedIndex]);

  return (
    <View style={[{ width: itemWidth * 3 }, props.containerStyle]}>
      <Animated.FlatList
        data={modifiedItems}
        renderItem={renderItem}
        horizontal // 가로 스크롤 활성화
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        onMomentumScrollEnd={momentumScrollEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        getItemLayout={(_, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        initialScrollIndex={initValueIndex}
      />
    </View>
  );
};

export default WheelPicker;