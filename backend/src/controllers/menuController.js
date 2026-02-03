const Menu = require("../models/Menu");
const cloudinary = require("../config/cloudinary");

const format = (i) => ({
  id: i._id,
  nome: i.nome,
  preco: i.preco,
  descricao: i.descricao,
  categoria: i.categoria,
  tipo: i.tipo,
  imagem: i.imagem,
});

exports.listar = async (req, res) => {
  const menu = await Menu.find();
  res.json({ data: menu.map(format) });
};

exports.criar = async (req, res) => {
  const { nome, preco, categoria, descricao, tipo } = req.body;

  if (!nome || !preco || !categoria || !tipo) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  const item = await Menu.create({
    nome,
    preco,
    categoria,
    descricao,
    tipo,
    imagem: req.file?.path || null,
    imagemId: req.file?.filename || null,
  });

  res.json({ data: item });
};

exports.atualizar = async (req, res) => {
  const item = await Menu.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  // 🗑️ remover imagem
  if (req.body.removeImagem === "true" && item.imagemId) {
    await cloudinary.uploader.destroy(item.imagemId);
    item.imagem = null;
    item.imagemId = null;
  }

  // 🔁 nova imagem
  if (req.file) {
    if (item.imagemId) {
      await cloudinary.uploader.destroy(item.imagemId);
    }

    item.imagem = req.file.path;
    item.imagemId = req.file.filename;
  }

  // ✍️ campos
  item.nome = req.body.nome;
  item.preco = req.body.preco;
  item.descricao = req.body.descricao;
  item.categoria = req.body.categoria;
  item.tipo = req.body.tipo;

  await item.save();
  res.json({ data: item });
};

exports.remover = async (req, res) => {
  const item = await Menu.findById(req.params.id);

  if (item?.imagemId) {
    await cloudinary.uploader.destroy(item.imagemId);
  }

  await Menu.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
