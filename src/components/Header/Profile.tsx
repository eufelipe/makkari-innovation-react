import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export function Profile() {
  return (
    <Flex align="center" ml="auto">
      <Box mr="4" textAlign="right">
        <Text color="white">Felipe Rosas</Text>
      </Box>

      <Avatar
        size="md"
        name="Felipe Rosas"
        src="https://github.com/eufelipe.png"
      />
    </Flex>
  );
}
