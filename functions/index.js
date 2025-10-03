const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const functions = require("firebase-functions");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Configuração do Supabase
const supabase = createClient(
  "https://disqeylgrgyarybvqdkv.supabase.co", // URL do seu projeto
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpc3FleWxncmd5YXJ5YnJ2cWRrdiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzU5NDU3NTg3LCJleHAiOjIwNzUwMzM1ODd9.FSXT1jaXa1UlMIQY0kzlqOiusU-rGuIuKReDdoTV5D8"
);

// ===== ENDPOINTS ===== //

// GET - lista todo o cardápio
app.get("/cardapio", async (req, res) => {
  const { data, error } = await supabase.from("cardapio").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST - adiciona item
app.post("/cardapio", async (req, res) => {
  const { nome, preco } = req.body;
  const { data, error } = await supabase
    .from("cardapio")
    .insert([{ nome, preco }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// PUT - editar item
app.put("/cardapio/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;
  const { error } = await supabase
    .from("cardapio")
    .update({ nome, preco })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// DELETE - remover item
app.delete("/cardapio/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("cardapio").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// === Exporta para Firebase Functions ===
exports.api = functions.https.onRequest(app);