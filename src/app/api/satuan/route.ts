import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isDelet = searchParams.get("isDelet") || "";
  const search = searchParams.get("search") || "";

  try {
    const satuan = await prisma.satuan.findMany({
      where: search
        ? {
            satuanname: { contains: search, mode: "insensitive" },
            isDelet: Boolean(isDelet),
          }
        : { isDelet: Boolean(isDelet) },
    });

    return NextResponse.json(
      { status: 200, message: "success", data: satuan },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "error", data: [], error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const res: { satuanname: string } = await request.json();

    const satuan = await prisma.satuan.create({
      data: {
        satuanname: res.satuanname,
        isDelet: false,
      },
    });

    return NextResponse.json(
      { status: 200, message: "registrasi success", data: satuan },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 400,
        message: "registrasi error",
        data: [],
        error: error.message,
      },
      { status: 400 }
    );
  }
}
