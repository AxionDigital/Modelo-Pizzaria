const Categoria = require("../models/Categoria");

const format = (cat) => ({
  id: cat._id,
  nome: cat.nome,
});

exports.listar = async (req, res) => {
  const categorias = await Categoria.find();
  res.json({ data: categorias.map(format) });
};

exports.criar = async (req, res) => {
  const categoria = await Categoria.create(req.body);
  res.json({ data: format(categoria) });
};

exports.atualizar = async (req, res) => {
  const categoria = await Categoria.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ data: format(categoria) });
};

exports.remover = async (req, res) => {
  await Categoria.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
