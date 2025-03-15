import prisma from "../../../../utils/prisma";
import { NextResponse } from "next/server";

interface RequestParams {
  params: { slug: string };
}

export async function PATCH(request: Request, { params }: RequestParams) {
  try {
    const res = await request.json();
    const { slug } = params;

    const transaksimasuk = await prisma.transaksimasuk.update({
      where: { idtransaksi: slug },
      data: {
        quantity: res.quantity,
        idbahan: res.idbahan,
        harga: res.harga,
      },
    });

    return NextResponse.json(
      { status: 200, message: "update success", data: transaksimasuk },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: "update error", error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: RequestParams) {
  try {
    const { slug } = params;

    const transaksimasuk = await prisma.transaksimasuknote.update({
      where: { idtransaksimasuknote: slug },
      data: { isDelet: true },
    });

    return NextResponse.json(
      { status: 200, message: "delete success", data: transaksimasuk },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: "delete error", error: (error as Error).message },
      { status: 400 }
    );
  }
}
