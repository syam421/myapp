import { useSearch } from "wouter";
import { FilesView } from "./FilesView";

export function SearchView() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const q = params.get("q") ?? "";

  return <FilesView search={q} />;
}
