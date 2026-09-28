-- 1) Create the admin as a normal email/password user in Supabase Auth.
-- 2) Confirm the admin email.
-- 3) Replace the UUID below with that auth.users.id and run this once.
-- Never put the admin password in this repository.
insert into public.admin_users (auth_user_id, role, active)
values ('00000000-0000-0000-0000-000000000000', 'super_admin', true);
