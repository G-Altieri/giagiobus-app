import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    Easing,
    SharedValue
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DebugSvgAnimation = () => {
    // Definiamo la larghezza totale del canvas SVG e il percorso delle strisce
    const svgWidth = 300;
    const stripWidth = 50; // Larghezza di ogni striscia

    // Valori animati per X (movimento orizzontale)
    const translateX1 = useSharedValue(0);
    const translateX2 = useSharedValue(0);
    const translateX3 = useSharedValue(0);
    const translateX4 = useSharedValue(0);

    // Proprietà animate per ogni singola striscia
    const createAnimatedProps = (translateX: SharedValue<number>) => {
        console.log("cristo ", translateX)
        return useAnimatedProps(() => ({
            transform: [{ translateX: translateX.value }],
        }));
    }

    const animatedProps1 = createAnimatedProps(translateX1);
    const animatedProps2 = createAnimatedProps(translateX2);
    const animatedProps3 = createAnimatedProps(translateX3);
    const animatedProps4 = createAnimatedProps(translateX4);

    React.useEffect(() => {
        // Funzione per creare l'animazione infinita delle strisce
        const createAnimation = (translateX: SharedValue<number>, delay: number) => {
            setTimeout(() => {
                translateX.value = withRepeat(
                    withTiming(-svgWidth, {
                        duration: 4000,
                        easing: Easing.linear,
                    }),
                    -1,
                    false
                );
            }, delay);
        }

        // Avviamo le animazioni, facendo partire ogni striscia da una posizione diversa
        createAnimation(translateX1, 0);
        createAnimation(translateX2, 100);
        createAnimation(translateX3, 200);
        createAnimation(translateX4, 300);
    }, []);

    return (
        <View style={styles.container}>
            {/* Animazione dell'SVG */}
            <Svg width={svgWidth} height={200} viewBox={`0 0 ${svgWidth} 134`}>
                {/* Linea della strada */}
                <Path d="M-3 82l435-1" stroke="#fff" strokeWidth={3} />

                {/* Striscia 1 */}
                <AnimatedPath
                    animatedProps={animatedProps1}
                    d="M0 112.5h25"
                    stroke="#fff"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Striscia 2 */}
                <AnimatedPath
                    animatedProps={animatedProps2}
                    d="M80 112.5h25"
                    stroke="#fff"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Striscia 3 */}
                <AnimatedPath
                    animatedProps={animatedProps3}
                    d="M160 112.5h25"
                    stroke="#fff"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Striscia 4 */}
                <AnimatedPath
                    animatedProps={animatedProps4}
                    d="M240 112.5h25"
                    stroke="#fff"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
            {/* Debug valori animati */}
            <Text style={styles.debugText}>Valore X1: {translateX1.value.toFixed(2)}</Text>
            <Text style={styles.debugText}>Valore X2: {translateX2.value.toFixed(2)}</Text>
            <Text style={styles.debugText}>Valore X3: {translateX3.value.toFixed(2)}</Text>
            <Text style={styles.debugText}>Valore X4: {translateX4.value.toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    debugText: {
        marginTop: 20,
        fontSize: 16,
        color: 'white',
    },
});

export default DebugSvgAnimation;
