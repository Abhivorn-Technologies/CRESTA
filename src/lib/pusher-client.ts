import PusherClient from "pusher-js";

let pusherClientInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    console.warn(
      "[PusherClient] Missing NEXT_PUBLIC_PUSHER_KEY or NEXT_PUBLIC_PUSHER_CLUSTER environment variables."
    );
    return null;
  }

  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(key, {
      cluster,
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
      },
    });
  }

  return pusherClientInstance;
}
