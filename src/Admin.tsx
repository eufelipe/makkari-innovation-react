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
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import ReactPlayer from "react-player";
import { RecordWebcam } from "react-record-webcam";

import { useEffect, useRef, useState } from "react";
import type { RecordWebcamOptions } from "react-record-webcam";
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

  const [blob, setBlob] = useState<any>();

  const [url, setUrl] = useState();
  const [enableButtonSave, setEnableButtonSave] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [controls, setControls] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const reactPlayerRef = useRef<any>();
  const [status, setStatus] = useState(STATUS.idle.id);

  const webCamRef = useRef<RecordWebcam>(null);

  const getRecordingFileRenderProp = async (blob: Blob | undefined) => {
    console.log({ blob });
  };

  const startRecording = () => {
    setShowPreview(false);

    const status = webCamRef.current?.state.status;
    if (status === "CLOSED" || status === "RECORDING" || status === "PREVIEW") {
      alert("Camera is not ready");
      return;
    }
    setPlaying(true);
    setControls(true);
    webCamRef.current?.handleStartRecording();
    setStatus(STATUS.start.id);
    if (reactPlayerRef?.current) {
      reactPlayerRef.current.playing = true;
    }
  };

  const stopRecording = () => {
    setPlaying(false);
    setControls(false);
    setStatus(STATUS.stop.id);
    setShowPreview(true);
    setEnableButtonSave(true);
    webCamRef.current?.handleStopRecording();
  };

  const reset = () => {
    setShowPreview(false);
    setPlaying(false);
    setControls(false);
    webCamRef.current?.handleRetakeRecording();
    setStatus(STATUS.idle.id);
    setEnableButtonSave(false);
  };

  // blob?: Blob | null
  const saveRecording = async () => {
    const blob = await webCamRef.current?.getRecording();

    if (!blob) {
      alert("No video to save");
      return;
    }

    if (!id) {
      alert("No video to save");
      return;
    }
    setSaving(true);

    console.log("blob", blob);

    const file = new File([blob], `${id}.mp4`, {
      type: "video/mp4",
    });

    let videoId = `${id}`.split("v=")[1];
    const ampersandPosition = videoId.indexOf("&");
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }

    s3.putObject(
      {
        Bucket: BUCKET_NAME || "",
        Key: `${videoId}.mp4`,
        Body: file,
      },
      async (err, data) => {
        if (err) {
          console.log(err);
          alert("Erro ao salvar vídeo");
          setSaving(false);
          return;
        }

        const entries = JSON.parse(localStorage.getItem("entries") ?? "[]");
        const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${videoId}.mp4`;

        const alreadyExists = entries.find((entry: any) => entry.id === id);

        if (alreadyExists) {
          const newEntries = entries.map((entry: any) =>
            entry.videoId === videoId ? { ...entry, url } : entry
          );
          localStorage.setItem("entries", JSON.stringify(newEntries));
        } else {
          entries.push({
            id,
            url,
            videoId,
          });
          localStorage.setItem("entries", JSON.stringify(entries));
        }

        console.log(data);
        alert("Vídeo salvo com sucesso");
        setSaving(false);
        window.location.href = "/videos";
      }
    );

    // setShowPreview(false);
    setPlaying(false);
    setControls(false);
    setStatus(STATUS.save.id);
  };

  useEffect(() => {
    webCamRef.current?.handleOpenCamera();
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
              Criador de Sinalização
            </Heading>
          </Flex>

          {saving && (
            <Flex mb="8">
              <Spinner size="md" mr="5" color="white" />
              <Heading size="lg" fontWeight="normal" color="white">
                Salvando...
              </Heading>
            </Flex>
          )}

          {enableButtonSave && (
            <Flex mb="8" justify="space-between" align="center">
              <Button
                w="100%"
                colorScheme="green"
                size="lg"
                disabled={saving}
                onClick={saveRecording}
              >
                SALVAR
              </Button>
              <Button
                variant="outline"
                size="lg"
                color="white"
                ml="5"
                disabled={saving}
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
                webCamRef.current?.previewRef.current?.play();
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
              <video ref={webCamRef.current?.previewRef} muted />
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
                <RecordWebcam
                  ref={webCamRef}
                  options={OPTIONS}
                  render={(renderProps) => (
                    <div>
                      {/* <Text color="white">Component render prop demo</Text>
                      <Text color="white">
                        Camera status: {renderProps.status}
                      </Text> */}
                      <div>
                        {/* <Button
                          disabled={
                            renderProps.status === "OPEN" ||
                            renderProps.status === "RECORDING" ||
                            renderProps.status === "PREVIEW"
                          }
                          onClick={renderProps.openCamera}
                        >
                          Open camera
                        </Button>
                        <Button
                          disabled={renderProps.status === "CLOSED"}
                          onClick={renderProps.closeCamera}
                        >
                          Close camera
                        </Button>

                        <Button
                          disabled={
                            renderProps.status === "CLOSED" ||
                            renderProps.status === "RECORDING" ||
                            renderProps.status === "PREVIEW"
                          }
                          onClick={renderProps.start}
                        >
                          Start recording
                        </Button>
                        <Button
                          disabled={renderProps.status !== "RECORDING"}
                          onClick={renderProps.stop}
                        >
                          Stop recording
                        </Button>
                        <Button
                          disabled={renderProps.status !== "PREVIEW"}
                          onClick={renderProps.retake}
                        >
                          Retake
                        </Button>
                        <Button
                          disabled={renderProps.status !== "PREVIEW"}
                          onClick={renderProps.download}
                        >
                          Download
                        </Button>
                        <Button
                          disabled={renderProps.status !== "PREVIEW"}
                          onClick={async () => {
                            const blob = await renderProps.getRecording();
                            // @ts-ignore
                            saveRecording(blob);
                          }}
                        >
                          Get blob
                        </Button> */}

                        {[STATUS.idle.id].includes(status) && (
                          <Button
                            mb="5"
                            width="100%"
                            colorScheme="teal"
                            onClick={startRecording}
                            disabled={
                              renderProps.status === "CLOSED" ||
                              renderProps.status === "RECORDING" ||
                              renderProps.status === "PREVIEW"
                            }
                          >
                            Começar
                          </Button>
                        )}
                        {[STATUS.start.id].includes(status) && (
                          <Button
                            mb="5"
                            width="100%"
                            colorScheme="orange"
                            disabled={renderProps.status !== "RECORDING"}
                            onClick={stopRecording}
                          >
                            Parar
                          </Button>
                        )}
                        {/* <Button
                          mb="5"
                          width="100%"
                          colorScheme="orange"
                          onClick={async () => {
                            const blob = await renderProps.getRecording();
                            // @ts-ignore
                            await saveRecording(blob);
                          }}
                        >
                          SAVE
                        </Button> */}
                      </div>
                    </div>
                  )}
                />
              </Stack>
            </GridItem>
          </Grid>
        </Box>
        <Divider />
        <Text color="white">
          Camera status: {webCamRef.current?.state.status}
        </Text>
      </Box>
    </ChakraProvider>
  );
}

export default Admin;
