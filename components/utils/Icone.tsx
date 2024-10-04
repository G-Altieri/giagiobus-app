import React from 'react';
import Svg, { Path, SvgProps, Circle } from 'react-native-svg';

// Usa SvgProps fornito da react-native-svg
export function IconaFrecceAvantiDietro(props: SvgProps) {
    return (
        <Svg
            width={42}
            height={42}
            viewBox="0 0 42 42"
            fill="none"
            {...props}
        >
            <Path
                d="M41.2 10.875c0-.506-.17-.844-.51-1.181l-8.5-8.438c-.68-.675-1.7-.675-2.38 0-.68.675-.68 1.688 0 2.363l7.31 7.256-7.31 7.256c-.68.675-.68 1.688 0 2.363s1.7.675 2.38 0l8.5-8.438c.34-.337.51-.675.51-1.181z"
                fill="#132A68"
            />
            <Path
                d="M37.8 10.875c0-1.012-.85-1.688-1.7-1.688h-34c-1.02 0-1.7.676-1.7 1.688s.68 1.688 1.7 1.688h34c.85 0 1.7-.676 1.7-1.688zM12.3 22.688c0-1.013-.68-1.688-1.7-1.688-.51 0-.85.169-1.19.506l-8.5 8.438c-.68.675-.68 1.687 0 2.362l8.5 8.438c.68.675 1.7.675 2.38 0 .68-.675.68-1.688 0-2.363l-7.31-7.256 7.31-7.256c.34-.338.51-.675.51-1.181z"
                fill="#132A68"
            />
            <Path
                d="M41.2 31.125c0-1.012-.85-1.688-1.7-1.688h-34c-1.02 0-1.7.675-1.7 1.688s.68 1.688 1.7 1.688h34c.85 0 1.7-.675 1.7-1.688z"
                fill="#132A68"
            />
        </Svg>
    );
}
export function IconaBandierina(props: SvgProps) {
    return (
        <Svg
            width={28}
            height={32}
            viewBox="0 0 28 32"
            fill="none"
            {...props}
        >
            <Path
                d="M23.012 10.375l4.083-6.445a1.125 1.125 0 00-.945-1.727H5.257v-.265a1.125 1.125 0 00-2.25 0v27H1.855a1.125 1.125 0 100 2.25h4.552a1.125 1.125 0 100-2.25h-1.15V18.54H26.15a1.125 1.125 0 00.95-1.727l-4.088-6.438zM5.257 16.29V4.453H24.1l-3.375 5.316a1.125 1.125 0 000 1.204L24.1 16.29H5.257z"
                fill="#132A68"
            />
        </Svg>
    );
}
//@ts-ignore
export function IconaArrowBack({ size = 24, ...props }) {
    return (
        <Svg
            width={size} // Corretto per usare la prop `size`
            height={size} // Corretto per usare la prop `size`
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Path
                d="M8 17l-5-5m0 0l5-5m-5 5h18"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
export function IconaLinee(props: SvgProps) {
    return (
        <></>
    );
}
export function IconaMarkerFermata({ size = 24, color = '#fff', ...props }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 43 80"
            fill="none"
            {...props}
        >
            <Circle cx={21} cy={21} r={17} fill={color} />
            <Path
                d="M21.192.001A21.199 21.199 0 003.114 10.146a21.212 21.212 0 00-.79 20.719 21.217 21.217 0 0017.263 11.488l.012 34.465h-2.075v3.184h7.328v-3.184h-2.074l.016-34.477a21.195 21.195 0 0017.273-11.477A21.199 21.199 0 0021.192 0v.001zM9.981 19.63h-.16a1.13 1.13 0 01-1.13-1.129V14.99a1.136 1.136 0 011.133-1.133h.16l-.003 5.774zm5.34 13.32a.701.701 0 01-.7.688h-1.328a.702.702 0 01-.703-.688v-1.727h2.73v1.727zm14.473 0a.701.701 0 01-.7.688h-1.332a.699.699 0 01-.699-.688v-1.727h2.73v1.727zm1.73-3.8h-.004a1.2 1.2 0 01-1.191 1.195H12.056a1.2 1.2 0 01-1.191-1.196V11.473c0-.508.324-.957.808-1.113a29.535 29.535 0 0119.04 0c.483.156.808.605.808 1.113l.003 17.676zM33.692 18.5a1.136 1.136 0 01-1.133 1.133h-.16v-5.777h.16a1.136 1.136 0 011.133 1.133V18.5z"
                fill="#132A68"
            />
            <Path
                d="M28.308 24.349c-.648 0-1.23.39-1.48.988a1.61 1.61 0 00.348 1.746 1.593 1.593 0 001.742.344 1.59 1.59 0 00.988-1.477 1.58 1.58 0 00-.465-1.132c-.3-.301-.71-.47-1.133-.47zM14.076 24.349a1.6 1.6 0 00-1.13 2.734 1.593 1.593 0 001.743.344 1.6 1.6 0 00-.613-3.078zM18.25 11.282h5.883a.305.305 0 000-.61H18.25a.305.305 0 000 .61zM22.344 13.856h7.226v6.316h-7.226v-6.316zM12.277 13.856h7.239v6.316h-7.239v-6.316z"
                fill="#132A68"
            />
        </Svg>
    );
}
