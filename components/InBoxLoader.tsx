function InBoxLoader() {
  return (
    <div className="z-50 rounded-xl grid h-full w-full place-items-center bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Gradient Spinner */}
        <div className="relative">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-r-cyan-400" />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-gray-900">Loading...</p>
          <p className="text-sm text-gray-600">
            Please wait while we load your data
          </p>
        </div>

        {/* Pulse Dots */}
        <div className="flex space-x-1">
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export default InBoxLoader;
