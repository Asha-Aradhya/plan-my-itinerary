import { ImageResponse } from "next/og";
import IconMonogram from "@/pwa/IconMonogram";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <IconMonogram fontSize={90} letterSpacing="-3px" />,
    { ...size },
  );
}
