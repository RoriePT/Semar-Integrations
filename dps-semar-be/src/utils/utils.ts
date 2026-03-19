import { NetBanking } from 'src/channel/entity/net-banking.entity';
import { HttpStatus } from '@nestjs/common';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  AlertType,
  ChannelName,
  GatewayName,
  NotificationType,
  ServiceRateType,
} from './enum/enum';
import { EndUser } from 'src/end-user/entities/end-user.entity';
import { Merchant } from 'src/merchant/entities/merchant.entity';
import { Payin } from 'src/payin/entities/payin.entity';

// Encrypt password or match password
export const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bycrypt.genSalt(saltRounds);
  return bycrypt.hash(password, salt);
};

export const checkPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bycrypt.compare(password, hashedPassword);
};

// Generate web token and check web token
export const generateJwtToken = (payload: any) => {
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });
  return token;
};

export const verifyToken = async (
  token: string,
): Promise<string | jwt.JwtPayload> => {
  const secretKey = process.env.JWT_SECRET;
  try {
    const details = await jwt.verify(token, secretKey);
    return details;
  } catch (error) {
    return { status: HttpStatus.FORBIDDEN, message: 'invalid token' };
  }
};

export const generateRandomOTP = () => {
  let sixDigitRandomNumber;

  do {
    const randomDecimal = Math.random();
    sixDigitRandomNumber = Math.floor(randomDecimal * 900000) + 100000;
  } while (String(sixDigitRandomNumber).startsWith('0'));

  return sixDigitRandomNumber;
};

export const extractToken = (token: string) => {
  return token.split(' ')[1];
};

export const roundOffAmount = (
  amount: number | string,
  makeAbsolute = false,
): number => {
  if (amount == null || isNaN(Number(amount))) return 0;

  let result = makeAbsolute ? Math.abs(Number(amount)) : Number(amount);
  return parseFloat(result.toFixed(2));
};

export const getTextForNotification = (type: NotificationType, data: any) => {
  let text;

  switch (type) {
    case NotificationType.GRAB_PAYOUT:
      text = `A new payout order of amount ${data.amount} is up for grab on for channel - ${data.channel}`;
      break;
    case NotificationType.GRAB_TOPUP:
      text = `A new topup order of amount ${data.amount} is up for grab on for channel - ${data.channel}`;
      break;
    case NotificationType.PAYOUT_REJECTED:
      text = `Your payment submission for payout order #${data.orderId} for amount ${data.amount} has been rejected.`;
      break;
    case NotificationType.PAYOUT_VERIFIED:
      text = `Your payment submission for payout order #${data.orderId} for amount ${data.amount} has been verified.`;
      break;
    case NotificationType.TOPUP_REJETCED:
      text = `Your payment submission for topup order #${data.orderId} for amount ${data.amount} has been rejected.`;
      break;
    case NotificationType.TOPUP_VERIFIED:
      text = `Your payment submission for topup order #${data.orderId} for amount ${data.amount} has been verified.`;
      break;
    case NotificationType.PAYIN_FOR_VERIFY:
      if (data.isUpiVendor) {
        text = `New payin order ₹${data.amount} | Tracking ID: ${data.trackingId || 'N/A'}${data.upiId ? ` | UPI: ${data.upiId}` : ''}`;
      } else {
        text = `You have a new payin order to be verified for amount ${data.amount}.`;
      }
      break;
    default:
      break;
  }

  return text;
};

export const getTextForAlert = (type: AlertType, data: any) => {
  let text;

  switch (type) {
    case AlertType.PAYOUT_FAILED:
      text = `Your payout order (#${data?.orderId}) of amount ${data?.amount} has been failed.`;
      break;
    case AlertType.PAYOUT_SUCCESS:
      text = `Your payout order (#${data?.orderId}) of amount ${data?.amount} has been completed.`;
      break;
    case AlertType.WITHDRAWAL_COMPLETE:
      text = `Your withdrawal order (#${data?.orderId}) of amount ${data?.amount} has been completed.`;
      break;
    case AlertType.WITHDRAWAL_FAILED:
      text = `Your withdrawal order (#${data?.orderId}) of amount ${data?.amount} has been failed.`;
      break;
    case AlertType.WITHDRAWAL_REJECTED:
      text = `Your withdrawal order (#${data?.orderId}) of amount ${data?.amount} has been rejected.`;
      break;
    default:
      break;
  }

  return text;
};

