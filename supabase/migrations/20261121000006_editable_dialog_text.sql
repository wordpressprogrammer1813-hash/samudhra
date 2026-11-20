-- =============================================================================
-- Samudra :: 0006 :: the last hardcoded words become editable
--
-- The page copy was already content. This moves the remaining interface text
-- - the reserve/order dialog, the event enquiry form and the spoken labels on
-- the menu and hero controls - into the same model, so nothing a visitor can
-- read is stuck in the code.
-- =============================================================================

-- Merge the new keys in; existing values are left alone.
update public.page_sections s
   set content = content || $json$
{
  "openMenuLabel": "Open site menu",
  "closeMenuLabel": "Close menu"
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'global' and s.key = 'header';

update public.page_sections s
   set content = content || $json$
{
  "scrollLabel": "Scroll down",
  "pauseLabel": "Pause animations",
  "playLabel": "Play animations"
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'home' and s.key = 'hero';

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'booking-dialog', 'bookingDialog', 'Reserve & order dialog', 2, $json$
{
  "choosePrompt": "Choose a location",
  "closeLabel": "Close",
  "switchLabel": "Switch Location",
  "noticeTag": "Prototype",

  "reserveTitle": "Reserve a Table",
  "reservePrompt": "Where would you like to dine?",
  "reserveLead": "On the live site this opens the reservation system for",
  "reserveNote": "The booking link hasn’t been supplied, so no table has been reserved.",

  "orderTitle": "Order Online",
  "orderPrompt": "Order from which location?",
  "orderLead": "On the live site this opens online ordering for",
  "orderNote": "The ordering link hasn’t been supplied, so no order has been placed."
}
$json$::jsonb
from public.pages p where p.slug = 'global'
on conflict (page_id, key) do nothing;

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'enquiry-form', 'enquiryForm', 'Event enquiry form', 3, $json$
{
  "eyebrow": "Catering & Events",
  "title": "Event Inquiry",
  "closeLabel": "Close",

  "locationLabel": "Location",
  "nameLabel": "Name",
  "emailLabel": "Email",
  "dateLabel": "Date",
  "guestsLabel": "Guests",
  "occasionLabel": "Your occasion",

  "submitLabel": "Send Inquiry",
  "footnote": "Prototype form — not sent.",
  "errorText": "Choose a location for your inquiry.",
  "sentTag": "Prototype — not sent",
  "sentText": "This form isn’t connected to an events inbox yet, so nothing has been sent."
}
$json$::jsonb
from public.pages p where p.slug = 'global'
on conflict (page_id, key) do nothing;
