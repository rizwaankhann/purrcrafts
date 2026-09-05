# PurrCrafts 🐾 🌸

A boutique showcase and mobile-friendly catalog for handmade everlasting chenille pipe cleaner flowers and whimsical miniatures. Designed specifically for [@purr__crafts](https://www.instagram.com/purr__crafts/).

![PurrCrafts Banner Preview](https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Highlights & Features

- 📱 **Mobile-First Curated Boutique**: 2-column mobile responsive grid inspired by Instagram and Pinterest, perfectly sized for browsing on smartphones.
- 🏷️ **Sticky Filter & Category Bar**: Instant client-side filtering (Bouquets, Single Stems, Cute Miniatures, Gift Sets) and live keyword search.
- 🔍 **Quick-View Interactive Modal**: Multi-photo gallery, dimensions, materials, care instructions, and customizable ribbon selections.
- 💖 **Wishlist / Favorites**: Allows visitors to save their favorite creations with 1-tap, persisted in `localStorage`.
- 💬 **WhatsApp Inquiry & Order Flow**:
  - Adds items to a slide-over inquiry bag.
  - Automatically formats itemized WhatsApp messages with quantities, chosen ribbon styles, gift notes, and total price.
  - One-click redirects to WhatsApp chat.
- 🎨 **Bespoke Custom Bouquet Builder**: Form modal allowing customers to submit custom color palettes and miniature animal requests.
- ⚡ **Zero-Build Stack**: Built with pure HTML5, Tailwind CSS, and Alpine.js—no Node.js build steps required. Runs directly out-of-the-box.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with mobile viewport optimization
- **Tailwind CSS**: Utility-first styling with custom warm pastel theme
- **Alpine.js**: Reactive client-side state for cart, filter, modal, and drawer
- **Lucide Icons**: Clean, modern icons for e-commerce actions
- **Google Fonts**: *Plus Jakarta Sans*, *Playfair Display*, and *Fredoka*

---

## 🚀 How to Run Locally

Because there are no build tools or npm dependencies, you can open and run this project immediately:

### Option 1: Direct Local Server (Python)
```bash
cd /var/www/html/purrcrafts
python3 -m http.server 8000
```
Open your browser at [http://localhost:8000](http://localhost:8000).

### Option 2: Apache Web Server
Since the repository is located in `/var/www/html/purrcrafts`, start Apache:
```bash
sudo systemctl start apache2
```
Access via [http://localhost/purrcrafts/](http://localhost/purrcrafts/).

---

## 📁 Project Structure

```
purrcrafts/
├── index.html          # Main HTML5 showcase and template
├── css/
│   └── styles.css      # Custom animations, glassmorphism, fonts
├── js/
│   ├── products.js     # Catalog dataset (photos, descriptions, prices)
│   └── app.js          # Alpine.js logic (cart, modal, filters, WhatsApp)
└── assets/
    └── images/         # Place your original craft photos here
```

---

## ⚙️ Customization Guide

### 1. Set Your WhatsApp Phone Number
Open [`js/app.js`](file:///var/www/html/purrcrafts/js/app.js) and update line 46:
```javascript
// Replace with your country code + phone number (no + or spaces)
whatsAppNumber: '919876543210',
```

### 2. Add Your Own Products and Photos
Open [`js/products.js`](file:///var/www/html/purrcrafts/js/products.js) to add or edit creations:
```javascript
{
  id: "pc-custom-01",
  name: "Pastel Lavender & Tulip Bouquet",
  category: "bouquets",
  price: 799,
  badge: "🌸 Bestseller",
  images: [
    "assets/images/my-tulip-1.jpg",
    "assets/images/my-tulip-2.jpg"
  ],
  ribbonOptions: ["Blush Pink", "Vanilla Cream", "Lavender"],
  ...
}
```

### 3. Change Currency or Default Texts
Prices in [`js/products.js`](file:///var/www/html/purrcrafts/js/products.js) are set in Indian Rupees (`₹`), but you can format or change currency symbols directly in [`index.html`](file:///var/www/html/purrcrafts/index.html).

---

## 📸 Social & Instagram
- Instagram: [@purr__crafts](https://www.instagram.com/purr__crafts/)