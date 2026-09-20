import { AnimatedPageFallback } from "@/components/shared/animated-page-fallback";
import DashboardShimmer from "@/features/dashboard/DashboardShimmer";

export default function DashboardLoading() {
  return (
    <AnimatedPageFallback>
      <DashboardShimmer />
    </AnimatedPageFallback>
  );
}
