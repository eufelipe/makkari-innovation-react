import { Box, Flex } from "@chakra-ui/react";
import { Logo } from "./Logo";
import { Profile } from "./Profile";

export function Header() {
  return (
    <>
      <Flex
        w="100%"
        maxWidth={1120}
        h="20"
        mx="auto"
        mt="4"
        mb="10"
        px="6"
        align="center"
        as="header"
      >
        <Box as="a">
          <Logo />
        </Box>

        <Profile />
      </Flex>
    </>
  );
}