export const monthNames = () => {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
};

export const calculateServiceAmountForMerchant = (
  orderAmount: number,
  serviceRate: ServiceRateType,
) => {
  if (!orderAmount || !serviceRate) return 0;

  if (serviceRate.mode === 'ABSOLUTE') return serviceRate.absoluteAmount;

  if (serviceRate.mode === 'PERCENTAGE')
    return (orderAmount / 100) * serviceRate.percentageAmount;

  if (serviceRate.mode === 'COMBINATION') {
    const percentageAmount = (orderAmount / 100) * serviceRate.percentageAmount;

    return percentageAmount + serviceRate.absoluteAmount;
  }
};

export const getServicerRateForMerchant = (absoluteAmount, rate) => {
  if (!absoluteAmount && !rate) return 0;

  if (absoluteAmount && rate) return `₹${absoluteAmount} + ${rate}%`;
  if (absoluteAmount) return `₹${absoluteAmount}`;
  if (rate) return `${rate}%`;
};

export const mapAndGetGatewayPayoutStatus = (
  gateway: GatewayName,
  status: string,
): 'FAILED' | 'SUCCESS' | 'PENDING' => {
  switch (gateway) {
    case GatewayName.RAZORPAY:
      if (status === 'processed') return 'SUCCESS';
      if (
        status === 'failed' ||
        status === 'rejected' ||
        status === 'cancelled'
      )
        return 'FAILED';

      return 'PENDING';

    case GatewayName.UNIQPAY:
      if (status === 'SUCCESS') return 'SUCCESS';
      if (status === 'Transaction Successful') return 'SUCCESS';

      if (
        status === 'Transaction Failed' ||
        status === 'FAILED' ||
        status === 'FORBIDDEN' ||
        status === 'Internal processing error' ||
        status === 'Duplicate Transaction'
      )
        return 'FAILED';

      return 'PENDING';

    case GatewayName.CASHFREE:
      if (status === 'SUCCESS') return 'SUCCESS';

      if (status === 'FAILED' || status === 'REJECTED') return 'FAILED';

      return 'PENDING';

    case GatewayName.DOKU:
      {
        const normalizedStatus = String(status).toUpperCase();
        if (
          ['00', 'SUCCESS', 'COMPLETED', 'PAID', 'SETTLEMENT'].includes(
            normalizedStatus,
          )
        )
          return 'SUCCESS';

        if (
          ['04', '06', 'FAILED', 'EXPIRED', 'CANCELLED', 'REJECTED'].includes(
            normalizedStatus,
          )
        )
          return 'FAILED';

        return 'PENDING';
      }

    case GatewayName.MIDTRANS:
      {
        const normalizedStatus = String(status || '').toLowerCase();

        if (
          [
            'settlement',
            'capture',
            'success',
            'completed',
            'ok',
          ].includes(normalizedStatus)
        )
          return 'SUCCESS';

        if (
          ['deny', 'expire', 'cancel', 'failed', 'failure', 'rejected'].includes(
            normalizedStatus,
          )
        )
          return 'FAILED';
      }

      return 'PENDING';

    case GatewayName.XENDIT:
      if (
        status === 'SUCCEEDED' ||
        status === 'COMPLETED' ||
        status === 'PAID' ||
        status === 'SUCCESS'
      )
        return 'SUCCESS';

      if (
        status === 'FAILED' ||
        status === 'EXPIRED' ||
        status === 'CANCELLED'
      )
        return 'FAILED';

      return 'PENDING';

    default:
      return 'PENDING';
  }
};

