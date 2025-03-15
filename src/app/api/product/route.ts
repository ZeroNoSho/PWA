import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isDelet = searchParams.get("isDelet") === "true"; // Konversi string ke boolean
    const search = searchParams.get("search") || "";

    const barang = await prisma.barang.findMany({
      where: {
        barangname: search
          ? { contains: search, mode: "insensitive" }
          : undefined,
        isDelet,
      },
      include: {
        satuan: true,
        kategori: true,
      },
    });

    return NextResponse.json(
      { status: 200, message: "Success", data: barang },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 400, message: "Error", error: error.message, data: [] },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const res: {
      barangname: string;
      stock: number;
      deskripsi: string;
      harga: number;
      idkategori: string[];
      idsatuan: string[];
    } = await request.json();

    if (
      !res.barangname ||
      !res.stock ||
      !res.deskripsi ||
      !res.harga ||
      !res.idkategori ||
      !res.idsatuan
    ) {
      return NextResponse.json(
        { status: 400, message: "All fields are required", data: [] },
        { status: 400 }
      );
    }

    const barang = await prisma.barang.create({
      data: {
        barangname: res.barangname,
        stock: res.stock,
        deskripsi: res.deskripsi,
        harga: res.harga,
        idkategori: res.idkategori,
        idsatuan: res.idsatuan,
        isDelet: false,
      },
    });

    return NextResponse.json(
      { status: 200, message: "Registration success", data: barang },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 400,
        message: "Registration error",
        error: error.message,
        data: [],
      },
      { status: 400 }
    );
  }
}
