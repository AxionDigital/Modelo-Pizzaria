import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Não autorizado" },
      { status: 401 }
    );
  }

  const r = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!r.ok) {
    return NextResponse.json(
      { message: "Erro ao buscar menu" },
      { status: r.status }
    );
  }

  const data = await r.json();
  return NextResponse.json(data);
}
