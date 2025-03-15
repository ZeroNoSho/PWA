import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isDelet = searchParams.get("isDelet") || "";
  const search = searchParams.get("search") || "";

  try {
    const bahan = await prisma.bahan.findMany({
      where: search
        ? {
            bahanname: { contains: search, mode: "insensitive" },
            isDelet: Boolean(isDelet),
          }
        : { isDelet: Boolean(isDelet) },
    });

    return NextResponse.json(
      { status: 200, message: "success", data: bahan },
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

    const bahan = await prisma.bahan.create({
      data: {
        bahanname: res.bahanname,
        deskripsi: res.deskripsi,
        isDelet: false,
      },
    });

    return NextResponse.json(
      { status: 200, message: "registrasi success", data: bahan },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: "registrasi error", data: [] },
      { status: 400 }
    );
  }
}
