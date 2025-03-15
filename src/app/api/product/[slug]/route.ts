import prisma from "../../../../utils/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const res: Partial<{
      barangname: string;
      stock: number;
      deskripsi: string;
      harga: number;
      idsatuan: string[];
      idkategori: string[];
    }> = await request.json();

    const { slug } = params;

    // Ambil data lama jika tidak ada di request
    const barangOld = await prisma.barang.findUnique({
      where: { idbarang: slug },
    });

    if (!barangOld) {
      return NextResponse.json(
        { status: 404, message: "Barang not found", data: [] },
        { status: 404 }
      );
    }

    const barang = await prisma.barang.update({
      where: { idbarang: slug },
      data: {
        barangname: res.barangname ?? barangOld.barangname,
        stock: res.stock ?? barangOld.stock,
        deskripsi: res.deskripsi ?? barangOld.deskripsi,
        harga: res.harga ?? barangOld.harga,
        idsatuan: res?.idsatuan ?? barangOld.idsatuan,
        idkategori: res?.idkategori ?? barangOld.idkategori,
      },
    });

    return NextResponse.json(
      { status: 200, message: "Update success", data: barang },
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

    const barang = await prisma.barang.update({
      where: { idbarang: slug },
      data: { isDelet: true },
    });

    return NextResponse.json(
      { status: 200, message: "Delete success", data: barang },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "Delete error", error: error.message, data: [] },
      { status: 400 }
    );
  }
}
