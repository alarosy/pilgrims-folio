import type { ReactNode } from "react";
import { moduleLabel } from "~/data";
import type { Word } from "~/data/types";
import { useRoomT } from "~/i18n/rooms";
import { SpecimenStamp } from "./print";

/** The Shakespeare line with the word picked out in ink. */
function Marked({ line, term }: { line: string; term: string }) {
  const i = line.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return <>{line}</>;
  return (
    <>
      {line.slice(0, i)}
      <span className="word-mark">{line.slice(i, i + term.length)}</span>
      {line.slice(i + term.length)}
    </>
  );
}

export function WordFront({ word, placeholder, big = false }: { word: Word; placeholder?: boolean; big?: boolean }) {
  return (
    <div className="flex h-full flex-col p-5 sm:p-6" lang="en" dir="ltr">
      <div className="flex items-start justify-between gap-3">
        <p className={`font-display ${big ? "text-h1" : "text-h2"} leading-none`}>{word.term}</p>
        {placeholder ? <SpecimenStamp /> : null}
      </div>
      {word.line ? (
        <p className="mt-5 font-heading text-lead italic leading-snug">
          “<Marked line={word.line} term={word.term} />”
        </p>
      ) : null}
      {word.source ? <p className="label mt-auto pt-4 text-ink-muted">{word.source}</p> : null}
    </div>
  );
}

export function WordBack({ word, module }: { word: Word; module?: string }) {
  const r = useRoomT().lexicon;
  const row =(label: string, body: ReactNode, l?: "ar") =>
    body ? (
      <div>
        <dt className="label text-ink-muted">{label}</dt>
        <dd className="mt-0.5" lang={l} dir={l === "ar" ? "rtl" : undefined}>
          {body}
        </dd>
      </div>
    ) : null;
  return (
    <div className="h-full p-5 sm:p-6">
      <p className="font-display text-h4" lang="en">
        {word.term}
      </p>
      <dl className="mt-3 space-y-3">
        {row(r.meaning, <span lang="en">{word.meaning}</span>)}
        {row(r.example, word.example ? <span lang="en" className="italic">{word.example}</span> : null)}
        {row(r.arabic, word.arabicNote ?? null, "ar")}
        {row(r.source, word.source ? <span lang="en">{word.source}{module ? ` · ${moduleLabel(module)}` : ""}</span> : null)}
      </dl>
    </div>
  );
}
