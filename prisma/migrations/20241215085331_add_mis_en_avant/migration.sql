-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jeu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateSortie" DATETIME NOT NULL,
    "genreId" INTEGER NOT NULL,
    "editeurId" INTEGER NOT NULL,
    "misEnAvant" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Jeu_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Jeu_editeurId_fkey" FOREIGN KEY ("editeurId") REFERENCES "Editeur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Jeu" ("dateSortie", "description", "editeurId", "genreId", "id", "titre") SELECT "dateSortie", "description", "editeurId", "genreId", "id", "titre" FROM "Jeu";
DROP TABLE "Jeu";
ALTER TABLE "new_Jeu" RENAME TO "Jeu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
