import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export const generatePDF = (data) => {
  const docDefinition = {
    content: [
      { text: "Struk Pembelian", style: "header" },

      {
        text: ` ${data.name} - ${data.lokasi} - ${data.pembayaran}`,
        style: "subheader",
        margin: [0, 5],
      },
      {
        text: `Tanggal: ${new Date().toLocaleString()}`,
        style: "subheader",
      },

      { text: "=====================================", style: "divider" },

      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              { text: "Item", bold: true, margin: [0, 5] },
              { text: "Harga", bold: true, alignment: "right", margin: [0, 5] },
            ],
            ...data.items.map((item, index) => [
              { text: `${index + 1}. ${item.name}`, margin: [0, 2] },
              {
                text: `Rp ${item.qty * item.price} (${item.qty} x ${
                  item.price
                })`,
                alignment: "right",
                margin: [0, 5],
              },
            ]),
          ],
        },
        layout: "noBorders",
      },

      { text: "=====================================", style: "divider" },

      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              { text: "", border: [false, false, false, false] },
              {
                text: `Sub Total: Rp ${data.total}`,
                bold: true,
                alignment: "right",
                margin: [0, 5],
              },
            ],
            [
              { text: "", border: [false, false, false, false] },
              {
                text: `PPN (10%): Rp ${data.ppn}`,
                bold: true,
                alignment: "right",
                margin: [0, 5],
              },
            ],
            [
              { text: "", border: [false, false, false, false] },
              {
                text: `Total: Rp ${data.total - data.ppn}`,
                bold: true,
                alignment: "right",
                margin: [0, 10],
              },
            ],
          ],
        },
        layout: "noBorders",
      },
    ],
    styles: {
      header: { fontSize: 14, bold: true, alignment: "center" },
      subheader: { fontSize: 10, italics: true, alignment: "center" },
      divider: { fontSize: 10, alignment: "center", margin: [0, 5] },
    },
  };

  pdfMake.createPdf(docDefinition).print();
};
