import { Header } from "@/components";
import { theme } from "@/styles/theme";
import {
  Box,
  ChakraProvider,
} from "@chakra-ui/react";
import React from "react";
import srcVideo from "./files/mar-do-sertao-01.mp4";

function User() {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxWidth={1120} margin="0 auto">
        <Header />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
        <Box
            as='video'
            controls
            src={srcVideo}
            poster='https://i.ytimg.com/vi/VCV7RA0mK14/maxresdefault.jpg'
            alt='Mar do Sertão'
            objectFit='contain'
            sx={{
              aspectRatio: '16/9'
            }}
        />
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default User;