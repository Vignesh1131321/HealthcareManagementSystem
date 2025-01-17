"use client"
import React, { useState } from 'react';
import { Search, ShoppingCart, X, Plus, Minus, CreditCard, MapPin } from 'lucide-react';
import { NavbarWrapper } from '../healthcare/components/NavbarWrapper';
import './styles.css'

interface Medicine {
  id: number;
  name: string;
  usage: string;
  dosage: string;
  price: number;
  category: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

interface Address {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol",
    usage: "Pain relief and fever reduction",
    dosage: "500-1000mg every 4-6 hours",
    price: 9.99,
    category: "Pain Relief",
  },
  {
    id: 2,
    name: "Ibuprofen",
    usage: "Reduces inflammation and pain",
    dosage: "200-400mg every 6-8 hours",
    price: 14.99,
    category: "Pain Relief",
  },
  {
    id: 3,
    name: "Amoxicillin",
    usage: "Treats bacterial infections",
    dosage: "250-500mg every 8 hours",
    price: 19.99,
    category: "Antibiotics",
  },
  {
    id: 4,
    name: "Cetirizine",
    usage: "Relieves allergy symptoms",
    dosage: "10mg once daily",
    price: 4.99,
    category: "Allergy Relief",
  },
  {
    id: 5,
    name: "Metformin",
    usage: "Controls blood sugar levels",
    dosage: "500-1000mg twice daily",
    price: 24.99,
    category: "Diabetes",
  },
  {
    id: 6,
    name: "Omeprazole",
    usage: "Treats acid reflux and ulcers",
    dosage: "20mg once daily",
    price: 12.99,
    category: "Digestive Health",
  },
  {
    id: 7,
    name: "Vitamin D3",
    usage: "Supports bone and immune health",
    dosage: "1000 IU daily",
    price: 8.99,
    category: "Vitamins",
  },
];

export default function MedicineStore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [address, setAddress] = useState<Address>({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const categories = ['All', ...new Set(medicines.map(med => med.category))];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...medicine, quantity: 1 }];
    });
    setShowCart(true);
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0);
      return newCart;
    });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
    setCheckoutStep(1);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order placed successfully!');
    setCart([]);
    setShowCheckout(false);
    setCheckoutStep(1);
  };
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  

  const CartModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => setShowCart(false)}>
          <X size={24} />
        </button>
        <div className="modal-header">
          <h2>Shopping Cart</h2>
        </div>
        <div className="cart-items-container">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.id, -1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            className="checkout-button"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );

  const CheckoutModal = () => (
    <div className="modal-overlay">
      <div className="modal-content checkout-modal">
        <button className="modal-close" onClick={() => setShowCheckout(false)}>
          <X size={24} />
        </button>
        <div className="modal-header">
          <h2>{checkoutStep === 1 ? 'Shipping Address' : 'Payment Details'}</h2>
        </div>
        
        {checkoutStep === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep(2); }} className="checkout-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({...address, fullName: e.target.value})}
                  placeholder="Name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  required
                  value={address.streetAddress}
                  onChange={(e) => setAddress({...address, streetAddress: e.target.value})}
                  placeholder="Address"
                />
              </div>
            </div>

            <div className="form-row three-columns">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  placeholder="City"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({...address, state: e.target.value})}
                  placeholder="State"
                />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  required
                  value={address.zipCode}
                  onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                  placeholder="Zip Code"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <button type="submit" className="primary-button">
              Continue to Payment
            </button>
          </form>
        ) : (
          <form onSubmit={handlePayment} className="payment-form">
            <div className="payment-methods">
              <button
                type="button"
                className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard />
                <span>Credit/Debit Card</span>
              </button>
              <button
                type="button"
                className={`payment-method ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <MapPin />
                <span>Cash on Delivery</span>
              </button>
            </div>
            
            {paymentMethod === 'card' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      required
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                      placeholder="Card Number"
                      maxLength={19}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={paymentDetails.cardName}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                      placeholder="Name"
                    />
                  </div>
                </div>

                <div className="form-row two-columns">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={paymentDetails.expiry}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      required
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                      placeholder="CVV"
                      maxLength={3}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="payment-summary">
              <div className="payment-total">
                <span>Total to Pay:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button type="submit" className="primary-button">
                {paymentMethod === 'card' ? 'Pay Now' : 'Place Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <><NavbarWrapper/>
    <div className="app-container">
      
      <main className="store-container">
        <header className="store-header">
          <h1>Medicine Store</h1>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="cart-button"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
          </div>
        </header>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="medicine-grid">
          {filteredMedicines.map(medicine => (
            <div key={medicine.id} className="medicine-card">
              <div className="medicine-header">
                <h3>{medicine.name}</h3>
                <span className="category-tag">{medicine.category}</span>
              </div>
              <div className="medicine-content">
                <div className="medicine-details">
                  <p className="detail-label">Usage:</p>
                  <p className="detail-text">{medicine.usage}</p>
                </div>
                <div className="medicine-details">
                  <p className="detail-label">Dosage:</p>
                  <p className="detail-text">{medicine.dosage}</p>
                </div>
                <div className="medicine-footer">
                  <span className="price">${medicine.price.toFixed(2)}</span>
                  <button 
                    className="add-cart-button"
                    onClick={() => addToCart(medicine)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCart && <CartModal />}
        {showCheckout && <CheckoutModal />}
      </main>
    </div>
    </>
  );
}