import { ImageResponse } from "next/og";
import IconMonogram from "@/pwa/IconMonogram";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <IconMonogram fontSize={340} letterSpacing="-10px" />,
    { ...size },
  );
}
