import Link from "next/link";
import { AnimatedArrow } from "@/components/ui/animated-arrow";

/*
 * Global 404. Matches the rest of the app: gradient big numeral
 * on the left, platform typography on the right, and a couple of
 * primary/secondary CTAs to help the user get unstuck. Rendered
 * for any unmatched route in both the marketing shell and the
 * authed app shell (Next.js App Router falls back here when a
 * route's own `notFound()` fires and no nested `not-found.tsx`
 * intercepts it).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 bg-white">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <p
          className="w-fit font-display font-medium leading-none bg-clip-text text-transparent text-[160px] sm:text-[200px]"
          style={{
            backgroundImage: "linear-gradient(214deg, #7161ef 28%, #ec7357 72%)",
          }}
        >
          404
        </p>

        <div className="flex flex-col gap-3">
          <h1 className="font-display font-medium text-h2">Deze pagina bestaat niet</h1>
          <p className="text-body text-sm text-black/80 max-w-lg">De pagina die je zoekt is verplaatst, verwijderd of heeft nooit bestaan. Ga terug naar home of gebruik één van de snelkoppelingen hieronder.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/home" className="group flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-2 hover:bg-purple transition-colors">
            <span>Terug naar home</span>
            <AnimatedArrow size="xs" className="text-white" />
          </Link>
          <Link href="/kennisbank" className="flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-2 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
            Kennisbank
          </Link>
          <Link href="/mijn-pad" className="flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-2 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
            Mijn pad
          </Link>
          <Link href="/team" className="flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-2 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
            Team
          </Link>
        </div>
      </div>
    </div>
  );
}
