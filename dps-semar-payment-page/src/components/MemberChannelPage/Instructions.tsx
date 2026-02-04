import React from "react";

import { Alert, Button, List, Paper, Title } from "@mantine/core";

const Instructions = ({ channel, handleContinue }) => {
  if (channel === "upi")
    return (
      <Paper p={"sm"}>
        <Title order={3}>Rules for Payment</Title>
        <List type="ordered" size="sm" mt={"md"}>
          <List.Item>
            By clicking the "Proceed to payment" button below, you will be able
            to view the QR code and UPI ID for your payment.
          </List.Item>
          <List.Item>
            You can either scan the QR code using any UPI app or manually enter
            the UPI ID and payment amount in the app.
          </List.Item>
          <List.Item>
            After completing your payment on the UPI app, return to this page
            and click the "I have made my payment" button.
          </List.Item>
          <List.Item>
            Next, provide your UTR (Transaction ID) and upload a screenshot of
            the successful transaction.
          </List.Item>
          <List.Item>
            Once your payment is verified, it will be confirmed as successful.
          </List.Item>
        </List>

        <Button size="md" w={"100%"} my={"md"} onClick={handleContinue}>
          Proceed to payment
        </Button>

        <Alert title="Disclaimer" variant="light" color="yellow">
          <div style={{ fontSize: "12px" }}>
            1. The QR and the UPI Id are for one time payment only. Dont try to
            make more than one transaction, otherwise payment wont be recorded.
          </div>
          <div style={{ marginTop: "4px", fontSize: "12px" }}>
            2. Kingsgate is not responsible for loss of money in case you dont
            follow the rules of payment.
          </div>
        </Alert>
      </Paper>
    );

  if (channel === "netbanking")
    return (
      <Paper p={"sm"}>
        <Title order={3}>Rules for Payment</Title>
        <List type="ordered" size="sm" mt={"md"}>
          <List.Item>
            By clicking the "Proceed to payment" button below, you will be able
            to view the netbanking details for your payment.
          </List.Item>
          <List.Item>
            You can open the netbanking app of your bank and manually enter the
            netbanking details.
          </List.Item>
          <List.Item>
            After completing your payment on the netbanking app, return to this
            page and click the "I have made my payment" button.
          </List.Item>
          <List.Item>
            Next, provide your UTR (Transaction ID) and upload a screenshot of
            the successful transaction.
          </List.Item>
          <List.Item>
            Once your payment is verified, it will be confirmed as successful.
          </List.Item>
        </List>

        <Button size="md" w={"100%"} my={"md"} onClick={handleContinue}>
          Proceed to payment
        </Button>

        <Alert title="Disclaimer" variant="light" color="yellow">
          <div style={{ fontSize: "12px" }}>
            1. The QR and the UPI Id are for one time payment only. Dont try to
            make more than one transaction, otherwise payment wont be recorded.
          </div>
          <div style={{ marginTop: "4px", fontSize: "12px" }}>
            2. Kingsgate is not responsible for loss of money in case you dont
            follow the rules of payment.
          </div>
        </Alert>
      </Paper>
    );

  if (channel === "e-wallet")
    return (
      <Paper p={"sm"}>
        <Title order={3}>Rules for Payment</Title>
        <List type="ordered" size="sm" mt={"md"}>
          <List.Item>
            By clicking the "Proceed to payment" button below, you will be able
            to view the e-wallet app name and the associated mobile number for
            your payment.
          </List.Item>
          <List.Item>
            You can open the given e-wallet app on your phone and send payment
            to the given mobile number.
          </List.Item>
          <List.Item>
            After completing your payment on the e-wallet app, return to this
            page and click the "I have made my payment" button.
          </List.Item>
          <List.Item>
            Next, provide your UTR (Transaction ID) and upload a screenshot of
            the successful transaction.
          </List.Item>
          <List.Item>
            Once your payment is verified, it will be confirmed as successful.
          </List.Item>
        </List>

        <Button size="md" w={"100%"} my={"md"} onClick={handleContinue}>
          Proceed to payment
        </Button>

        <Alert title="Disclaimer" variant="light" color="yellow">
          <div style={{ fontSize: "12px" }}>
            1. The QR and the UPI Id are for one time payment only. Dont try to
            make more than one transaction, otherwise payment wont be recorded.
          </div>
          <div style={{ marginTop: "4px", fontSize: "12px" }}>
            2. Kingsgate is not responsible for loss of money in case you dont
            follow the rules of payment.
          </div>
        </Alert>
      </Paper>
    );
};

export default Instructions;
