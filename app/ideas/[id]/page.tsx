import { IdeaDetails } from "@/components/ideas/idea-details";

export default async function IdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IdeaDetails ideaId={id} />;
}
