"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter in client component

export default function CreatePage() {
    const [formData, setFormData] = useState({ text: "", Topic: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/symposa', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add topic');
            }

            await response.json();
            router.push("/"); 
        } catch (error) {
            setError("Failed to add topic. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold my-8">Add New Topic</h2>

            <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Term"
                    className="py-1 px-4 border rounded-md"
                />

                <textarea
                    name="Topic"
                    value={formData.Topic}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Topic"
                    className="py-1 px-4 border rounded-md resize-none"
                ></textarea>

                <button
                    type="submit"
                    className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
                >
                    {isLoading ? "Adding..." : "Add Topic"}
                </button>
            </form>
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
}

