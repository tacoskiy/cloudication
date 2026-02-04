"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";

const TestAPI = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {(
    async () => {
      try {
        const res = await apiFetch("/api/hello");
        setMessage(res.message);
      } finally {
        setLoading(false);
      }
    }
  )(); }, []);

  return (
    <section className="w-full h-dvh flex justify-center items-center">
      {
        loading
          ? <p>Loading...</p>
          : <p>{message}</p>
      }
    </section>
  );
}

export default TestAPI;