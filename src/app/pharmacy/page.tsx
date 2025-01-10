// "use client"
// import React, { useState } from 'react';
// import { Search, ShoppingCart, X, Plus, Minus } from 'lucide-react';
// import './styles.css';

// interface Medicine {
//   id: number;
//   name: string;
//   usage: string;
//   dosage: string;
//   price: number;
//   category: string;
// }

// interface CartItem extends Medicine {
//   quantity: number;
// }

// interface PaymentDetails {
//   cardNumber: string;
//   cardName: string;
//   expiry: string;
//   cvv: string;
// }

// const medicines: Medicine[] = [
//   {
//     id: 1,
//     name: "Paracetamol",
//     usage: "Pain relief and fever reduction",
//     dosage: "500-1000mg every 4-6 hours",
//     price: 9.99,
//     category: "Pain Relief",
//   },
//   {
//     id: 2,
//     name: "Ibuprofen",
//     usage: "Reduces inflammation and pain",
//     dosage: "200-400mg every 6-8 hours",
//     price: 14.99,
//     category: "Pain Relief",
//   },
//   {
//     id: 3,
//     name: "Amoxicillin",
//     usage: "Treats bacterial infections",
//     dosage: "250-500mg every 8 hours",
//     price: 19.99,
//     category: "Antibiotics",
//   },
//   {
//     id: 4,
//     name: "Cetirizine",
//     usage: "Relieves allergy symptoms",
//     dosage: "10mg once daily",
//     price: 4.99,
//     category: "Allergy Relief",
//   },
//   {
//     id: 5,
//     name: "Metformin",
//     usage: "Controls blood sugar levels",
//     dosage: "500-1000mg twice daily",
//     price: 24.99,
//     category: "Diabetes",
//   },
//   {
//     id: 6,
//     name: "Omeprazole",
//     usage: "Treats acid reflux and ulcers",
//     dosage: "20mg once daily",
//     price: 12.99,
//     category: "Digestive Health",
//   },
//   {
//     id: 7,
//     name: "Vitamin D3",
//     usage: "Supports bone and immune health",
//     dosage: "1000 IU daily",
//     price: 8.99,
//     category: "Vitamins",
//   },
//   // ... other medicines
// ];

// export default function MedicineStore(): JSX.Element {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>('All');
//   const [showPayment, setShowPayment] = useState<boolean>(false);
//   const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
//     cardNumber: '',
//     cardName: '',
//     expiry: '',
//     cvv: ''
//   });

//   const categories = ['All', ...new Set(medicines.map(med => med.category))];

//   const filteredMedicines = medicines.filter(medicine => {
//     const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const handlePayment = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Add payment processing logic here
//     console.log('Processing payment:', paymentDetails);
//     setShowPayment(false);
//   };

//   const PaymentModal = () => (
//     <div className="modal-overlay">
//       <div className="payment-modal">
//         <button className="close-button" onClick={() => setShowPayment(false)}>
//           <X size={24} />
//         </button>
//         <div className="payment-header">
//           <h2>Payment Details</h2>
//         </div>
//         <form onSubmit={handlePayment} className="payment-form">
//           <div className="form-group">
//             <label className="form-label">Card Number</label>
//             <input
//               type="text"
//               className="form-input"
//               placeholder="1234 5678 9012 3456"
//               value={paymentDetails.cardNumber}
//               onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
//               maxLength={19}
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Cardholder Name</label>
//             <input
//               type="text"
//               className="form-input"
//               placeholder="John Doe"
//               value={paymentDetails.cardName}
//               onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
//             />
//           </div>
//           <div className="card-details">
//             <div className="form-group">
//               <label className="form-label">Expiry Date</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 placeholder="MM/YY"
//                 value={paymentDetails.expiry}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
//                 maxLength={5}
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">CVV</label>
//               <input
//                 type="password"
//                 className="form-input"
//                 placeholder="123"
//                 value={paymentDetails.cvv}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
//                 maxLength={3}
//               />
//             </div>
//           </div>
//           <button type="submit" className="add-to-cart">
//             Pay ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
//           </button>
//         </form>
//       </div>
//     </div>
//   );

//   return (
//     <div className="store-container">
//       <div className="store-header">
//         <h1 className="store-title">Medicine Store</h1>
//         <div className="search-container">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
//           <input
//             type="text"
//             placeholder="Search medicines..."
//             className="search-input"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button 
//             className="add-to-cart"
//             onClick={() => setShowPayment(true)}
//           >
//             <ShoppingCart size={20} />
//             <span className="ml-2">{cart.length}</span>
//           </button>
//         </div>
//       </div>

