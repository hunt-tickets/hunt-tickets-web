"use client";

import * as SubframeCore from "@subframe/core";
import { Tooltip as SubframeTooltip } from "../sub/tooltip";

function Tooltip() {
  return (
    <SubframeCore.Tooltip.Provider>
      <SubframeCore.Tooltip.Root>
        <SubframeCore.Tooltip.Trigger asChild={true}>
          <SubframeCore.Icon
            className="text-body font-body text-subtext-color"
            name="FeatherHelpCircle"
          />
        </SubframeCore.Tooltip.Trigger>
        <SubframeCore.Tooltip.Portal>
          <SubframeCore.Tooltip.Content
            side="bottom"
            align="center"
            sideOffset={4}
            asChild={true}
          >
            <SubframeTooltip>Tooltip</SubframeTooltip>
          </SubframeCore.Tooltip.Content>
        </SubframeCore.Tooltip.Portal>
      </SubframeCore.Tooltip.Root>
    </SubframeCore.Tooltip.Provider>
  );
}

export default Tooltip;
