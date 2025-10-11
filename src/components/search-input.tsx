"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.replace(`/?${params.toString()}`);
  }

  return (
    <input
      type="text"
      name="q"
      placeholder="جستجو..."
      defaultValue={query}
      onChange={handleChange}
      className="w-full p-2 rounded-lg border border-neutral-600 bg-neutral-700 text-neutral-100"
    />
  );
}
