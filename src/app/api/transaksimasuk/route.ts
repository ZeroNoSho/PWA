import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isDelet = searchParams.get("isDelet") === "true"; // Convert to boolean
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    const transaksimasuk = await prisma.transaksimasuknote.findMany({
      where: {
        isDelet,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate
            ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
            : undefined,
        },
      },
      include: {
        transaksimasuk: {
          include: {
            bahan: true,
          },
        },
      },
    });

    return NextResponse.json(
      { status: 200, message: "success", data: transaksimasuk },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: "error", error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const res = await request.json();

    const transaksimasuknote = await prisma.transaksimasuknote.create({
      data: {
        pembayaran: res.pembayaran,
        total: res.total,
        isDelet: false,
      },
    });

    const data = res.data.map((item: any) => ({
      ...item,
      idtransaksimasuknote: transaksimasuknote.idtransaksimasuknote,
    }));

    await prisma.transaksimasuk.createMany({ data });

    return NextResponse.json(
      { status: 200, message: "registrasi success", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: "registrasi error", error: (error as Error).message },
      { status: 400 }
    );
  }
}
