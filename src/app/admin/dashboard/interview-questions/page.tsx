import { cookies } from 'next/headers';
import { getInterviewQuestionsAdmin } from '@/lib/api';
import InterviewQuestionForm from '@/components/InterviewQuestionForm';
import { Button } from '@/components/ui/Button';
import { deleteInterviewQuestionByAdmin, setInterviewQuestionPublishStatus } from '@/app/actions';

export default async function InterviewQuestionsPage() {
    const token = (await cookies()).get('token')?.value;
    const questions = token ? await getInterviewQuestionsAdmin(token) : [];

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <h1 className="text-3xl font-semibold text-slate-900">Interview Questions</h1>
                <p className="mt-2 text-sm text-slate-600">Create and manage interview Q&amp;A for the public site.</p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Add Question</h2>
                <InterviewQuestionForm />
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Existing Questions</h2>
                <div className="space-y-4">
                    {questions.map((item) => {
                        const createdAt = item.createdAt ? new Date(item.createdAt) : null;
                        return (
                            <div key={item.id} className="rounded-xl border border-blue-50 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                            {item.category && (
                                                <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
                                                    {item.category}
                                                </span>
                                            )}
                                            <span className={`rounded-full px-2 py-1 ${item.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {item.isPublished ? 'Published' : 'Hidden'}
                                            </span>
                                            {createdAt && (
                                                <span>{createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <form action={setInterviewQuestionPublishStatus.bind(null, String(item.id), !item.isPublished)}>
                                            <Button type="submit" variant="outline" size="sm">
                                                {item.isPublished ? 'Unpublish' : 'Publish'}
                                            </Button>
                                        </form>
                                        <form action={deleteInterviewQuestionByAdmin.bind(null, String(item.id))}>
                                            <Button type="submit" variant="destructive" size="sm">
                                                Delete
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                                <details className="mt-4 rounded-lg border border-blue-50 bg-blue-50/40 p-3">
                                    <summary className="cursor-pointer text-sm font-semibold text-slate-700">View Answer</summary>
                                    <div
                                        className="prose mt-3 max-w-none text-sm text-slate-700"
                                        dangerouslySetInnerHTML={{ __html: item.answer }}
                                    />
                                </details>
                            </div>
                        );
                    })}
                    {questions.length === 0 && (
                        <p className="text-sm text-slate-500">No interview questions yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
