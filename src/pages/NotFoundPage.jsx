import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export default function NotFoundPage() {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = "/";
    }
  }, [seconds]);

  return (
    <div className="h-[90dvh] w-[100dvw] flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <div className="flex items-center gap-3 mb-6 flex-wrap justify-center">
        <img src="/icon.svg" alt="PdfBuddy Logo" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          PdfBuddy
        </h1>
      </div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-red-600">404</h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mt-2">Page Not Found</p>

      <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2">
        Redirecting you to home in{" "}
        <span className="font-semibold">{seconds}</span> seconds...
      </p>

      <a
        href="/"
        className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base md:text-lg"
      >
        Go Home Now
      </a>
    </div>
  );
}
