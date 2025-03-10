import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
        "title": "SPeed",
        "subtitle": " check it out",
        "start": "Start",
        "selectObject": "Select an object to measure",
        "swipeToSelect": "Swipe to select",
        "loading": "Loading",
        "useLandscape": "Use the device horizontally",
        "imageProcessing": "Please use it horizontally for image processing",
        "measurementError": "Measurement results may vary depending on the size of the object",
        "category": {
            "person": "person",
            "bicycle": "bicycle",
            "car": "car",
            "motorcycle": "motorcycle",
            "airplane": "airplane",
            "bus": "bus",
            "train": "train",
            "truck": "truck",
            "boat": "boat", 
            "bird": "bird",
            "cat": "cat",
            "dog": "dog",
            "horse": "horse",
            "sheep": "sheep",
            "cow": "cow",
            "elephant": "elephant",
            "bear": "bear",
            "zebra": "zebra",
            "giraffe": "giraffe",
            "skis": "skis",
            "snowboard": "snowboard",
            "sports ball": "sports ball",
            "skateboard": "skateboard",
            "surfboard": "surfboard",
        },
      
    }
  },
  ko: {
    translation: {
        "title": "속도",
        "subtitle": "를 확인하세요",
        "start": "시작",
        "selectObject": "측정할 대상 선택",
        "swipeToSelect": "오른쪽으로 스와이프하여 선택",
        "loading": "로딩 중",
        "useLandscape": "디바이스를 가로로 사용하세요",
        "imageProcessing": "이미지 처리를 위해 가로로 사용해주세요",
        "measurementError": "측정 결과는 측정 대상의 크기에 따라 오차가 존재합니다",
        "category": {
            "person": "사람",
            "bicycle": "자전거",
            "car": "자동차",
            "motorcycle": "오토바이",
            "airplane": "비행기",
            "bus": "버스",
            "train": "기차",
            "truck": "트럭",
            "boat": "보트", 
            "bird": "새",
            "cat": "고양이",
            "dog": "개",
            "horse": "말",
            "sheep": "양",
            "cow": "소",
            "elephant": "코끼리",
            "bear": "곰",
            "zebra": "얼룩말",
            "giraffe": "기린",
            "skis": "스키",
            "snowboard": "스노보드",
            "sports ball": "공",
            "skateboard": "스케이트보드",
            "surfboard": "서핑보드",
        }
     }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ko", // 기본 언어 
    fallbackLng: "en", //대체 언어 
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;