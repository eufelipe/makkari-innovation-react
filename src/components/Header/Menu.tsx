import { Button, Stack } from "@chakra-ui/react";

export function Menu() {
  return (
    <Stack
      w="100%"
      align="center"
      justify="flex-end"
      color="white"
      direction="row"
      spacing={4}
    >
      <Button colorScheme="red" variant="solid" as="a" href="/videos">
        Vídeos
      </Button>
      <Button colorScheme="red" variant="solid" as="a" href="/admin">
        Criar Vídeo
      </Button>
    </Stack>
  );
}
