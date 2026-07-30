-- resync user id sequence
SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE((SELECT MAX(id) FROM "User"), 1));
