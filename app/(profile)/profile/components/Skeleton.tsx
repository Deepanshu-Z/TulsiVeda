import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-screen w-screen rounded-xl overflow-hidden" />
    </div>
  );
}

export default SkeletonCard;
