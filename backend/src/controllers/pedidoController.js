const Pedido = require("../models/Pedido");
const { enviarMensagemTelegram } = require("../bot/bot");

exports.listar = async (_, res) => {
  const pedidos = await Pedido.find()
    .populate("itens.produtoId")
    .populate("itens.sabor1Id")
    .populate("itens.sabor2Id")
    .sort({ criadoEm: -1 });

  const formatado = pedidos.map(p => ({
    id: p._id,
    cliente: p.cliente,
    total: p.total,
    status: p.status,
    metodoPagamento: p.metodoPagamento,
    tipoEntrega: p.tipoEntrega,
    endereco: p.endereco,
    criadoEm: p.criadoEm,
    itens: p.itens
  }));

  res.json({ data: formatado });
};

exports.criar = async (req, res) => {
  const pedido = await Pedido.create({
    ...req.body,
    status: "Pendente",
    criadoEm: new Date()
  });

  res.json({ data: pedido });
};

exports.atualizarStatus = async (req, res) => {
  const pedido = await Pedido.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  enviarMensagemTelegram(pedido);

  console.log(`[BOT] Pedido #${pedido._id} mudou para: ${pedido.status}`);

  res.json({ data: pedido });
};

exports.remover = async (req, res) => {
  const pedido = await Pedido.findByIdAndDelete(req.params.id);

  if (!pedido) {
    return res.status(404).json({ message: "Pedido não encontrado" });
  }

  res.json({ message: "Pedido deletado com sucesso" });
};
