import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button"
import { FC, ComponentProps, useState } from "react"
import { IoCheckmarkDoneSharp } from "react-icons/io5";

type CopyButtonProps = {
  textToCopy: string
  ariaLabel: string
  icon: FC<ComponentProps<'svg'>>
  iconClassName?: string
  className?: string
}

export const CopyButton = (props: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(props.textToCopy);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  return (
    <Tooltip content={props.ariaLabel}>
      <Button
        isIconOnly
        aria-label={props.ariaLabel}
        className={`${isCopied ? 'bg-green-500' : ''} ${props.className}`}
        onPress={handleCopy}
      >
        <div className="w-full h-full flex items-center justify-center">
          {
            isCopied ? (
              <IoCheckmarkDoneSharp className="text-white h-5 w-5" />
            ) : (
              <props.icon className={`h-5 w-5 ${props.iconClassName || ''}`} />
            )
          }
        </div>
      </Button>
    </Tooltip>
  );
}
