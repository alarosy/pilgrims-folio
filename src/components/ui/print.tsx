import { useId, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "../ornament/Icon";
import { useLang, type Lang } from "~/lib/lang";

/**
 * Print furniture from 17th-century books, used as working navigation:
 * running head (where you are), catchword (what comes next), signature mark,
 * marginal gloss, Finis, and the Specimen stamp for placeholder content.
 */

export function RunningHead({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="running-head">
      <span>{left}</span>
      <span className="italic">{right}</span>
    </div>
  );
}

/** The first word of the next page, printed at the foot: here, a real "next" link. */
export function Catchword({
  to,
  word,
  full,
  kicker = "Next",
}: {
  to: string;
  /** The catchword itself: the first word of the next title. */
  word: string;
  /** The full title, for the accessible name. */
  full: string;
  kicker?: string;
}) {
  return (
    <div className="catchword">
      <span className="label text-ink-muted">{kicker}</span>
      <Link to={to} className="ink-link inline-flex items-center gap-2 font-display text-h4 italic" aria-label={`${kicker}: ${full}`}>
        {word}
        <Icon name="manicule" size={26} />
      </Link>
    </div>
  );
}

export function SignatureMark({ children }: { children: ReactNode }) {
  return <p className="signature-mark text-center">{children}</p>;
}

/**
 * A word with a marginal gloss. On wide screens the note is meant to sit in
 * the margin (the page layout places it); on phones it opens beneath the line.
 */
export function Gloss({ word, note }: { word: string; note: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <button
        type="button"
        className="gloss-word cursor-help bg-transparent p-0 font-[inherit] text-[length:inherit] text-[color:inherit]"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {word}
      </button>
      <span id={id} hidden={!open} className="gloss-note block ps-4">
        <span className="not-italic text-ornament-ink">{word}:</span> {note}
      </span>
    </>
  );
}

export function Finis({ lang = "en" }: { lang?: "en" | "ar" }) {
  return (
    <p className="text-center">
      {lang === "ar" ? (
        <span className="font-arabic text-h3 font-bold" lang="ar">
          تمّت
        </span>
      ) : (
        <span className="finis" lang="la">
          Finis
        </span>
      )}
    </p>
  );
}

/** Marks example content. Speaks the page's language unless told otherwise. */
export function SpecimenStamp({ lang }: { lang?: Lang }) {
  const pageLang = useLang();
  const l = lang ?? pageLang;
  return (
    <span
      className="specimen-stamp"
      lang={l}
      title={l === "ar" ? "محتوى نموذجي: استبدله بمحتواك" : "Example content: replace it with your own"}
    >
      {l === "ar" ? "نموذج" : "Specimen"}
    </span>
  );
}
