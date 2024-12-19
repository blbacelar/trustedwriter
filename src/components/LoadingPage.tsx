import LoadingSpinner from "./LoadingSpinner";

const LoadingPage = () => {
  return (
    <div
      className="min-h-screen bg-gray-900 flex items-center justify-center"
      data-testid="loading-page"
    >
      <LoadingSpinner size="lg" className="border-white border-t-transparent" />
    </div>
  );
};

export default LoadingPage; 