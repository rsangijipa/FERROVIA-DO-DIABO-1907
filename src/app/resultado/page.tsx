import { permanentRedirect } from "next/navigation";

export default function LegacyResultadoPage() {
  permanentRedirect("/resultado-integrado");
}
