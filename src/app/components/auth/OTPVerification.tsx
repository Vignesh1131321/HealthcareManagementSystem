// import React, { useState } from 'react';
// import { Mail, Lock } from 'lucide-react';
// import styles from './OTPVerification.module.css';

// interface OTPVerificationProps {
//   email: string;
//   onVerificationSuccess: () => void;
// }

// export const OTPVerification: React.FC<OTPVerificationProps> = ({ 
//   email,
//   onVerificationSuccess 
// }) => {
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleVerifyOTP = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       const response = await fetch('/api/doctors', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Verification failed');
//       }

//       setMessage('Verification successful!');
//       onVerificationSuccess();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       const response = await fetch('/api/doctors', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to resend OTP');
//       }

//       setMessage('New verification code sent!');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.verificationContainer}>
//       <div className={styles.formSection}>
//         <h3>Email Verification</h3>
//         <p className={styles.verificationText}>
//           We've sent a verification code to <strong>{email}</strong>
//         </p>

//         <form onSubmit={handleVerifyOTP} className={styles.verificationForm}>
//           <div className={styles.inputWrapper}>
//             <Lock className={styles.inputIcon} />
//             <input
//               type="text"
//               placeholder="Enter verification code"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className={styles.input}
//             />
//           </div>

//           {error && <div className={styles.errorMessage}>{error}</div>}
//           {message && <div className={styles.successMessage}>{message}</div>}

//           <button
//             type="submit"
//             disabled={loading}
//             className={styles.verifyButton}
//           >
//             {loading ? 'Verifying...' : 'Verify Email'}
//           </button>

//           <button
//             type="button"
//             onClick={handleResendOTP}
//             disabled={loading}
//             className={styles.resendButton}
//           >
//             Resend verification code
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import styles from './OTPVerification.module.css';

interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  userType?: 'user' | 'doctor';
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email,
  onVerificationSuccess,
  userType = 'user'  // Default to user if not specified
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Get the appropriate API endpoint based on user type
  const getApiEndpoint = () => {
    return userType === 'doctor' ? '/api/doctors' : '/api/users/signup';
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(getApiEndpoint(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setMessage('Verification successful!');
      onVerificationSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(getApiEndpoint(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setMessage('New verification code sent!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.verificationContainer}>
      <div className={styles.formSection}>
        <h3>Email Verification</h3>
        <p className={styles.verificationText}>
          We've sent a verification code to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerifyOTP} className={styles.verificationForm}>
          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Enter verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {message && <div className={styles.successMessage}>{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.verifyButton}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading}
            className={styles.resendButton}
          >
            Resend verification code
          </button>
        </form>
      </div>
    </div>
  );
};