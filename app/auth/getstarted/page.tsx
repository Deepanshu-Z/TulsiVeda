import { Suspense } from "react";
import Display from "../_components/Display";

export default function page() {
  return (
    <Suspense>
      <Display />
    </Suspense>
  );
}
