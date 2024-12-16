const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route pour afficher la liste des éditeurs
router.get('/', async (req, res) => {
  try {
    const editeurs = await prisma.editeur.findMany(); // Récupère tous les éditeurs depuis la BD
    res.render('editeurs/index', { editeurs }); // Passe les éditeurs à la vue 'editeurs/index'
  } catch (error) {
    console.error('Erreur lors de la récupération des éditeurs :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour afficher les jeux d'un éditeur spécifique
router.get('/:id/jeux', async (req, res) => {
  const editeurId = parseInt(req.params.id);
  try {
    const editeur = await prisma.editeur.findUnique({
      where: { id: editeurId },
      include: { jeux: true }, // Inclut les jeux associés à cet éditeur
    });
    if (!editeur) {
      return res.status(404).send('Éditeur non trouvé');
    }
    res.render('editeurs/jeux', { editeur }); // Passe l'éditeur et ses jeux à la vue 'editeur/jeux'
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux pour cet éditeur :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour afficher le formulaire de création d'un éditeur
router.get('/new', (req, res) => {
  res.render('editeurs/new'); // Affiche le formulaire pour créer un nouvel éditeur
});

// Route pour traiter la création d'un éditeur
router.post('/new', async (req, res) => {
  const { nom } = req.body;
  try {
    const newEditeur = await prisma.editeur.create({
      data: {
        nom, // Création d'un éditeur avec le nom fourni dans le formulaire
      },
    });
    res.redirect('/editeurs'); // Redirige vers la liste des éditeurs
  } catch (error) {
    console.error('Erreur lors de la création de l\'éditeur :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour afficher le formulaire de modification d'un éditeur
router.get('/:id/edit', async (req, res) => {
  const editeurId = parseInt(req.params.id);
  try {
    const editeur = await prisma.editeur.findUnique({
      where: { id: editeurId },
    });
    if (!editeur) {
      return res.status(404).send('Éditeur non trouvé');
    }
    res.render('editeurs/edit', { editeur }); // Affiche le formulaire avec les données existantes
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'éditeur :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour traiter la modification d'un éditeur
router.post('/:id/edit', async (req, res) => {
  const editeurId = parseInt(req.params.id);
  const { nom } = req.body;
  try {
    const updatedEditeur = await prisma.editeur.update({
      where: { id: editeurId }, // Utilise editeurId et non genreId
      data: {
        nom, // Met à jour le nom de l'éditeur
      },
    });
    res.redirect('/editeurs'); // Redirige vers la liste des éditeurs
  } catch (error) {
    console.error('Erreur lors de la modification de l\'éditeur :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour supprimer un éditeur
router.post('/:id/delete', async (req, res) => {
  const editeurId = parseInt(req.params.id);
  try {
    await prisma.editeur.delete({
      where: { id: editeurId },
    });
    res.redirect('/editeurs'); // Redirige vers la liste des éditeurs après suppression
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'éditeur :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

module.exports = router;
