import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Fetch a specific Symposa
async function fetchSymposa(id: string) {
  try {
    const symposa = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Symposa",
      id
    );
    return symposa;
  } catch (error) {
    console.error("Error fetching Symposa", error);
    throw new Error("Failed to fetch Symposa");
  }
}

// Delete a specific Symposa
async function deleteSymposa(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Symposa",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting Symposa", error);
    throw new Error("Failed to delete Symposa");
  }
}

// Update a specific Symposa
async function updateSymposa(id: string, data: { Topic: string; text: string }) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Symposa",
      id,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating Symposa", error);
    throw new Error("Failed to update Symposa");
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const symposa = await fetchSymposa(id);
    return NextResponse.json({ symposa });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: "Failed to fetch Symposa" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteSymposa(id);
    return NextResponse.json({ message: "Symposa deleted" });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json({ error: "Failed to delete Symposa" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const symposa = await req.json();
    await updateSymposa(id, symposa);
    return NextResponse.json({ message: "Symposa updated" });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json({ error: "Failed to update Symposa" }, { status: 500 });
  }
}
