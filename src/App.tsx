import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./styles/theme";

function App() {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <h1>Makkari app</h1>
    </ChakraProvider>
  );
}

export default App;
