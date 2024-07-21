import client from "@/lib/client";
import { Databases, ID, Query } from "appwrite";
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

export async function POST(req: Request){
  try {
    const data = await req.json();
    const response = await db.createDocument(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_BOOKS_COLLECTION_ID as string,
      ID.unique(),
      {
        name: data.name,
        author: data.author,
        no_of_pages: data.no_of_pages,
        is_done: data.is_done
      }
    );
    return NextResponse.json({message: "Data created"});

  } catch (err) {
    return NextResponse.json(
      {error: err},
      {status: 500}
    );
  }
}