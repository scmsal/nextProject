import { useDb } from "@/lib/db/providers";
import { getPropertyAggregates } from "@/lib/db/queries";

export default function AggregateSummaries() {
  const { db } = useDb();
  const handleAggregate = () => {
    console.log("handleAggregate clicked");
    if (!db) return <p>Database not initialized</p>;
    getPropertyAggregates(db);
  };
  return (
    <button className="border py-2 px-4" onClick={handleAggregate}>
      Calculate aggregates
    </button>
  );
}
