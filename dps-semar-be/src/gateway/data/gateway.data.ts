export const loadPhonepeData = () => {
  return {
    incoming: true,
    outgoing: true,
    merchant_id: 'dummy_secret_key',
    salt_key: 'dummy_secret_key',
    salt_index: 'dummy_secret_key',
    sandbox_merchant_id: 'dummy_secret_key',
    sandbox_salt_key: 'dummy_secret_key',
    sandbox_salt_index: 'dummy_secret_key',
  };
};

export const loadRazorpayData = () => {
  return {
    incoming: true,
    outgoing: true,
    key_secret: 'dummy_secret_key',
    key_id: 'dummy_secret_key',
    sandbox_key_id: 'dummy_secret_key',
    sandbox_key_secret: 'dummy_secret_key',
    account_number: '1234 1234 1234 1234',
    sandbox_account_number: '1234 1234 1234',
  };
};

export const loadUniqpayData = () => {
  return {
    incoming: false,
    outgoing: true,
    uniqpay_id: 'dummy_secret_key',
    client_id: 'dummy_secret_key',
    client_secret: 'dummy_secret_key',
  };
};

export const loadPayuData = () => {
  return {
    incoming: true,
    outgoing: false,
    client_id: 'dummy',
    client_secret: 'dummy',
    merchant_id: 'dummy',
    sandbox_client_id: 'dummy',
    sandbox_client_secret: 'dummy',
    sandbox_merchant_id: 'dummy',
  };
};

export const loadCashfreeData = () => {
  return {
    incoming: true,
    outgoing: false,
    client_id: 'dummy',
    client_secret: 'dummy',
    sandbox_client_id: 'dummy',
    sandbox_client_secret: 'dummy',
  };
};

export const loadDokuData = () => {
  return {
    incoming: true,
    outgoing: true,
    merchant_id: 'dummy',
    client_id: 'dummy',
    secret_key: 'dummy',
    sandbox_merchant_id: 'dummy',
    sandbox_client_id: 'dummy',
    sandbox_secret_key: 'dummy',
  };
};

export const loadMidtransData = () => {
  return {
    incoming: true,
    outgoing: true,
    server_key: 'dummy',
    client_key: 'dummy',
    sandbox_server_key: 'dummy',
    sandbox_client_key: 'dummy',
    disbursement_merchant_id: 'dummy',
    disbursement_creator_api_key: 'dummy',
    disbursement_creator_merchant_key: 'dummy',
    disbursement_approver_api_key: 'dummy',
    disbursement_approver_merchant_key: 'dummy',
    sandbox_disbursement_merchant_id: 'dummy',
    sandbox_disbursement_creator_api_key: 'dummy',
    sandbox_disbursement_creator_merchant_key: 'dummy',
    sandbox_disbursement_approver_api_key: 'dummy',
    sandbox_disbursement_approver_merchant_key: 'dummy',
  };
};

export const loadXenditData = () => {
  return {
    incoming: true,
    outgoing: true,
    secret_key: 'dummy',
    sandbox_secret_key: 'dummy',
  };
};
