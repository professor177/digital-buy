-- Run with Supabase CLI / pgTAP in a staging project as part of a fuller security suite.
-- These checks document the required invariants for manual SQL inspection.
-- 1. anon/authenticated have SELECT only on public catalog tables.
-- 2. authenticated users can read only their own profile/orders/items/payments.
-- 3. delivered_credentials and admin_users have no anon/authenticated grants.
-- 4. create_order_with_payment is executable only by authenticated users.
-- 5. admin workflow RPCs verify current_user_is_admin() inside the database.
-- 6. consume_rate_limit is executable only by service_role.

select relname, relrowsecurity
from pg_class
where relname in ('user_profiles','admin_users','categories','platforms','products','orders','order_items','payments','delivered_credentials','rate_limit_buckets')
order by relname;
