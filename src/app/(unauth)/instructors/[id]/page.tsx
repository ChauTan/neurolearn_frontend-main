import InstructorDetailPageClient from './InstructorDetailPageClient';

export default async function InstructorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <InstructorDetailPageClient params={resolvedParams} />;
}
