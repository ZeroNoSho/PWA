import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isDelet = searchParams.get("isDelet") === "true";
  const search = searchParams.get("search") || "";

  try {
    const kategori = await prisma.kategori.findMany({
      where: search
        ? {
            kategoriname: { contains: search, mode: "insensitive" },
            isDelet,
          }
        : { isDelet },
    });

    return NextResponse.json(
      { status: 200, message: "success", data: kategori },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: "error", data: [] },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const res = await request.json();

    const kategori = await prisma.kategori.create({
      data: {
        kategoriname: res.kategoriname,
        isDelet: false,
      },
    });

    return NextResponse.json(
      { status: 200, message: "registrasi success", data: kategori },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        message: "registrasi error",
        data: [],
      },
      { status: 400 }
    );
  }
}
