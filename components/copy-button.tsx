import { Tooltip } from "@heroui/tooltip";
import { Button } from "@nextui-org/button"
import { FC, ComponentProps, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
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

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  return (
    <Tooltip content={props.ariaLabel}>
      <Button isIconOnly aria-label={props.ariaLabel} className={`${isCopied ? 'bg-green-500' : ''} ${props.className}`}>
        <CopyToClipboard text={props.textToCopy} onCopy={() => handleCopy()}>
          <div className="w-full h-full flex items-center justify-center">
            {
              isCopied ? (
                <IoCheckmarkDoneSharp className="text-white h-5 w-5" />
              ) : (
                <props.icon className={`h-5 w-5 ${props.iconClassName || ''}`} />
              )
            }
          </div>
        </CopyToClipboard>
      </Button>
    </Tooltip>
  );
}
