import { AnimatedPageFallback } from "@/components/shared/animated-page-fallback";
import TransactionsShimmer from "@/features/transactions/TransactionsShimmer";

export default function TransactionsLoading() {
  return (
    <AnimatedPageFallback>
      <TransactionsShimmer />
    </AnimatedPageFallback>
  );
}
