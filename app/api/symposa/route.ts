import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create Symposa
async function createSymposa(data: { Topic: string; text: string }) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Symposa",
      ID.unique(),
      data
    );

    return response;
  } catch (error) {
    console.error("Error creating Symposa", error);
    throw new Error("Failed to create Symposa");
  }
}

// Fetch Symposa
async function fetchSymposa() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Symposa",
      [Query.orderDesc("$createdAt")]
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching Symposa", error);
    throw new Error("Failed to fetch Symposa");
  }
}

export async function POST(req: Request) {
  try {
    const { Topic, text } = await req.json();
    const data = { Topic, text };
    const response = await createSymposa(data);
    return NextResponse.json({ message: "Symposa created", response });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to create Symposa" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const symposa = await fetchSymposa();
    return NextResponse.json({ symposa });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch Symposa" },
      { status: 500 }
    );
  }
}