export const sanitizeRazorpayDetails = (response) => {
  return {
    Bank: response.bank || undefined,
    Contact: response.contact || undefined,
    Currency: response.currency || undefined,
    Description: response.description || undefined,
    Fee: response.fee ?? undefined,
    'Payment Method': response.method || undefined,
    'Payment Status': response.status || undefined,
    Tax: response.tax ?? undefined,
    UPI: response.vpa || undefined,
    Wallet: response.wallet || undefined,
  };
};

export const sanitizePhonepeDetails = (response) => {
  return {
    Description: response.message || undefined,
    Fee: response.data?.feesContext?.amount ?? undefined,
    'Payment Method': response.data?.paymentInstrument?.type || undefined,
    'Payment Status': response.data?.responseCode || undefined,
  };
};

export const sanitizeUniqpayDetails = (response) => {
  return {
    Contact:
      response.transactionDetails?.beneficiaryInformation?.phone || undefined,
    Bank:
      response.transactionDetails?.beneficiaryAccountInformation
        ?.accountNumber || undefined,
    Fee: response.data?.charges?.totalCharges ?? undefined,
    'Payment Method': response.transactionDetails?.transferMode || undefined,
    Tax: response.data?.charges?.gstCharges ?? undefined,
  };
};

export const sanitizePayuDetails = (response) => {
  return {
    'Created On': response?.createdOn || undefined,
    'Gateway Transaction Id': response?.transactionId || undefined,
    'Settled Amount': response?.settledAmount ?? undefined,
    'Payment Method': response?.mode || undefined,
    status: response.status || undefined,
  };
};

export const sanitizeCashreeDetails = (response) => {
  return {
    'Created On': response?.linkCreatedAt || undefined,
    'Gateway Link Id': response?.cf_link_id || undefined,
    'Payment Method': response?.link_meta?.payment_methods || undefined,
    status: response.link_status || undefined,
  };
};

export const sanitizeDokuDetails = (response) => {
  return {
    'Gateway Invoice': response?.order?.invoice_number || undefined,
    'Gateway Transaction Id':
      response?.transaction?.id || response?.transaction_id || undefined,
    'Payment Method':
      response?.additional_info?.channel_code || response?.channel || undefined,
    status:
      response?.transaction?.status || response?.status || response?.order?.status,
  };
};

export const sanitizeMidtransDetails = (response) => {
  return {
    'Gateway Transaction Id': response?.transaction_id || undefined,
    'Payment Method':
      response?.payment_type || response?.channel_response_message || undefined,
    'Settlement Time': response?.settlement_time || undefined,
    status: response?.transaction_status || undefined,
  };
};

export const sanitizeXenditDetails = (response) => {
  return {
    'Gateway Invoice': response?.external_id || undefined,
    'Gateway Transaction Id': response?.payment_id || response?.id || undefined,
    'Payment Method': response?.payment_method || response?.channel_code,
    status: response?.status || undefined,
  };
};

export const sanitizeTransactionDetails = (
  gatewayName: GatewayName,
  response: any,
) => {
  if (!response || !gatewayName) return null;

  if (gatewayName === GatewayName.RAZORPAY)
    return sanitizeRazorpayDetails(response);

  if (gatewayName === GatewayName.PHONEPE)
    return sanitizePhonepeDetails(response);

  if (gatewayName === GatewayName.UNIQPAY)
    return sanitizeUniqpayDetails(response);

  if (gatewayName === GatewayName.PAYU) return sanitizePayuDetails(response);

  if (gatewayName === GatewayName.CASHFREE)
    return sanitizeCashreeDetails(response);

  if (gatewayName === GatewayName.DOKU) return sanitizeDokuDetails(response);

  if (gatewayName === GatewayName.MIDTRANS)
    return sanitizeMidtransDetails(response);

  if (gatewayName === GatewayName.XENDIT) return sanitizeXenditDetails(response);
};

