import { Header } from "@/components";
import { theme } from "@/styles/theme";
import {
  Box,
  Button,
  ChakraProvider,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import ReactPlayer from "react-player";
import { useRecordWebcam } from "react-record-webcam";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import type {
  RecordWebcamHook,
  RecordWebcamOptions,
} from "react-record-webcam";
import { CAMERA_STATUS } from "react-record-webcam";
import s3, { BUCKET_NAME } from "./instances/s3";

const OPTIONS: RecordWebcamOptions = {
  filename: "test-filename",
  fileType: "mp4",
  width: 1920,
  height: 1080,
};

const STATUS = {
  idle: {
    id: 0,
  },
  start: {
    id: 1,
  },
  stop: {
    id: 2,
  },
  preview: {
    id: 3,
  },
  save: {
    id: 4,
  },
};

function Admin() {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");

  const [url, setUrl] = useState();
  const [enableButtonSave, setEnableButtonSave] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [controls, setControls] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const reactPlayerRef = useRef<any>();
  const [status, setStatus] = useState(STATUS.idle.id);

  const recordWebcam: RecordWebcamHook = useRecordWebcam(OPTIONS);

  const getRecordingFileHooks = async () => {
    const blob = await recordWebcam.getRecording();
    return blob;
  };

  const getRecordingFileRenderProp = async (blob: Blob | undefined) => {
    console.log({ blob });
  };

  const startRecording = () => {
    setShowPreview(false);
    if (
      recordWebcam.status === CAMERA_STATUS.CLOSED ||
      recordWebcam.status === CAMERA_STATUS.RECORDING ||
      recordWebcam.status === CAMERA_STATUS.PREVIEW
    ) {
      alert("Camera is not ready");
      return;
    }
    setPlaying(true);
    setControls(true);
    recordWebcam.start();
    setStatus(STATUS.start.id);
    if (reactPlayerRef?.current) {
      reactPlayerRef.current.playing = true;
    }
  };

  const stopRecording = () => {
    if (recordWebcam.status !== CAMERA_STATUS.RECORDING) {
      alert("Camera is not recording");
      return;
    }
    setPlaying(false);
    setControls(false);
    recordWebcam.stop();
    recordWebcam.retake();
    setStatus(STATUS.stop.id);
    setShowPreview(true);
    setEnableButtonSave(true);
  };

  const previewRecording = () => {
    setShowPreview(true);
  };

  const reset = () => {
    setShowPreview(false);
    setPlaying(false);
    setControls(false);
    recordWebcam.retake();
    setStatus(STATUS.idle.id);
    setEnableButtonSave(false);
  };

  const saveRecording = async () => {
    if (!id) {
      alert("No video to save");
      return;
    }
    setLoading(true);

    const blob = await getRecordingFileHooks();

    let videoId = `${id}`.split("v=")[1];
    const ampersandPosition = videoId.indexOf("&");
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }

    s3.putObject(
      {
        Bucket: BUCKET_NAME || "",
        Key: `${videoId}.mp4`,
        Body: blob as any,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          alert("Erro ao salvar vídeo");
          setLoading(false);
          return;
        }
        console.log(data);
        alert("Vídeo salvo com sucesso");
        setLoading(false);
      }
    );

    setShowPreview(false);
    setPlaying(false);
    setControls(false);
    setStatus(STATUS.save.id);
  };

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
              Insira aqui uma url 🥰
            </Heading>
            <HStack spacing={3}>
              <Input
                width={700}
                placeholder="Insira uma URl de vídeo"
                value={url}
                onChange={(event: any) => setUrl(event.target.value)}
                size="lg"
                color="white"
                variant="outline"
              />
              <Button
                as="a"
                colorScheme="pink"
                size="lg"
                href={`/admin?id=${url}`}
                disabled={!url}
              >
                Começar
              </Button>
            </HStack>
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
              Admin
            </Heading>

            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Ações
              </MenuButton>
              <MenuList>
                <MenuItem onClick={recordWebcam.open}>Open camera</MenuItem>
                <MenuItem
                  disabled={
                    recordWebcam.status === CAMERA_STATUS.CLOSED ||
                    recordWebcam.status === CAMERA_STATUS.PREVIEW
                  }
                  onClick={recordWebcam.close}
                >
                  Close camera
                </MenuItem>
                <MenuItem
                  disabled={
                    recordWebcam.status === CAMERA_STATUS.CLOSED ||
                    recordWebcam.status === CAMERA_STATUS.RECORDING ||
                    recordWebcam.status === CAMERA_STATUS.PREVIEW
                  }
                  onClick={recordWebcam.start}
                >
                  Start recording
                </MenuItem>
                <MenuItem
                  disabled={recordWebcam.status !== CAMERA_STATUS.RECORDING}
                  onClick={recordWebcam.stop}
                >
                  Stop recording
                </MenuItem>
                <MenuItem
                  disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                  onClick={recordWebcam.retake}
                >
                  Retake
                </MenuItem>
                <MenuItem
                  disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                  onClick={recordWebcam.download}
                >
                  Download
                </MenuItem>
                <MenuItem
                  disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                  onClick={getRecordingFileHooks}
                >
                  Get recording
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          {enableButtonSave && (
            <Flex mb="8" justify="space-between" align="center">
              <Button
                w="100%"
                colorScheme="green"
                size="lg"
                onClick={saveRecording}
              >
                SALVAR
              </Button>
              <Button
                variant="outline"
                size="lg"
                color="white"
                ml="5"
                onClick={reset}
              >
                Refazer
              </Button>
            </Flex>
          )}

          <Box
            position="relative"
            overflow="hidden"
            top={!showPreview ? "-4000px" : "0"}
            height="600"
            mb="20"
          >
            <ReactPlayer
              ref={reactPlayerRef}
              width="100%"
              height="600px"
              url={id}
              onStart={() => {
                recordWebcam.previewRef.current?.play();
              }}
              onEnded={() => {
                setStatus(STATUS.preview.id);
                setEnableButtonSave(true);
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
              <video ref={recordWebcam.previewRef} muted />
            </Box>
          </Box>

          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={10}
            top={showPreview ? "-4000px" : "-650px"}
            position="relative"
          >
            <GridItem>
              <ReactPlayer
                controls={controls}
                url={id}
                loading="lazy"
                playing={playing}
              />
            </GridItem>
            <GridItem>
              <Stack
                spacing={4}
                direction="row"
                align="center"
                top={showPreview ? "-4000px" : "-650px"}
              >
                <video ref={recordWebcam.webcamRef} autoPlay muted />
              </Stack>

              {[STATUS.idle.id].includes(status) && (
                <Button
                  mt="5"
                  width="100%"
                  colorScheme="teal"
                  onClick={startRecording}
                >
                  Começar
                </Button>
              )}
              {[STATUS.start.id].includes(status) && (
                <Button
                  mt="5"
                  width="100%"
                  colorScheme="orange"
                  onClick={stopRecording}
                >
                  Parar
                </Button>
              )}
              {[STATUS.stop.id].includes(status) && !showPreview && (
                <Button
                  mt="5"
                  width="100%"
                  colorScheme="cyan"
                  onClick={previewRecording}
                >
                  Visualizar
                </Button>
              )}
            </GridItem>
          </Grid>
        </Box>
        <Divider />
        <Text color="white">Camera status: {recordWebcam.status}</Text>
      </Box>
    </ChakraProvider>
  );
}

export default Admin;
