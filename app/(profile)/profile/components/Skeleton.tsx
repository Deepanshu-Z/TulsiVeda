import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div className="h-screen  w-full justify-center items-center flex flex-col space-y-3">
      <Skeleton className="h-[80%] w-full rounded-xl overflow-hidden" />
    </div>
  );
}

export default SkeletonCard;
