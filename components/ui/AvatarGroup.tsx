import React from "react";
import Avatar from "@components/ui/Avatar";
import classNames from "@lib/classNames";
// import * as Tooltip from "@radix-ui/react-tooltip";

export type AvatarGroupProps = {
  size: number;
  truncateAfter?: number;
  items: {
    image: string;
    title?: string;
    alt: string;
  }[];
  className?: string;
};

export const AvatarGroup = function AvatarGroup(props: AvatarGroupProps) {
  /*  const truncatedAvatars: string[] =
    props.items.length > props.truncateAfter
      ? props.items
          .slice(props.truncateAfter)
          .map((item) => item.title)
          .filter(Boolean)
      : [];*/

  return (
    <ul className={classNames("flex -space-x-2 overflow-hidden", props.className)}>
      {props.items.slice(0, props.truncateAfter).map((item, idx) => (
        <li key={idx} className="inline-block">
          <Avatar imageSrc={item.image} title={item.title} alt={item.alt} size={props.size} />
        </li>
      ))}
      {/*props.items.length > props.truncateAfter && (
        <li className="inline-block relative">
          <Tooltip.Tooltip delayDuration="300">
            <Tooltip.TooltipTrigger className="cursor-default">
              <span className="w-16 absolute bottom-1.5 border-2 border-gray-300 flex-inline items-center text-white pt-4 text-2xl top-0 rounded-full block bg-neutral-600">+1</span>
            </Tooltip.TooltipTrigger>
            {truncatedAvatars.length !== 0 && (
              <Tooltip.Content className="p-2 rounded-sm text-sm bg-black text-white shadow-sm">
                <Tooltip.Arrow />
                <ul>
                  {truncatedAvatars.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              </Tooltip.Content>
            )}
          </Tooltip.Tooltip>
        </li>
      )*/}
    </ul>
  );
};

export default AvatarGroup;
