'use client';

import { useEffect, useState } from 'react';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Eraser,
    Heading1,
    Heading2,
    Heading3,
    Link2,
    List,
    ListOrdered,
    Moon,
    Redo2,
    Code2,
    Sun,
    Undo2,
} from 'lucide-react';

type RichTextEditorProps = {
    name: string;
    defaultValue?: string;
    placeholder?: string;
    minHeightClassName?: string;
};

export default function RichTextEditor({
    name,
    defaultValue = '',
    placeholder = 'Write content...',
    minHeightClassName = 'min-h-[320px]',
}: RichTextEditorProps) {
    const editorClass = `tiptap prose max-w-none text-sm leading-7 focus:outline-none ${minHeightClassName}`;
    const [html, setHtml] = useState(defaultValue);
    const [darkSurface, setDarkSurface] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Superscript,
            Subscript,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                protocols: ['http', 'https'],
                defaultProtocol: 'https',
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: defaultValue,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: editorClass,
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            setHtml(currentEditor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== defaultValue) {
            editor.commands.setContent(defaultValue || '');
        }
    }, [defaultValue, editor]);

    const runLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('Enter URL', previousUrl || '');
        if (url === null) return;
        if (url.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const toolbarButton = "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900";
    const activeButton = "bg-violet-100 text-violet-700";
    const separator = <div className="mx-1 h-6 w-px bg-slate-300/70" />;

    return (
        <div className={`overflow-hidden rounded-3xl border ${darkSurface ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-[#f6f6fb]'}`}>
            <div className={`flex flex-wrap items-center gap-1 border-b px-3 py-2 ${darkSurface ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-200 bg-[#f2f2f8]'}`}>
                <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></button>
                <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></button>
                {separator}
                <select
                    className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700"
                    value={
                        editor?.isActive('heading', { level: 1 })
                            ? 'h1'
                            : editor?.isActive('heading', { level: 2 })
                                ? 'h2'
                                : editor?.isActive('heading', { level: 3 })
                                    ? 'h3'
                                    : 'p'
                    }
                    onChange={(e) => {
                        const value = e.target.value;
                        if (!editor) return;
                        if (value === 'p') editor.chain().focus().setParagraph().run();
                        if (value === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                        if (value === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                        if (value === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                    }}
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>
                {separator}
                <button type="button" className={`${toolbarButton} ${editor?.isActive('heading', { level: 1 }) ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="h-4 w-4" /></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('heading', { level: 2 }) ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('heading', { level: 3 }) ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></button>
                {separator}
                <button type="button" className={`${toolbarButton} ${editor?.isActive('bulletList') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('orderedList') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></button>
                {separator}
                <button type="button" className={`${toolbarButton} ${editor?.isActive('bold') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleBold().run()}><span className="text-sm font-bold">B</span></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('italic') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleItalic().run()}><span className="text-sm italic">I</span></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('strike') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleStrike().run()}><span className="text-sm line-through">S</span></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('underline') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleUnderline().run()}><span className="text-sm underline">U</span></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('code') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleCode().run()}><Code2 className="h-4 w-4" /></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('superscript') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleSuperscript().run()}><span className="text-[11px]">x<sup>2</sup></span></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive('subscript') ? activeButton : ''}`} onClick={() => editor?.chain().focus().toggleSubscript().run()}><span className="text-[11px]">x<sub>2</sub></span></button>
                {separator}
                <button type="button" className={`${toolbarButton} ${editor?.isActive({ textAlign: 'left' }) ? activeButton : ''}`} onClick={() => editor?.chain().focus().setTextAlign('left').run()}><AlignLeft className="h-4 w-4" /></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive({ textAlign: 'center' }) ? activeButton : ''}`} onClick={() => editor?.chain().focus().setTextAlign('center').run()}><AlignCenter className="h-4 w-4" /></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive({ textAlign: 'right' }) ? activeButton : ''}`} onClick={() => editor?.chain().focus().setTextAlign('right').run()}><AlignRight className="h-4 w-4" /></button>
                <button type="button" className={`${toolbarButton} ${editor?.isActive({ textAlign: 'justify' }) ? activeButton : ''}`} onClick={() => editor?.chain().focus().setTextAlign('justify').run()}><AlignJustify className="h-4 w-4" /></button>
                {separator}
                <button type="button" className={`${toolbarButton} ${editor?.isActive('link') ? activeButton : ''}`} onClick={runLink}><Link2 className="h-4 w-4" /></button>
                <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser className="h-4 w-4" /></button>
                <div className="ml-auto">
                    <button type="button" className={toolbarButton} onClick={() => setDarkSurface((v) => !v)}>
                        {darkSurface ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <EditorContent editor={editor} className={`px-8 py-8 ${darkSurface ? 'text-slate-100' : 'text-slate-800'}`} />
            <input type="hidden" name={name} value={html} />
        </div>
    );
}
