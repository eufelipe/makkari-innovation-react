import { theme } from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <h1>Makkari app</h1>
    </ChakraProvider>
  );
}

export default App;
