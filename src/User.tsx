import { Header } from "@/components";
import { theme } from "@/styles/theme";
import {
  Box,
  ChakraProvider,
  Flex,
  Heading,
} from "@chakra-ui/react";

import ReactPlayer from "react-player";

function User() {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");

  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxWidth={1120} margin="0 auto">
        <Header />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
         {id && <ReactPlayer url={id} loading="lazy" width="100%" height="600px" />}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default User;
