import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.BOLD_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, currency } = await req.json();

    if (!orderId || !amount || !currency) {
      console.warn("⚠️ Faltan datos para generar hash:", {
        orderId,
        amount,
        currency,
      });
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const cadena = `${orderId}${amount}${currency}${SECRET_KEY}`;
    const hash = crypto.createHash("sha256").update(cadena).digest("hex");

    return NextResponse.json({ hash });
  } catch (error) {
    console.log("❌ Error generando el hash:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
