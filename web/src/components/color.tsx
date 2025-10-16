export const Color = ({ color }: { color: "green" | "yellow" | "red" | "blue" }) => {
  const colorName = color.toUpperCase();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: color,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "3rem",
          fontWeight: "bold",
          textAlign: "center",
          margin: 0,
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        {colorName} IS THE MOST POWERFUL COLOR !!
      </h1>
    </div>
  );
};
