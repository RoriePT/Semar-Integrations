import {
  Container,
  Flex,
  Image,
  List,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import semarLogo from "../../assets/semar_logo.svg";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.privacyPolicyPage}>
      <Container className={styles.container}>
        <Paper
          className={styles.privacyPolicyBox}
          p="xl"
          shadow="md"
          radius={"lg"}
          w={"100%"}
        >
          <Flex justify="center">
            <Image src={semarLogo} alt="logo" />
          </Flex>
          <Title ta="center" order={2} mb="sm">
            Privacy Policy
          </Title>
          <Text ta="justify" fw="400">
            We know that you care how information about you is used and shared,
            and we appreciate your trust that we will do so carefully and
            sensibly. This User Privacy policy applies regardless of how you
            access or use these Services, including access via browser or apps.
            By using our services you agree to our use of your personal
            information in accordance with this Privacy policy, it may be
            amended from time to time by us at our discretion. You also agree
            and consent to us collecting, storing, processing, transferring, and
            sharing your personal information with third parties or service
            providers for the purposes set out in this Privacy Policy.
          </Text>

          <Title order={4} my="sm">
            Information we collect
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              When you register on the App, web or show interest in our products
              and Services, participate in App activities, or contact us, we
              collect personal information that you voluntarily provide. The
              personal information we collect depends on how you interact with
              us and the App, including your choices and the products and
              features you use. Examples of personal information we may collect
              include:
              <List pr="20">
                <List.Item ta="justify">
                  Your name, email address, and phone number,
                </List.Item>
                <List.Item ta="justify">
                  Your financial information, such as the details about the
                  payment methods used. This may involve information such as the
                  name of the cardholder, banking details, wallet details, and
                  other relevant data, for product transaction tracking purpose,
                </List.Item>
                <List.Item ta="justify">
                  Your browsing behaviour on the App, such as pages visited,
                  time spent, and links clicked,
                </List.Item>
                <List.Item ta="justify">
                  Your communication with us, such as customer support requests
                  and feedback.
                </List.Item>
              </List>
            </List.Item>
            <List.Item ta="justify">
              It is important that all personal information you provide to us is
              accurate, complete, and truthful. You must inform us of any
              changes to your personal information.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            How we use information
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              At Semar, we may use the information that you provide for a
              variety of purposes, including providing our services to you. As a
              user of Semar, you consent to the use of Sensitive Personal Data
              and Other Personal Information for verifying user accounts,
              maintaining user accounts, completing user transactions, and
              analysing user behaviour. We may also use software applications to
              analyse Platform traffic and gather related statistics, which
              allows us to advertise our services and determine the efficacy and
              popularity of Semar.
            </List.Item>
            <List.Item ta="justify">
              In some cases, we may need to share your information with our
              Service Providers, contractors, agents, and regulatory
              authorities. However, we restrict access to your personal
              information to these parties and only allow access on a
              need-to-know basis for processing and providing our services or in
              response to regulatory requests.
            </List.Item>
            <List.Item ta="justify">
              Please note that when tracking product orders, we may use your
              name, photo, login ID, and location. From time to time, Semar may
              conduct periodic analysis and surveys of Platform traffic for
              market research and advertising purposes. To achieve this, we
              reserve the right to share your registration information with
              Semar-appointed market research and advertising companies or
              firms. We may also use cumulative non-personal information for
              auditing and analysis purposes, which helps us to improve our
              services.
            </List.Item>
            <List.Item ta="justify">
              Please note that while we securely gather the payment information,
              it does not imply that a transaction or payment has been processed
              within the app.
            </List.Item>
            <List.Item ta="justify">
              The collection of this information allows us to provide a
              convenient and secure app for tracking product order transactions.
              We prioritise the security of your financial data and adhere to
              industry-standards and practices to safeguard your information.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Data Security
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              We implement appropriate security measures to safeguard data
              against unauthorised access, alteration, disclosure, or
              destruction. These measures include internal reviews of data
              collection, storage, processing practices, and security measures.
              We use encryption and physical security measures to protect
              against unauthorised access to systems where personal data is
              stored. Our information security program and policies contain
              managerial, technical, operational, and physical security control
              measures for the protection of Sensitive Personal Data and Other
              Personal Information.
            </List.Item>
            <List.Item ta="justify">
              We store information collected by Semar securely using various
              security applications, including firewalls. However, we cannot
              guarantee absolute security as security measures are always
              relative and can be breached. Information transmitted over the
              internet is inherently exposed to security risks or threats. Data
              transmitted via chat or email can be compromised and used by
              others. Therefore, Semar cannot guarantee security for such
              information transmitted through the internet infrastructure or any
              unsolicited disclosures made by any user availing the services of
              the Platform.
            </List.Item>
            <List.Item ta="justify">
              Your account is protected by login information, including a
              username and password known only to you when you register with
              Semar. You should not provide your user credentials and related
              personal information to anyone else. Violation of this Policy and
              breach of security, including the compromise of your login
              information, must be immediately reported to Semar.
            </List.Item>
            <List.Item ta="justify">
              The Platform may contain links to other websites/portals, which
              are governed by their own privacy policies. Semar does not
              exercise control over these websites/portals. You are responsible
              for reading and understanding the privacy policy of such
              websites/portals when you follow a link outside the Website.
              Exercise caution in sharing personal information with third-party
              advertisers on the Platforms, and Semar is not responsible for
              information provided by you on third-party websites/portals.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            User Account and Data Deletion
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              If you wish to delete your user account and personal information
              from Semar, you may do so by sending a written request to
              helpdesk@Semar.market. We will respond as soon as possible, but no
              later than one month from the receipt of your request or any
              further information required to comply with your request.
              Alternatively, you may request temporary deactivation of your
              account by writing to the same email address, which will suspend
              your account but keep your data intact for future reactivation.
            </List.Item>
            <List.Item ta="justify">
              Please note that permanent deactivation of your account will
              result in the loss of all data associated with it, including
              personal information. However, you may request account restoration
              within one month from the date of notification of account deletion
              by Semar by writing to helpdesk@Semar.market.
            </List.Item>
            <List.Item ta="justify">
              We take care to ensure that the deletion process is thorough and
              safe, and that all data is removed completely from our servers or
              retained only in anonymized form. However, there may be some
              delays in removing copies of your data from our active and backup
              systems due to our protection measures against accidental or
              malicious deletion.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Cookies
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              A cookie is a small text file that is assigned by a website's
              server and identifies your browser when you visit the website. By
              using cookies, we can save your preferences and account settings,
              among other things. When you visit our Platform(s), you
              acknowledge and agree that cookies may be stored on your computer
              by our servers. These cookies may be used to personalise your
              experience on the Platform(s), as well as for Authentication,
              Management, Data Analysis, and Security purposes.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Liability of Limitations
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              Semar hereby clarifies that this Privacy Policy solely serves as a
              description of its practices concerning user information and does
              not intend to establish any legal rights for you or any other
              individual.
            </List.Item>
            <List.Item ta="justify">
              Please note that Semar retains the right to modify this Policy at
              its discretion without any prior notification to you. Semar's
              liability shall be limited to the removal of Sensitive Personal
              Data from its system and the elimination of personally
              identifiable elements of Other Personal Information in case of any
              discrepancies.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Applicable Law and Jurisdiction
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              By visiting this Portal, you agree that the laws of Taiwan without
              regard to its conflict of laws principles, govern this Privacy
              Policy and any dispute arising in respect hereof shall be subject
              to and governed by the dispute resolution process set out in the
              Terms and Conditions.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Contact us
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              If you have any queries or concerns about our privacy policy or
              our use of personal information, please contact us at our support
              Email Id: helpdesk@Semar.market or by normal/physical mail
              addressed to:
              <Text fw="500" my="xs">
                Contact Details:
              </Text>
              <Text> Name : Dwi Arifin</Text>
              <Text> Location : Kota Depok, Indonesia, (+62)</Text>
              <Text> Support Email : helpdesk@Semar.market</Text>
            </List.Item>
          </List>
        </Paper>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
