-- Custom SQL migration file, put your code below! --
CREATE VIRTUAL TABLE lists_fts USING fts5(
  title,
  description,
  content='lists',
  content_rowid='id'
);