const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Afficher la liste de tous les jeux
router.get("/", async (req, res) => {
  try {
    const jeux = await prisma.jeu.findMany({
      include: { genre: true, editeur: true },
    });
    res.render("jeux/index", { jeux });
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux :", error);
    res.status(500).send("Erreur lors de la récupération des jeux.");
  }
});

// Permet de créer un nouveau jeu dans la base de données à partir des données envoyées via un formulaire.
router.post("/", async (req, res) => {
  const { titre, description, dateSortie, genreId, editeurId, misEnAvant } = req.body;

  try {
    await prisma.jeu.create({
      data: {
        titre,
        description,
        dateSortie: new Date(dateSortie),
        genreId: parseInt(genreId),
        editeurId: parseInt(editeurId),
        misEnAvant: misEnAvant === "on", // Checkbox management
      },
    });
    res.redirect("/jeux");
  } catch (error) {
    console.error("Erreur lors de la création du jeu :", error);
    res.status(500).send("Erreur lors de la création du jeu.");
  }
});

// Affiche un formulaire qui permet de créer un nouveau jeu.
router.get("/new", async (req, res) => {
  try {
    const genres = await prisma.genre.findMany();
    const editeurs = await prisma.editeur.findMany();
    res.render("jeux/new", { genres, editeurs });
  } catch (error) {
    console.error("Erreur lors du chargement du formulaire de création :", error);
    res.status(500).send("Erreur lors du chargement du formulaire.");
  }
});

// Afficher le détail d'un jeu
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const jeu = await prisma.jeu.findUnique({
      where: { id: parseInt(id) },
      include: { genre: true, editeur: true },
    });

    if (!jeu) {
      return res.status(404).send("Jeu introuvable.");
    }

    res.render("jeux/show", { jeu });
  } catch (error) {
    console.error("Erreur lors de la récupération du détail du jeu :", error);
    res.status(500).send("Erreur lors de la récupération des détails du jeu.");
  }
});

// Modifier un jeu
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;

  try {
    const jeu = await prisma.jeu.findUnique({ where: { id: parseInt(id) } });

    if (!jeu) {
      return res.status(404).send("Jeu introuvable.");
    }

    const genres = await prisma.genre.findMany();
    const editeurs = await prisma.editeur.findMany();
    res.render("jeux/edit", { jeu, genres, editeurs });
  } catch (error) {
    console.error("Erreur lors du chargement du formulaire de modification :", error);
    res.status(500).send("Erreur lors du chargement du formulaire.");
  }
});

// Met à jour un jeu existant avec les nouvelles données.
router.post("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { titre, description, dateSortie, genreId, editeurId, misEnAvant } = req.body;

  try {
    await prisma.jeu.update({
      where: { id: parseInt(id) },
      data: {
        titre,
        description,
        dateSortie: new Date(dateSortie),
        genreId: parseInt(genreId),
        editeurId: parseInt(editeurId),
        misEnAvant: misEnAvant === "on", // Checkbox management
      },
    });

    res.redirect(`/jeux/${id}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du jeu :", error);
    res.status(500).send("Erreur lors de la mise à jour du jeu.");
  }
});

// Suppression d'un jeu de la base de données
router.post("/:id/delete", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.jeu.delete({ where: { id: parseInt(id) } });
    res.redirect("/jeux");
  } catch (error) {
    console.error("Erreur lors de la suppression du jeu :", error);
    res.status(500).send("Erreur lors de la suppression du jeu.");
  }
});

module.exports = router;
