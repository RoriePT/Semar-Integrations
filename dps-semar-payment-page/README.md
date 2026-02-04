# DPS Payment Page

Frontend for Kingsgate's Digital Payment System (DPS). A React app that handles checkout, payment method selection, gateway redirects, and payment status for UPI, Net Banking, and E-Wallet.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build & dev server)
- **Mantine** (UI components)
- **React Router** (routing)
- **Axios** (API calls)

## Features

- **Checkout** – Load checkout by integration ID, show amount and available payment channels
- **Payment methods** – UPI, Net Banking, E-Wallet (member, Razorpay, PhonePe, PayU)
- **Gateway flows** – Redirect to external gateways and handle callback
- **Member channel** – Direct UPI/Net Banking/E-Wallet instructions (QR, bank details, etc.)
- **UPI vendor gateway** – UPI collect flow with vendor gateway details
- **Status & polling** – Payment status display and polling until success/failure
- **Receipt upload** – Upload payment receipt for member payments

## Routes

| Path                           | Purpose                                                |
| ------------------------------ | ------------------------------------------------------ |
| `/checkout/:integrationId`     | Main checkout – select payment method and amount       |
| `/gateway-callback`            | Handles return from external payment gateway           |
| `/payment/:orderId`            | Member payment – UPI/Net Banking/E-Wallet instructions |
| `/upi-vendor-gateway/:orderId` | UPI vendor gateway payment details                     |

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Install

```bash
npm install
```

### Environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-dps-api-base-url.com
```

Use your DPS backend base URL (no trailing slash). For local dev you might use something like `http://localhost:3000`.

### Run

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── CheckoutPage/     # Checkout UI, payment methods, status, loading/error
│   ├── GatewayPage/      # Gateway redirect & general gateway callback
│   ├── MemberChannelPage/# UPI, Net Banking, E-Wallet instructions
│   ├── VendorGatewayUPIPage/
│   └── TestPage/
├── hooks/
│   ├── useCheckout.ts
│   ├── usePaymentProcessing.ts
│   ├── usePaymentStatus.ts
│   ├── usePaymentStatusPolling.ts
│   └── useWindowMessage.ts
├── routes/
├── services/             # API client (api.ts, apiUtils.ts)
├── types/                # payment.ts – request/response types
└── utils/                # constants, intent helpers
```

## API Integration

The app talks to the DPS backend using `VITE_API_BASE_URL`. Key flows:

- **Checkout** – `POST /payment-system/checkout/:integrationId`
- **Create payment** – `POST /payment-system/create-payment-order`
- **Assign gateway** – `POST /payment-system/assign-payment-gateway`
- **Member / UPI vendor channel** – member-channel, upi-vendor-channel, status, order-details, etc.

See `src/utils/constants.ts` for full endpoint list and `src/services/api.ts` for usage.

## License

Private – Kingsgate.
