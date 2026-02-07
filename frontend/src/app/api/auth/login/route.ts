import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("segundo");

  // chama o backend
  const r = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!r.ok) {
    return NextResponse.json(
      { message: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const { token, user } = await r.json();

  // 🍪 COOKIE CRIADO NO DOMÍNIO DO NEXT
  const res = NextResponse.json({ user });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
