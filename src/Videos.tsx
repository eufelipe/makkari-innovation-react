import { Header } from "@/components";
import { theme } from "@/styles/theme";
import { Box, ChakraProvider, Image, Link, SimpleGrid } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

function Videos() {
  const [entries, setEntries] = useState([]);

  const loadEntries = useCallback(() => {
    const entriesStorage = JSON.parse(localStorage.getItem("entries") || "[]");
    setEntries(entriesStorage);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxWidth={1120} margin="0 auto">
        <Header />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <SimpleGrid columns={[2, null, 3]} spacing="40px" gap={10}>
            {entries.map((entry: any) => (
              <Link
                href={`/player?id=${entry.videoId}`}
                key={entry.id}
                border="10px solid transparent"
                _hover={{
                  borderColor: "pink.500",
                }}
              >
                <Image
                  src={`https://i.ytimg.com/vi/${entry.videoId}/maxresdefault.jpg`}
                  alt=""
                />
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Videos;
