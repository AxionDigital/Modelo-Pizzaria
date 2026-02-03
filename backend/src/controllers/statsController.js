const Pedido = require("../models/Pedido");

exports.stats = async (_, res) => {
  const pedidos = await Pedido.find()
    .populate("itens.produtoId")
    .populate("itens.sabor1Id")
    .populate("itens.sabor2Id");

  const entregues = pedidos.filter(p => p.status === "Entregue");
  const faturamento = entregues.reduce((acc, p) => acc + Number(p.total || 0), 0);

  const vendas = {};

  pedidos.forEach(p => {
    if (p.status !== "Cancelado") {
      p.itens.forEach(i => {
        const qtd = Number(i.quantidade || 0);

        if (i.isMeioAMeio) {
          vendas[i.sabor1Id?.nome] = (vendas[i.sabor1Id?.nome] || 0) + qtd * 0.5;
          vendas[i.sabor2Id?.nome] = (vendas[i.sabor2Id?.nome] || 0) + qtd * 0.5;
        } else {
          vendas[i.produtoId?.nome] = (vendas[i.produtoId?.nome] || 0) + qtd;
        }
      });
    }
  });

  const topItens = Object.entries(vendas)
    .map(([nome, qtd]) => ({ nome, qtd }))
    .sort((a, b) => b.qtd - a.qtd)
    .slice(0, 5);

  res.json({
    data: {
      faturamento: faturamento.toFixed(2),
      totalPedidos: pedidos.length,
      topItens
    }
  });
};
