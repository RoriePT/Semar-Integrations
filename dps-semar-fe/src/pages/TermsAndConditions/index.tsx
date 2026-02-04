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
import styles from "./TermsAndConditions.module.css";

const TermsAndConditions: React.FC = () => {
  return (
    <div className={styles.termsAndConditionsPage}>
      <Container className={styles.container}>
        <Paper
          className={styles.termsAndConditionsBox}
          p="xl"
          shadow="md"
          radius={"lg"}
          w={"100%"}
        >
          <Flex justify="center">
            <Image src={semarLogo} alt="logo" />
          </Flex>
          <Title ta="center" order={2} mb="sm">
            Terms and conditions
          </Title>
          <Title order={4} my="sm">
            Semar:
          </Title>
          <Text ta="justify" fw="400">
            Semar is ecommerce product order display app which is designed to
            help you display and see the products. Various types of users and
            their order history tracking are displayed in the app. Various
            orders will be assigned and completed in the app. No financial
            transaction happens through the app. It is the integration platform
            for users to view the product. This application only tracks the
            product order transactions. Actual financial transactions will not
            happen in this application.
          </Text>
          <Title order={4} my="sm">
            Usage of the app:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              These Terms and Conditions govern the use of the Semar platform by
              any person (referred to as "User") who accesses it for the purpose
              of tracking the products available on the platform. By using
              Semar, the User agrees to be bound by these Terms and Conditions,
              as well as any other rules, regulations, and terms of use provided
              by Semar in relation to its services.
            </List.Item>
            <List.Item ta="justify">
              Semar reserves the right to modify these Terms and Conditions,
              rules, regulations, and terms of use at any time by posting them
              on the platform. Continued use of Semar constitutes the User's
              acceptance of any modified terms. Semar may also notify the User
              of any changes by email or notifications in the User's account,
              allowing the User to indicate non- acceptance of the modified
              terms. If no such action is taken, the User will be deemed to have
              accepted the changes.
            </List.Item>
            <List.Item ta="justify">
              Certain Semar services may be subject to additional rules and
              regulations, which will prevail in case of any inconsistency with
              these Terms and Conditions. Semar reserves the right to restrict,
              suspend, or terminate a User's access to its services, change or
              discontinue any part of the platform, reject or remove any
              material submitted by the User, establish general practices and
              limits for platform use, assign its rights and liabilities to any
              entity, and take technical and legal steps against any User who
              breaches these Terms and Conditions or misuses the platform.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            User account:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              In order to access our Services, you must register through our
              Portal and accept our Terms and conditions. By registering on the
              Portal, you agree to receive all communications from us, including
              email and push notifications, and you can withdraw your consent by
              emailing helpdesk@Semar.market. During the registration process,
              you will need to choose a login name and password and provide some
              personal information, some of which may be optional. However, you
              may also be asked for additional personal information for account
              verification purposes. You are responsible for providing accurate
              and up-to-date personal information, including your name, address,
              email address, and phone number, and for updating this information
              as necessary. We may verify this information at any time and may
              require additional documentation from you to do so. If you provide
              incorrect or incomplete information, we reserve the right to
              suspend or terminate your registration.
            </List.Item>
            <List.Item ta="justify">
              In order to enhance your e-commerce experience within our app, we
              may collect certain financial information from you. This
              information may consists of banking details, and any other
              relevant data necessary for tracking product order transactions.
              It's important to note that the collection of this information
              does not imply that a payment has been made within the app;
              rather, it enables us to provide you with a convenient and secure
              app for tracking product order transactions.
            </List.Item>
            <List.Item ta="justify">
              You are responsible for protecting the information you provide on
              the Portal, including your username, password, email address, and
              contact details. We will never ask for your login password except
              at the time of login, and you should never provide your user
              account information to anyone else. You agree not to allow anyone
              else to use your user account or to use your user account for any
              purpose other than playing games on the Portal or carrying out
              transactions related to our Services. If we suspect that your
              account has been used for any other purpose, we may immediately
              terminate your account.
            </List.Item>
            <List.Item ta="justify">
              We may attempt to validate your user account from time to time,
              typically through email. If we are unable to contact you, we may
              make additional attempts to do so. If we are unable to validate
              your account or contact you, we may limit your access to our
              Services. If the phone number or email address you provide is
              incorrect, we will not be responsible for any interruption to our
              Services.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Product listings:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              The accuracy of all product and order listings is displayed on our
              app. We agree to only display products and orders that are
              authorized to you and that comply with all applicable laws and
              regulations.
            </List.Item>
            <List.Item ta="justify">
              Various orders will be assigned to the users and completed in the
              app.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Payment:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              Once you register on our Portal/App, we maintain a user account
              for you to keep a record of all your product transactions.
            </List.Item>
            <List.Item ta="justify">
              Please note that while we securely gather the payment information,
              it does not imply that a transaction happens within the app.
            </List.Item>
            <List.Item ta="justify">
              The collection of this information allows us to provide a
              convenient and secure app for displaying product order
              transactions. Rest assured, we prioritize the security of your
              financial data and adhere to industry- standards and practices to
              safeguard your payment information.
            </List.Item>
            <List.Item ta="justify">
              No actual financial transactions happen through the app.
            </List.Item>
            <List.Item ta="justify">
              No delivery of products happens through the app.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Intellectual property:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              Users bear full responsibility for all materials, whether publicly
              posted or privately transmitted, that they upload, post, email,
              transmit, or otherwise provide on Semar ("Users' Content"). Each
              User declares and assures that they have full ownership of all
              Intellectual Property Rights in the User's Content and that no
              portion of the User's Content violates any third-party rights.
            </List.Item>
            <List.Item ta="justify">
              Users additionally confirm and pledge not to showcase or use any
              third party's names, logos, marks, labels, trademarks, copyrights,
              or intellectual and proprietary rights on Semar.
            </List.Item>
            <List.Item ta="justify">
              Users consent to compensate and protect Semar, its owners, and
              assigns from all costs, damages, loss, and harm, including
              litigation costs and counsel fees, related to any third-party
              claims that may arise, including for Intellectual Property Rights
              infringement arising from such display or usage of the names,
              logos, marks, labels, trademarks, copyrights, or intellectual and
              proprietary rights on Semar.
            </List.Item>
            <List.Item ta="justify">
              We own all intellectual property rights in our app, including but
              not limited to copyrights, trademarks, and trade secrets. You are
              prohibited from copying, modifying, distributing, selling, or
              transferring any portion of our app without our prior written
              permission.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Data privacy:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              Our priority is to protect your personal information, and we have
              taken the necessary measures to ensure its safety. Nonetheless, we
              cannot provide a complete guarantee regarding the security of your
              information. By using our app, you understand and accept that we
              may collect and use your personal information as specified in our
              privacy policy.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Limitation of liability:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              Semar cannot be held liable for any damages, including but not
              limited to injury, loss of data, loss of income, loss of profit,
              loss of opportunity, or loss of or damage to property, arising
              from your use of the Services on any Portal, whether in contract,
              negligence, or other tort. This includes direct, indirect,
              special, incidental, consequential, exemplary, or punitive
              damages. Additionally, you agree to indemnify us and our service
              providers and licensors against any claims related to such
              matters.
            </List.Item>
            <List.Item ta="justify">
              You acknowledge that we are not liable for the defamatory,
              undesirable, or illegal conduct of any other user of the Services,
              nor for any loss incurred due to the use, abuse, or misuse of your
              user account or any feature of our Services on the Websites. We
              are not liable for any technical failures, breakdowns, defects,
              delays, interruptions, improper or manipulated data transmission,
              data loss or corruption, or communications infrastructure failure,
              viruses, or any other adverse technological occurrences arising in
              connection with your access to or use of our Services. We are also
              not liable for the accuracy, completeness, or currency of any
              information services provided on the Portal, any delay or failure
              on our part to notify you of concerns about your activities, or
              any activities/transactions on third-party websites or apps
              accessed through links or advertisements posted on the Portal.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Indemnification:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              By participating in the Activity, you agree to indemnify, save and
              hold us harmless to the fullest extent permitted by law from any
              claims, actions, suits, taxes, damages, injuries, causes of
              action, penalties, interest, demands, expenses and/or awards
              asserted or brought against us by any person in connection with
              the following:
              <List pr="20">
                <List.Item ta="justify">
                  Any infringement of their intellectual property rights
                  resulting from your publication of any content on our Portal;
                </List.Item>
                <List.Item ta="justify">
                  Any defamatory, offensive or illegal conduct of any other
                  player or any misleading, inaccurate, defamatory, threatening,
                  obscene or otherwise illegal content originating from another
                  player or any source;
                </List.Item>
                <List.Item ta="justify">
                  Any use, abuse or misuse of your user account on our Portal in
                  any manner;
                </List.Item>
                <List.Item ta="justify">
                  Any disconnections, technical failures, system breakdowns,
                  defects, delays, interruptions, manipulated or improper data
                  transmission, loss or corruption of data or communication
                  lines failure, distributed denial of service attacks, viruses
                  or any other adverse technological occurrences arising in
                  connection with your access to or use of our Website;
                </List.Item>
                <List.Item ta="justify">
                  Any unauthorized access of your user account by any other
                  person accessing the Services using your username or password,
                  whether or not with your authorization.
                </List.Item>
              </List>
            </List.Item>
            <List.Item ta="justify">
              You agree to defend us, including the costs of litigation,
              disbursements and reasonable attorney's fees that we may incur in
              connection with any such claims. This indemnification includes any
              direct, indirect, or consequential losses, as well as any loss of
              profit or loss of reputation.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Governing law:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              The laws of the jurisdiction in which we operate shall govern and
              interpret these terms and conditions. Any disputes arising from
              these terms and conditions shall be settled by the courts in that
              Indonesia jurisdiction.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Changes to terms and conditions:
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              Our app's terms and conditions are subject to change at any time
              without prior notice. Your continued use of our app constitutes
              your agreement to be bound by the latest version of the terms and
              conditions.
            </List.Item>
          </List>

          <Title order={4} my="sm">
            Contact us
          </Title>
          <List pr="20">
            <List.Item ta="justify">
              If you have any queries or concerns about our terms and conditions
              or our use of personal information, please contact us at our
              support Email Id: helpdesk@Semar.market or by normal/physica mail
              addressed to:
              <Text fw="500" my="xs">
                Contact Details:
              </Text>
              <Text> Name : Dwi Arifin</Text>
              <Text> Location : Kota Depok, Indonesia, (+62)</Text>
              <Text> Support Email : helpdesk@Semar.market</Text>
              Using our app means that you have acknowledged, comprehended, and
              consented to be legally bound by these terms and conditions. If
              you disagree with these terms and conditions, you are not
              permitted to use our app.
            </List.Item>
          </List>
        </Paper>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
