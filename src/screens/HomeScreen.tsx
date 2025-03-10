import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavi } from "../navigation/useNavi";
import { useRecoilState } from 'recoil';
import { languageState } from '../state/languageState';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const navigation = useNavi();
  const [language, setLanguage] = useRecoilState(languageState);
  const { t, i18n } = useTranslation();
  

  const toggleLanguage = () => {
    const newLanguage = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{language === 'ko' ? 'English' : '한국어'}</Text>
        </TouchableOpacity>
        <Image source={require('../assets/3dbg_2.png')} style={styles.backgroundImage} />
        <View style={styles.textContainer}>
            <Text style={styles.title}>{t('title')}</Text>
            <Text style={styles.subtitle}>{t('subtitle')}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ObjectSelect')}>
          <Text style={styles.buttonText}>{t('start')}</Text>
        </TouchableOpacity>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  languageButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 15,
    top: '-20%',
    left: '35%',
    shadowColor: 'rgba(210, 192, 229, 0.8)',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 1.55,
    shadowRadius: 0.34,
    elevation: 5,
  },
  languageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '200',
  },

  backgroundImage: {
    position: 'absolute',
    top: '20%',
    left: '8%',
    width: '80%',
    height: '40%',
  },


  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '55%',
  },
  title: {
    //color: 'white',
    color:'rgba(210, 192, 229, 0.8)',
    fontSize: 24,
    fontWeight: '200',
    //marginTop: '50%',
  },
  subtitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '100',
    //marginTop: '50%',
  },


  button: {
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 15,
    width: '30%',
    top: '15%',
    shadowColor: 'rgba(210, 192, 229, 0.8)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 0.14,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '100',
  },
  
});
