import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useGameData() {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: genresData, error: genresError } = await supabase
          .from("v_genres_products")
          .select("*");
        if (genresError) throw genresError;

        const uniqueGenres = genresData
          ? Array.from(new Set(genresData.map((genre) => genre.id_genres))).map(
              (id) => ({
                id,
                name: genresData.find((genre) => genre.id_genres === id)
                  .genre_name,
              })
            )
          : [];

        setGenres(uniqueGenres);

        const { data: platformsData, error: platformsError } = await supabase
          .from("v_platforms_products")
          .select("*");
        if (platformsError) throw platformsError;

        const uniquePlatforms = platformsData
          ? Array.from(
              new Set(platformsData.map((platform) => platform.id_platforms))
            ).map((id) => ({
              id,
              name: platformsData.find(
                (platform) => platform.id_platforms === id
              ).name,
            }))
          : [];

        setPlatforms(uniquePlatforms);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { genres, platforms, loading, error };
}
