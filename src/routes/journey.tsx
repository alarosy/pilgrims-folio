import { InkWrite } from "~/components/ui/InkWrite";
import type { Route } from "./+types/journey";
import { DropCapParagraph } from "~/components/ornament/DropCap";
import { Hedera } from "~/components/ornament/Fleuron";
import { HeadPiece } from "~/components/ornament/HeadPiece";
import { RunningHead } from "~/components/ui/print";
import { data } from "~/data";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { langOf, textAttrs, useLang } from "~/lib/lang";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langOf(location.pathname);
  return [{ title: `${ROOMS[lang].journey.title} · ${STRINGS[lang].siteTitle}` }];
};

/** Ali's own story. The site never writes it for him. */
export default function Journey() {
  const t = useT();
  const r = useRoomT().journey;
  const lang = useLang();
  const story = (lang === "ar" ? data.journey.storyAr || data.journey.story : data.journey.story).trim();
  const paras = story ? story.split(/\n\s*\n/) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
      <RunningHead left={r.title} right={t.siteTitle} />
      <header className="mt-10 text-center">
        <InkWrite as="h1" text={r.title} />
        <p className="mt-4 text-lead text-ink-muted">{r.lead}</p>
        <HeadPiece className="mx-auto mt-10 max-w-xl" />
      </header>

      <div className="mt-12">
        {paras.length ? (
          <div className="space-y-5 text-lead">
            {paras.map((p, i) =>
              i === 0 && lang === "en" && textAttrs(p).lang === "en" ? (
                <DropCapParagraph key={i}>{p}</DropCapParagraph>
              ) : (
                <p key={i} {...textAttrs(p)}>
                  {p}
                </p>
              ),
            )}
          </div>
        ) : (
          <div className="card p-6 text-center sm:p-8">
            <p className="font-heading text-h4">{r.empty}</p>
            <p className="mt-3 text-caption text-ink-muted">{r.howTo}</p>
          </div>
        )}
      </div>

      <section aria-labelledby="facts-h" className="mt-14">
        <h2 id="facts-h" className="text-h4">
          {r.facts}
        </h2>
        <ul className="mt-4 space-y-3">
          {[r.fact1, r.fact2, r.fact3].map((f) => (
            <li key={f} className="flex gap-3">
              <Hedera size={18} turned className="icon-directional mt-1.5 shrink-0 text-ornament-ink" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
