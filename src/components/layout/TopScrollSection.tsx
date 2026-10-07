import { topScrollApi } from "@/lib/api/topScroll";
import { TopScroll } from "./TopScroll";

export async function TopScrollSection() {
  const message = await topScrollApi.get().catch(() => null);
  if (!message || message.status !== "active") return null;
  return <TopScroll text={message.text} />;
}
