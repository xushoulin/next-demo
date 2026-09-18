import { getCurrentUsername } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const username = await getCurrentUsername();
  return Response.json({ username: username ?? null });
}
