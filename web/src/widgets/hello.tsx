import { mountWidget } from "skybridge/web";
import "@/index.css";

const HelloWorld = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-teal-400">
      <div className="text-white text-4xl font-bold shadow-lg p-8 rounded-lg bg-black/30 backdrop-blur">
        Hello, World!
      </div>
    </div>
  );
};

export default HelloWorld;

mountWidget(<HelloWorld />);
