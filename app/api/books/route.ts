import client from "@/lib/client";
import { Databases, Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

const db = new Databases(client);

export async function GET(req: Request){

  try {
    const response = await db.listDocuments(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_BOOKS_COLLECTION_ID as string,
      [Query.orderAsc("$createdAt")]
    );
  
    const data = response.documents;
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {error: err},
      {status: 500}
    );
  }

}

