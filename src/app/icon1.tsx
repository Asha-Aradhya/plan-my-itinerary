import { ImageResponse } from "next/og";
import IconMonogram from "@/pwa/IconMonogram";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <IconMonogram fontSize={130} letterSpacing="-4px" />,
    { ...size },
  );
}
