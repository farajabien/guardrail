import { ProgressTracker } from "@/components/ideas/progress-tracker";

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProgressTracker ideaId={id} />;
}
