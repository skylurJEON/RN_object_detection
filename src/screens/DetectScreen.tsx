import {useState, useEffect, useRef} from 'react';
import {Camera, runAtTargetFps, useCameraDevice, useSkiaFrameProcessor, useCameraPermission} from 'react-native-vision-camera';
import { useNavi } from "../navigation/useNavi";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useTensorflowModel, Tensor, TensorflowModel } from 'react-native-fast-tflite'; 
import { Platform } from 'react-native';
import { Skia, PaintStyle, FontStyle } from '@shopify/react-native-skia';
import { RootStackParamList } from '../navigation/useNavi';
import { RouteProp } from '@react-navigation/native';
import { useCocoCategories } from '../data/cocoCategories';
import { useSharedValue } from 'react-native-reanimated';


type DetectScreenRouteProp = RouteProp<RootStackParamList, 'Detect'>;

interface Props {
    route: DetectScreenRouteProp;
}

interface ObjectState {
    distance: number;
    timestamp: number;
}

interface Position {
    x: number;
    y: number;
    height: number;
    timestamp: number;
  }

      //바운딩 박스 시각화
      const boxPaint = Skia.Paint();
      boxPaint.setStyle(PaintStyle.Stroke);
      boxPaint.setStrokeWidth(5);
      boxPaint.setColor(Skia.Color('green'));
  
      //속도 텍스트 시각화
      const textPaint = Skia.Paint();
      textPaint.setStyle(PaintStyle.Fill);
      textPaint.setColor(Skia.Color('white'));
  
      // 배경색을 Paint 객체 생성
      const bgPaint = Skia.Paint();
      bgPaint.setStyle(PaintStyle.Fill);
      bgPaint.setColor(Skia.Color('green'));
  
      const familyName = Platform.select({ ios: "Arial", default: "serif" });
  
      // 시스템 폰트 매니저 가져오기
      const fontMgr = Skia.FontMgr.System();
  
      // 폰트 매칭
      const typeface = fontMgr.matchFamilyStyle(familyName, FontStyle.Normal);
      if (!typeface) {
          throw new Error('폰트를 찾을 수 없습니다.');
      }
      // Define a font for the speed text
      const speedFont = Skia.Font(typeface, 44);

// Utility functions to stringify tensors and models
// function tensorToString(tensor: Tensor): string {
//     return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`
//   }
  
//   function modelToString(model: TensorflowModel): string {
//     return (
//       `TFLite Model (${model.delegate}):\n` +
//       `- Inputs: ${model.inputs.map(tensorToString).join('')}\n` +
//       `- Outputs: ${model.outputs.map(tensorToString).join('')}`
//     );
//   }

