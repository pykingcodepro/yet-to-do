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
    console.log(data)
    const res = await db.createDocument(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_MOVIES_COLLECTION_ID as string,
      ID.unique(),
      {
        name: data.name,
        is_series: data.is_series,
        no_of_episodes: data.no_of_episodes,
        is_done: data.is_done
      }
    );
    return NextResponse.json({message: "ok"});
  } catch (err){
    return NextResponse.json(
      {error: err},
      {status: 500}
    )
  }
}