//       <div className="category-filter">
//         {categories.map(category => (
//           <button
//             key={category}
//             className={`category-button ${selectedCategory === category ? 'active' : ''}`}
//             onClick={() => setSelectedCategory(category)}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       <div className="medicine-grid">
//         {filteredMedicines.map(medicine => (
//           <div key={medicine.id} className="medicine-card">
//             <div className="card-header">
//               <div className="flex justify-between items-start">
//                 <h3 className="card-title">{medicine.name}</h3>
//                 <span className="card-badge">{medicine.category}</span>
//               </div>
//             </div>
//             <div className="card-content">
//               <div className="medicine-info">
//                 <p className="info-label">Usage:</p>
//                 <p className="info-text">{medicine.usage}</p>
//               </div>
//               <div className="medicine-info">
//                 <p className="info-label">Dosage:</p>
//                 <p className="info-text">{medicine.dosage}</p>
//               </div>
//               <div className="price-action">
//                 <p className="price">${medicine.price}</p>
//                 <button className="add-to-cart">Add to Cart</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showPayment && <PaymentModal />}
//     </div>
//   );
// }


"use client"
import React, { useState } from 'react';
import { Search, ShoppingCart, X, Plus, Minus, MapPin, CreditCard } from 'lucide-react';
import './styles.css';
import { NavbarWrapper } from '../healthcare/components/NavbarWrapper';

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
  // ... other medicines
];

export default function MedicineStore(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<number>(1); // 1: Address, 2: Payment
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

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
    // Simulate payment processing
    alert('Payment processed successfully!');
    setCart([]);
    setShowCheckout(false);
    setCheckoutStep(1);
  };

  const CartModal = () => (
    <div className="modal-overlay">
      <div className="payment-modal">
        <button className="close-button" onClick={() => setShowCart(false)}>
          <X size={24} />
        </button>
        <div className="payment-header">
          <h2>Your Cart</h2>
        </div>
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>${item.price}</p>
              </div>
              <div className="quantity-controls">
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
        <div className="cart-total">
          <h3>Total: ${cartTotal.toFixed(2)}</h3>
          <button className="checkout-button" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );

  const CheckoutModal = () => (
    <div className="modal-overlay">
      <div className="payment-modal">
        <button className="close-button" onClick={() => setShowCheckout(false)}>
          <X size={24} />
        </button>
        <div className="payment-header">
          <h2>{checkoutStep === 1 ? 'Shipping Address' : 'Payment Details'}</h2>
        </div>
        
        {checkoutStep === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep(2); }} className="payment-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                value={address.fullName}
                onChange={(e) => setAddress({...address, fullName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-input"
                required
                value={address.streetAddress}
                onChange={(e) => setAddress({...address, streetAddress: e.target.value})}
              />
            </div>
            <div className="address-grid">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({...address, state: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={address.zipCode}
                  onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                required
                value={address.phone}
                onChange={(e) => setAddress({...address, phone: e.target.value})}
              />
            </div>
            <button type="submit" className="add-to-cart">
              Continue to Payment
            </button>
          </form>
        ) : (
          <form onSubmit={handlePayment} className="payment-form">
            <div className="payment-methods">
              <button
                type="button"
                className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard /> Credit/Debit Card
              </button>
              <button
                type="button"
                className={`payment-method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                Cash on Delivery
              </button>
            </div>
            
            {paymentMethod === 'card' && (
              <>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    required
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                    maxLength={19}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    required
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                  />
                </div>
                <div className="card-details">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MM/YY"
                      required
                      value={paymentDetails.expiry}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                      maxLength={5}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="123"
                      required
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                      maxLength={3}
                    />
                  </div>
                </div>
              </>
            )}
            <button type="submit" className="add-to-cart">
              Pay ${cartTotal.toFixed(2)}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <>
    <NavbarWrapper/>
    <div className="store-container">
      <div className="store-header">
        <h1 className="store-title">Medicine Store</h1>
        <div className="search-container">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
          <input
            type="text"
            placeholder="Search medicines..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="add-to-cart"
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart size={20} />
            <span className="ml-2">{cart.length}</span>
          </button>
        </div>
      </div>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="medicine-grid">
        {filteredMedicines.map(medicine => (
          <div key={medicine.id} className="medicine-card">
            <div className="card-header">
              <div className="flex justify-between items-start">
                <h3 className="card-title">{medicine.name}</h3>
                <span className="card-badge">{medicine.category}</span>
              </div>
            </div>
            <div className="card-content">
              <div className="medicine-info">
                <p className="info-label">Usage:</p>
                <p className="info-text">{medicine.usage}</p>
              </div>
              <div className="medicine-info">
                <p className="info-label">Dosage:</p>
                <p className="info-text">{medicine.dosage}</p>
              </div>
              <div className="price-action">
                <p className="price">${medicine.price}</p>
                <button className="add-to-cart" onClick={() => addToCart(medicine)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCart && <CartModal />}
      {showCheckout && <CheckoutModal />}
    </div>
    </>
  );
}