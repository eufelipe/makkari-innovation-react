import { Header } from "@/components";
import { theme } from "@/styles/theme";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

function Player() {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const reactPlayerRef = useRef<any>();
  const reactPlayerRefSign = useRef<any>();

  const [video, setVideo] = useState<any>();

  const load = useCallback(() => {
    const entriesStorage = JSON.parse(localStorage.getItem("entries") || "[]");
    const video = entriesStorage.find((entry: any) => entry.videoId === id);
    setVideo(video);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxWidth={1120} margin="0 auto">
        <Header />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          {video && (
            <Box
              position="relative"
              overflow="hidden"
              top={"0"}
              height="600"
              mb="20"
            >
              <ReactPlayer
                ref={reactPlayerRef}
                width="100%"
                height="600px"
                url={video?.id}
                onPlay={() => {
                  reactPlayerRefSign.current.play();
                }}
                onPause={() => {
                  console.log("onPause");
                  reactPlayerRefSign.current.pause();
                }}
                onStart={() => {
                  reactPlayerRefSign.current?.play();
                }}
                loading="lazy"
              />

              <Box
                position="absolute"
                bottom="14"
                right="5"
                width="200px"
                height="150px"
                display="flex"
                border="2px solid black"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  ref={reactPlayerRefSign}
                  as="video"
                  src={video?.url}
                  objectFit="contain"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Player;
