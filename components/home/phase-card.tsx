import type { PhaseStatus } from "@/lib/types/home";

interface PhaseCardProps {
  title: string;
  status: PhaseStatus;
  statusLabel: string;
  subtitle: string;
  progress: number;
}

/*
 * Per-status styling for the 4 cards on the new-employee home. The
 * progress bar always renders a track; the fill width is driven by
 * `progress`, so a 0% upcoming phase still shows a visible bar.
 */
const statusStyles: Record<PhaseStatus, {
  border: string;
  label: string;
  trackBg: string;
  fill: string;
}> = {
  completed: {
    border: "border-green",
    label: "text-green",
    trackBg: "bg-black/10",
    fill: "bg-green",
  },
  active: {
    border: "border-purple",
    label: "text-purple",
    trackBg: "bg-black/10",
    fill: "bg-purple",
  },
  upcoming: {
    border: "border-black/15",
    label: "text-black",
    trackBg: "bg-black/20",
    fill: "bg-black/20",
  },
};

export function PhaseCard({ title, status, statusLabel, subtitle, progress }: PhaseCardProps) {
  const styles = statusStyles[status];

  return (
    <div
      className={`flex-1 flex flex-col justify-between gap-4 bg-white border rounded-lg p-4 ${styles.border}`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className={`text-body text-xs font-medium leading-card ${styles.label}`}>
            {title} · {statusLabel}
          </p>
          {status === "completed" && <span className="icon text-green">check</span>}
        </div>
        <p className="text-body text-xs text-black/60 leading-card">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-display font-medium text-xl leading-normal">{progress}%</p>
        <div className={`h-1 w-full rounded-full overflow-hidden ${styles.trackBg}`}>
          <div
            className={`h-full rounded-full ${styles.fill}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
