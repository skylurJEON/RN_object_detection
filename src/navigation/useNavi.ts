import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";


export type RootStackParamList = {
  Home: undefined;
  ObjectSelect: undefined;
  Detect: { categoryId: number;};
  Loading: { categoryId: number;};
};

// useNavi 훅 정의
export const useNavi = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return navigation;
};
