import Image from "next/image";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const id = params.id;
  const apiKey = process.env.API_KEY;
  if (!apiKey)
    throw new Error(
      "tmdb api key missing. set API_KEY in your environment"
    );

  const detailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fa-IR`;
  const videosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`;
  const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`;

  const [detailsRes, videosRes, creditsRes] = await Promise.all([
    fetch(detailsUrl),
    fetch(videosUrl),
    fetch(creditsUrl),
  ]);

  if (!detailsRes.ok)
    return <div className="p-6">خطا در دریافت جزییات فیلم</div>;

  const details = (await detailsRes.json()) as {
    poster_path?: string;
    title?: string;
    tagline?: string;
    release_date?: string;
    runtime?: number;
    vote_average?: number;
    overview?: string;
    genres?: { id: number; name: string }[];
  };

  const videos = (await videosRes.json().catch(() => ({ results: [] }))) as {
    results: { site?: string; type?: string; key?: string }[];
  };

  const credits = (await creditsRes.json().catch(() => ({ cast: [], crew: [] }))) as {
    cast: { id: number; name: string; character?: string; profile_path?: string }[];
    crew: { id: number; name: string; character?: string; profile_path?: string }[];
  };

  const trailer = videos.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  return (
    <main className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <div className="shadow-lg rounded-2xl overflow-hidden">
          {details.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title || details.name}
              width={500}
              height={750}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              پوستر موجود نیست
            </div>
          )}
        </div>

        <section>
          <h1 className="text-3xl font-semibold mb-2">{details.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{details.tagline}</p>

          <div className="flex flex-wrap gap-3 text-sm mb-4">
            <span>منتشر شده: {details.release_date || "نامشخص"}</span>
            <span>
              · مدت: {details.runtime ? `${details.runtime} دقیقه` : "نامشخص"}
            </span>
            <span>· امتیاز: {details.vote_average ?? "—"}/10</span>
            <span>
              · ژانر: {" "}
              {(details.genres || []).map((g) => g.name).join("، ") || "—"}
            </span>
          </div>

          <h2 className="text-lg font-medium mb-2">خلاصه</h2>
          <p className="prose max-w-none mb-6">
            {details.overview || "خلاصه‌ای موجود نیست."}
          </p>

          {/* {trailer && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">تریلر</h3>
              <div className="aspect-video">
                <iframe
                  title="trailer"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            </div>
          )} */}

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">بازیگران اصلی</h3>
            <div className="flex overflow-x-auto gap-4 pb-2 ">
              {(credits.cast || []).map((c) => (
                <div key={c.cast_id || c.credit_id} className="min-w-[120px]">
                  <div className="w-28 h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                    {c.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                        alt={c.name}
                        width={185}
                        height={278}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs">
                        تصویر ندارد
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-neutral-200">
                      {c.character}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">اطلاعات تکمیلی</h3>
            <ul className="text-sm space-y-1 text-neutral-200">
              <li>
                بودجه:{" "}
                {details.budget ? details.budget.toLocaleString() + " $" : "—"}
              </li>
              <li>
                درآمد جهانی:{" "}
                {details.revenue
                  ? details.revenue.toLocaleString() + " $"
                  : "—"}
              </li>
              <li>
                زبان‌ها:{" "}
                {(details.spoken_languages || [])
                  .map((l) => l.english_name || l.name)
                  .join("، ") || "—"}
              </li>
              <li>وضعیت: {details.status || "—"}</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );

