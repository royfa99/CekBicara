import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('parent'), // parent, doctor, therapist
  createdAt: text('created_at').notNull()
});

export const children = sqliteTable('children', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  gender: text('gender').notNull(),
  isPremature: integer('is_premature', { mode: 'boolean' }).notNull().default(false),
  gestationalAge: integer('gestational_age'), // in weeks if premature
  familyHistory: text('family_history').default('tidak'), // ada / tidak
  createdAt: text('created_at').notNull()
});

export const screenings = sqliteTable('screenings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  childId: integer('child_id').references(() => children.id).notNull(),
  date: text('date').notNull(),
  riskLevel: text('risk_level').notNull(), // Risiko Rendah, Risiko Sedang, Risiko Tinggi
  summary: text('summary'),
  score: integer('score'), // numerical score 0-100 for charts
  createdAt: text('created_at').notNull()
});

export const screeningAnswers = sqliteTable('screening_answers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  screeningId: integer('screening_id').references(() => screenings.id).notNull(),
  questionIndex: integer('question_index').notNull(),
  questionText: text('question_text').notNull(),
  answer: integer('answer', { mode: 'boolean' }).notNull()
});

export const screeningResults = sqliteTable('screening_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  screeningId: integer('screening_id').references(() => screenings.id).notNull(),
  redFlags: text('red_flags').notNull(), // JSON array stored as text
  strengths: text('strengths').notNull(), // JSON array stored as text
  recommendations: text('recommendations').notNull(), // JSON array stored as text
  stimulationPlan: text('stimulation_plan').notNull() // JSON array stored as text
});
