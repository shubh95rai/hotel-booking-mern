import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";

export default function Loader() {
  const { navigate } = useAppContext();
  const { nextUrl } = useParams();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 8000);
    }
  }, [nextUrl]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-t-primary border-4 border-gray-300"></div>
    </div>
  );
}
