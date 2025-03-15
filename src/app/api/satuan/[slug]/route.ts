import prisma from "../../../../utils/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const res: { satuanname: string } = await request.json();
    const { slug } = params;

    const satuan = await prisma.satuan.update({
      where: { idsatuan: slug },
      data: { satuanname: res.satuanname },
    });

    return NextResponse.json(
      { status: 200, message: "update success", data: satuan },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "update error", data: [], error: error.message },
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

    const satuan = await prisma.satuan.update({
      where: { idsatuan: slug },
      data: { isDelet: true },
    });

    return NextResponse.json(
      { status: 200, message: "delete success", data: satuan },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "delete error", data: [], error: error.message },
      { status: 400 }
    );
  }
}
