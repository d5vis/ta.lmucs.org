import GoogleDoc from "../components/resources/GoogleDoc";

const ONBOARDING_DOCUMENT_ID = "1uiprF7N49pAyzSHeN2AH3sPbYM2vB5Iu_VhcSLcmMTE";

export default function Onboarding() {
  return <GoogleDoc documentId={ONBOARDING_DOCUMENT_ID} title="Onboarding" />;
}
