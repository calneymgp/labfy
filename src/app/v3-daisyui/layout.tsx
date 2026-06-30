import type { Metadata } from "next";
import "./daisyui.css";

export const metadata: Metadata = {
  title: "Labfy — DaisyUI",
};

export default function DaisyUILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="night" className="min-h-full flex flex-col">
      {children}
    </div>
  );
}
