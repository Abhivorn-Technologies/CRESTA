import Pusher from "pusher";

const globalForPusher = globalThis as unknown as {
  pusherServer: Pusher | null;
};

function initPusherServer(): Pusher | null {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    console.warn(
      "[PusherServer] Missing Pusher configuration. Real-time notifications will be disabled until credentials are provided."
    );
    return null;
  }

  try {
    return new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  } catch (error) {
    console.error("[PusherServer] Failed to initialize Pusher instance:", error);
    return null;
  }
}

export const pusherServer =
  globalForPusher.pusherServer ?? initPusherServer();

if (process.env.NODE_ENV !== "production") {
  globalForPusher.pusherServer = pusherServer;
}
