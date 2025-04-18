import { Suspense } from "react";
import Reservation from "./page";

export default function Layout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reservation />
    </Suspense>
  );
}
