"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Link as LinkIcon, Unlink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white/[0.02] border-b border-white/10 rounded-t-xl">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<Bold size={14} />}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<Italic size={14} />}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<Strikethrough size={14} />}
      />
      
      <div className="w-px h-4 bg-white/10 mx-1" />
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<Heading1 size={14} />}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon={<Heading2 size={14} />}
      />
      
      <div className="w-px h-4 bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<List size={14} />}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<ListOrdered size={14} />}
      />

      <div className="w-px h-4 bg-white/10 mx-1" />

      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        icon={<LinkIcon size={14} />}
      />
      {editor.isActive('link') && (
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          isActive={false}
          icon={<Unlink size={14} />}
        />
      )}
    </div>
  );
};

const ToolbarButton = ({ onClick, isActive, icon }: { onClick: () => void, isActive: boolean, icon: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "p-2 rounded-lg transition-colors flex items-center justify-center",
      isActive 
        ? "bg-[rgb(0,167,157,0.2)] text-[rgb(0,167,157)]" 
        : "text-white/40 hover:text-white hover:bg-white/5"
    )}
  >
    {icon}
  </button>
);

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[rgb(0,167,157)] underline hover:text-[rgb(0,200,188)] transition-colors cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something amazing...',
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-white/20 before:float-left before:pointer-events-none',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-teal max-w-none min-h-[300px] outline-none p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden focus-within:border-[rgb(0,167,157,0.4)] transition-all">
      <MenuBar editor={editor} />
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
