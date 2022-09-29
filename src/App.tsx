import { Header } from "@/components";
import { theme } from "@/styles/theme";
import { Box, ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxWidth={1120} margin="0 auto">
        <Header />
      </Box>
    </ChakraProvider>
  );
}

export default App;
