import Image from "next/image";
import Link from "next/link";

async function getMovies(query?: string) {
  const baseUrl = "https://api.themoviedb.org/3";
  const endpoint = query ? "search/movie" : "movie/popular";
  const params = new URLSearchParams({
    api_key: process.env.API_KEY,
    language: "fa-IR",
    page: "1",
  });

  if (query) params.append("query", query);

  const res = await fetch(`${baseUrl}/${endpoint}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (await searchParams).q || "";
  const data = await getMovies(query);

  return (
    <main className="container mx-auto py-4 flex flex-col gap-4">
      <h1 className="text-2xl text-neutral-50">فیلم من</h1>

      <form className="w-full">
        <input
          type="text"
          name="q"
          placeholder="جستجو..."
          defaultValue={query}
          className="w-full p-2 rounded-lg border border-neutral-600 bg-neutral-700 text-neutral-100"
        />
      </form>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {data.results?.length ? (
          data.results.map((movie: any) => (
            <Link
              key={`${movie.id}-${movie.title}`}
              href={`/${movie.id}`}
              className="h-full flex "
            >
              <li className="border rounded-xl border-neutral-600 hover:bg-neutral-600 transition-colors cursor-pointer bg-neutral-700 flex flex-col overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title || "movie poster"}
                  width={256}
                  height={384}
                  className="w-full rounded-t-xl"
                />
                <div className="flex flex-col  p-2 py-1 grow gap-1">
                  <h2 className="text-neutral-100 text-sm md:text-base white whitespace-nowrap overflow-hidden text-ellipsis ">
                    {movie.title}
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm">
                    امتیاز: {movie.vote_average}
                  </p>
                </div>
              </li>
            </Link>
          ))
        ) : (
          <p className="text-neutral-400 col-span-full text-center py-8">
            فیلمی یافت نشد.
          </p>
        )}
      </ul>
    </main>
  );
}