export default function DetectScreen({ route }: Props) {
    const navigation = useNavi();

    //추적 객체 관리
    const { categoryId } = route.params;
    const cocoCategories = useCocoCategories();
    const selectedObject = cocoCategories.find(category => category.id === categoryId);

    const objectSize = selectedObject ? selectedObject.size : 0;
    console.log(`Category Id: ${categoryId}, Category Name: ${selectedObject?.name}, Object Size: ${objectSize}`)

 

    
    //카메라 관리
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');

    //영상처리 관리
    const {resize} = useResizePlugin();
    const objectDetection = useTensorflowModel(require('../model/efficientdet.tflite'))
    const model = objectDetection.state === "loaded" ? objectDetection.model : undefined

    //속도 측정 관리
    const assumeFov = 65
    const { height: frameHeight, width: frameWidth} = Dimensions.get('window')
    console.log(`Frame Height: ${frameHeight}, Frame Width: ${frameWidth}`)
    //const objectSize = 0.3

    const previousPosition = useSharedValue<Position | null>(null);
    // 속도 기록을 위한 공유 값
    const smoothedSpeed = useSharedValue(0);
    
    const frameProcessor = useSkiaFrameProcessor((frame) => {
        'worklet'
        frame.render()
        //모델이 로드되지 않았으면 함수 종료ß
        if (model == null) return;

        // 프레임 처리
        runAtTargetFps(60, () => {
            const resized = resize(frame, {
              scale:{
                width: 320,
                height: 320,
              },
              pixelFormat : 'rgb',
              dataType : 'uint8',
            })
        //resized 프레임을 모델에 전달
        const outputs = model.runSync([resized])

        // 모델의 출력값 변수에 저장
        const detection_boxes = outputs[0]
        const detection_classes = outputs[1]
        const detection_scores = outputs[2]
        const num_detections = outputs[3]

        const numDetection = detection_boxes.length
        const currentTimestamp = Date.now();
        
        for (let i = 0; i < numDetection; i += 4) {
            const confidence = detection_scores[i / 4]
            const classId = detection_classes[i / 4]

            if (confidence > 0.7 && classId === categoryId) {
                //감지된 객체 바운딩 박스 좌표
                const left = detection_boxes[i]
                const top = detection_boxes[i + 1]
                const right = detection_boxes[i + 2]
                const bottom = detection_boxes[i + 3]
                //console.log(left, top, right, bottom)

                //디바이스 화면 좌표로 변경
                const x = top * frame.width
                const y = left * frame.height
                const w = (bottom - top) * frame.width
                const h = (right - left) * frame.height

                

                //객체와의 거리 계산
                const objectPixelSize = Math.max(w, h);
                const distance = (objectSize * frameHeight) / (2 * objectPixelSize * Math.tan((assumeFov / 2) * (Math.PI / 180)));
                const distanceMillimeters = distance * 1000;
                console.log(`Distance to Object: ${distanceMillimeters.toFixed(2)} mm`);

                // 픽셀 크기를 실제 크기(미터)로 변환
                const fovRadians = (assumeFov * Math.PI) / 180;
                const realWidth = 2 * distance * Math.tan(fovRadians / 2);
                const metersPerPixel = realWidth / frame.width;
                const objectActualSize = (objectPixelSize * realWidth) / frame.width;

                console.log(`Actual Object Size: ${objectActualSize.toFixed(2)} meters`);

                // 속도 계산 (이전 프레임과 비교)
                let speed = 0;
                const currentPosition = {
                    x: x,
                    y: y,
                    height: h,
                    timestamp: currentTimestamp,
                };

                if (previousPosition.value) {
                    const dx = currentPosition.x - previousPosition.value.x
                    const dy = currentPosition.y - previousPosition.value.y
                    const dt = (currentPosition.timestamp - previousPosition.value.timestamp) / 1000; // 초 단위 시간


                    // dt가 너무 작지 않은지 확인
                    if (dt > 0.01) { // 0.01초 이상일 때만 계산
                        const distanceMovedPixels = Math.sqrt(dx * dx + dy * dy); // 이동한 픽셀 거리
                        const speedMps = distanceMovedPixels * metersPerPixel / dt; // 미터/초
                        const speedKmh = speedMps * 3.6; // km/h 변환

                        // 지수 이동 평균 계산
                        const alpha = 0.1; // 평활화 계수 (0 < alpha <= 1)
                        smoothedSpeed.value = alpha * speedKmh + (1 - alpha) * smoothedSpeed.value;

                        console.log(`Object Speed: ${smoothedSpeed.value.toFixed(2)} km/h`);
                        speed = smoothedSpeed.value;
                     } else {
                        console.log("Time difference (dt) is too small, skipping speed calculation.");
                    }   
                }

                // 이전 위치 업데이트
                previousPosition.value = currentPosition;
        
                const rect = Skia.XYWHRect(x, y, w, h)
                frame.drawRect(rect, boxPaint)

                const speedText = `${speed.toFixed(1)} km/h`;
                const textX = x;
                const textY = y - 10;

                const textBounds = speedFont.getTextWidth(speedText);
                const padding = 5;
                const bgRect = Skia.XYWHRect(
                    textX - padding,
                    textY - speedFont.getSize(),
                    textBounds + 20,
                    speedFont.getSize() + 20
                );
                frame.drawRect(bgRect, bgPaint);
                frame.drawText(speedText, textX, textY, textPaint, speedFont);

                


                  
            }
        }
    })
    }, [model, boxPaint, textPaint, bgPaint, speedFont])

    useEffect(() => {
        const requestCameraPermission = async () => {
            const permission = await Camera.requestCameraPermission();
            if (permission === 'denied') {
                // 권한이 거부된 경우 처리
                console.log('Camera permission denied');
            }
        };
        if(model == null) return;
        //console.log(modelToString(model))

        requestCameraPermission();
    }, [model]);

    if (!hasPermission) {
        return <Text>Camera permission is required</Text>; 
    }
    if (device == null) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.homeButtonText}>HOME</Text>
            </TouchableOpacity>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                pixelFormat="rgb"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    homeButton: {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 10,
        position: 'absolute',
        top: '48%',
        left: '80%',
        zIndex: 1000,
        transform: [{ rotate: '90deg' }],
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
    },
    homeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '300',
      
    },
});
