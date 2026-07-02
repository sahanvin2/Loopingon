export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-50/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="h-16 w-16 animate-spin rounded-full border-4 border-text-200"
            style={{ borderTopColor: "#c86482" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary-600"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
                opacity="0.3"
              />
              <path
                d="M12 2L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-serif font-semibold text-text-800">
            Kandyam
          </p>
          <p className="mt-1 text-sm text-muted-500">
            Loading your amazing products...
          </p>
        </div>

        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-primary-400"
              style={{
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
