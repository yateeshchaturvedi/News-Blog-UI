'use client'

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createInterviewQuestionByAdmin, FormState } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import RichTextEditor from '@/components/ui/rich-text-editor';

const initialState: FormState = {
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Add Question'}
        </Button>
    );
}

export default function InterviewQuestionForm() {
    const [formState, formAction] = useActionState(createInterviewQuestionByAdmin, initialState);
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        if (formState.success) {
            setFormKey((key) => key + 1);
        }
    }, [formState.success]);

    return (
        <form key={formKey} action={formAction} className="space-y-4">
            <div>
                <Label htmlFor="question">Question</Label>
                <Input id="question" name="question" placeholder="e.g. Explain blue/green deployments" required />
                {formState.errors?.question && (
                    <p className="text-xs text-red-500 mt-1">{formState.errors.question[0]}</p>
                )}
            </div>
            <div>
                <Label htmlFor="category">Category (optional)</Label>
                <Input id="category" name="category" placeholder="e.g. Kubernetes" />
            </div>
            <div>
                <Label htmlFor="answer">Answer</Label>
                <RichTextEditor name="answer" placeholder="Write a detailed answer..." minHeightClassName="min-h-[240px]" />
                {formState.errors?.answer && (
                    <p className="text-xs text-red-500 mt-1">{formState.errors.answer[0]}</p>
                )}
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="isPublished" defaultChecked className="h-4 w-4 rounded border-slate-300" />
                Publish immediately
            </label>
            <div className="flex items-center gap-3">
                <SubmitButton />
                {formState.message && !formState.success && (
                    <p className="text-sm text-red-500">{formState.message}</p>
                )}
                {formState.success && (
                    <p className="text-sm text-emerald-600">{formState.message}</p>
                )}
            </div>
        </form>
    );
}
