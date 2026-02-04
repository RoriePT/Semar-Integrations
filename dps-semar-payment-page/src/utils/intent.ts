function detectPlatform() {
  //@ts-ignore
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  //@ts-ignore
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "ios";
  if (/android/i.test(ua)) return "android";

  return "other";
}

export function generateUpiPayLinks({ pa, pn, am, tr, tn = null }) {
  const platform = detectPlatform();

  // Build UPI PAY URI
  const params = new URLSearchParams();
  params.set("am", am);
  params.set("cu", "INR");
  params.set("pa", pa);
  // params.set("pn", pn);

  if (tn) params.set("tn", tn);

  params.set("tr", tr);

  const upiUri = `upi://pay?${params.toString()}`;

  // Predefined deep links
  const apps = {
    gpay: {
      android: `intent://pay?${params.toString()}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`,
      ios: `gpay://upi/pay?${params.toString()}`,
    },
    phonepe: {
      android: `intent://pay?${params.toString()}#Intent;scheme=upi;package=com.phonepe.app;end`,
      ios: `phonepe://pay?${params.toString()}`,
    },
    paytm: {
      android: `intent://pay?${params.toString()}#Intent;scheme=upi;package=net.one97.paytm;end`,
      ios: `paytmmp://pay?${params.toString()}`,
    },
    generic: {
      android: upiUri,
      ios: upiUri,
    },
  };

  // Build final links using platform *outside* the loop
  return {
    upiUri,
    links: {
      gpay: apps.gpay[platform],
      phonepe: apps.phonepe[platform],
      paytm: apps.paytm[platform],
      generic: apps.generic[platform],
    },
  };
}
