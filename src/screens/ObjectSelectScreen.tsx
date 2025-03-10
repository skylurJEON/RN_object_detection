import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavi } from "../navigation/useNavi";
import WheelPicker from "../components/WheelPicker";
import { useCocoCategories } from "../data/cocoCategories";
import { useRecoilValue } from 'recoil';
import { languageState } from '../state/languageState';
import { useTranslation } from 'react-i18next';


export default function ObjectSelectScreen() {
    const navigation = useNavi();
    const cocoCategories = useCocoCategories();
    const [selectedObject, setSelectedObject] = useState(cocoCategories[0]); // 추적 대상 저장

    const language = useRecoilValue(languageState);
    const { t, i18n } = useTranslation();

    console.log(selectedObject);

    // 언어 변경 시 i18n의 언어도 변경
    useEffect(() => {
      i18n.changeLanguage(language);
  }, [language]);
    

    const handleNavigate = () => {
        navigation.navigate('Loading', {
            categoryId: selectedObject.id,
        });
    };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>{t('selectObject')}</Text>
        <View style={styles.pickerContainer}>
            <WheelPicker
            items={cocoCategories.map(category => category.name)}
            onItemChange={(name) => {
            const selected = cocoCategories.find(category => category.name === name);
            if (selected) setSelectedObject(selected);
            }}
            itemWidth={100}
            initValue={selectedObject.name}
        />
        </View>
        <Text style={styles.swipeText}>{t('swipeToSelect')}</Text>
        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
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
    title: {
        fontSize: 20,
        fontWeight: '200',
        color: 'white',
    },
    pickerContainer: {
        top: '10%',
    },
    swipeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '100',
        top: '6%',

    },


    button: {
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 15,
        width: '30%',
        top: '21%',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 0.04,
        elevation: 5,
    },
    buttonText: {
      
        color: 'white',
        fontSize: 20,
        fontWeight: '100',
    },

    
});