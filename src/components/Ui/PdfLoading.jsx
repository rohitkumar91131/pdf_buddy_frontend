import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PdfSkeleton({ pages = 1 }) {
  return (
    <div className="flex flex-col gap-6 p-4 w-full items-center">
      <div className="w-full max-w-3xl flex flex-col gap-2 mb-4">
        <Skeleton height={30} width={250} />  
        <div className="flex gap-4">
          <Skeleton height={20} width={100} /> 
          <Skeleton height={20} width={80} />
        </div>
      </div>

      <div className="w-full max-w-3xl flex gap-3 mb-4">
        <Skeleton height={35} width={80} />
        <Skeleton height={35} width={80} />
        <Skeleton height={35} width={80} />
      </div>


      {[...Array(pages)].map((_, i) => (
        <div
          key={i}
          className="w-[600px] h-[800px] rounded-lg shadow-md overflow-hidden"
        >
          <Skeleton height="100%" width="100%" />
        </div>
      ))}
    </div>
  );
}

export default PdfSkeleton;
