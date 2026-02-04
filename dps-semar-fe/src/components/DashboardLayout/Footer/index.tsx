import { Anchor, Flex, Paper, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";

const AppFooter: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <Paper p="md" shadow="xs" mt="md">
      <Flex h={20} justify={"space-between"} align={"center"}>
        <Text size="xs">Semar © {year}</Text>
        <Flex
          justify="center"
          align={"center"}
          gap={"xs"}

          // className={styles.signInAnchors}
        >
          {/* <Anchor c="#000" size="xs">
            About Us
          </Anchor>
          | */}
          <Anchor
            component={Link}
            to="/terms-and-conditions"
            c="#000"
            size="xs"
          >
            Terms & Conditions
          </Anchor>
          |
          <Anchor component={Link} to="/privacy-policy" c="#000" size="xs">
            Privacy Policy
          </Anchor>
        </Flex>
      </Flex>
    </Paper>
  );
};
export default AppFooter;
