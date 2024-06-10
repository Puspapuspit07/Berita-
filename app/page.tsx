"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Symposa {
  $id: string;
  Topic: string;
  text: string;
}

export default function Home() {
  const [symposa, setSymposa] = useState<Symposa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSymposa = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/symposa");
        if (!response.ok) {
          throw new Error("Failed to fetch Symposa");
        }
        const data = await response.json();
        setSymposa(data?.symposa); // Ensure your API returns data in the expected format
      } catch (error) {
        console.log("Error: ", error);
        setError("Failed to load Symposa. Please try reloading the page");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSymposa();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/item/${id}`, { method: "DELETE" });
      setSymposa((prevSymposa) => prevSymposa?.filter((i) => i.$id !== id));
    } catch (error) {
      setError("Failed to delete Symposa. Please try again");
    }
  };

  return (
    <div>
      {error && <p className="py-4 text-red-600">{error}</p>}
      
      {isLoading ? (
        <p>Loading Symposa</p>
      ) : symposa?.length > 0 ? (
        symposa.map((item) => (
          <div key={item.$id} className="p-4 my-2 rounded-md border-b leading-9">
            <div className="font-bold">{item.Topic}</div>
            <div>{item.text}</div>
            <div className="flex gap-4 mt-4 justify-end">
              <Link className="bg-slate-200 px-4 py-2 rounded-md uppercase text-small font-bold tracking-widest" 
              href={`/edit/${item.$id}`}>
                Edit
              </Link>
              <button onClick={() => handleDelete(item.$id)} className="bg-purple-600 text-white px-4 py-2 rounded-md uppercase text-small font-bold tracking-widest">
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No Symposa Found</p>
      )}
    </div>
  );
}
