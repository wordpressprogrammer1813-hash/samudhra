'use client';

import { useState, type FormEvent } from 'react';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/scroll-reveal';

interface MenuDish {
  name: string;
  price: string;
  ingredients: string;
  story: string;
  dietary: string;
  isVeg: boolean;
}

function VegSymbol({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      className={`inline-grid size-3.5 shrink-0 place-items-center rounded-[2px] border ${
        isVeg ? 'border-emerald-700' : 'border-red-700'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${isVeg ? 'bg-emerald-700' : 'bg-red-700'}`}
      />
    </span>
  );
}

interface MenuCategory {
  id: string;
  title: string;
  theme: 'serenade' | 'zest' | 'heath';
  imageSide: 'left' | 'right';
  image: string;
  dishes: MenuDish[];
}

const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'signature-plates',
    title: 'Signature Plates',
    theme: 'serenade',
    imageSide: 'right',
    image: '/images/beetroot-dish.jpg',
    dishes: [
      {
        name: 'Beetroot Murgh Tikka',
        price: '$24',
        ingredients: 'Chicken tikka, roasted beetroot, watermelon radish',
        story: 'Char-grilled free-range chicken marinated in spiced yogurt, served over roasted beetroot purée and crisp radish.',
        dietary: 'Gluten-Free · 420 kcal',
        isVeg: false,
      },
      {
        name: 'Tandoori Broccoli',
        price: '$16',
        ingredients: 'Cheese & cashew marinade, chaat masala',
        story: 'Tender florets glazed in aged cheddar, roasted cashew cream, and smoky tandoor char.',
        dietary: 'Vegetarian · 310 kcal',
        isVeg: true,
      },
      {
        name: 'Lamb Seekh Kebab',
        price: '$22',
        ingredients: 'Minced lamb, mint chutney, pickled onion',
        story: 'Hand-minced spiced lamb skewers roasted over live coals with bright garden mint.',
        dietary: 'Gluten-Free · 480 kcal',
        isVeg: false,
      },
      {
        name: 'Paneer Tikka Shashlik',
        price: '$18',
        ingredients: 'Paneer, peppers, onion, ajwain',
        story: 'House-pressed cottage cheese skewered with charred bell peppers and carom seed.',
        dietary: 'Vegetarian · 390 kcal',
        isVeg: true,
      },
    ],
  },
  {
    id: 'curries',
    title: 'Curries',
    theme: 'serenade',
    imageSide: 'left',
    image: '/images/curry-bowl.webp',
    dishes: [
      {
        name: 'Butter Chicken',
        price: '$23',
        ingredients: 'Tandoori chicken, tomato & butter makhani',
        story: 'Slow-simmered vine tomatoes, cultured butter, and dried fenugreek leaves.',
        dietary: 'Gluten-Free · 620 kcal',
        isVeg: false,
      },
      {
        name: 'Dal Makhani',
        price: '$17',
        ingredients: 'Black lentils, cooked overnight',
        story: 'Whole urad lentils simmered for 18 hours over dying embers with ginger and cream.',
        dietary: 'Vegetarian · Gluten-Free · 440 kcal',
        isVeg: true,
      },
      {
        name: 'Lamb Rogan Josh',
        price: '$26',
        ingredients: 'Kashmiri chilli, fennel, dry ginger',
        story: 'Braised lamb shoulder in an aromatic Kashmiri gravy tinted with ratan jot.',
        dietary: 'Gluten-Free · 590 kcal',
        isVeg: false,
      },
      {
        name: 'Palak Paneer',
        price: '$19',
        ingredients: 'Spinach, paneer, garlic tadka',
        story: 'Velvety baby spinach tempered with toasted garlic, cumin, and soft paneer.',
        dietary: 'Vegetarian · Gluten-Free · 410 kcal',
        isVeg: true,
      },
      {
        name: 'Goan Prawn Curry',
        price: '$27',
        ingredients: 'Coconut, kokum, tamarind',
        story: 'Coastal tiger prawns simmered in fresh pressed coconut milk and tangy kokum.',
        dietary: 'Gluten-Free · Dairy-Free · 460 kcal',
        isVeg: false,
      },
    ],
  },
  {
    id: 'biryani-rice',
    title: 'Biryani & Rice',
    theme: 'serenade',
    imageSide: 'right',
    image: '/images/biryani-dish.jpg',
    dishes: [
      {
        name: 'Hyderabadi Chicken Dum Biryani',
        price: '$25',
        ingredients: 'Aged basmati, saffron, egg, raita',
        story: 'Sealed in pastry and slow-steamed with caramelized onions, mint, and saffron milk.',
        dietary: '680 kcal',
        isVeg: false,
      },
      {
        name: 'Subz Dum Biryani',
        price: '$20',
        ingredients: 'Seasonal vegetables, saffron, mint',
        story: 'Layered market vegetables and fragrant basmati steamed with rose water and whole spices.',
        dietary: 'Vegetarian · 520 kcal',
        isVeg: true,
      },
      {
        name: 'Gosht Biryani',
        price: '$28',
        ingredients: 'Lamb, whole spices, kewra',
        story: 'Bone-in lamb braised until tender and steamed beneath long-grain basmati.',
        dietary: '740 kcal',
        isVeg: false,
      },
      {
        name: 'Saffron Jeera Rice',
        price: '$7',
        ingredients: 'Basmati, cumin, ghee',
        story: 'Fluffy aged basmati tempered with toasted cumin seeds and clarified butter.',
        dietary: 'Vegetarian · Gluten-Free · 290 kcal',
        isVeg: true,
      },
    ],
  },
  {
    id: 'weekend-thali',
    title: 'Weekend Thali',
    theme: 'zest',
    imageSide: 'left',
    image: '/images/thali-plate.jpg',
    dishes: [
      {
        name: 'Samudhra Vegetarian Thali',
        price: '$32',
        ingredients: 'Eight bowls, rice, bread & dessert',
        story: 'A rotating weekend feast of seasonal curries, dal, raita, farsan, naan, rice, and mithai.',
        dietary: 'Vegetarian · Sat & Sun',
        isVeg: true,
      },
      {
        name: 'Samudhra Non-Vegetarian Thali',
        price: '$38',
        ingredients: 'Chicken, lamb, dal, rice & dessert',
        story: 'Our signature weekend platter pairing regional meat curries with classic accompaniments.',
        dietary: 'Sat & Sun',
        isVeg: false,
      },
      {
        name: 'Little Thali',
        price: '$18',
        ingredients: 'A gentle thali for younger guests',
        story: 'Mild butter curry, dal, warm naan, basmati rice, and mango sweet.',
        dietary: 'Kids · Sat & Sun',
        isVeg: true,
      },
    ],
  },
  {
    id: 'bar-cocktails',
    title: 'Bar & Cocktails',
    theme: 'heath',
    imageSide: 'right',
    image: '/images/cocktails-bar.jpg',
    dishes: [
      {
        name: 'Saffron Old Fashioned',
        price: '$15',
        ingredients: 'Bourbon, saffron honey, star anise',
        story: 'Small-batch bourbon stirred with Kashmiri saffron honey and smoked star anise.',
        dietary: 'Signature Cocktail',
        isVeg: true,
      },
      {
        name: 'Masala Chai Martini',
        price: '$14',
        ingredients: 'Vodka, chai reduction, cardamom',
        story: 'Velvety espresso-style martini shaken with spiced Assam chai reduction.',
        dietary: 'Signature Cocktail',
        isVeg: true,
      },
      {
        name: 'Rose & Cardamom Spritz',
        price: '$13',
        ingredients: 'Gin, rose, cardamom, soda',
        story: 'Botanical gin lifted with Damascus rose water, crushed green cardamom, and crisp soda.',
        dietary: 'Signature Cocktail',
        isVeg: true,
      },
      {
        name: 'Mango Lassi',
        price: '$7',
        ingredients: 'Alphonso mango, yoghurt — zero proof',
        story: 'Chilled Ratnagiri Alphonso mango blended with house-cultured yogurt and cardamom.',
        dietary: 'Zero Proof · Vegetarian',
        isVeg: true,
      },
    ],
  },
];

