import { NextResponse } from "next/server";
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

    const r = await fetch(`${API}/api/pedidos`, {
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: "include",
    });

    // Lê como texto primeiro para evitar erros se a resposta não for JSON
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
        { message: data.message || "Erro ao buscar pedidos" },
        { status: r.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
