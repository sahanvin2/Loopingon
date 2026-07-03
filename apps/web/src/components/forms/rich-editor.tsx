"use client";

import React, { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import UnderlineExtension from "@tiptap/extension-underline";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Strikethrough,
  Quote,
  Code,
  Minus,
  FileText,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/api-client";
import { toast } from "sonner";

interface RichEditorProps {
  content?: string;
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  label,
  icon: Icon,
  disabled,
}: {
  onClick: () => void;
  isActive?: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded text-muted-600 hover:bg-muted-100 transition-colors flex items-center justify-center",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        isActive && "bg-primary-100 text-primary-700",
      )}
      aria-label={label}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export function RichEditor({
  content,
  value,
  onChange,
  placeholder = "Write something...",
  className,
}: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const initialContent = value ?? content ?? "";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-600 underline hover:text-primary-700",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      UnderlineExtension,
      PlaceholderExtension.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
          "text-text-700",
        ),
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadFile<any>("/media/upload", file, "file", { folder: "documents" });
      const url = res.data?.url || res.url || res;
      
      // If it's an image, embed it. Otherwise, create a link with the file name.
      if (file.type.startsWith("image/")) {
        editor.chain().focus().setImage({ src: url }).run();
      } else {
        editor.chain().focus().insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a> `).run();
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      className={cn(
        "border border-accent-300 rounded-lg overflow-hidden bg-white",
        "focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent",
        className,
      )}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileUpload}
        accept="application/pdf,image/*,.doc,.docx,.txt"
      />
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-accent-200 bg-surface-50 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          label="Bold"
          icon={Bold}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          label="Italic"
          icon={Italic}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          label="Underline"
          icon={UnderlineIcon}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          label="Strikethrough"
          icon={Strikethrough}
        />

        <div className="w-px h-5 bg-surface-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          label="Heading 1"
          icon={Heading1}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          label="Heading 2"
          icon={Heading2}
        />

        <div className="w-px h-5 bg-surface-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          label="Bullet List"
          icon={List}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          label="Numbered List"
          icon={ListOrdered}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          label="Quote"
          icon={Quote}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          label="Code"
          icon={Code}
        />

        <div className="w-px h-5 bg-surface-300 mx-1" />

        <ToolbarButton onClick={addLink} label="Add Link" icon={LinkIcon} />
        <ToolbarButton onClick={addImage} label="Add Image via URL" icon={ImageIcon} />
        
        <ToolbarButton 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUploading}
          label="Upload File/PDF" 
          icon={isUploading ? Loader2 : FileText} 
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          label="Divider"
          icon={Minus}
        />

        <div className="flex-1" />

        <div className="w-px h-5 bg-surface-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          label="Undo"
          icon={Undo2}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          label="Redo"
          icon={Redo2}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
