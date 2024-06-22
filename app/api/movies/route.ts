import client from "@/lib/client";
import { Databases, Query } from "appwrite";
import { NextResponse } from "next/server";

const db = new Databases(client);

export const GET = async (req: Request) => {
  try {
    const res = await db.listDocuments(
      process.env.APP_WRITE_DATABASE_ID as string,
      "667673700010a80b0910",
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