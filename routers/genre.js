// routes/genre.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route pour afficher la liste des genres
router.get('/', async (req, res) => {
  try {
    const genres = await prisma.genre.findMany(); // Récupère tous les genres depuis la BD
    res.render('genres/index', { genres }); // Passe les genres à la vue 'genres/index'
  } catch (error) {
    console.error('Erreur lors de la récupération des genres :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour afficher les jeux d'un genre spécifique
router.get('/:id/jeux', async (req, res) => {
  const genreId = parseInt(req.params.id);
  try {
    const genre = await prisma.genre.findUnique({
      where: { id: genreId },
      include: { jeux: true }, // Inclut les jeux associés à ce genre
    });
    if (!genre) {
      return res.status(404).send('Genre non trouvé');
    }
    res.render('genres/jeux', { genre }); // Passe le genre et ses jeux à la vue 'genres/jeux'
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux pour ce genre :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour afficher le formulaire de création de genre
router.get('/new', (req, res) => {
  res.render('genres/new'); // Affiche le formulaire pour créer un nouveau genre
});

// Route pour traiter la création d'un genre
router.post('/new', async (req, res) => {
  const { nom } = req.body;
  try {
    const newGenre = await prisma.genre.create({
      data: {
        nom, // Création d'un genre avec le nom fourni dans le formulaire
      },
    });
    res.redirect('/genres'); // Redirige vers la liste des genres
  } catch (error) {
    console.error('Erreur lors de la création du genre :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour afficher le formulaire de modification d'un genre
router.get('/:id/edit', async (req, res) => {
  const genreId = parseInt(req.params.id);
  try {
    const genre = await prisma.genre.findUnique({
      where: { id: genreId },
    });
    if (!genre) {
      return res.status(404).send('Genre non trouvé');
    }
    res.render('genres/edit', { genre }); // Affiche le formulaire avec les données existantes
  } catch (error) {
    console.error('Erreur lors de la récupération du genre :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

// Route pour traiter la modification d'un genre
router.post('/:id/edit', async (req, res) => {
  const genreId = parseInt(req.params.id);
  const { nom } = req.body;
  try {
    const updatedGenre = await prisma.genre.update({
      where: { id: genreId },
      data: {
        nom, // Met à jour le nom du genre
      },
    });
    res.redirect('/genres'); // Redirige vers la liste des genres
  } catch (error) {
    console.error('Erreur lors de la modification du genre :', error);
    res.status(500).send('Erreur du serveur.');
  }
});

module.exports = router;