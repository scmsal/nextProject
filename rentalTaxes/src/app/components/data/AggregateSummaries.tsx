import { useDb } from "@/lib/db/providers";
import { getRevenueAggregates } from "@/lib/db/queries";

export default function AggregateSummaries() {
  const { loadRevenueAggregates } = useDb();
  const handleAggregate = async () => {
    console.log("handleAggregate clicked");
    await loadRevenueAggregates();
  };
  return (
    <button className="border py-2 px-4 w-2/5" onClick={handleAggregate}>
      Calculate aggregates
    </button>
  );
}
