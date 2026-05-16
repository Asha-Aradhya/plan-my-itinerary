type IconMonogramProps = {
  fontSize: number;
  letterSpacing?: string;
};

export default function IconMonogram({
  fontSize,
  letterSpacing = "-1px",
}: IconMonogramProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f1f3d",
        color: "#c9a84c",
        fontFamily: "serif",
        fontSize,
        fontWeight: 700,
        letterSpacing,
      }}
    >
      P
    </div>
  );
}
