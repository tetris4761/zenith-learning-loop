-- Create sample folder and document for demonstration
INSERT INTO public.folders (id, name, user_id) 
VALUES ('00000000-0000-0000-0000-000000000001', 'My Notes', '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- Create sample document with content
INSERT INTO public.documents (
  id,
  title, 
  content, 
  folder_id, 
  user_id, 
  word_count
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Welcome to Documents',
  '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Welcome to Zenith Documents"}]},{"type":"paragraph","content":[{"type":"text","text":"This is your document editor where you can write, organize, and highlight important information. Here are some features you can try:"}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Key Features"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Rich text formatting with "},{"type":"text","marks":[{"type":"bold"}],"text":"bold"},{"type":"text","text":", "},{"type":"text","marks":[{"type":"italic"}],"text":"italic"},{"type":"text","text":", and "},{"type":"text","marks":[{"type":"code"}],"text":"code"},{"type":"text","text":" styling"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Create folders to organize your documents"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Search across all your documents"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Select text to create highlights and tasks"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Try selecting some text above to see the selection bubble in action!"}]},{"type":"codeBlock","content":[{"type":"text","text":"// Example code block\nfunction greetUser(name) {\n  return `Hello, ${name}! Welcome to Zenith.`;\n}"}]},{"type":"blockquote","content":[{"type":"paragraph","content":[{"type":"text","text":"\"The best way to learn is to write it down and organize your thoughts.\""}]}]},{"type":"paragraph","content":[{"type":"text","text":"Start creating your own documents and build your knowledge base!"}]}]}',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  85
)
ON CONFLICT DO NOTHING;

-- Create sample highlight
INSERT INTO public.highlights (
  id,
  document_id,
  user_id,
  anchor_data,
  text_content
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  '{"start": 150, "end": 200}',
  'Select text to create highlights and tasks'
)
ON CONFLICT DO NOTHING;