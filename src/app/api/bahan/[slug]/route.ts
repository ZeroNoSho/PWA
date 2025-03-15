import prisma from "../../../../utils/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const res = await request.json();
    const { slug } = params;

    const bahanOld = await prisma.bahan.findFirst({
      where: { idbahan: slug },
    });

    if (!bahanOld) {
      return NextResponse.json(
        { status: 404, message: "Data not found", data: null },
        { status: 404 }
      );
    }

    const bahan = await prisma.bahan.update({
      where: { idbahan: slug },
      data: {
        bahanname: res.bahanname ?? bahanOld.bahanname,
        deskripsi: res.deskripsi ?? bahanOld.deskripsi,
      },
    });

    return NextResponse.json(
      { status: 200, message: "Update success", data: bahan },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: "Update error", data: [] },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const bahan = await prisma.bahan.update({
      where: {
        idbahan: slug,
      },
      data: { isDelet: true },
    });

    return NextResponse.json(
      { status: 200, message: "Delete success", data: bahan },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: "Delete error", data: [] },
      { status: 400 }
    );
  }
}
