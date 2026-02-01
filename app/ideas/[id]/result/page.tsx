import { ResultContent } from "@/components/ideas/result-content";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResultContent ideaId={id} />;
}
