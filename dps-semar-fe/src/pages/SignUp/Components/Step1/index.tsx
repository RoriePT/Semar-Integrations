import { Anchor, Button, Center, Text, TextInput, Title } from "@mantine/core";
import { Link } from "react-router-dom";

const Step1 = ({
  email,
  firstName,
  lastName,
  setEmail,
  setFirstName,
  setLastName,

  error,
  loading,

  handleSubmit,
}) => {
  return (
    <>
      <Title ta="center" order={3}>
        Register as Member
      </Title>
      <Text ta="center" mb="xl">
        Join the Semar community as a member
      </Text>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          placeholder="Enter email"
          required
          withAsterisk={true}
          size="lg"
          w={"100%"}
          mb={"md"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label="First name"
          placeholder="Enter first name"
          required
          withAsterisk={true}
          size="lg"
          w={"100%"}
          mb={"md"}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <TextInput
          label="Last name"
          placeholder="Enter last name"
          required
          withAsterisk={true}
          size="lg"
          w={"100%"}
          mb={"md"}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <p style={{ color: "tomato", marginTop: "5px" }}>{error}</p>
        <Button
          variant="filled"
          radius={"md"}
          fullWidth
          mt="md"
          size="lg"
          loading={loading}
          onClick={handleSubmit}
        >
          Signup
        </Button>
      </form>

      <Center mt={"lg"}>
        <Text>
          Already have a member account?
          <Anchor
            fw={600}
            ml={"xs"}
            component={Link}
            to={"/sign-in"}
            variant="outline"
          >
            Sign in
          </Anchor>
        </Text>
      </Center>
    </>
  );
};

export default Step1;
