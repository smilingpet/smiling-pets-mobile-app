import { ProductGridSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <div className="px-4 py-4">
      <div className="skeleton mb-4 h-8 w-1/2 rounded-full" />
      <ProductGridSkeleton count={6} />
    </div>
  );
}
