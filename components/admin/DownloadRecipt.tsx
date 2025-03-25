"use client";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
//@ts-ignore
import { saveAs } from "file-saver";
import React from "react";

interface User {
  fullName: string;
  email: string;
}

interface Book {
  title: string;
}

interface Props {
  user: User;
  book: Book;
  borrowDate: string;
  returnDate?: string | null;
}

const DownloadReceipt: React.FC<Props> = ({
  user,
  book,
  borrowDate,
  returnDate,
}) => {
  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 500]); // Width x Height

    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Function to draw text
    const drawText = (
      text: string,
      x: number,
      y: number,
      isBold = false,
      size = 12
    ) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(1, 1, 1), // White text for dark theme
      });
    };

    // Background color (dark theme)
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.1, 0.1, 0.15), // Dark navy background
    });

    // Receipt Header
    drawText("BookWise", 50, height - 40, true, 16);
    drawText("Borrow Receipt", 50, height - 60, true, 14);
    drawText(`Receipt ID: #${Math.random().toString(36).substr(2, 10)}`, 50, height - 80, false, 10);
    drawText(`Date Issued: ${borrowDate}`, 50, height - 100, false, 10);

    // Book Details Section
    drawText("Book Details", 50, height - 130, true, 12);
    drawText(`Title: ${book.title}`, 50, height - 150);
    drawText(`Borrowed on: ${borrowDate}`, 50, height - 210);
    drawText(`Due Date: ${returnDate ?? "Not Returned"}`, 50, height - 230);

    // Terms
    drawText("Terms", 50, height - 280, true, 12);
    drawText("- Please return the book by the due date.", 50, height - 300, false, 10);
    drawText("- Lost or damaged books may incur replacement costs.", 50, height - 320, false, 10);

    // Generate and Download PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "BookWise_Receipt.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
    >
      Generate
    </button>
  );
};

export default DownloadReceipt;
