import { Loader2 } from "lucide-react";

export function Loader({ text }: { text: string }) {
  return (
    <div className="container p-8 flex items-center justify-center w-full">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
