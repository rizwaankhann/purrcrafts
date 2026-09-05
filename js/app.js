// PurrCrafts Alpine.js Application Logic
// Handles catalog filters, quick view modal, cart drawer, wishlist, and WhatsApp checkout

document.addEventListener('alpine:init', () => {
  Alpine.data('boutiqueApp', () => ({
    // Catalog state
    products: PRODUCTS_DATA || [],
    categories: CATEGORIES || [],
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    maxPrice: 2000,

    // UI Drawer & Modal states
    isCartOpen: false,
    isMobileMenuOpen: false,
    isQuickViewOpen: false,
    isCustomOrderOpen: false,
    isWishlistView: false,

    // Quick View item state
    quickViewProduct: null,
    quickViewActiveImageIndex: 0,
    quickViewSelectedRibbon: '',
    quickViewCustomNote: '',
    quickViewQty: 1,

    // Cart state with localStorage persistence
    cart: JSON.parse(localStorage.getItem('purrcrafts_cart') || '[]'),

    // Wishlist state with localStorage persistence
    wishlist: JSON.parse(localStorage.getItem('purrcrafts_wishlist') || '[]'),

    // Custom Order modal state
    customOrder: {
      name: '',
      phoneOrHandle: '',
      craftType: 'Custom Bouquet',
      colorPalette: 'Pastel Sunset (Pink, Peach, Cream)',
      budget: 'Under ₹1,000',
      notes: ''
    },

    // WhatsApp business contact (Can be customized by user)
    // Default format: phone number without + or spaces e.g. '919876543210'
    whatsAppNumber: '917383610426', 
    instagramHandle: 'purr__crafts',

    // Toast notification
    toast: {
      show: false,
      message: '',
      icon: 'sparkles'
    },

    init() {
      const refreshIcons = () => {
        this.$nextTick(() => {
          if (window.lucide) {
            lucide.createIcons();
          }
        });
      };

      // Save cart on changes
      this.$watch('cart', (val) => {
        localStorage.setItem('purrcrafts_cart', JSON.stringify(val));
        refreshIcons();
      });

      // Save wishlist on changes
      this.$watch('wishlist', (val) => {
        localStorage.setItem('purrcrafts_wishlist', JSON.stringify(val));
        refreshIcons();
      });

      // Re-hydrate icons on filter & UI updates
      this.$watch('selectedCategory', refreshIcons);
      this.$watch('searchQuery', refreshIcons);
      this.$watch('sortBy', refreshIcons);
      this.$watch('isWishlistView', refreshIcons);
      this.$watch('isCartOpen', refreshIcons);
      this.$watch('isQuickViewOpen', refreshIcons);
      this.$watch('isCustomOrderOpen', refreshIcons);

      refreshIcons();
    },

    // Computed filtered and sorted products
    get filteredProducts() {
      return this.products
        .filter(item => {
          // Category filter
          const matchesCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory;
          
          // Wishlist filter mode
          const matchesWishlist = !this.isWishlistView || this.wishlist.includes(item.id);

          // Search query filter
          const query = this.searchQuery.trim().toLowerCase();
          const matchesSearch = !query || 
            item.name.toLowerCase().includes(query) ||
            item.shortDescription.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query));

          // Price filter
          const matchesPrice = item.price <= this.maxPrice;

          return matchesCategory && matchesWishlist && matchesSearch && matchesPrice;
        })
        .sort((a, b) => {
          if (this.sortBy === 'price-low') return a.price - b.price;
          if (this.sortBy === 'price-high') return b.price - a.price;
          if (this.sortBy === 'popular') return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
          return 0; // Default featured order
        });
    },

    get cartCount() {
      return this.cart.reduce((sum, item) => sum + item.qty, 0);
    },

    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    },

    // Quick View Modal
    openQuickView(product) {
      this.quickViewProduct = product;
      this.quickViewActiveImageIndex = 0;
      this.quickViewSelectedRibbon = product.ribbonOptions && product.ribbonOptions.length > 0 ? product.ribbonOptions[0] : 'Standard';
      this.quickViewCustomNote = '';
      this.quickViewQty = 1;
      this.isQuickViewOpen = true;

      this.$nextTick(() => {
        if (window.lucide) lucide.createIcons();
      });
    },

    closeQuickView() {
      this.isQuickViewOpen = false;
      this.quickViewProduct = null;
    },

    // Cart Management
    addToCart(product, ribbon = '', customNote = '', qty = 1) {
      const selectedRibbon = ribbon || (product.ribbonOptions ? product.ribbonOptions[0] : 'Standard');
      
      // Look for identical product + ribbon combination
      const existingIndex = this.cart.findIndex(
        item => item.id === product.id && item.ribbon === selectedRibbon
      );

      if (existingIndex > -1) {
        this.cart[existingIndex].qty += qty;
      } else {
        this.cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          ribbon: selectedRibbon,
          customNote: customNote,
          qty: qty
        });
      }

      this.showToast(`Added ${product.name} to inquiry bag! 🌸`);

      this.$nextTick(() => {
        if (window.lucide) lucide.createIcons();
      });
    },

    addQuickViewToCart() {
      if (!this.quickViewProduct) return;
      this.addToCart(
        this.quickViewProduct,
        this.quickViewSelectedRibbon,
        this.quickViewCustomNote,
        this.quickViewQty
      );
      this.closeQuickView();
      this.isCartOpen = true;
    },

    updateCartQty(index, change) {
      const item = this.cart[index];
      if (!item) return;

      item.qty += change;
      if (item.qty <= 0) {
        this.cart.splice(index, 1);
        this.showToast('Item removed from inquiry bag.');
      }
    },

    removeCartItem(index) {
      this.cart.splice(index, 1);
      this.showToast('Item removed from inquiry bag.');
    },

    clearCart() {
      this.cart = [];
      this.showToast('Inquiry bag cleared.');
    },

    // Wishlist
    toggleWishlist(productId) {
      const index = this.wishlist.indexOf(productId);
      if (index > -1) {
        this.wishlist.splice(index, 1);
        this.showToast('Removed from favorites 💔');
      } else {
        this.wishlist.push(productId);
        this.showToast('Added to favorites! 🐾💖');
      }
    },

    isWishlisted(productId) {
      return this.wishlist.includes(productId);
    },

    toggleWishlistView() {
      this.isWishlistView = !this.isWishlistView;
      if (this.isWishlistView) {
        this.selectedCategory = 'all';
        this.showToast('Showing your saved favorites 💖');
      }
    },

    // WhatsApp Inquiry Cart Link Generator
    checkoutViaWhatsApp() {
      if (this.cart.length === 0) {
        this.showToast('Your inquiry bag is empty.');
        return;
      }

      let message = `🐾 *PurrCrafts Handmade Order Inquiry* 🌸\n\n`;
      message += `Hi PurrCrafts team! I would love to place an inquiry for the following handcrafted items:\n\n`;

      this.cart.forEach((item, idx) => {
        message += `${idx + 1}. *${item.name}*\n`;
        message += `   • Qty: ${item.qty}\n`;
        message += `   • Custom Ribbon/Style: ${item.ribbon}\n`;
        if (item.customNote && item.customNote.trim()) {
          message += `   • Gift Note: "${item.customNote.trim()}"\n`;
        }
        message += `   • Price: ₹${(item.price * item.qty).toLocaleString('en-IN')}\n\n`;
      });

      message += `--------------------------------\n`;
      message += `🎁 *Estimated Total: ₹${this.cartTotal.toLocaleString('en-IN')}*\n\n`;
      message += `Could you please confirm availability and delivery timeline? Thank you! ✨`;

      const encodedText = encodeURIComponent(message);
      // If phone number is configured, link directly to it; otherwise open universal WhatsApp share
      const url = this.whatsAppNumber 
        ? `https://wa.me/${this.whatsAppNumber}?text=${encodedText}`
        : `https://wa.me/?text=${encodedText}`;

      window.open(url, '_blank');
    },

    // Custom Order via WhatsApp
    submitCustomOrder() {
      if (!this.customOrder.name.trim()) {
        alert('Please enter your name');
        return;
      }

      let message = `🌸 *Bespoke Custom Order Request @purr__crafts* 🐾\n\n`;
      message += `Hello! I would like to request a custom handmade creation:\n\n`;
      message += `• *Name:* ${this.customOrder.name}\n`;
      message += `• *Contact / Instagram:* ${this.customOrder.phoneOrHandle || 'Not provided'}\n`;
      message += `• *Type of Craft:* ${this.customOrder.craftType}\n`;
      message += `• *Preferred Color Palette:* ${this.customOrder.colorPalette}\n`;
      message += `• *Budget:* ${this.customOrder.budget}\n`;
      if (this.customOrder.notes.trim()) {
        message += `• *Special Requests:* ${this.customOrder.notes.trim()}\n`;
      }
      message += `\nLooking forward to bringing this cute idea to life! ✨`;

      const encodedText = encodeURIComponent(message);
      const url = this.whatsAppNumber 
        ? `https://wa.me/${this.whatsAppNumber}?text=${encodedText}`
        : `https://wa.me/?text=${encodedText}`;

      window.open(url, '_blank');
      this.isCustomOrderOpen = false;
      this.showToast('Custom request opened in WhatsApp! 🌸');
    },

    // Copy Cart Text to Clipboard
    copyCartSummary() {
      if (this.cart.length === 0) return;
      let text = `PurrCrafts Order Inquiry:\n`;
      this.cart.forEach(item => {
        text += `- ${item.name} (x${item.qty}) [${item.ribbon}] - ₹${item.price * item.qty}\n`;
      });
      text += `Total: ₹${this.cartTotal}`;

      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Order summary copied to clipboard! 📋');
      });
    },

    // Toast Notification helper
    showToast(message) {
      this.toast.message = message;
      this.toast.show = true;
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    }
  }));
});
