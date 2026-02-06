const Pedido = require("../models/Pedido");
const { enviarMensagemTelegram } = require("../bot/bot");
const Menu = require("../models/Menu");

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
  try {
    const itensProcessados = [];

    for (const item of req.body.itens) {

      // 🔹 ITEM NORMAL
      if (!item.isMeioAMeio) {
        const produto = await Menu.findById(item.produtoId);

        if (!produto) {
          return res.status(400).json({ message: "Produto não encontrado" });
        }

        itensProcessados.push({
          produtoId: produto._id,
          isMeioAMeio: false,
          quantidade: item.quantidade,
          precoUnitario: Number(item.precoUnitario),
          observacao: item.observacao,
          borda: item.borda,
        });

      }
      // 🔸 MEIO A MEIO
      else {
        const sabor1 = await Menu.findById(item.sabor1Id);
        const sabor2 = await Menu.findById(item.sabor2Id);

        if (!sabor1 || !sabor2) {
          return res.status(400).json({ message: "Sabores inválidos" });
        }

        itensProcessados.push({
          isMeioAMeio: true,
          sabor1Id: sabor1._id,
          sabor2Id: sabor2._id,
          quantidade: item.quantidade,
          precoUnitario: Number(item.precoUnitario),
          observacao: item.observacao,
          borda: item.borda,
        });
      }
    }

    const pedido = await Pedido.create({
      cliente: req.body.cliente,
      itens: itensProcessados,
      total: Number(req.body.total),
      metodoPagamento: req.body.metodoPagamento,
      tipoEntrega: req.body.tipoEntrega,
      endereco: req.body.endereco,
      status: "Pendente",
      criadoEm: new Date(),
    });

    res.json({ data: pedido });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
};

exports.atualizarStatus = async (req, res) => {
  const pedido = await Pedido.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )
    .populate("itens.produtoId")
    .populate("itens.sabor1Id")
    .populate("itens.sabor2Id");

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
