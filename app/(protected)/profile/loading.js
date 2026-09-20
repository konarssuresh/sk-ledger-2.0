import { AnimatedPageFallback } from "@/components/shared/animated-page-fallback";
import ProfileShimmer from "@/features/profile/ProfileShimmer";

export default function ProfileLoading() {
  return (
    <AnimatedPageFallback>
      <ProfileShimmer />
    </AnimatedPageFallback>
  );
}
