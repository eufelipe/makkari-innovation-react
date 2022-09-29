/* import { Header } from "@/components";
import { theme } from "@/styles/theme";
import {
  Box,
  ChakraProvider,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import React from "react";
import srcVideo from "./files/Libras.mp4";
// import srcVideo from "./files/mar-do-sertao-01.mp4";


function User() {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);

  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };
  
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxWidth={1120} margin="0 auto">
        <Header />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <ReactPlayer
            url={srcVideo}
            playing={true}
            controls={true}
            loop={true}
            muted={true}
            playsinline={true}
            onReady={onLoadedData}
          />
        </Box>
      </Box>
    </ChakraProvider>
  );
} */
import React, { useState, Suspense } from "react";
import ReactPlayer from "react-player";
import Vid from "./files/mountain-video.mp4";
// const Vid = React.lazy(() => import('./files/mountain-video.mp4')) || '';

export default function User() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };
  return (
    <div className="App">
      <h1>react-player-mp4</h1>
      <div>
        <div style={{ opacity: isVideoLoaded ? 1 : 0 }}>
        <Suspense fallback={<div>Loading...</div>}>
            <ReactPlayer
              url={Vid}
              playing={true}
              controls={true}
              loop={true}
              muted={true}
              playsinline={true}
              onReady={onLoadedData}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
