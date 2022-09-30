import { Header } from "@/components";
import { theme } from "@/styles/theme";
import { Box, ChakraProvider, Flex, Heading, VStack } from "@chakra-ui/react";

import ReactPlayer from "react-player";
import { useRecordWebcam } from "react-record-webcam";

import { useEffect, useRef } from "react";
import type {
  RecordWebcamHook,
  RecordWebcamOptions,
} from "react-record-webcam";

const OPTIONS: RecordWebcamOptions = {
  filename: "test-filename",
  fileType: "mp4",
  width: 1920,
  height: 1080,
};

function Viewer() {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");

  const reactPlayerRef = useRef<any>();

  const recordWebcam: RecordWebcamHook = useRecordWebcam(OPTIONS);

  useEffect(() => {
    if (recordWebcam) {
      recordWebcam.open();
    }
  }, []);

  if (!id) {
    return (
      <ChakraProvider theme={theme}>
        <Header />
        <Box
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p="8"
          width={1120}
          margin="0 auto"
        >
          <VStack mb="8" align="flex-start">
            <Heading size="4xl" fontWeight="normal" color="white" mb="5">
              Página não encontrada
            </Heading>
          </VStack>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxWidth={1120} margin="0 auto">
        <Header />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal" color="white">
              Visualizar
            </Heading>
          </Flex>

          <Box
            position="relative"
            overflow="hidden"
            top="0"
            mb="20"
            height="500"
          >
            <ReactPlayer
              ref={reactPlayerRef}
              width="100%"
              height="500px"
              url={`https://www.youtube.com/watch?v=${id}`}
              onStart={() => {
                recordWebcam.previewRef.current?.play();
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
              <ReactPlayer
                width="200px"
                height="150px"
                url={`https://innovathon.s3.amazonaws.com/${id}.mp4`}
                loading="lazy"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Viewer;
