import { ScoringWizard } from "@/components/ideas/scoring-wizard";

export default async function ScoreIdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ScoringWizard ideaId={id} />;
}
