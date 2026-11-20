-- =============================================================================
-- Samudra :: 0005 :: home + global content from the approved homepage
--
-- Replaces the content seeded in 0004 with the field shapes the final design
-- needs (buttons that open the booking picker, per-location contact details,
-- photo focus points) and points every image at the files extracted from the
-- approved page into apps/web/public/images.
-- =============================================================================

update public.page_sections s
   set content = $json$
{
  "menuLabel": "Menu",
  "logo": "/images/samudhra.png",
  "actions": [
    { "label": "Order Online", "action": "order",   "href": "", "style": "outline" },
    { "label": "Reservations", "action": "reserve", "href": "", "style": "solid"   }
  ],
  "navGroups": [
    { "heading": "Our Menu",          "links": "Food & Drinks | #menu\nWeekend Thali | #thali" },
    { "heading": "Dining & Lounge",   "links": "Dining Experience | /dining\nPhoto Gallery | /dining#gallery" },
    { "heading": "Catering & Events", "links": "Catering Menu | /catering\nEvent Inquiry | /catering#inquiry" },
    { "heading": "Our Story",         "links": "About Samudhra | #story" },
    { "heading": "Contact",           "links": "Location & Hours | #contact\nContact Details | #contact" }
  ],
  "panelAddress": "[Location One address]\n[Location Two address]"
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'global' and s.key = 'header';

update public.page_sections s
   set content = $json$
{
  "logo": "/images/samudhra.png",
  "tagline": "Tradition, reinterpreted. A contemporary expression of Indian warmth.",
  "columns": [
    { "heading": "Our Menu",          "links": "Food & Drinks | #menu\nWeekend Thali | #thali" },
    { "heading": "Dining & Lounge",   "links": "Dining Experience | /dining\nPhoto Gallery | /dining#gallery" },
    { "heading": "Catering & Events", "links": "Catering Menu | /catering\nEvent Inquiry | /catering#inquiry" },
    { "heading": "Our Story",         "links": "About Samudhra | #story" },
    { "heading": "Contact",           "links": "Location & Hours | #contact\nContact Details | #contact" }
  ],
  "legal": "© 2026 Samudhra",
  "note": "Prototype — [bracketed] details are placeholders",
  "markImage": "/images/photo-2.png"
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'global' and s.key = 'footer';

update public.page_sections s
   set content = $json$
{
  "eyebrow": "Contemporary Indian Dining",
  "titleLine1": "Tradition",
  "titleLine2": "Reinterpreted",
  "subtitle": "A contemporary expression of Indian warmth",
  "backgroundImage": "/images/photo-3.jpg",
  "imagePosition": "52% 56%",
  "actions": [
    { "label": "Reserve a Table", "action": "reserve", "href": "" },
    { "label": "Order Online",    "action": "order",   "href": "" },
    { "label": "Private Events",  "action": "link",    "href": "#catering" }
  ]
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'home' and s.key = 'hero';

update public.page_sections s
   set content = $json$
{
  "eyebrow": "Our Menu",
  "heading": "From the Samudhra kitchen",
  "body": "Each dish begins with the traditions, spices and regional flavours that shape Indian cooking — interpreted through a modern dining experience.",
  "starImage": "/images/photo-9.png",
  "cards": [
    {
      "numeral": "i.", "title": "Curries",
      "description": "Rooted in tradition, rich with spice.",
      "image": "/images/a-white-bowl-of-curry-finished-with-cori.webp",
      "imageMode": "cutout", "imagePosition": "", "imageScale": "",
      "linkLabel": "View menu", "href": "#menu"
    },
    {
      "numeral": "ii.", "title": "Signature Plates",
      "description": "Familiar flavours, refined for the table.",
      "image": "/images/photo-3.jpg",
      "imageMode": "plate", "imagePosition": "47% 52%", "imageScale": "1.25",
      "linkLabel": "View menu", "href": "#menu"
    },
    {
      "numeral": "iii.", "title": "Biryani",
      "description": "Fresh, vibrant and distinctly Samudhra.",
      "image": "/images/biryani-with-egg-fried-onions-and-lime.jpg",
      "imageMode": "plate", "imagePosition": "40% 50%", "imageScale": "1.3",
      "linkLabel": "View menu", "href": "#menu"
    }
  ],
  "ctaLabel": "Order Online",
  "action": "order",
  "ctaHref": ""
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'home' and s.key = 'menu-showcase';

update public.page_sections s
   set content = $json$
{
  "eyebrow": "Our Menu · Weekends at Samudhra",
  "titleLine1": "Weekend",
  "titleLine2": "Thali",
  "body": "Many small bowls around one plate — curries, dal, rice and accompaniments. A generous way to taste a little of everything.",
  "plateImage": "/images/a-thali-of-small-bowls-around-rice-seen-.jpg",
  "frames": [
    { "image": "/images/photo-7.jpg", "alt": "Cocktails on the bar",       "imagePosition": "45% 60%" },
    { "image": "/images/photo-6.jpg", "alt": "A bartender mixing a drink", "imagePosition": "45% 40%" },
    { "image": "/images/biryani-with-egg-fried-onions-and-lime.jpg", "alt": "Biryani with egg and lime", "imagePosition": "" },
    { "image": "/images/photo-3.jpg", "alt": "Plated dish with beetroot",  "imagePosition": "" }
  ],
  "actions": [
    { "label": "Reserve for the Weekend", "action": "reserve", "href": "" },
    { "label": "View Thali Menu",         "action": "link",    "href": "#menu" }
  ]
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'home' and s.key = 'weekend-thali';

update public.page_sections s
   set content = $json$
{
  "eyebrow": "02 — Dining & Lounge",
  "heading": "Stay a While",
  "body": "From the first plate to the last pour — an evening at Samudhra is meant to be lingered over.",
  "rows": [
    {
      "title": "Dining Experience",
      "description": "The dining room, service and the evening at the table.",
      "image": "/images/photo-3.jpg", "imagePosition": "", "href": "/dining"
    },
    {
      "title": "The Lounge",
      "description": "Cocktails and conversation, poured with care for spice and balance.",
      "image": "/images/photo-6.jpg", "imagePosition": "45% 40%", "href": "/dining#lounge"
    },
    {
      "title": "Photo Gallery",
      "description": "Food, drinks and the rooms they are served in.",
      "image": "/images/photo-7.jpg", "imagePosition": "50% 60%", "href": "/dining#gallery"
    }
  ]
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'home' and s.key = 'dining-lounge';

update public.page_sections s
   set content = $json$
{
  "eyebrow": "03 — About Samudhra",
  "heading": "Our Story",
  "quote": "What begins in tradition becomes something new at the table.",
  "body": "Each dish begins with the traditions, spices, and regional flavors that shape Indian cooking, interpreted through a modern dining experience. The menu brings familiar flavors into a refined setting — rooted in tradition, still fresh, vibrant, and distinctly Samudhra.",
  "markImage": "/images/photo-10.png",
  "ctaLabel": "About Samudhra",
  "action": "link",
  "ctaHref": "#story"
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'home' and s.key = 'our-story';

update public.page_sections s
   set content = $json$
{
  "eyebrow": "04 — Catering & Events",
  "heading": "Bring the Table to You",
  "body": "Celebrations, gatherings and occasions large or small — shaped around your guests, at Samudhra or wherever you host.",
  "cards": [
    {
      "titleLine1": "Catering", "titleLine2": "Menu",
      "note": "For gatherings of every size",
      "image": "/images/biryani-with-egg-fried-onions-and-lime.jpg",
      "imagePosition": "45% 55%",
      "linkLabel": "View the menu", "action": "link", "href": "/catering"
    },
    {
      "titleLine1": "Event", "titleLine2": "Inquiry",
      "note": "Tell us about your occasion",
      "image": "/images/a-thali-of-small-bowls-around-rice-seen-.jpg",
      "imagePosition": "",
      "linkLabel": "Start an inquiry", "action": "enquiry", "href": ""
    }
  ]
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'home' and s.key = 'catering-events';

update public.page_sections s
   set content = $json$
{
  "eyebrow": "05 — Contact",
  "heading": "Find Us",
  "body": "Location & hours, and how to reach the team for reservations, orders and events.",
  "actions": [
    { "label": "Reserve a Table", "action": "reserve", "href": "" },
    { "label": "Order Online",    "action": "order",   "href": "" }
  ],
  "locations": [
    {
      "label": "Location 01", "name": "[Location One]",
      "address": "[Street, city, postcode]", "hours": "[Mon–Sun hours]",
      "phone": "[Phone]", "email": "[Email]", "linkLabel": "Reserve here"
    },
    {
      "label": "Location 02", "name": "[Location Two]",
      "address": "[Street, city, postcode]", "hours": "[Mon–Sun hours]",
      "phone": "[Phone]", "email": "[Email]", "linkLabel": "Reserve here"
    }
  ]
}
$json$::jsonb
  from public.pages p
 where s.page_id = p.id and p.slug = 'home' and s.key = 'contact';
