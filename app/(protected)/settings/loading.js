import { AnimatedPageFallback } from "@/components/shared/animated-page-fallback";
import SettingsShimmer from "@/features/settings/SettingsShimmer";

export default function SettingsLoading() {
  return (
    <AnimatedPageFallback>
      <SettingsShimmer />
    </AnimatedPageFallback>
  );
}
