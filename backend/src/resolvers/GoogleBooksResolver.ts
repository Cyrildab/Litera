import { Arg, Int, Query, Resolver } from "type-graphql";
import fetch from "node-fetch";
import { GoogleBookResult } from "../types/GoogleBookResult";

@Resolver()
export class GoogleBooksResolver {
  @Query(() => [GoogleBookResult])
  async searchGoogleBooks(@Arg("query") query: string, @Arg("maxResults", () => Int, { defaultValue: 20 }) maxResults: number): Promise<GoogleBookResult[]> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=fr&printType=books&maxResults=${maxResults}`;
    const res = await fetch(url);
    const json = await res.json();

    return (json.items || []).map((item: any) => {
      const volume = item.volumeInfo;
      return {
        id: item.id,
        title: volume.title,
        author: volume.authors?.[0] || "Auteur inconnu",
        cover: volume.imageLinks?.thumbnail?.replace("zoom=1", "zoom=3") || "",
        gender: volume.categories?.[0] || "Genre inconnu",
        description: volume.description || "Pas de description disponible.",
      };
    });
  }

  @Query(() => GoogleBookResult, { nullable: true })
  async getGoogleBook(@Arg("id") id: string): Promise<GoogleBookResult | null> {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
    const res = await fetch(url);
    const json = await res.json();

    const volume = json.volumeInfo;
    if (!volume) return null;

    return {
      id: json.id,
      title: volume.title,
      author: volume.authors?.[0] || "Auteur inconnu",
      cover: volume.imageLinks?.thumbnail?.replace("zoom=1", "zoom=3") || "",
      gender: volume.categories?.[0] || "Genre inconnu",
      description: volume.description || "Pas de description disponible.",
    };
  }
}
