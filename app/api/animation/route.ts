import client from "@/lib/client";
import { Databases, ID, Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

const db = new Databases(client);

export async function GET(req:Request) {

  try {
    const response = await db.listDocuments(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_ANIMATION_COLLECTION_ID as string,
      [Query.orderAsc("$createdAt")]
    );

    const data = response.documents;
  
    return NextResponse.json(data);
  }
  catch(err){
    return NextResponse.json(
      {error: err},
      {status: 500}
    );
  }

}


export const POST = async(req: Request) => {
  try {
    const data = await req.json();
    console.log(data)
    const res = await db.createDocument(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_ANIMATION_COLLECTION_ID as string,
      ID.unique(),
      {
        name: data.name,
        no_of_episodes: data.no_of_episodes,
        type: data.type,
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