import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

function getIdFromRequest(req: NextRequest): string | null {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/'); // Ex: ['', 'api', 'categoria', '12345']
  const id = pathSegments[pathSegments.length - 1];
  
  // Retorna o ID se ele for válido, senão retorna null
  return id && id !== "[id]" ? id : null;
}

export async function PATCH(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const API = process.env.NEXT_PUBLIC_API_URL;
    const id = getIdFromRequest(req);

    if (!id) {
      return NextResponse.json({ message: "ID do pedido não fornecido" }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const r = await fetch(`${API}/api/pedidos/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
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
        { message: data.message || "Erro ao atualizar item" },
        { status: r.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const API = process.env.NEXT_PUBLIC_API_URL;
    const id = getIdFromRequest(req);

    if (!id) {
      return NextResponse.json({ message: "ID da categoria não fornecido" }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    const r = await fetch(`${API}/api/pedidos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
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
        { message: data.message || "Erro ao deletar item" },
        { status: r.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao deletar pedido:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
