import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import AppDataSource from "./data-source";
import { Book } from "./entities/Book";

async function seed() {
  await AppDataSource.initialize();

  const existingBooks = await AppDataSource.manager.find(Book);
  if (existingBooks.length > 0) {
    console.log("📚 Des livres existent déjà, seed ignoré.");
    await AppDataSource.destroy();
    return;
  }

  const books = [
    new Book(
      "1984",
      "George Orwell",
      "Dystopie",
      "https://static.fnac-static.com/multimedia/PE/Images/FR/NR/10/35/01/79120/1507-1/tsp20250103092736/1984.jpg",
      "Un classique de la littérature politique."
    ),
    new Book(
      "Le Petit Prince",
      "Antoine de Saint-Exupéry",
      "Conte",
      "https://m.media-amazon.com/images/I/710wth0vXZL.jpg",
      "Le Petit Prince vient d’une planète à peine plus grande que lui sur laquelle il y a des baobabs et une fleur très précieuse, qui fait sa coquette et dont il se sent responsable. Le Petit Prince aime le coucher de soleil. Un jour, il l'a vu quarante-quatre fois ! Il a aussi visité d'autres planètes et rencontré des gens très importants qui ne savaient pas répondre à ses questions. Sur la Terre, il a apprivoisé le renard, qui est devenu son ami. Et il a rencontré l’aviateur échoué en plein désert du Sahara. Alors, il lui a demandé : « S’il vous plaît… dessine-moi un mouton ! »"
    ),
    new Book(
      "Les Misérables",
      "Victor Hugo",
      "Roman",
      "https://www.gallimard.fr/system/files/styles/medium/private/migrations/ouvrages/couvertures/G09587.jpg.webp?itok=v2Vir-f0",
      "Paris et ses prisons, ses égouts. Paris insurgé : le Paris des révolutions, des barricades sur lesquelles fraternisent les hommes du peuple. Paris incarné à travers la figure de Gavroche, enfant des rues effronté et malicieux. Hugo retrace ici avec force les misères et les heures glorieuses des masses vivantes qui se retrouvent. Les événements se précipitent, les personnages se rencontrent, se heurtent, s'unissent parfois, à l'image de Cosette et de Marius. L'histoire du forçat évadé et de la petite miséreuse symbolise quelque chose de plus grand : avec Les Misérables, Hugo réalise enfin l'esprit du peuple."
    ),
    new Book("L'Étranger", "Albert Camus", "Philosophie", "https://m.media-amazon.com/images/I/8130inT26AL.jpg", "Un roman emblématique de l'absurde."),
    new Book(
      "Harry Potter à l'école des sorciers",
      "J.K. Rowling",
      "Fantasy",
      "https://m.media-amazon.com/images/I/71N6SgkNlcL._AC_UF1000,1000_QL80_.jpg",
      "Le début d'une aventure magique."
    ),
    new Book(
      "Le Seigneur des Anneaux",
      "J.R.R. Tolkien",
      "Fantasy",
      "https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg",
      "Une épopée dans la Terre du Milieu."
    ),
    new Book(
      "Fahrenheit 451",
      "Ray Bradbury",
      "Science-fiction",
      "https://m.media-amazon.com/images/I/41pa+plYkTL._AC_UF1000,1000_QL80_.jpg",
      "Un monde où les livres sont interdits."
    ),
    new Book("Don Quichotte", "Miguel de Cervantes", "Aventure", "https://m.media-amazon.com/images/I/81k2vtNkQtL.jpg", "Un chevalier fou mais touchant."),
    new Book(
      "Crime et Châtiment",
      "Fiodor Dostoïevski",
      "Roman",
      "https://m.media-amazon.com/images/I/81+1kkJQz+L.jpg",
      "Une plongée dans la psychologie humaine."
    ),
    new Book(
      "Orgueil et Préjugés",
      "Jane Austen",
      "Romance",
      "https://m.media-amazon.com/images/I/81nKAJtQ+uL.jpg",
      "Un regard critique et romantique sur la société anglaise."
    ),
    new Book(
      "Dracula",
      "Bram Stoker",
      "Horreur",
      "https://m.media-amazon.com/images/I/61yuKCUJiBL._AC_UF1000,1000_QL80_.jpg",
      "Le roman fondateur du mythe du vampire."
    ),
    new Book(
      "Frankenstein",
      "Mary Shelley",
      "Science-fiction",
      "https://static.fnac-static.com/multimedia/PE/Images/FR/NR/97/4c/11/1133719/1507-1/tsp20250103075549/Frankenstein-ou-Le-Promethee-moderne.jpg",
      "La création d'une créature qui échappe à son créateur."
    ),
    new Book(
      "Le Comte de Monte-Cristo",
      "Alexandre Dumas",
      "Aventure",
      "https://m.media-amazon.com/images/I/71MRNnNTnaL.jpg",
      "Un roman de vengeance et de justice."
    ),
    new Book(
      "Bel-Ami",
      "Guy de Maupassant",
      "Roman",
      "https://www.recyclivre.com/media/cache/sylius_shop_product_original/c6/5e/bfefd6047ef6d9d1be3017ccb9ab.jpg",
      "L'ascension sociale d'un arriviste."
    ),
    new Book(
      "La Peste",
      "Albert Camus",
      "Philosophie",
      "https://static.fnac-static.com/multimedia/Images/FR/NR/2e/f9/01/129326/1507-0/tsp20191030071015/La-Peste.jpg",
      "Une allégorie de la résistance humaine."
    ),
    new Book(
      "L'Attrape-cœurs",
      "J.D. Salinger",
      "Roman initiatique",
      "https://static.fnac-static.com/multimedia/PE/Images/FR/NR/13/bc/73/7584787/1507-1/tsp20250307080232/L-Attrape-coeurs.jpg",
      "L'adolescence désabusée de Holden Caulfield."
    ),
    new Book(
      "Le Nom de la Rose",
      "Umberto Eco",
      "Policier historique",
      "https://m.media-amazon.com/images/I/81W6mh0rv1L.jpg",
      "Une enquête dans un monastère médiéval."
    ),
    new Book("Sur la route", "Jack Kerouac", "Roman", "https://m.media-amazon.com/images/I/818kHs1DhnL.jpg", "Une quête de liberté à travers les USA."),
    new Book(
      "Les Fleurs du mal",
      "Charles Baudelaire",
      "Poésie",
      "https://www.gallimard.fr/system/files/migrations/ouvrages/couvertures/A30766.jpg",
      "La beauté dans le spleen et l’idéal."
    ),
    new Book(
      "Le Meilleur des mondes",
      "Aldous Huxley",
      "Science-fiction",
      "https://static.fnac-static.com/multimedia/PE/Images/FR/NR/d0/1d/15/1383888/1507-1/tsp20250304104746/Le-meilleur-des-mondes.jpg",
      "Une dystopie technocratique inquiétante."
    ),
  ];

  const savedBook = await AppDataSource.manager.save(books);
  console.log("📚 Livres insérés avec succès !");
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("❌ Erreur pendant le seeding :", err);
});
