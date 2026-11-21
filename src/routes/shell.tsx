import { Outlet } from "react-router";
import { Shell } from "~/components/layout/Shell";

/** Every page of the Folio (in both languages) sits inside the shell. */
export default function ShellLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
