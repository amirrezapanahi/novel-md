import { JSONContent } from '@tiptap/react';
export declare const isWhiteSpaceOnly: (s: string) => boolean;
export declare const htmlToMarkdown: (editorContent: string) => string;
export declare const markdownToHtml: (markdownContent: string) => string;
export declare const htmlToEditorState: (html: string) => JSONContent;
