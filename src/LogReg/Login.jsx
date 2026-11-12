import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { loginUser, registerUser } from '../auth/auth';
import { sendRegistrationWelcome } from '../services/emailNotifications';
import './Login.css';
import authImage from '../assets/man-session.png';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phonePattern = /^[6-9]\d{9}$/;

const validate = (form, mode) => {
  const errors = {};
  if (mode === 'register') {
    if (!form.name.trim()) errors.name = 'Full name is required.';
    else if (form.name.trim().length < 2) errors.name = 'Enter at least 2 characters.';

    if (!form.phone.trim()) errors.phone = 'Phone number is required.';
    else if (!phonePattern.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit Indian number.';
  }

  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!emailPattern.test(form.email.trim())) errors.email = 'Enter a valid email address.';

  if (!form.password) errors.password = 'Password is required.';
  else if (mode === 'register') {
    if (form.password.length < 8) errors.password = 'Use at least 8 characters.';
    else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/\d/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password)) {
      errors.password = 'Use uppercase, lowercase, number and special character.';
    }
  }

  if (mode === 'register' && form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (mode === 'register' && !form.terms) errors.terms = 'Please accept the terms to continue.';
  return errors;
};

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const requestedNext = params.get('next');
  const nextPath = requestedNext?.startsWith('/') && !requestedNext.startsWith('//')
    ? requestedNext
    : '/account';
  const [mode, setMode] = useState(location.pathname === '/register' || params.get('mode') === 'register' ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false,
  });

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setServerError('');
    setSuccess('');
    const query = new URLSearchParams()
    if (nextMode === 'register') query.set('mode', 'register')
    if (requestedNext) query.set('next', requestedNext)
    navigate(`/login${query.size ? `?${query.toString()}` : ''}`, { replace: true });
  };

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setServerError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setServerError('');
    setSuccess('');
    const validationErrors = validate(form, mode);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      if (mode === 'register') {
        await registerUser(form);
        try {
          await sendRegistrationWelcome({ name: form.name.trim(), email: form.email.trim() });
          setSuccess('Account created successfully. Your welcome email has been sent.');
        } catch (emailError) {
          console.error('Unable to send account welcome email:', emailError);
          setSuccess('Account created successfully, but we could not send the welcome email.');
        }
        setTimeout(() => navigate('/account', { replace: true }), 900);
      } else {
        await loginUser(form);
        setSuccess('Welcome back. Redirecting you to the store…');
        setTimeout(() => navigate(nextPath, { replace: true }), 700);
      }
    } catch (error) {
      if (error.message === 'EMAIL_EXISTS') {
        setServerError('This email is already registered. Please sign in or use another email.');
      } else {
        setServerError('Incorrect email or password. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-visual" style={{ backgroundImage: `url(${authImage})` }}>
          <div className="auth-visual-overlay" />
          <Link to="/" className="auth-back"><ArrowBack /> Back to store</Link>
          <div className="auth-brand-mark">
            <span className="auth-eyebrow">SOVERIAN FIT’S</span>
            <h1>Style.<br /><em>Quality.</em><br />Confidence.</h1>
            <p>Premium fashion for those who don’t follow trends — they set them.</p>
          </div>
          <div className="auth-benefits">
            <span><CheckCircleOutlined /> Premium collections</span>
            <span><CheckCircleOutlined /> Exclusive member offers</span>
            <span><CheckCircleOutlined /> Secure account access</span>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-logo-text"><span>✦</span> SOVERIAN FIT’S</div>
            <div className="auth-heading">
              <span className="auth-kicker">{mode === 'register' ? 'JOIN THE MOVEMENT' : 'WELCOME BACK'}</span>
              <h2>{mode === 'register' ? 'Create your account' : 'Sign in to your account'}</h2>
              <p>{mode === 'register' ? 'Create an account for faster checkout and exclusive access.' : 'Enter your details to continue your journey in style.'}</p>
            </div>

            <div className="auth-tabs">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Login</button>
              <button className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Create account</button>
            </div>

            <form className="auth-form" onSubmit={submit} noValidate>
              {mode === 'register' && (
                <div className="field-row">
                  <Field label="Full name" value={form.name} error={errors.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" autoComplete="name" />
                  <Field label="Phone" value={form.phone} error={errors.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" autoComplete="tel" inputMode="numeric" />
                </div>
              )}

              <Field label="Email address" value={form.email} error={errors.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email" type="email" />

              <div className="password-field">
                <Field label="Password" value={form.password} error={errors.password} onChange={(e) => update('password', e.target.value)} placeholder="Enter your password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} type={showPassword ? 'text' : 'password'} />
                <button type="button" className="eye-btn" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>

              {mode === 'register' && (
                <>
                  <div className="password-field">
                    <Field label="Confirm password" value={form.confirmPassword} error={errors.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat your password" autoComplete="new-password" type={showConfirm ? 'text' : 'password'} />
                    <button type="button" className="eye-btn" onClick={() => setShowConfirm((v) => !v)} aria-label="Toggle confirmation password visibility">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </button>
                  </div>
                  <label className={`terms ${errors.terms ? 'has-error' : ''}`}>
                    <input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} />
                    <span>I agree to the <a href="#terms">Terms & Conditions</a> and Privacy Policy.</span>
                  </label>
                  {errors.terms && <small className="error-message">{errors.terms}</small>}
                </>
              )}

              {mode === 'login' && <div className="form-options"><label><input type="checkbox" /> Remember me</label><button type="button" onClick={() => setServerError('Password reset can be connected to your email service when the backend is added.')}>Forgot password?</button></div>}

              {serverError && <div className="form-alert error"><LockOutlined /> {serverError}</div>}
              {success && <div className="form-alert success"><CheckCircleOutlined /> {success}</div>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
                {!loading && <span>→</span>}
              </button>
            </form>

            <p className="auth-switch">
              {mode === 'register' ? 'Already have an account?' : 'New to Soverian Fit’s?'}{' '}
              <button onClick={() => switchMode(mode === 'register' ? 'login' : 'register')}>
                {mode === 'register' ? 'Sign in' : 'Create an account'}
              </button>
            </p>
            <p className="secure-note">Demo accounts are stored in this browser only. Production sign-in requires a secure server.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

const Field = ({ label, error, ...props }) => (
  <label className={`form-field ${error ? 'has-error' : ''}`}>
    <span>{label}</span>
    <input {...props} />
    {error && <small className="error-message">{error}</small>}
  </label>
);

export default Login;
