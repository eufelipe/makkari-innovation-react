import { Header } from "@/components";
import { theme } from "@/styles/theme";
import {
  Box, Button, ChakraProvider,
  Flex,
  Grid,
  GridItem,
  Heading, Stack, Text
} from "@chakra-ui/react";

import ReactPlayer from "react-player";
import { useRecordWebcam } from "react-record-webcam";

export function App() {
  const recordWebcam = useRecordWebcam();

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
              Video
            </Heading>
          </Flex>

          <Grid templateColumns="repeat(2, 1fr)" gap={10}>
            <GridItem>{id && <ReactPlayer url={id} loading="lazy" />}</GridItem>
            <GridItem>
                <Text color="white">Camera status: {recordWebcam.status}</Text>
                <Stack spacing={4} direction='row' align='center'>
                    <Button onClick={recordWebcam.open}>Open camera<Button>
                    <Button onClick={recordWebcam.start}>Start recording<Button>
                    <Button onClick={recordWebcam.stop}>Stop recording<Button>
                    <Button onClick={recordWebcam.retake}>Retake recording<Button>
                    <Button onClick={recordWebcam.download}>Download recording<Button>
                    <Button onClick={saveFile}>Save file to server<Button>
                </Stack>
  
                <Stack spacing={4} direction='row' align='center'>
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

export default App;
