import { useTranslation } from 'react-i18next';

export const useCocoCategories = () => {
    const { t } = useTranslation();
    
    return [
    {id: 0, name: t('category.person'), size: 1.7},
    {id: 1, name: t('category.bicycle'), size: 1.8},
    {id: 2, name: t('category.car'), size: 4.5},
    {id: 3, name: t('category.motorcycle'), size: 2.1},
    {id: 4, name: t('category.airplane'), size: 37},
    {id: 5, name: t('category.bus'), size: 12},
    {id: 6, name: t('category.train'), size: 25},
    {id: 7, name: t('category.truck'), size: 7},
    {id: 8, name: t('category.boat'), size: 5}, 
    {id: 14, name: t('category.bird'), size: 0.3},
    {id: 15, name: t('category.cat'), size: 0.5},
    {id: 16, name: t('category.dog'), size: 0.5},
    {id: 17, name: t('category.horse'), size: 2.4},
    {id: 18, name: t('category.sheep'), size: 1.5},
    {id: 19, name: t('category.cow'), size: 2.5},
    {id: 20, name: t('category.elephant'), size: 6},
    {id: 21, name: t('category.bear'), size: 2},
    {id: 22, name: t('category.zebra'), size: 2.5},
    {id: 23, name: t('category.giraffe'), size: 5.5},
    {id: 30, name: t('category.skis'), size: 1.7},
    {id: 31, name: t('category.snowboard'), size: 1.5},
    {id: 32, name: t('category.sports ball'), size: 0.22},
    {id: 36, name: t('category.skateboard'), size: 0.8},
    {id: 37, name: t('category.surfboard'), size: 2},
    
    ];
};