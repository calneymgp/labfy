import { readFileSync } from "fs";
import path from "path";

export default function DesignSystemPage() {
  const content = readFileSync(path.join(process.cwd(), "DESIGN_SYSTEM.md"), "utf-8");

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <pre className="text-xs leading-relaxed whitespace-pre-wrap break-words text-foreground">
        {content}
      </pre>
    </div>
  );
}
