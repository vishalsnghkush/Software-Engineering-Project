import { pgTable, uuid } from "drizzle-orm/pg-core";
import { tags } from "./tags";
import { questionPapers } from "./questionPapers";

export const tagsQp = pgTable("tags_qp", {
  id: uuid().primaryKey().defaultRandom(),
  tagId: uuid().references(() => tags.id, { onDelete: "cascade" }),
  qpId: uuid().references(() => questionPapers.id, { onDelete: "cascade" }),
});
