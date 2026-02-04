import React, { useEffect, useState } from "react";

import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  Image,
  Loader,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import semarLogo from "../../assets/semar_logo.svg";
import { getRouteForUserDashboard } from "../../utils/auth";
import ForgotPassword from "./ForgotPassword";
import styles from "./SignIn.module.css";
import useSignIn from "./useSignIn";

axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}`;

const SignInForm: React.FC = () => {
  const [opened, handlers] = useDisclosure();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { form, handleSubmit, error, loading } = useSignIn();

  let userRoute = null;

  useEffect(() => {
    if (localStorage.getItem("KGtoken2")) {
      userRoute = getRouteForUserDashboard(localStorage.getItem("KGtoken2"));
      if (userRoute) {
        navigate(`${userRoute}/overview`);
        setIsLoading(false);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <Flex align={"center"} justify={"center"} style={{ height: "100vh" }}>
        <Loader />
      </Flex>
    );
  }

  return (
    <div className={styles.signInForm}>
      <Container className={styles.container}>
        <Image src={semarLogo} alt="logo" />

        <Paper
          className={styles.signInBox}
          p="xl"
          shadow="md"
          radius={"lg"}
          w={"100%"}
        >
          <Title ta="center" order={3}>
            Welcome
          </Title>
          <Text ta="center" mb="xl">
            Sign in to continue to Semar
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Registered email"
              placeholder="Enter registered email address"
              {...form.getInputProps("email")}
              required
              withAsterisk={true}
              mb={"md"}
              size="lg"
            />

            <PasswordInput
              label="Password"
              placeholder="Enter password"
              {...form.getInputProps("password")}
              withAsterisk
              size="lg"
            />
            <p style={{ color: "tomato" }}>{error}</p>

            <Flex
              mt="4px"
              direction={"row"}
              justify={"space-between"}
              align={"center"}
            >
              <Checkbox
                label="Remember me"
                size="sm"
                {...form.getInputProps("rememberMe", { type: "checkbox" })}
              />

              <Button variant="transparent" p={0} m={0} onClick={handlers.open}>
                Forgot password?
              </Button>
            </Flex>
            <Button
              type="submit"
              variant="filled"
              radius={"md"}
              fullWidth
              mt="md"
              size="lg"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <Divider label="OR" labelPosition="center" my={"sm"} />
          <Center>
            <Button component={Link} to={"/sign-up"} variant="outline">
              Register as a Member
            </Button>
          </Center>

          <Flex
            justify="center"
            align={"center"}
            mt="xl"
            gap={"md"}
            className={styles.signInAnchors}
          >
            <Anchor component={Link} to="/about-us" c="#000">
              About Us
            </Anchor>
            |
            <Anchor component={Link} to="/terms-and-conditions" c="#000">
              Terms & Conditions
            </Anchor>
            |
            <Anchor component={Link} to="/privacy-policy" c="#000">
              Privacy Policy
            </Anchor>
          </Flex>
        </Paper>
      </Container>
      <ForgotPassword opened={opened} close={handlers.close} />
    </div>
  );
};

export default SignInForm;
