import { index, layout, prefix, route, type RouteConfig } from "@react-router/dev/routes";

/** The same pages in each language. Arabic lives under /ar. */
const pages = (lang: "en" | "ar") => [
  index("routes/prologue.tsx", { id: `prologue-${lang}` }),
  route("map", "routes/map.tsx", { id: `map-${lang}` }),
  route("modules/:id", "routes/module.tsx", { id: `module-${lang}` }),
  route("commonplace", "routes/commonplace.tsx", { id: `commonplace-${lang}` }),
  route("lexicon", "routes/lexicon.tsx", { id: `lexicon-${lang}` }),
  route("lexicon/review", "routes/lexicon-review.tsx", { id: `lexicon-review-${lang}` }),
  route("sonnets", "routes/sonnets.tsx", { id: `sonnets-${lang}` }),
  route("sonnets/:id", "routes/sonnet.tsx", { id: `sonnet-${lang}` }),
  route("macbeth", "routes/macbeth.tsx", { id: `macbeth-${lang}` }),
  route("traditions", "routes/traditions.tsx", { id: `traditions-${lang}` }),
  route("folio", "routes/folio.tsx", { id: `folio-${lang}` }),
  route("journey", "routes/journey.tsx", { id: `journey-${lang}` }),
];

export default [
  layout("routes/shell.tsx", { id: "shell-en" }, pages("en")),
  ...prefix("ar", [layout("routes/shell.tsx", { id: "shell-ar" }, pages("ar"))]),
  route("style-guide", "routes/style-guide.tsx"),
] satisfies RouteConfig;
