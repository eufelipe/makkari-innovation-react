import { Header } from "@/components";
import { theme } from "@/styles/theme";
import { Box, ChakraProvider, Flex, Heading } from "@chakra-ui/react";

import ReactPlayer from "react-player";

function App() {
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
          {id && (
            <Flex mb="8" justify="space-between" align="center">
              <ReactPlayer url={id} />
            </Flex>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
