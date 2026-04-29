const SubscriptionSummarySkeleton = () => {
  return (
    <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl sticky top-10 space-y-6 animate-pulse">
      {/* Title */}
      <div className="h-5 w-48 bg-gray-200 rounded" />

      {/* Plan List */}
      <div className="space-y-4">
        {/* Selected Plan */}
        <div>
          <div className="h-3 w-24 bg-gray-200 rounded mb-3" />

          <div className="p-4 rounded-xl border-2 border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Other Plans */}
        <div>
          <div className="h-3 w-24 bg-gray-200 rounded mb-3" />

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                  <div className="h-4 w-12 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-5 rounded-xl space-y-4 border border-gray-100">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>

        <div className="flex justify-between">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>

        <div className="pt-3 border-t border-gray-200 flex justify-between">
          <div className="h-4 w-28 bg-gray-300 rounded" />
          <div className="h-6 w-20 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Button */}
      <div className="h-12 w-full bg-gray-300 rounded" />

      {/* Note */}
      <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto" />
    </div>
  );
};

export default  SubscriptionSummarySkeleton;