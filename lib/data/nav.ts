export type Channel = {
  id: string;
  label: string;
  href: string;
};

export const channels: Channel[] = [
  { id: "MAIN_00", label: "MAIN", href: "/" },
  { id: "LOG_01", label: "PROFILE", href: "/profile" },
  { id: "LOG_02", label: "MISSIONS", href: "/missions" },
  { id: "LOG_03", label: "TRANSMISSION", href: "/transmission" },
];

export function findChannel(pathname: string): Channel {
  // exact match first
  const exact = channels.find((c) => c.href === pathname);
  if (exact) return exact;
  // detail routes fall back to their parent
  if (pathname.startsWith("/missions/")) {
    return channels.find((c) => c.href === "/missions") ?? channels[0];
  }
  return channels[0];
}
