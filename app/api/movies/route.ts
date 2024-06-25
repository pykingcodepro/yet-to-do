import client from "@/lib/client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const db = new Databases(client);

export const GET = async (req: Request) => {
  try {
    const res = await db.listDocuments(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_MOVIES_COLLECTION_ID as string,
      [Query.orderAsc("$createdAt")]
    );
    return NextResponse.json(res.documents);
  }
  catch(err){
    return NextResponse.json(
      {error: err},
      {status: 500}
    )
  }
}

export const POST = async(req: Request) => {
  try {
    const data = await req.json();
    const res = await db.createDocument(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_MOVIES_COLLECTION_ID as string,
      ID.unique(),
      data
    );
    return NextResponse.json({message: "ok"});
  } catch (err){
    return NextResponse.json(
      {error: err},
      {status: 500}
    )
  }
}