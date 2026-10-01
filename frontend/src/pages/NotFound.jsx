import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
      {" "}
      <div>
        {" "}
        <h1 className="text-9xl font-bold text-primary-100 mb-4">404</h1>{" "}
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Page Not Found
        </h2>{" "}
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          {" "}
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.{" "}
        </p>{" "}
        <Link
          to="/"
          className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition inline-block"
        >
          {" "}
          Go Back Home{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}
