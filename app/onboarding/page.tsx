"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  generateGoogleDocsEmbedUrl,
  generateGoogleDocsUrl,
} from "../utils/googleDocs";

const ONBOARDING_DOCUMENT_ID = "1uiprF7N49pAyzSHeN2AH3sPbYM2vB5Iu_VhcSLcmMTE";

export default function Onboarding() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [iframeDimensions, setIframeDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIframeDimensions({
        width: window.innerWidth * 0.75,
        height: window.innerHeight * 0.73,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isPortrait) {
      window.location.replace(generateGoogleDocsUrl(ONBOARDING_DOCUMENT_ID));
    }
  }, [isPortrait]);

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-2xl p-8">
      <iframe
        className="dark:invert dark:hue-rotate-[170deg] dark:brightness-[0.88] dark:saturate-[0.5]"
        src={generateGoogleDocsEmbedUrl(ONBOARDING_DOCUMENT_ID)}
        title="Onboarding"
        width={iframeDimensions.width}
        height={iframeDimensions.height}
        style={{ border: "0" }}
      ></iframe>
    </Card>
  );
}
