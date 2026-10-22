import React, { useEffect, useMemo, useState } from 'react';
import { breeds } from './data/breeds.js';
import { categories, formatPrice, products } from './data/products.js';
import { storeDetails } from './data/store.js';

const emptyCustomer = { name: '', phone: '', address: '', notes: '' };

function BrandMark() {
  return (
    <a className="brand" href="#home" aria-label="WE LOVE DOGS home">
      <span className="brand-mark" aria-hidden="true">w</span>
      <span className="brand-copy"><strong>WE LOVE DOGS</strong><small>good food, good days</small></span>
    </a>
  );
}

function Header({ cartCount, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['Home', '#home'],
    ['Shop', '#shop'],
    ['Dog breeds', '#breeds'],
    ['About us', '#about'],
    ['How to order', '#how-to-order'],
    ['Contact', '#contact'],
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark />
        <button className="menu-toggle icon-button" type="button" aria-expanded={menuOpen} aria-controls="primary-nav" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>
        <nav id="primary-nav" className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <button className="cart-trigger" type="button" onClick={onCartClick} aria-label={`Open cart, ${cartCount} items`}>
          <span className="cart-symbol" aria-hidden="true">♧</span><span>Cart</span><b>{cartCount}</b>
        </button>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, detail, light = false }) {
  return (
    <div className={`section-heading ${light ? 'is-light' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {detail && <p>{detail}</p>}
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className={`product-photo ${product.tone}`}>
        <img src={product.image} alt={product.alt} loading="lazy" />
        <span className="product-stage">{product.stage}</span>
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand} <span>·</span> {product.size}</p>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta"><span>{product.pack}</span><span>{product.type}</span></div>
        <div className="product-buy">
          <strong>{formatPrice(product.price)}</strong>
          <button className="add-button" type="button" onClick={() => onAdd(product.id)} aria-label={`Add ${product.name} to cart`}>Add <span aria-hidden="true">+</span></button>
        </div>
      </div>
    </article>
  );
}

function CartPanel({ open, items, customer, setCustomer, onClose, onQuantity, onRemove, onSubmit }) {
  const [notice, setNotice] = useState('');
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  const submitOrder = (event) => {
    event.preventDefault();
    if (items.length === 0) {
      setNotice('Add a product before preparing an order.');
      return;
    }
    const missingDetails = [
      ['name', 'your name'],
      ['phone', 'your phone number'],
      ['address', 'your delivery address'],
    ].filter(([field]) => !customer[field].trim());
    if (missingDetails.length > 0) {
      setNotice(`Please enter ${missingDetails.map(([, label]) => label).join(', ')} before preparing your WhatsApp enquiry.`);
      event.currentTarget.elements.namedItem(missingDetails[0][0]).focus();
      return;
    }
    if (!storeDetails.whatsappLink) {
      setNotice('WhatsApp is not configured yet. Add your business number in src/data/store.js; no order has been sent.');
      return;
    }
    const message = [
      `Order enquiry for ${storeDetails.businessName}`,
      ...items.map(({ product, quantity }) => `${quantity} × ${product.name} (${formatPrice(product.price * quantity)})`),
      `Subtotal: ${formatPrice(subtotal)}`,
      `Estimated total (delivery excluded): ${formatPrice(subtotal)}`,
      `Name: ${customer.name.trim()}`,
      `Phone: ${customer.phone.trim()}`,
      `Delivery address: ${customer.address.trim()}`,
      customer.notes ? `Notes: ${customer.notes}` : '',
      'Please confirm availability, delivery and payment. This is an enquiry, not a payment.',
    ].filter(Boolean).join('\n');
    const number = storeDetails.whatsappLink.replace(/\D/g, '');
    if (number.length < 10) {
      setNotice('Add a valid international WhatsApp number in src/data/store.js; no order has been sent.');
      return;
    }
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setNotice('WhatsApp opened with your order enquiry. It is only sent after you review and press Send in WhatsApp.');
  };

  return (
    <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-header"><div><span className="eyebrow">YOUR PICKS</span><h2 id="cart-title">Shopping cart</h2></div><button className="icon-button close-button" type="button" aria-label="Close cart" onClick={onClose}>×</button></div>
        {items.length ? (
          <>
            <div className="cart-lines">
              {items.map(({ product, quantity }) => (
                <div className="cart-line" key={product.id}>
                  <img src={product.image} alt="" />
                  <div className="cart-line-copy"><strong>{product.name}</strong><span>{formatPrice(product.price)} · {product.pack}</span>
                    <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
                      <button type="button" onClick={() => onQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name} quantity`}>−</button>
                      <span aria-live="polite">{quantity}</span>
                      <button type="button" onClick={() => onQuantity(product.id, quantity + 1)} aria-label={`Increase ${product.name} quantity`}>+</button>
                      <button className="remove-button" type="button" onClick={() => onRemove(product.id)}>Remove</button>
                    </div>
                  </div>
                  <strong className="line-total">{formatPrice(product.price * quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="cart-subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="cart-total"><span>Estimated total</span><strong>{formatPrice(subtotal)}</strong></div>
            <p className="cart-disclaimer">Delivery is not included. Final availability, delivery and any applicable charges are confirmed by the business. Prices shown are demonstration data.</p>
            <form className="order-form" onSubmit={submitOrder}>
              <h3>Order enquiry</h3>
              <p className="form-note">Your details are required to prepare the WhatsApp enquiry.</p>
              <label>Your name <span className="required">(required)</span><input name="name" required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
              <label>Phone number <span className="required">(required)</span><input name="phone" required type="tel" autoComplete="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
              <label>Delivery address <span className="required">(required)</span><textarea name="address" required autoComplete="street-address" rows="2" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} /></label>
              <label>Order notes <span className="optional">(optional)</span><textarea rows="2" value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} /></label>
              <button className="button button-dark full-button" type="submit">Prepare WhatsApp enquiry <span aria-hidden="true">↗</span></button>
              <p className="form-note">No payment is taken and no order is confirmed here. You will review and send the message in WhatsApp.</p>
              {notice && <p className="status-message" role="status">{notice}</p>}
            </form>
          </>
        ) : (
          <div className="empty-cart"><span aria-hidden="true">♡</span><h3>Your cart is taking a nap.</h3><p>Add a few favourites and they’ll be waiting here.</p><button className="button button-dark" type="button" onClick={onClose}>Explore the shop</button></div>
        )}
      </aside>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('we-love-dogs-cart') || '{}'); }
    catch { return {}; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All food');
  const [sort, setSort] = useState('featured');
  const [contactMessage, setContactMessage] = useState('');
  const cartItems = useMemo(() => Object.entries(cart).flatMap(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return product && quantity > 0 ? [{ product, quantity }] : [];
  }), [cart]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'All food' || product.tags.includes(category);
      const matchesSearch = !query || `${product.name} ${product.brand} ${product.description} ${product.stage} ${product.size}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
    if (sort === 'low-high') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'high-low') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, search, sort]);

  useEffect(() => {
    try { localStorage.setItem('we-love-dogs-cart', JSON.stringify(cart)); }
    catch { /* The cart remains usable when browser storage is unavailable. */ }
  }, [cart]);

  const addToCart = (id) => setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
  const updateQuantity = (id, quantity) => setCart((current) => {
    if (quantity < 1) {
      const next = { ...current };
      delete next[id];
      return next;
    }
    return { ...current, [id]: quantity };
  });
  const openCart = () => setCartOpen(true);

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const contactInput = event.currentTarget.elements.namedItem('contact');
    const contactValue = contactInput.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue);
    const isPhone = /^\+?[\d\s().-]{7,}$/.test(contactValue);
    if (!isEmail && !isPhone) {
      contactInput.setCustomValidity('Enter a valid email address or phone number.');
      contactInput.reportValidity();
      return;
    }
    contactInput.setCustomValidity('');
    setContactMessage('Thanks for filling this in. The form is a preview only; connect an email service or backend before using it to receive messages.');
  };

  return (
    <>
      <Header cartCount={cartCount} onCartClick={openCart} />
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="kicker-dot" /> A little love in every bowl</span>
            <h1>WE LOVE<br /><em>DOGS</em><span className="hero-period">.</span></h1>
            <p>Healthy, happy dogs start with food that fits their day, their age and their own little story.</p>
            <div className="hero-actions"><a className="button button-orange" href="#shop">Shop dog food <span aria-hidden="true">↘</span></a><a className="text-link" href="#how-to-order">How ordering works <span aria-hidden="true">→</span></a></div>
            <div className="hero-proof"><div className="mini-avatars" aria-hidden="true"><span>🐕</span><span>🐶</span><span>🐾</span></div><span>Made for every kind of good dog</span></div>
          </div>
          <div className="hero-image-wrap">
            <div className="hero-image"><img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=90" alt="Golden retriever enjoying a sunny day outdoors" fetchPriority="high" /></div>
            <div className="hero-note"><span className="note-sun" aria-hidden="true">✳</span><span>Good food.<br /><strong>Great company.</strong></span></div>
            <span className="hero-image-caption">A happy bowl starts here</span>
          </div>
          <div className="hero-side-label" aria-hidden="true">BOWL FULL OF GOOD</div>
        </section>

        <div className="ticker" aria-label="Our promise"><div><span>GOOD FOOD</span><i>✳</i><span>HAPPY TAILS</span><i>✳</i><span>EVERY KIND OF DOG</span><i>✳</i><span>GOOD FOOD</span><i>✳</i><span>HAPPY TAILS</span><i>✳</i></div></div>

        <section className="shop-section section-pad" id="shop">
          <div className="shop-intro"><SectionHeading eyebrow="THE GOOD STUFF" title="Find their new favourite." detail="Browse our demo range by life stage, size or food type. Always check the label and your dog's individual needs." /><a href="#how-to-order" className="round-link" aria-label="Learn how to order">↘</a></div>
          <div className="catalog-tools">
            <label className="search-field"><span aria-hidden="true">⌕</span><span className="sr-only">Search products</span><input type="search" placeholder="Search food, brand or life stage" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <label className="sort-field"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low-high">Price: low to high</option><option value="high-low">Price: high to low</option></select></label>
          </div>
          <div className="category-tabs" role="group" aria-label="Filter products by category">
            {categories.map((item) => <button type="button" key={item} className={category === item ? 'active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <p className="demo-banner"><span aria-hidden="true">ⓘ</span> Demonstration products, prices and inventory only. Confirm real availability and final pricing with the store.</p>
          {visibleProducts.length ? (
            <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div>
          ) : <div className="no-results"><span aria-hidden="true">⌕</span><h3>No matching food found.</h3><p>Try another search or choose a different category.</p><button type="button" className="text-link" onClick={() => { setSearch(''); setCategory('All food'); }}>Clear filters →</button></div>}
          <p className="catalog-footnote">Choosing food can depend on life stage, size, health and preference. For specific dietary advice, speak with your veterinarian.</p>
        </section>

        <section className="breed-section section-pad" id="breeds">
          <div className="breed-heading"><SectionHeading eyebrow="A TAIL FOR EVERY SIZE" title="Big paws. Tiny paws. All paws." detail="Different breeds come in different shapes and sizes. Start with your dog's life stage and the guidance on each product label." /><span className="paw-stamp" aria-hidden="true">✳<small>10<br />good dogs</small></span></div>
          <div className="breed-grid">{breeds.map((breed, index) => <article className={`breed-card breed-${index + 1}`} key={breed.name}><img src={breed.image} alt={breed.alt} loading="lazy" /><div className="breed-overlay"><span>{breed.size} breed</span><h3>{breed.name}</h3><p>{breed.note}</p></div></article>)}</div>
        </section>

        <section className="about-band" id="about">
          <div className="about-photo"><img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85" alt="Two dogs exploring together on a path" loading="lazy" /><span className="photo-tag">OUR KIND OF HAPPY</span></div>
          <div className="about-copy"><span className="eyebrow">A NOTE FROM US</span><h2>We believe every dog deserves a bowl made with care.</h2><p>WE LOVE DOGS is here to make choosing everyday food feel a little easier. We bring together options for different ages, sizes and routines, so you can browse thoughtfully and ask questions before you buy.</p><p className="about-placeholder">Business story and verified claims can be added here when provided.</p><a className="text-link" href="#contact">Get in touch <span aria-hidden="true">→</span></a><span className="about-scribble" aria-hidden="true">all the<br />good dogs</span></div>
        </section>

        <section className="values-section section-pad">
          <SectionHeading eyebrow="THE GOOD-DOG PROMISE" title="A little more care, at every step." />
          <div className="value-grid">
            <article><span className="value-number">01</span><span className="value-icon" aria-hidden="true">♡</span><h3>Choice with context</h3><p>Browse by age, size and food type, then check the details that matter for your dog.</p></article>
            <article><span className="value-number">02</span><span className="value-icon" aria-hidden="true">⌂</span><h3>Real answers first</h3><p>We confirm stock, delivery and payment with you before an order is final.</p></article>
            <article><span className="value-number">03</span><span className="value-icon" aria-hidden="true">✳</span><h3>Dogs come first</h3><p>Every dog is different. We encourage thoughtful choices and veterinary advice when needed.</p></article>
          </div>
        </section>

        <section className="stories-section section-pad">
          <div className="stories-top"><SectionHeading eyebrow="THE LOVE IS REAL" title="Good stories start with good people." detail="A space for verified customer stories, shared with permission." /><span className="quote-mark" aria-hidden="true">“</span></div>
          <div className="story-placeholder"><span className="story-star" aria-hidden="true">✳</span><div><strong>Customer story space</strong><p>Sample layout only. Add a real customer quote and their permission before publishing a testimonial.</p></div><span className="story-caption">REAL DOGS. REAL WORDS.</span></div>
        </section>

        <section className="order-section section-pad" id="how-to-order">
          <div className="order-top"><SectionHeading eyebrow="SIMPLE AS A SIT-STAY" title="How to order." detail="An easy enquiry now, with a real person confirming the important details." light /><span className="order-doodle" aria-hidden="true">→</span></div>
          <ol className="steps-grid">
            {[
              ['01', 'Browse the range', 'Explore food by age, size or type.'],
              ['02', 'Pick their favourites', 'Add products and quantities to your cart.'],
              ['03', 'Check your basket', 'Review items and the sample subtotal.'],
              ['04', 'Share your details', 'Add your name, phone and delivery address.'],
              ['05', 'Send an enquiry', 'Review your order summary in WhatsApp.'],
              ['06', 'We confirm together', 'Availability, delivery and payment are confirmed by the business.'],
            ].map(([number, title, text]) => <li key={number}><span className="step-number">{number}</span><span className="step-icon" aria-hidden="true">{['⌕', '♡', '▤', '⌂', '↗', '✓'][Number(number) - 1]}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
          <div className="order-caveat"><span aria-hidden="true">ⓘ</span><p>This demo does not take payment or send orders to a server. Review the order enquiry and press Send in WhatsApp to contact the business.</p></div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="contact-copy"><SectionHeading eyebrow="LET'S CHAT" title="We’re all ears." detail="Questions about a product or an order? Call, WhatsApp or email us. Contact details are supplied by the business." /><div className="contact-details">
            <div><span>PHONE</span><a href={`tel:${storeDetails.phoneLink}`}>{storeDetails.phone}</a></div>
            <div><span>WHATSAPP</span><a href={`https://wa.me/${storeDetails.whatsappLink}`} target="_blank" rel="noopener noreferrer">{storeDetails.whatsapp}</a></div>
            <div><span>EMAIL</span><a href={`mailto:${storeDetails.email}`}>{storeDetails.email}</a></div>
            <div><span>VISIT / DELIVERY</span><p>{storeDetails.address}<br />{storeDetails.deliveryAreas}</p></div>
            <div><span>OPENING HOURS</span><p>{storeDetails.hours}</p></div>
          </div></div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <h3>Send us a message</h3>
            <label>Name<input required autoComplete="name" /></label>
            <label>Phone or email<input name="contact" required autoComplete="email" aria-describedby="contact-help" onChange={(event) => event.currentTarget.setCustomValidity('')} /><span id="contact-help" className="form-note">Enter a phone number or email address we can use to reach you.</span></label>
            <label>Subject<input required /></label>
            <label>Your message<textarea required rows="4" /></label>
            <button className="button button-orange" type="submit">Prepare message <span aria-hidden="true">↗</span></button>
            <p className="form-note">This preview form does not send or store messages.</p>
            {contactMessage && <p className="status-message" role="status">{contactMessage}</p>}
          </form>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-main"><div><BrandMark /><p>Good food for good dogs.<br />Made with a whole lot of love.</p></div><div className="footer-links"><span>FIND YOUR WAY</span><a href="#shop">Shop dog food</a><a href="#breeds">Dog breeds</a><a href="#about">About us</a><a href="#how-to-order">How to order</a></div><div className="footer-contact"><span>SAY HELLO</span><p><a href={`tel:${storeDetails.phoneLink}`}>{storeDetails.phone}</a><br /><a href={`mailto:${storeDetails.email}`}>{storeDetails.email}</a><br />{storeDetails.address}</p></div><a href="#home" className="back-top" aria-label="Back to top">↑</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} WE LOVE DOGS</span><span>Sample catalogue · Prices in South African rand</span><a href="#home">Back to top ↑</a></div>
      </footer>
      <CartPanel open={cartOpen} items={cartItems} customer={customer} setCustomer={setCustomer} onClose={() => setCartOpen(false)} onQuantity={updateQuantity} onRemove={(id) => updateQuantity(id, 0)} />
    </>
  );
}

export default App;