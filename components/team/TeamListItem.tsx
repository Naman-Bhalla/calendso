import {
  DotsHorizontalIcon,
  ExternalLinkIcon,
  LinkIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Dropdown, { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/Dropdown";
import { useState } from "react";
import { Tooltip } from "@components/Tooltip";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@components/Dialog";
import ConfirmationDialogContent from "@components/dialog/ConfirmationDialogContent";
import Avatar from "@components/ui/Avatar";
import Button from "@components/ui/Button";
import showToast from "@lib/notification";

interface Team {
  id: number;
  name: string | null;
  slug: string | null;
  logo: string | null;
  bio: string | null;
  role: string | null;
  hideBranding: boolean;
  prevState: null;
}

export default function TeamListItem(props: {
  onChange: () => void;
  key: number;
  team: Team;
  onActionSelect: (text: string) => void;
}) {
  const [team, setTeam] = useState<Team | null>(props.team);

  const acceptInvite = () => invitationResponse(true);
  const declineInvite = () => invitationResponse(false);

  const invitationResponse = (accept: boolean) =>
    fetch("/api/user/membership", {
      method: accept ? "PATCH" : "DELETE",
      body: JSON.stringify({ teamId: props.team.id }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      // success
      setTeam(null);
      props.onChange();
    });

  return (
    team && (
      <li className="divide-y">
        <div className="flex justify-between my-4">
          <div className="flex">
            <Avatar
              imageSrc={
                props.team.logo
                  ? props.team.logo
                  : "https://eu.ui-avatars.com/api/?background=fff&color=039be5&name=" +
                    encodeURIComponent(props.team.name || "")
              }
              displayName="Team Logo"
              className="rounded-full w-9 h-9"
            />
            <div className="inline-block ml-3">
              <span className="text-sm font-bold text-neutral-700">{props.team.name}</span>
              <span className="block -mt-1 text-xs text-gray-400">
                {window.location.hostname}/{props.team.slug}
              </span>
            </div>
          </div>
          {props.team.role === "INVITEE" && (
            <div>
              <Button type="button" color="secondary" onClick={declineInvite}>
                Reject
              </Button>
              <Button type="button" color="primary" className="ml-1" onClick={acceptInvite}>
                Accept
              </Button>
            </div>
          )}
          {props.team.role === "MEMBER" && (
            <div>
              <Button type="button" color="primary" onClick={declineInvite}>
                Leave
              </Button>
            </div>
          )}
          {props.team.role === "OWNER" && (
            <div className="flex">
              <span className="self-center h-6 px-3 py-1 text-xs text-gray-700 capitalize rounded-md bg-gray-50">
                Owner
              </span>
              <Tooltip content="Copy link">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.hostname + "/team/" + props.team.slug);
                    showToast("Link copied!", "success");
                  }}
                  color="minimal"
                  className="w-full pl-5 ml-8"
                  StartIcon={LinkIcon}
                  type="button"></Button>
              </Tooltip>
              <Dropdown>
                <DropdownMenuTrigger>
                  <DotsHorizontalIcon className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button
                      type="button"
                      color="minimal"
                      className="w-full"
                      onClick={() => props.onActionSelect("edit")}
                      StartIcon={PencilAltIcon}>
                      {" "}
                      Edit team
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="">
                    <Link href={`/team/${props.team.slug}`} passHref={true}>
                      <a target="_blank">
                        <Button type="button" color="minimal" className="w-full" StartIcon={ExternalLinkIcon}>
                          {" "}
                          Preview team page
                        </Button>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          color="warn"
                          StartIcon={TrashIcon}
                          className="w-full">
                          Disband Team
                        </Button>
                      </DialogTrigger>
                      <ConfirmationDialogContent
                        variety="danger"
                        title="Disband Team"
                        confirmBtnText="Yes, disband team"
                        cancelBtnText="Cancel"
                        onConfirm={() => props.onActionSelect("disband")}>
                        Are you sure you want to disband this team? Anyone who you&apos;ve shared this team
                        link with will no longer be able to book using it.
                      </ConfirmationDialogContent>
                    </Dialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </Dropdown>
            </div>
          )}
        </div>
      </li>
    )
  );
}
