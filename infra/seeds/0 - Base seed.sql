-- Seed data for word_banks
INSERT INTO word_banks (title, description) VALUES
('Basic Vocabulary', 'A collection of basic vocabulary words'),
('Advanced Vocabulary', 'A collection of advanced vocabulary words');

-- Seed data for entries
INSERT INTO entries (term, pronunciation) VALUES
('apple', 'ˈæpəl'),
('banana', 'bəˈnænə'),
('cat', 'kæt'),
('dog', 'dɔɡ'),
('bark', 'bɑrk'),
('chase', 'tʃeɪs');

-- Seed data for word_banks_entries
INSERT INTO word_banks_entries (word_bank_id, entry_id) VALUES
((SELECT word_bank_id FROM word_banks WHERE title = 'Basic Vocabulary'), (SELECT entry_id FROM entries WHERE term = 'apple')),
((SELECT word_bank_id FROM word_banks WHERE title = 'Basic Vocabulary'), (SELECT entry_id FROM entries WHERE term = 'banana')),
((SELECT word_bank_id FROM word_banks WHERE title = 'Basic Vocabulary'), (SELECT entry_id FROM entries WHERE term = 'cat')),
((SELECT word_bank_id FROM word_banks WHERE title = 'Basic Vocabulary'), (SELECT entry_id FROM entries WHERE term = 'dog')),
((SELECT word_bank_id FROM word_banks WHERE title = 'Advanced Vocabulary'), (SELECT entry_id FROM entries WHERE term = 'bark')),
((SELECT word_bank_id FROM word_banks WHERE title = 'Advanced Vocabulary'), (SELECT entry_id FROM entries WHERE term = 'chase'));

-- Seed data for definitions
INSERT INTO definitions (definition_text, examples, entry_id) VALUES
('A fruit that is typically red, green, or yellow and has a sweet taste.', ARRAY['I ate an apple for breakfast.', 'She picked an apple from the tree.'], (SELECT entry_id FROM entries WHERE term = 'apple')),
('A long curved fruit that grows in clusters and has soft pulpy flesh and yellow skin when ripe.', ARRAY['He ate a banana after his workout.', 'She made a banana smoothie.'], (SELECT entry_id FROM entries WHERE term = 'banana')),
('A small domesticated carnivorous mammal with soft fur, a short snout, and retractile claws.', ARRAY['The cat chased the mouse.', 'She has a black cat as a pet.'], (SELECT entry_id FROM entries WHERE term = 'cat')),
('A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, and a barking, howling, or whining voice.', ARRAY['The dog barked loudly.', 'He took his dog for a walk.'], (SELECT entry_id FROM entries WHERE term = 'dog')),
('The sound a dog makes.', ARRAY['The dog let out a loud bark.', 'The bark echoed through the forest.'], (SELECT entry_id FROM entries WHERE term = 'bark')),
('To pursue in order to catch or catch up with.', ARRAY['The dog chased the cat.', 'She chased after the thief.'], (SELECT entry_id FROM entries WHERE term = 'chase'));