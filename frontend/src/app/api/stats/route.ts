import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const API = process.env.NEXT_PUBLIC_API_URL;

    if (!token) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    const r = await fetch(`${API}/api/stats`, {
      headers: {
        Cookie: `token=${token}`, 
      },
      credentials: "include",
    });

    // Lê o corpo como texto primeiro, para tratar casos de HTML
    const text = await r.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Resposta do backend não é JSON:", text);
      return NextResponse.json(
        { message: "Resposta inesperada do backend" },
        { status: r.status }
      );
    }

    if (!r.ok) {
      return NextResponse.json(
        { message: data.message || "Erro ao buscar menu" },
        { status: r.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao buscar stats:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
