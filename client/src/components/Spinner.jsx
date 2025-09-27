// components/Spinner.tsx
import React from "react";
import { Loader2 } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};

export default Spinner;
