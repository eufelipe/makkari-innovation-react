import { Header } from "@/components";
import { theme } from "@/styles/theme";
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import ReactPlayer from "react-player";
import { useRecordWebcam } from "react-record-webcam";

import type {
  RecordWebcamHook,
  RecordWebcamOptions,
} from "react-record-webcam";
import { CAMERA_STATUS } from "react-record-webcam";

const OPTIONS: RecordWebcamOptions = {
  filename: "test-filename",
  fileType: "mp4",
  width: 1920,
  height: 1080,
};

function Admin() {
  const recordWebcam: RecordWebcamHook = useRecordWebcam(OPTIONS);

  const getRecordingFileHooks = async () => {
    const blob = await recordWebcam.getRecording();
    console.log({ blob });
  };

  const getRecordingFileRenderProp = async (blob: Blob | undefined) => {
    console.log({ blob });
  };

  const saveFile = async () => {
    // const blob = await recordWebcam.getRecording();
  };

  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");

  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxWidth={1120} margin="0 auto">
        <Header />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal" color="white">
              Admin
            </Heading>
          </Flex>

          <Grid templateColumns="repeat(2, 1fr)" gap={10}>
            <GridItem>{id && <ReactPlayer url={id} loading="lazy" />}</GridItem>
            <GridItem>
              <Text color="white">Camera status: {recordWebcam.status}</Text>

              <Stack>
                <Button
                  colorScheme="teal"
                  size="xs"
                  onClick={recordWebcam.open}
                >
                  Open camera
                </Button>

                <Button
                  colorScheme="teal"
                  size="xs"
                  disabled={
                    recordWebcam.status === CAMERA_STATUS.CLOSED ||
                    recordWebcam.status === CAMERA_STATUS.PREVIEW
                  }
                  onClick={recordWebcam.close}
                >
                  Close camera
                </Button>
                <Button
                  colorScheme="teal"
                  size="xs"
                  disabled={
                    recordWebcam.status === CAMERA_STATUS.CLOSED ||
                    recordWebcam.status === CAMERA_STATUS.RECORDING ||
                    recordWebcam.status === CAMERA_STATUS.PREVIEW
                  }
                  onClick={recordWebcam.start}
                >
                  Start recording
                </Button>
                <Button
                  colorScheme="teal"
                  size="xs"
                  disabled={recordWebcam.status !== CAMERA_STATUS.RECORDING}
                  onClick={recordWebcam.stop}
                >
                  Stop recording
                </Button>
                <Button
                  colorScheme="teal"
                  size="xs"
                  disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                  onClick={recordWebcam.retake}
                >
                  Retake
                </Button>
                <Button
                  colorScheme="teal"
                  size="xs"
                  disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                  onClick={recordWebcam.download}
                >
                  Download
                </Button>
                <Button
                  colorScheme="teal"
                  size="xs"
                  disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                  onClick={getRecordingFileHooks}
                >
                  Get recording
                </Button>
              </Stack>

              <Stack spacing={4} direction="row" align="center">
                <video ref={recordWebcam.webcamRef} autoPlay muted />
                <video ref={recordWebcam.previewRef} autoPlay muted loop />
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Admin;
