"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  console.log("this is the search param", searchParams);
  console.log("this is the session id", sessionId);
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-lg w-full bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-xl p-10 text-center border border-gray-800">
        <CheckCircle2 className="mx-auto text-green-400 w-16 h-16 mb-6" />

        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Subscription Successful 🎉
        </h1>

        <p className="text-gray-400 mb-6">
          Thank you for subscribing! <br /> Your payment was processed
          successfully.
        </p>

        {/* {sessionId && (
          <p className="text-sm text-gray-500 mb-6">
            Reference ID:{" "}
            <span className="font-mono text-purple-400">{sessionId}</span>
          </p>
        )} */}

        <Link
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
