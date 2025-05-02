import { 
    ToggleButtonGroup, 
    ToggleButton,
    Button,
    Divider,
    Box
  } from '@mui/material';
  import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatListBulleted,
    FormatListNumbered,
    InsertPhoto,
    Link
  } from '@mui/icons-material';
  
  const EditorToolbar = ({ editor }) => {
    if (!editor) return null;
  
    const addImage = () => {
      const url = window.prompt('Enter the URL of the image:');
      if (url) editor.chain().focus().setImage({ src: url }).run();
    };
  
    const setLink = () => {
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);
  
      if (url === null) return;
      if (url === '') {
        editor.chain().focus().unsetLink().run();
        return;
      }
  
      editor.chain().focus().setLink({ href: url }).run();
    };
  
    return (
      <Box sx={{ mb: 1 }}>
        <ToggleButtonGroup size="small" sx={{ flexWrap: 'wrap' }}>
          <ToggleButton
            value="bold"
            selected={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBold fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="italic"
            selected={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalic fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="underline"
            selected={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FormatUnderlined fontSize="small" />
          </ToggleButton>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          
          <ToggleButton
            value="bulletList"
            selected={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulleted fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="orderedList"
            selected={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumbered fontSize="small" />
          </ToggleButton>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          
          <Button
            size="small"
            startIcon={<InsertPhoto fontSize="small" />}
            onClick={addImage}
          >
            Image
          </Button>
          <Button
            size="small"
            startIcon={<Link fontSize="small" />}
            onClick={setLink}
          >
            Link
          </Button>
        </ToggleButtonGroup>
      </Box>
    );
  };
  
  export default EditorToolbar;