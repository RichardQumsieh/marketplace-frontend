import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link,
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when `value` prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 1,
        minHeight: 200,
        '& .tiptap': {
          minHeight: 150,
          p: 1,
          '&:focus-visible': {
            outline: 'none',
          },
          '& h1, h2, h3, h4, h5, h6': {
            lineHeight: 1.2,
          },
          '& ul, ol': {
            pl: 2,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
          },
        },
      }}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Tip: Use headings, lists, and images to make your description engaging
      </Typography>
    </Box>
  );
};

export default RichTextEditor;