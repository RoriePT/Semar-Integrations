export const adminTopups = [
  {
    id: 6,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "complete",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),
    member: {
      id: 2,
      name: "Kanishk Priyadarshi",
    },

    transactionDetails: {
      transactionId: "848484575775784",
      receipt:
        "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
      member: {
        "Upi Id": "9149965887@2912",
        "Mobile Number": "9149965887",
      },
    },

    balancesAndProfit: [
      {
        role: "member",
        name: "Kanishk Priyadarshi",
        commissionRate: 2,
        commissionAmount: 23,
        quotaEarned: 2,
        quotaBefore: 20000,
        quotaAfter: 20022,
      },

      {
        role: "agent",
        name: "Zakir Hassan",
        commissionRate: 2,
        commissionAmount: 23,
        balanceBefore: 20000,
        balanceAfter: 20022,
        isMember: false,
        isAgentOf: "Rohit BhattaCharya",
      },

      {
        role: "agent",
        name: "Ripan Chaudhary",
        commissionRate: 2,
        commissionAmount: 23,
        balanceBefore: 20000,
        balanceAfter: 20022,
        isMember: true,
        isAgentOf: "Sneha Raina",
      },
    ],
  },

  {
    id: 8,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "rejected",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),
    member: {
      id: 2,
      name: "Kanishk Priyadarshi",
    },

    transactionDetails: {
      transactionId: "848484575775784",
      receipt:
        "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",
      member: {
        "Upi Id": "9149965887@2912",
        "Mobile Number": "9149965887",
      },
    },

    balancesAndProfit: null,
  },

  {
    id: 4,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "submitted",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),

    member: {
      id: 2,
      name: "Kanishk Priyadarshi",
    },

    transactionDetails: {
      transactionId: "848484575775784",
      receipt:
        "https://unsplash.com/photos/black-flat-screen-computer-monitor-cFFEeHNZEqw",

      member: {
        "Upi Id": "9149965887@2912",
        "Mobile Number": "9149965887",
      },
    },

    balancesAndProfit: [
      {
        role: "member",
        name: "Kanishk Priyadarshi",
        commissionRate: 2,
        commissionAmount: 23,
        quotaEarned: 2,
        quotaBefore: 20000,
        quotaAfter: 20022,
      },

      {
        role: "agent",
        name: "Rohit BhattaCharya",
        commissionRate: 2,
        commissionAmount: 23,
        balanceBefore: 20000,
        balanceAfter: 20022,
        isMember: false,
        isAgentOf: "Ravi Dubey",
      },

      {
        role: "agent",
        name: "Zakir Hassan",
        commissionRate: 2,
        commissionAmount: 23,
        balanceBefore: 20000,
        balanceAfter: 20022,
        isMember: false,
        isAgentOf: "Rohit BhattaCharya",
      },
    ],
  },

  {
    id: 2,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "assigned",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),

    member: {
      id: 2,
      name: "Kanishk Priyadarshi",
    },
    transactionDetails: null,

    balancesAndProfit: [
      {
        role: "member",
        name: "Kanishk Priyadarshi",
        commissionRate: 2,
        commissionAmount: 23,
        quotaEarned: 2,
        quotaBefore: 20000,
        quotaAfter: 20022,
      },

      {
        role: "agent",
        name: "Rohit BhattaCharya",
        commissionRate: 2,
        commissionAmount: 23,
        balanceBefore: 20000,
        balanceAfter: 20022,
        isMember: false,
        isAgentOf: "Ravi Dubey",
      },

      {
        role: "agent",
        name: "Zakir Hassan",
        commissionRate: 2,
        commissionAmount: 23,
        balanceBefore: 20000,
        balanceAfter: 20022,
        isMember: false,
        isAgentOf: "Rohit BhattaCharya",
      },
    ],
  },

  {
    id: 1,
    systemOrderId: "QWEFC1234565432",
    amount: 200,
    status: "initiated",
    channel: "Netbanking",
    createdAt: new Date(),
    updatedAt: new Date(),

    member: null,

    transactionDetails: null,

    balancesAndProfit: null,
  },
];
