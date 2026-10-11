/*
# Fix demo user password hashes

The original seed used crypt('demo1234', gen_salt('bf')) which produces
$2a$06$ cost factor hashes. Supabase GoTrue expects $2a$10$ cost factor.
This re-hashes all demo user passwords to the correct format.
*/

UPDATE auth.users
SET encrypted_password = crypt('demo1234', gen_salt('bf', 10))
WHERE email IN (
  'demo.senior@careconnect.app',
  'demo.senior2@careconnect.app',
  'demo.caregiver@careconnect.app',
  'demo.caregiver2@careconnect.app'
);
