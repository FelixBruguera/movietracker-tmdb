DROP TABLE lists_fts;

CREATE VIRTUAL TABLE lists_fts USING fts5(
  name,
  description,
  content='lists',
  content_rowid='id'
);
