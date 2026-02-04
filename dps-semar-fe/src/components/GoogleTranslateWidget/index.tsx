import { useEffect, useRef } from "react";

declare global {
  interface Window {
    initGoogleTranslate?: () => void;
    google: {
      translate: {
        TranslateElement: any;
      };
    };
  }
}

const GoogleTranslateWidget = () => {
  const googleTranslateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (
        document.querySelector(
          "script[src='//translate.google.com/translate_a/element.js?cb=initGoogleTranslate']"
        )
      ) {
        // Script is already added, do nothing
        return;
      }
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=initGoogleTranslate";
      script.async = true;
      document.body.appendChild(script);
    };

    window.initGoogleTranslate = () => {
      if (googleTranslateRef.current && window.google?.translate) {
        if (!googleTranslateRef.current.querySelector(".goog-te-combo")) {
          // Initialize the Google Translate widget only if it hasn't been initialized
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages:
                "af,ach,ak,am,ar,az,be,bem,bg,bh,bn,br,bs,ca,chr,ckb,co,crs,cs,cy,da,de,ee,el,en,eo,es,es-419,et,eu,fa,fi,fo,fr,fy,ga,gaa,gd,gl,gn,gu,ha,haw,hi,hr,ht,hu,hy,ia,id,ig,is,it,iw,ja,jw,ka,kg,kk,km,kn,ko,kri,ku,ky,la,lg,ln,lo,loz,lt,lua,lv,mfe,mg,mi,mk,ml,mn,mo,mr,ms,mt,ne,nl,nn,no,nso,ny,nyn,oc,om,or,pa,pcm,pl,ps,pt-BR,pt-PT,qu,rm,rn,ro,ru,rw,sd,sh,si,sk,sl,sn,so,sq,sr,sr-ME,st,su,sv,sw,ta,te,tg,th,ti,tk,tl,tn,to,tr,tt,tum,tw,ug,uk,ur,uz,vi,wo,xh,yi,yo,zh-CN,zh-TW,zu",
              layout:
                window.google.translate.TranslateElement.InlineLayout.VERTICAL,
            },
            googleTranslateRef.current
          );
        }
      }
    };

    if (!window.google?.translate) {
      addGoogleTranslateScript();
    } else {
      window.initGoogleTranslate?.();
    }

    return () => {
      const scriptTags = document.querySelectorAll(
        "script[src='//translate.google.com/translate_a/element.js?cb=initGoogleTranslate']"
      );
      scriptTags.forEach((script) => script.remove());
      window.initGoogleTranslate = undefined;
    };
  }, []);

  return (
    <div>
      <div ref={googleTranslateRef}></div>
    </div>
  );
};

export default GoogleTranslateWidget;
