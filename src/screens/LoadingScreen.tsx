import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavi, RootStackParamList } from "../navigation/useNavi";
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { languageState } from '../state/languageState';

type LoadingScreenRouteProp = RouteProp<RootStackParamList, 'Loading'>;

interface Props {
    route: LoadingScreenRouteProp;
}

export default function LoadingScreen({ route }: Props) {
    const navigation = useNavi();
    const { categoryId } = route.params;
    const language = useRecoilValue(languageState);
    const { t, i18n } = useTranslation();

    
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Detect', { categoryId });
        }, 3000); // 3초 후에 DetectScreen으로 이동

        return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                {/* <View style={styles.textWrapper}>
                    <Text style={styles.maintext}>{t('loading')}</Text>
                </View> */}
                
                <View style={styles.textWrapper}>
                    <Text style={styles.lasttext}>
                        {t('imageProcessing')} {'\n'}
                        {t('measurementError')} {'\n'}
                    </Text>
                </View>
                <View style={styles.textWrapper}>
                    <Text style={styles.subtext}>{t('useLandscape')}</Text>
                </View>
            </View>
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
    textContainer: {
        width: '80%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    textWrapper: {
        alignItems: 'center',
        transform: [{ rotate: '90deg' }],
        width: '50%',
        height: '20%',
    },
    maintext: {
        color: 'white',
        fontSize: 24,
        fontWeight: '500',
    },
    subtext: {
        color: 'white',
        fontSize: 32,
        fontWeight: '500',
        width: '300%',
        top : '70%',
        textAlign: 'center',
    },
    lasttext: {
        textAlign: 'center',
        color: 'white',
        fontSize: 12,
        fontWeight: '200',
        width: '300%',
    },
});
