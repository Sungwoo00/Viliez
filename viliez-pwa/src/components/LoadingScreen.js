import React from 'react';
import Lottie from 'react-lottie-player';
import loadingScreenJson from '../lottie/loadingScreen.json';

export default function LoadingScreen() {
  return (
    <Lottie
      loop
      width={100}
      height={100}
      animationData={loadingScreenJson}
      play
    />
  );
}
