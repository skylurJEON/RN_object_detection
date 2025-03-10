import AppNavigator from "./src/navigation/AppNavvigator";
import { RecoilRoot } from 'recoil';
import './i18n.config';

export default function App() {
  return (
    <RecoilRoot>
      <AppNavigator />
    </RecoilRoot>
  );
}
