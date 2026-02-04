import { Container, Flex, Image, Paper, Text, Title } from "@mantine/core";
import semarLogo from "../../assets/semar_logo.svg";
import styles from "./AboutUs.module.css";

const AboutUs: React.FC = () => {
  return (
    <div className={styles.aboutUsPage}>
      <Container className={styles.container}>
        <Paper
          className={styles.aboutUsBox}
          p="xl"
          shadow="md"
          radius={"lg"}
          w={"100%"}
        >
          <Flex justify="center">
            <Image src={semarLogo} alt="logo" />
          </Flex>
          <Title ta="center" order={2} mb="sm">
            About Us
          </Title>
          <Text ta="justify" fw="400">
            The Semar application is an E-commerce product display app that
            showcases user transaction history tracking without facilitating any
            financial transactions. It is the integration platform for users to
            view the product and track their order. Actual transaction will not
            happen in this application.
          </Text>
        </Paper>
      </Container>
    </div>
  );
};

export default AboutUs;
