type IconMonogramProps = {
  fontSize: number;
  letterSpacing?: string;
};

const SHORT_LETTER_RATIO = 0.72;

export default function IconMonogram({
  fontSize,
  letterSpacing = "-1px",
}: IconMonogramProps) {
  const tallLetterSize = fontSize;
  const shortLetterSize = Math.round(fontSize * SHORT_LETTER_RATIO);

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
        fontWeight: 700,
        letterSpacing,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <span style={{ fontSize: tallLetterSize, lineHeight: 1 }}>P</span>
        <span style={{ fontSize: shortLetterSize, lineHeight: 1 }}>M</span>
        <span style={{ fontSize: shortLetterSize, lineHeight: 1 }}>T</span>
      </div>
    </div>
  );
}
