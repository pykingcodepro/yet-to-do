import client from "@/lib/client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const db = new Databases(client);

export async function PUT(req:Request, {params}: {params: {id: string}}){
  try {
    const id = params.id;
    const data = await req.json();
    console.log(await data);
    const res = await db.updateDocument(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_COMICS_COLLECTION_ID as string,
      id,
      {
        name: data.name,
        no_of_chapters: data.no_of_chapters,
        is_done: data.is_done
      }
    );
    return NextResponse.json(data);
  }
  catch(err) {
    return NextResponse.json(
      {error: err},
      {status: 500}
    );
  }
}

export async function DELETE(req: Request, {params}: {params: {id: string}}){
  try {

    const id = params.id;
    const res = await db.deleteDocument(
      process.env.APP_WRITE_DATABASE_ID as string,
      process.env.APP_WRITE_COMICS_COLLECTION_ID as string,
      id
    );
    return NextResponse.json({messase: "deleted"});
    
  } catch (error) {
    return NextResponse.json(
      {error: error},
      {status: 500}
    )
  }
}