export const parseUserChannelDetails = (user: EndUser) => {
  if (!user) return;

  return {
    UPI: {
      'UPI ID': user?.upiDetails?.upiId,
      'UPI Mobile Number': user?.upiDetails?.mobileNumber,
    },
    NET_BANKING: {
      'Account Number': user?.netBankingDetails?.accountNumber,
      'Bank Name': user?.netBankingDetails?.bankName,
      'Beneficiary Name': user?.netBankingDetails?.beneficiaryName,
      'IFSC Code': user?.netBankingDetails?.ifscCode,
    },
    E_WALLET: {
      'App Name': user?.eWalletDetails?.appName,
      'Wallet Mobile Number': user?.eWalletDetails?.mobileNumber,
    },
  };
};

export const getExtractedRecieptDetails = ({
  merchant,
  user,
  payin,
}: {
  merchant: Merchant;
  user: EndUser;
  payin: Payin;
}) => {
  const createdDateTime = new Date(payin.createdAt);
  const transactionData = sanitizeTransactionDetails(
    payin.gatewayName,
    JSON.parse(payin.transactionDetails),
  );

  const userData = {
    name: user?.name,
    email: user?.email,
    phone: user?.mobile,
    paymentMode: payin?.channel?.toUpperCase(),
  };
  const merchantData = {
    name: merchant?.firstName + ' ' + merchant?.lastName,
    phone: merchant?.phone,
    businessName: merchant?.businessName,
    businessUrl: merchant?.businessUrl,
    gst: merchant?.gst,
  };
  const transactionDetails = {
    orderId: payin.merchantOrderId,
    orderDate:
      createdDateTime.toLocaleDateString() +
      ' ' +
      createdDateTime.toLocaleTimeString(),
    amount: payin.amount,
    tax: transactionData?.['Tax'] || '0',
    transactionId: payin.transactionId || payin.trackingId,
  };

  return {
    userData,
    merchantData,
    transactionDetails,
  };
};

function numberToWords(num) {
  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];
  const teens = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  function getTwoDigitWords(n) {
    if (n < 10) return ones[n];
    else if (n < 20) return teens[n - 10];
    else return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
  }

  function getThreeDigitWords(n) {
    let word = '';
    if (n >= 100) {
      word += ones[Math.floor(n / 100)] + ' hundred';
      if (n % 100 !== 0) word += ' ' + getTwoDigitWords(n % 100);
    } else {
      word += getTwoDigitWords(n);
    }
    return word;
  }

  function splitIndianNumber(num) {
    let parts = [];
    parts.push(num % 1000); // last 3 digits
    num = Math.floor(num / 1000);
    parts.push(num % 100); // thousand
    num = Math.floor(num / 100);
    parts.push(num % 100); // lakh
    num = Math.floor(num / 100);
    parts.push(num); // crore
    return parts;
  }

  const scaleNames = ['', 'thousand', 'lakh', 'crore'];
  const parts = splitIndianNumber(num);
  let result = [];

  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i] > 0) {
      const word = getThreeDigitWords(parts[i]);
      result.push(word + (scaleNames[i] ? ' ' + scaleNames[i] : ''));
    }
  }

  return result.join(' ');
}

export function amountToRupeesWords(amount) {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = '';

  if (rupees > 0) {
    result += numberToWords(rupees) + ' rupees';
  } else {
    result += 'zero rupees';
  }

  if (paise > 0) {
    result += ' and ' + numberToWords(paise) + ' paise';
  }

  result += ' only';

  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const getPreferredGatewayForDefaultMode = (
  payinChannels: string,
  channelName: string,
): GatewayName | null => {
  const channels = JSON.parse(payinChannels);

  if (!Array.isArray(channels)) return null;

  const matched = channels.find(
    (ch) => ch.channel.toLowerCase() === channelName.toLowerCase(),
  );

  return matched?.gateway?.toUpperCase() || null;
};
