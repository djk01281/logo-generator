import * as Popover from "@radix-ui/react-popover";

import { Upload } from "lucide-react";

export default function FileInput() {
  return (
    <Popover.Root>
      <Popover.Trigger className="h-[20px]">
        <Upload size={20} strokeWidth={1} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side={"top"} avoidCollisions={false} sideOffset={10}>
          Helloo
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
