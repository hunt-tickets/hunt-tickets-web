"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";
import { IconWithBackground } from "../sub/IconWithBackground";

interface CopyButtonProps {
  textToCopy?: string;
  buttonText?: string;
  tooltipContent?: string;
  onCopySuccess?: () => void;
}

export default function CopyButton({
  textToCopy,
  buttonText = "Copiar en el portapapeles",
  tooltipContent = "Click para copiar",
  onCopySuccess,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = textToCopy || window.location.href;
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      onCopySuccess && onCopySuccess();
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.log("Failed to copy text: ", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button variant="outline" onClick={handleCopy}>
              {isCopied ? "Copiado" : buttonText}
              <ClipboardIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? "Copiado" : tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconWithBackground
      variant="brand"
      size="small"
      icon="FeatherCopy"
      square={false}
    />
  );
}
