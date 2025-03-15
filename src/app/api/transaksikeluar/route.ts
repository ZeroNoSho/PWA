import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isDelet = searchParams.get("isDelet") === "true";
  let startDate: Date | undefined = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate") as string)
    : undefined;
  let endDate: Date | undefined = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate") as string)
    : undefined;
  const isHigh = searchParams.get("isHigh") === "true";
  const filter = searchParams.get("filter");

  try {
    if (isHigh) {
      const transaksikeluar = await prisma.transaksikeluar.findMany({
        where: { isDelet },
        include: { barang: true },
      });

      const groupedData = transaksikeluar.reduce<{ [key: string]: any }>(
        (acc, item: any) => {
          const idbarang = item.barang?.idbarang;
          if (!idbarang) return acc;

          if (!acc[idbarang]) {
            acc[idbarang] = {
              idbarang,
              totalQuantity: 0,
              barangname: item.barang.barangname,
            };
          }
          acc[idbarang].totalQuantity += item.quantity;
          return acc;
        },
        {}
      );

      const sortedStock = Object.values(groupedData).sort(
        (a, b) => b.totalQuantity - a.totalQuantity
      );

      return NextResponse.json({ status: 200, data: sortedStock });
    }

    if (!isHigh) {
      const barang = await prisma.barang.findMany({
        orderBy: { stock: "asc" },
      });
      return NextResponse.json({ status: 200, data: barang });
    }

    const now = new Date();
    switch (filter) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
    }

    const transaksikeluar = await prisma.transaksikeluarnote.findMany({
      where: { isDelet, createdAt: { gte: startDate, lte: endDate } },
      select: {
        total: true,
        ppn: true,
        idtransaksikeluarnote: true,
        pembayaran: true,
        lokasi: true,
        name: true,
        transaksikeluar: {
          select: {
            idtransaksi: true,
            quantity: true,
            barang: {
              select: {
                idbarang: true,
                barangname: true,
                stock: true,
                harga: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    const totalSetelahPPN = transaksikeluar.reduce(
      (acc, e) => acc + (e.total - e.ppn),
      0
    );

    return NextResponse.json({
      status: 200,
      data: transaksikeluar,
      details: { jumlah: transaksikeluar.length, total: totalSetelahPPN },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 400,
      message: "error",
      error: error.message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const transaksikeluarnote = await prisma.transaksikeluarnote.create({
      data: {
        pembayaran: res.pembayaran,
        lokasi: res.lokasi,
        name: res.name,
        total: res.total,
        isDelet: false,
        ppn: res.ppn,
      },
    });

    await prisma.transaksikeluar.createMany({
      data: res.data.map((item: any) => ({
        ...item,
        idtransaksimasuknote: transaksikeluarnote.idtransaksikeluarnote,
      })),
    });

    await Promise.all(
      res.data.map((e: any) =>
        prisma.barang.update({
          where: { idbarang: e.idbarang },
          data: { stock: { decrement: e.quantity } },
        })
      )
    );

    return NextResponse.json({ status: 200, message: "registrasi success" });
  } catch (error: any) {
    return NextResponse.json({
      status: 400,
      message: "registrasi error",
      error: error.message,
    });
  }
}
