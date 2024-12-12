import Image from "next/image";

interface ErrorStateProps {
  title?: string;
  message?: string;
  status?: string;
}

export default function ErrorState({ 
  title = "Oops! Our pets are chasing bugs...", 
  message = "Something went wrong", 
  status 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative w-64 h-64 mb-6">
        <Image
          src="/error-pet.svg"
          alt="Cute pet chasing bugs"
          fill
          priority
          className="object-contain"
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        {title}
      </h2>
      <p className="text-gray-600 text-center mb-2">
        {message}
      </p>
      {status && (
        <p className="text-sm text-gray-500 mt-2">
          Status: {status}
        </p>
      )}
    </div>
  );
} 