import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getInterviewQuestions } from '@/lib/api';
import { normalizeCanonicalPath } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Interview Questions & Answers',
    description: 'Browse curated DevOps interview questions and detailed answers.',
    alternates: {
        canonical: normalizeCanonicalPath('/interview-questions'),
    },
};

export default async function InterviewQuestionsPage() {
    const questions = await getInterviewQuestions();

    return (
        <div className="space-y-8">
            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Interview Q&A' }]} />
            <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <div>
                    <h1 className="text-4xl font-semibold text-slate-900">Interview Questions</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Short, focused answers you can revise before your next interview.
                    </p>
                </div>
            </div>

            {questions.length > 0 ? (
                <div className="space-y-4">
                    {questions.map((item) => (
                        <details key={item.id} className="group rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
                            <summary className="cursor-pointer list-none">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">{item.question}</h2>
                                        {item.category && (
                                            <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {item.category}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-500 group-open:hidden">View Answer</span>
                                </div>
                            </summary>
                            <div
                                className="prose mt-4 max-w-none text-sm text-slate-700"
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                        </details>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-blue-100 bg-white/85 py-14 text-center text-slate-500 shadow-sm">
                    <p>No interview questions have been published yet.</p>
                </div>
            )}
        </div>
    );
}
