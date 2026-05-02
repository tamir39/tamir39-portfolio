export type Channel = {
  id: string;
  channelId: string;
  label: string;
};

export const channels: Channel[] = [
  { id: "hero", channelId: "MAIN_00", label: "MAIN" },
  { id: "profile", channelId: "LOG_01", label: "PROFILE" },
  { id: "missions", channelId: "LOG_02", label: "MISSIONS" },
];

export const sectionIds = channels.map((c) => c.id);

export function findChannel(id: string): Channel {
  return channels.find((c) => c.id === id) ?? channels[0];
}

export function findChannelByPath(pathname: string): Channel | null {
  if (pathname.startsWith("/missions/")) {
    return channels.find((c) => c.id === "missions") ?? null;
  }
  return null;
}
