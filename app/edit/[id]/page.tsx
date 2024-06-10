"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";

export default function EditPage({ params }: { params: { id: string } }) {
    const [formData, setFormData] = useState({ text: "", Topic: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { id } = params;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/symposa/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch topic data');
                }
                const data = await response.json();
                setFormData({ text: data.text, Topic: data.Topic });
            } catch (error) {
                setError('Failed to load topic data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
            const response = await fetch(`/api/symposa/${id}`, {
                method: 'PUT', // Assuming you're using PUT for updating
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update topic');
            }

            await response.json();
            // Handle successful update, e.g., redirect or display success message
        } catch (error) {
            setError("Failed to update topic. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold my-8">Edit Topic</h2>

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
                    {isLoading ? "Updating..." : "Update Topic"}
                </button>
            </form>
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
}
