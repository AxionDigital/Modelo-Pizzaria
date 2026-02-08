import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ success: true });

    res.cookies.delete({ name: "token", path: "/", });

    return res;
  } catch (error: any) {
    console.error("Erro ao deletar cookie:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
