create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where auth_user_id = auth.uid() and active = true
  );
$$;

revoke all on function public.current_user_is_admin() from public, anon;
grant execute on function public.current_user_is_admin() to authenticated;

create or replace function public.admin_review_payment(
  p_order_id uuid,
  p_approve boolean,
  p_reason text default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_order public.orders;
begin
  if not public.current_user_is_admin() then raise exception 'Administrator access required'; end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.status <> 'payment_submitted' then raise exception 'Order is not awaiting payment review'; end if;

  if p_approve then
    update public.payments
      set status = 'verified', verified_by = auth.uid(), verified_at = now(), rejection_reason = null
      where order_id = p_order_id and status = 'submitted';
    if not found then raise exception 'Submitted payment not found'; end if;
    update public.orders set status = 'confirmed', failure_reason = null where id = p_order_id;
  else
    if coalesce(char_length(trim(p_reason)), 0) < 3 then raise exception 'A rejection reason is required'; end if;
    update public.payments
      set status = 'rejected', verified_by = auth.uid(), verified_at = now(), rejection_reason = trim(p_reason)
      where order_id = p_order_id and status = 'submitted';
    if not found then raise exception 'Submitted payment not found'; end if;
    update public.orders set status = 'failed', failure_reason = trim(p_reason) where id = p_order_id;
    update public.products p set stock = p.stock + oi.quantity
      from public.order_items oi
      where oi.order_id = p_order_id and oi.product_id = p.id and p.stock is not null;
  end if;
end;
$$;

revoke all on function public.admin_review_payment(uuid, boolean, text) from public, anon;
grant execute on function public.admin_review_payment(uuid, boolean, text) to authenticated;

create or replace function public.admin_set_order_status(
  p_order_id uuid,
  p_status public.order_status,
  p_reason text default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_order public.orders;
  v_allowed boolean := false;
begin
  if not public.current_user_is_admin() then raise exception 'Administrator access required'; end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;

  v_allowed := case v_order.status
    when 'pending' then p_status in ('payment_submitted','cancelled')
    when 'payment_submitted' then p_status in ('cancelled')
    when 'confirmed' then p_status in ('processing','completed','failed','cancelled')
    when 'processing' then p_status in ('completed','failed','cancelled')
    else false
  end;
  if not v_allowed then raise exception 'Invalid order status transition'; end if;
  if p_status in ('failed','cancelled') and coalesce(char_length(trim(p_reason)),0) < 3 then
    raise exception 'A reason is required for failed or cancelled orders';
  end if;

  update public.orders set status = p_status,
    failure_reason = case when p_status in ('failed','cancelled') then trim(p_reason) else null end
    where id = p_order_id;

  if p_status in ('failed','cancelled') then
    update public.products p set stock = p.stock + oi.quantity
      from public.order_items oi
      where oi.order_id = p_order_id and oi.product_id = p.id and p.stock is not null;
  end if;
end;
$$;

revoke all on function public.admin_set_order_status(uuid, public.order_status, text) from public, anon;
grant execute on function public.admin_set_order_status(uuid, public.order_status, text) to authenticated;
