import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const API = process.env.NEXT_PUBLIC_API_URL;

    const r = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

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
        { message: data.message || "Credenciais inválidas" },
        { status: r.status }
      );
    }

    const { token, user } = data;

    // 🍪 COOKIE CRIADO NO DOMÍNIO DO NEXT
    const res = NextResponse.json({ user });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return res;
  } catch (error: any) {
    console.error("Erro ao realizar login:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
