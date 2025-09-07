import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { FC, ComponentProps, useState } from "react";
import { TbCheck } from "react-icons/tb";

type CopyButtonProps = {
  textToCopy: string;
  icon: FC<ComponentProps<"svg">>;
  variant?:
    | "solid"
    | "light"
    | "bordered"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  iconClassName?: string;
  addTooltip?: boolean;
  tooltipText?: string;
};

export const CopyButton = (props: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(props.textToCopy);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const button = (
    <Button
      isIconOnly
      aria-label={props.tooltipText ? props.tooltipText : "Copy"}
      variant={props.variant || "solid"}
      onPress={handleCopy}
    >
      {isCopied ? (
        <TbCheck className="text-white h-5 w-5" />
      ) : (
        <props.icon className={`h-5 w-5 ${props.iconClassName || ""}`} />
      )}
    </Button>
  );

  return props.addTooltip || false ? (
    <Tooltip content={props.tooltipText}>{button}</Tooltip>
  ) : (
    button
  );
};
