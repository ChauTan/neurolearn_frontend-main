import QuizBuilderPage from '@/app/(auth)/instructor/quizzes/_components/QuizBuilderPage';

export default async function EditQuizBuilderRoutePage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const resolvedParams = await params;
  return <QuizBuilderPage params={resolvedParams} />;
}
