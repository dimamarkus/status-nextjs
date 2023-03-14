import type { ExampleReview } from "#/lib/types/examples";
import { ProductRating } from "#/ui/examples/product-rating";

export const ProductReviewCard = ({ review }: { review: ExampleReview }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <div className="h-6 w-6 rounded-full bg-gray-700" />
          <div className="text-sm text-white">{review.name}</div>
        </div>

        {review.rating ? <ProductRating rating={review.rating} /> : null}
      </div>

      <div className="text-gray-400">{review.text}</div>
    </div>
  );
};
