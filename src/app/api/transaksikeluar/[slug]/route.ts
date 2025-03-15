import prisma from "../../../../utils/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const res = await request.json();
    const { slug } = params;

    const transaksikeluar = await prisma.transaksikeluar.update({
      where: { idtransaksi: slug },
      data: {
        quantity: res.quantity,
        idbarang: res.idbarang,
      },
    });

    return NextResponse.json(
      { status: 200, message: "Update success", data: transaksikeluar },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "Update error", error: error.message, data: [] },
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

    // Tandai transaksi keluar note sebagai terhapus
    await prisma.transaksikeluarnote.update({
      where: { idtransaksikeluarnote: slug },
      data: { isDelet: true },
    });

    // Ambil semua transaksi keluar yang terkait dengan transaksi masuk note
    const transaksikeluar = await prisma.transaksikeluar.findMany({
      where: { idtransaksimasuknote: slug },
      select: {
        idtransaksi: true,
        quantity: true,
        barang: {
          select: {
            idbarang: true,
            barangname: true,
            stock: true,
          },
        },
      },
    });

    // Tandai transaksi keluar sebagai terhapus
    await prisma.transaksikeluar.updateMany({
      where: { idtransaksimasuknote: slug },
      data: { isDelet: true },
    });

    // Mapping data barang yang akan diperbarui
    const newTransaksiKeluar = transaksikeluar.map((e: any) => ({
      quantity: e.quantity,
      idbarang: e.barang.idbarang,
      barangname: e.barang.barangname,
      stock: e.barang?.stock,
    }));

    // Kembalikan stok barang
    const increaseQuantity = await Promise.all(
      newTransaksiKeluar.map((e) =>
        prisma.barang.update({
          where: { idbarang: e.idbarang },
          data: { stock: { increment: e.quantity } },
        })
      )
    );

    return NextResponse.json(
      { status: 200, message: "Delete success", data: increaseQuantity },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "Delete error", error: error.message, data: [] },
      { status: 400 }
    );
  }
}
