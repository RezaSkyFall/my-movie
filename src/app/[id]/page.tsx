import { CreditsResponse, Movie } from "@/types";
import Image from "next/image";
import { JSX } from "react";

export const revalidate = 60 * 60 * 24;
export default async function MoviePage({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const { id } = await params;
  const apiKey = process.env.API_KEY;

  const detailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fa-IR`;
  const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`;

  const [detailsRes, creditsRes] = await Promise.all([
    fetch(detailsUrl),
    fetch(creditsUrl),
  ]);

  const details = (await detailsRes.json()) as Movie;
  const credits = (await creditsRes.json()) as CreditsResponse;

  return (
    <main className='container mx-auto p-6'>
      <div className='grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6'>
        <div className='rounded-2xl overflow-hidden'>
          <Image
            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
            alt={details.title || "movie poster"}
            width={500}
            height={750}
            className='object-cover w-full h-full'
          />
        </div>

        <section className='overflow-hidden flex flex-col '>
          <h1 className='text-3xl font-semibold mb-2'>{details.title}</h1>

          <div className='flex flex-wrap gap-3 text-sm mb-4 text-neutral-300'>
            <span>منتشر شده: {details.release_date || "نامشخص"}</span>
            <span>
              · مدت: {details.runtime ? `${details.runtime} دقیقه` : "نامشخص"}
            </span>
            <span>· امتیاز: {details.vote_average ?? "—"}/10</span>
            <span>
              · ژانر:{" "}
              {(details.genres || []).map((g) => g.name).join("، ") || "—"}
            </span>
          </div>

          <h2 className='text-lg font-medium'>خلاصه</h2>
          <p className='mb-6 text-neutral-300'>
            {details.overview || "خلاصه‌ای موجود نیست."}
          </p>

          <div className='mb-6'>
            <h3 className='text-lg font-medium mb-3'>بازیگران اصلی</h3>
            <div className='flex overflow-x-auto gap-4 pb-2 '>
              {(credits.cast || [])
                .filter((x) => x.profile_path)
                .slice(0, 10)
                .map((c) => (
                  <div key={c.cast_id || c.credit_id}>
                    <div className='w-28 h-40  rounded-lg overflow-hidden mb-2'>
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                        alt={c.name}
                        width={185}
                        height={278}
                        className='object-cover w-full h-full'
                      />
                    </div>
                    <div className='text-sm'>
                      <div className='font-medium'>{c.name}</div>
                      <div className='text-xs text-neutral-300'>
                        {c.character}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium mb-3'>اطلاعات تکمیلی</h3>
            <ul className='text-sm space-y-1 text-neutral-200'>
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
}
