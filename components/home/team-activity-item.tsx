import Link from "next/link";
import Image from "next/image";
import type { AvatarColor, TeamActivity } from "@/lib/types/home";

interface TeamActivityItemProps {
  activity: TeamActivity;
}

const avatarColorClass: Record<AvatarColor, string> = {
  orange: "bg-orange",
  purple: "bg-purple",
  green: "bg-green",
  red: "bg-red",
};

/*
 * Row in the "Teamactiviteit" feed on the home dashboard. Renders an
 * avatar (photo or coloured initials) next to a "[author] [action]
 * [target]" message plus a relative timestamp.
 */
export function TeamActivityItem({ activity }: TeamActivityItemProps) {
  const {
    authorName,
    authorInitials,
    authorPhotoUrl,
    avatarColor,
    action,
    targetTitle,
    timeAgo,
    href,
  } = activity;

  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-5 py-3 hover:bg-black/5 transition-colors"
    >
      {authorPhotoUrl ? (
        <Image
          src={authorPhotoUrl}
          alt={authorName}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className={`shrink-0 size-8 rounded-full flex items-center justify-center ${avatarColorClass[avatarColor]}`}
        >
          <span className="font-display font-medium text-xs leading-none text-white">
            {authorInitials}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="text-body text-xs">
          <span className="font-bold">{authorName}</span>{" "}
          <span>{action}</span>{" "}
          <span className="font-medium">{targetTitle}</span>
        </p>
        <p className="text-body text-2xs text-black/60">{timeAgo}</p>
      </div>
    </Link>
  );
}