const GUEST_OPTIONS = ['1 guest', '2 guests', '3 guests', '4 guests', '5 guests', '6+ guests'];
const TIME_OPTIONS = ['5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm'];

export function MenuPageClient() {
  const [activeDish, setActiveDish] = useState<string | null>(null);
  const [reservation, setReservation] = useState({
    guests: '2 guests',
    date: '',
    time: '7:00 pm',
  });
  const [booked, setBooked] = useState(false);

  function scrollToCategory(id: string) {
    window.dispatchEvent(
      new CustomEvent('samudhra:scroll-to', { detail: { target: `#${id}`, offset: -80 } }),
    );
  }

  function handleReserveSubmit(e: FormEvent) {
    e.preventDefault();
    setBooked(true);
  }

  return (
    <main id="top" className="overflow-x-hidden bg-serenade text-heath">
      {/* ================= 01. TOP HERO BANNER IMAGE ================= */}
      <section aria-label="The Menu showcase image" className="w-full overflow-hidden bg-creole">
        <div className="h-[calc(100dvh-72px)] min-h-[480px] w-full sm:h-[calc(100dvh-92px)]">
          <ImageWithFallback
            src="/images/thali-plate.jpg"
            alt="Samudhra traditional thali spread"
            className="size-full object-cover"
          />
        </div>
      </section>

      {/* ================= 02. THE MENU INTRO & CATEGORY JUMP PILLS ================= */}
      <section className="border-b border-heath/12 bg-serenade pt-[clamp(56px,6vw,90px)] pb-[clamp(48px,5vw,76px)]">
        <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
          <Reveal>
            <p className="text-[clamp(10px,0.8vw,11px)] font-semibold tracking-[0.26em] text-zest uppercase">
              Samudhra · Contemporary Indian
            </p>
            <h1 className="mt-3 text-[clamp(54px,11.8vw,170px)] leading-[0.94] font-normal tracking-[-0.025em] text-heath">
              The Menu
            </h1>
            <p className="mt-5 max-w-[540px] text-[clamp(14px,1.15vw,16px)] leading-[1.68] text-heath/75">
              Regional recipes, seasonal produce and a few family secrets — plated for today. Hover
              over any dish, or tap it on your phone, to read the full story: ingredients, nutrition
              and price.
            </p>

            {/* Category Jump Buttons — Smooth Scroll to Sections Below */}
            <nav aria-label="Menu categories" className="mt-7 flex flex-wrap gap-2.5">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToCategory(cat.id)}
                  className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-heath/25 bg-transparent px-4.5 text-[11px] font-medium tracking-[0.04em] text-heath transition-colors duration-300 hover:border-heath hover:bg-heath hover:text-serenade cursor-pointer"
                >
                  {cat.title}
                </button>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {/* ================= 03–07. MENU CATEGORY SECTIONS ================= */}
      {MENU_CATEGORIES.map((cat) => {
        const isHeath = cat.theme === 'heath';
        const isZest = cat.theme === 'zest';
        const bgClass = isHeath
          ? 'bg-heath text-serenade'
          : isZest
            ? 'bg-zest text-heath'
            : 'bg-serenade text-heath border-b border-heath/12';
        const mutedClass = isHeath ? 'text-serenade/70' : 'text-heath/75';
        const dividerClass = isHeath ? 'divide-serenade/15' : 'divide-heath/15';

        const dishList = (
          <Reveal className="lg:col-span-6">
            <div>
              <h2 className="text-[clamp(28px,2.8vw,40px)] leading-[1.1] font-normal tracking-[-0.01em]">
                {cat.title}
              </h2>

              <div className={`mt-6 divide-y ${dividerClass}`}>
                {cat.dishes.map((dish) => {
                  const dishKey = `${cat.id}-${dish.name}`;
                  const isExpanded = activeDish === dishKey;
                  return (
                    <div
                      key={dish.name}
                      onMouseEnter={() => setActiveDish(dishKey)}
                      onMouseLeave={() => setActiveDish(null)}
                      onClick={() => setActiveDish(isExpanded ? null : dishKey)}
                      className="group cursor-pointer py-3.5 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="flex items-center gap-2.5 text-[clamp(13px,1vw,14px)] font-medium tracking-[0.01em]">
                          <VegSymbol isVeg={dish.isVeg} />
                          <span>{dish.name}</span>
                        </span>
                        <span className="text-[clamp(14px,1.15vw,16px)] font-medium tabular-nums">
                          {dish.price}
                        </span>
                      </div>
                      <p className={`mt-1 pl-6 text-[clamp(12px,0.95vw,14px)] leading-[1.5] ${mutedClass}`}>
                        {dish.ingredients}
                      </p>

                      {/* Expandable Story & Nutrition on Hover / Tap */}
                      <div
                        className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isExpanded
                            ? 'mt-2 grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className={`text-[11px] leading-[1.55] ${mutedClass}`}>{dish.story}</p>
                          <span
                            className={`mt-1 inline-block text-[10px] font-semibold tracking-[0.14em] uppercase ${
                              isHeath ? 'text-zest' : isZest ? 'text-heath' : 'text-korma'
                            }`}
                          >
                            {dish.dietary}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        );

        const photoBlock = (
          <Reveal variant="clip" delay={120} className="lg:col-span-6">
            <div className="group mx-auto aspect-[4/4.2] w-full max-w-[440px] overflow-hidden rounded-[18px] bg-creole/20 shadow-[0_24px_50px_-16px_rgba(29,5,6,0.4)]">
              <ImageWithFallback
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </div>
          </Reveal>
        );

        return (
          <section
            key={cat.id}
            id={cat.id}
            aria-label={cat.title}
            className={`scroll-mt-20 py-[clamp(64px,7vw,105px)] ${bgClass}`}
          >
            <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                {cat.imageSide === 'left' ? (
                  <>
                    <div className="order-2 lg:order-1 lg:col-span-6">{photoBlock}</div>
                    <div className="order-1 lg:order-2 lg:col-span-6">{dishList}</div>
                  </>
                ) : (
                  <>
                    <div className="lg:col-span-6">{dishList}</div>
                    <div className="lg:col-span-6">{photoBlock}</div>
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* ================= 08. BOTTOM RESERVATION BAR ================= */}
      <section
        aria-labelledby="menu-reservation-title"
        className="border-t border-serenade/15 bg-heath py-[clamp(56px,6vw,84px)] text-serenade"
      >
        <div className="mx-auto max-w-[880px] px-6 sm:px-10">
          <Reveal>
            <h2
              id="menu-reservation-title"
              className="text-center text-[clamp(28px,2.8vw,40px)] font-normal tracking-[-0.01em] text-serenade"
            >
              Reservation
            </h2>

            {booked ? (
              <div className="mt-8 rounded-[14px] border border-zest/40 bg-creole/40 p-5 text-center">
                <p className="text-[clamp(14px,1.15vw,16px)] text-serenade/90">
                  Table request noted for <strong className="font-medium">{reservation.guests}</strong>{' '}
                  at <strong className="font-medium">{reservation.time}</strong>. Our team will
                  confirm shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setBooked(false)}
                  className="mt-3 text-[11px] font-semibold tracking-[0.16em] text-zest uppercase hover:text-serenade cursor-pointer"
                >
                  Modify request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleReserveSubmit}
                className="mt-8 grid grid-cols-1 items-end gap-6 sm:grid-cols-4"
              >
                <label className="block">
                  <span className="block text-[10px] font-medium tracking-[0.2em] text-serenade/65 uppercase">
                    Guests
                  </span>
                  <select
                    value={reservation.guests}
                    onChange={(e) =>
                      setReservation((prev) => ({ ...prev, guests: e.target.value }))
                    }
                    className="mt-1.5 w-full border-b border-serenade/25 bg-heath pb-2 text-[clamp(14px,1.15vw,16px)] text-serenade outline-none focus:border-zest cursor-pointer"
                  >
                    {GUEST_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-heath text-serenade">
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="block text-[10px] font-medium tracking-[0.2em] text-serenade/65 uppercase">
                    Date
                  </span>
                  <input
                    type="date"
                    value={reservation.date}
                    onChange={(e) => setReservation((prev) => ({ ...prev, date: e.target.value }))}
                    className="mt-1.5 w-full border-b border-serenade/25 bg-transparent pb-2 text-[clamp(14px,1.15vw,16px)] text-serenade scheme-dark outline-none focus:border-zest"
                  />
                </label>

                <label className="block">
                  <span className="block text-[10px] font-medium tracking-[0.2em] text-serenade/65 uppercase">
                    Time
                  </span>
                  <select
                    value={reservation.time}
                    onChange={(e) => setReservation((prev) => ({ ...prev, time: e.target.value }))}
                    className="mt-1.5 w-full border-b border-serenade/25 bg-heath pb-2 text-[clamp(14px,1.15vw,16px)] text-serenade outline-none focus:border-zest cursor-pointer"
                  >
                    {TIME_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-heath text-serenade">
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  className="group inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-zest px-6 text-[11px] font-semibold tracking-[0.16em] text-heath uppercase transition-colors duration-300 hover:bg-serenade cursor-pointer"
                >
                  <span>Book a table</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
