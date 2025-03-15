import prisma from "../../../../utils/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { slug: string };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const res = await request.json();
    const { slug } = params;

    const kategori = await prisma.kategori.update({
      where: {
        idkategori: slug,
      },
      data: {
        kategoriname: res.kategoriname,
      },
    });

    return NextResponse.json(
      { status: 200, message: "update success", data: kategori },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "update error", data: [], error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { slug } = params;

    const kategori = await prisma.kategori.update({
      where: {
        idkategori: slug,
      },
      data: { isDelet: true },
    });

    return NextResponse.json(
      { status: 200, message: "delete success", data: kategori },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "delete error", data: [], error: error.message },
      { status: 400 }
    );
  }
}
