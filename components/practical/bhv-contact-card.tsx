import Image from "next/image";
import type { BhvContact } from "@/lib/mock-data/practical";

interface BhvContactCardProps {
  contact: BhvContact;
}

const avatarColorClass: Record<BhvContact["avatarColor"], string> = {
  purple: "bg-purple",
  orange: "bg-orange",
  green: "bg-green",
  red: "bg-red",
};

/*
 * Stand-alone card for a single BHV contact. Shows an avatar
 * (photo or coloured initials), the contact's name and role
 * label, and a black "Bel nu" CTA that opens the user's dialer
 * via a `tel:` href. Purely informational — no in-app calling.
 */
export function BhvContactCard({ contact }: BhvContactCardProps) {
  const { name, roleLabel, photoUrl, initials, avatarColor, phone } = contact;

  return (
    <div className="flex flex-col gap-3 items-center bg-white border border-black/10 rounded-xl shadow-card px-4 py-5 text-center">
      {photoUrl ? (
        <Image src={photoUrl} alt={name} width={50} height={50} className="size-12.5 rounded-full object-cover shrink-0" />
      ) : (
        <div className={`shrink-0 size-12.5 rounded-full flex items-center justify-center ${avatarColorClass[avatarColor]}`}>
          <span className="font-display font-medium text-sm leading-none text-white">{initials}</span>
        </div>
      )}

      <div className="flex flex-col gap-0.5 items-center">
        <p className="font-display font-medium text-sm leading-none text-black">{name}</p>
        <p className="text-body text-11 text-black/40 leading-none">{roleLabel}</p>
      </div>

      <a href={`tel:${phone}`} aria-label={`Bel ${name}`} className="w-full flex items-center justify-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 hover:bg-purple transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <mask id="bhv-call-mask" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
            <rect width="16" height="16" fill="#D9D9D9" />
          </mask>
          <g mask="url(#bhv-call-mask)">
            <path
              d="M12.9598 13.6667C11.7035 13.6667 10.4413 13.3746 9.17334 12.7903C7.90545 12.2061 6.73945 11.382 5.67534 10.318C4.61556 9.2539 3.79356 8.0889 3.20934 6.82301C2.62512 5.55723 2.33301 4.29618 2.33301 3.03984C2.33301 2.83984 2.39967 2.67207 2.53301 2.53651C2.66634 2.40107 2.83301 2.33334 3.03301 2.33334H5.20734C5.37567 2.33334 5.52417 2.38829 5.65284 2.49818C5.78151 2.60795 5.86334 2.74362 5.89834 2.90518L6.28051 4.86668C6.30695 5.04868 6.3014 5.20507 6.26384 5.33584C6.22617 5.46662 6.15862 5.57645 6.06117 5.66534L4.52151 7.16418C4.76929 7.61795 5.0524 8.04723 5.37084 8.45201C5.68917 8.85668 6.03384 9.24318 6.40484 9.61151C6.77062 9.9774 7.15951 10.3172 7.57151 10.6308C7.98351 10.9445 8.4284 11.2364 8.90617 11.5065L10.4022 9.99751C10.5065 9.88895 10.6328 9.81284 10.7812 9.76918C10.9294 9.72562 11.0835 9.71495 11.2433 9.73718L13.0945 10.1142C13.2628 10.1586 13.4002 10.2445 13.5067 10.3718C13.6131 10.4992 13.6663 10.6436 13.6663 10.8052V12.9667C13.6663 13.1667 13.5986 13.3333 13.4632 13.4667C13.3276 13.6 13.1598 13.6667 12.9598 13.6667Z"
              fill="currentColor"
            />
          </g>
        </svg>
        <span>Bel nu</span>
      </a>
    </div>
  );
}
