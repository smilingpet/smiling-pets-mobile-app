import { redirect } from "next/navigation";

export default function PrivacyPolicyRedirect() {
  redirect("/policies/privacy-policy");
}
