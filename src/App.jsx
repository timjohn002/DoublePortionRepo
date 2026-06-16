import { useState, useRef, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ukzwyegrjlcrmkewslrw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrend5ZWdyamxjcm1rZXdzbHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTcwMjgsImV4cCI6MjA5NzE3MzAyOH0.I90y23h3M_FD5ttK54DEcoBuwYdu4brJ_8jH1dcD4MM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GOOGLE_CLIENT_ID = "310389054450-evbm6r4ai6rmon598ts0iqpp7t7010te.apps.googleusercontent.com";
const ALLOWED_EMAILS = ["timjohnargota@gmail.com"];

const SOLD_AS_OPTIONS = ["whole cake", "per slice", "per piece", "per box"];

const QR_PLACEHOLDER = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PayNow%3A%2B6591234567&color=2C1A0E&bgcolor=FDF6EC";

const P = {
  bg: "#FDF6EC", espresso: "#2C1A0E", amber: "#F2A65A",
  sage: "#6B8F71", cream: "#FFFAF3", muted: "#8C6E4B", light: "#F7E8D4",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${P.bg}; font-family: 'Inter', sans-serif; color: ${P.espresso}; min-height: 100vh; }
  button { cursor: pointer; font-family: 'Inter', sans-serif; }
  input, textarea, select { font-family: 'Inter', sans-serif; }

  .nav { background: ${P.espresso}; color: ${P.cream}; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .nav-brand { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; letter-spacing: 0.02em; color: ${P.amber}; }
  .nav-brand span { color: ${P.cream}; font-weight: 400; font-size: 1rem; margin-left: 0.5rem; }
  .nav-links { display: flex; align-items: center; gap: 1rem; }
  .nav-btn { background: transparent; border: 1px solid rgba(255,255,255,0.25); color: ${P.cream}; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; transition: all 0.2s; }
  .nav-btn:hover { background: rgba(255,255,255,0.1); border-color: ${P.amber}; color: ${P.amber}; }
  .nav-btn.cart-btn { background: ${P.amber}; border-color: ${P.amber}; color: ${P.espresso}; font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .nav-btn.cart-btn:hover { background: #e8943e; }
  .cart-count { background: ${P.espresso}; color: ${P.amber}; width: 20px; height: 20px; border-radius: 50%; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }

  .page { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }

  .hero { text-align: center; padding: 3rem 1rem 2rem; }
  .hero-eyebrow { font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${P.muted}; margin-bottom: 0.75rem; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.1; color: ${P.espresso}; margin-bottom: 0.75rem; }
  .hero-title em { color: ${P.amber}; font-style: italic; }
  .hero-sub { color: ${P.muted}; font-size: 1rem; max-width: 420px; margin: 0 auto; line-height: 1.6; }
  .divider { display: flex; align-items: center; gap: 1rem; margin: 2rem 0; color: ${P.muted}; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: ${P.light}; }

  .filter-bar { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; }
  .filter-chip { padding: 0.4rem 1.2rem; border-radius: 20px; border: 1.5px solid ${P.light}; background: transparent; color: ${P.muted}; font-size: 0.85rem; transition: all 0.2s; }
  .filter-chip.active { background: ${P.espresso}; border-color: ${P.espresso}; color: ${P.cream}; }
  .filter-chip:hover:not(.active) { border-color: ${P.amber}; color: ${P.espresso}; }

  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
  .product-card { background: ${P.cream}; border-radius: 16px; border: 1.5px solid ${P.light}; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
  .product-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(44,26,14,0.08); }
  .product-card.unavailable { opacity: 0.55; }
  .product-img { height: 160px; display: flex; align-items: center; justify-content: center; font-size: 4rem; background: ${P.light}; overflow: hidden; }
  .product-img img { width: 100%; height: 100%; object-fit: cover; }
  .product-body { padding: 1.1rem 1.25rem 1.25rem; flex: 1; display: flex; flex-direction: column; }
  .product-category { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: ${P.muted}; margin-bottom: 0.3rem; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; margin-bottom: 0.4rem; color: ${P.espresso}; }
  .product-desc { font-size: 0.82rem; color: ${P.muted}; line-height: 1.5; flex: 1; margin-bottom: 1rem; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .product-price { font-size: 1.1rem; font-weight: 700; color: ${P.espresso}; }
  .product-price span { font-size: 0.75rem; font-weight: 400; color: ${P.muted}; }
  .sold-as-pill { display: inline-block; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.04em; color: ${P.muted}; background: ${P.light}; border-radius: 20px; padding: 0.15rem 0.55rem; margin-top: 0.3rem; }
  .add-btn { background: ${P.espresso}; color: ${P.cream}; border: none; border-radius: 20px; padding: 0.45rem 1rem; font-size: 0.82rem; font-weight: 600; transition: all 0.2s; }
  .add-btn:hover { background: ${P.amber}; color: ${P.espresso}; }
  .unavailable-tag { font-size: 0.75rem; color: #999; border: 1px solid #ddd; border-radius: 20px; padding: 0.4rem 0.8rem; }

  .cart-container { max-width: 680px; margin: 0 auto; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; margin-bottom: 1.5rem; color: ${P.espresso}; }
  .cart-item { background: ${P.cream}; border: 1.5px solid ${P.light}; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
  .cart-item-thumb { width: 48px; height: 48px; border-radius: 8px; background: ${P.light}; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; overflow: hidden; }
  .cart-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.2rem; }
  .cart-item-price { font-size: 0.85rem; color: ${P.muted}; }
  .qty-control { display: flex; align-items: center; gap: 0.5rem; }
  .qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid ${P.light}; background: white; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; color: ${P.espresso}; }
  .qty-btn:hover { border-color: ${P.amber}; background: ${P.light}; }
  .qty-num { font-weight: 600; min-width: 24px; text-align: center; }
  .remove-btn { background: transparent; border: none; color: #bbb; font-size: 1.1rem; padding: 4px; border-radius: 4px; transition: color 0.15s; }
  .remove-btn:hover { color: #e24b4a; }
  .cart-summary { background: ${P.espresso}; color: ${P.cream}; border-radius: 12px; padding: 1.25rem 1.5rem; margin-top: 1.5rem; }
  .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; }
  .summary-total { font-size: 1.15rem; font-weight: 700; color: ${P.amber}; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 0.75rem; margin-top: 0.5rem; }
  .checkout-btn { width: 100%; margin-top: 1rem; background: ${P.amber}; color: ${P.espresso}; border: none; border-radius: 10px; padding: 0.9rem; font-size: 1rem; font-weight: 700; transition: background 0.2s; }
  .checkout-btn:hover { background: #e8943e; }
  .empty-cart { text-align: center; padding: 4rem 2rem; color: ${P.muted}; }
  .empty-cart .big-emoji { font-size: 4rem; margin-bottom: 1rem; }
  .empty-cart p { font-size: 1.05rem; margin-bottom: 1.5rem; }
  .back-btn { background: ${P.espresso}; color: ${P.cream}; border: none; border-radius: 8px; padding: 0.6rem 1.4rem; font-size: 0.9rem; font-weight: 600; transition: background 0.2s; }
  .back-btn:hover { background: ${P.amber}; color: ${P.espresso}; }

  .checkout-container { max-width: 560px; margin: 0 auto; }
  .form-group { margin-bottom: 1.25rem; }
  .form-label { display: block; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: ${P.muted}; margin-bottom: 0.4rem; }
  .form-input { width: 100%; padding: 0.7rem 1rem; border: 1.5px solid ${P.light}; border-radius: 8px; font-size: 0.95rem; background: ${P.cream}; color: ${P.espresso}; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: ${P.amber}; }
  .form-input.error { border-color: #e24b4a; }
  .form-error { font-size: 0.78rem; color: #e24b4a; margin-top: 0.3rem; }
  .qr-section { background: ${P.cream}; border: 1.5px solid ${P.light}; border-radius: 12px; padding: 1.5rem; text-align: center; margin: 1.5rem 0; }
  .qr-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.4rem; }
  .qr-sub { font-size: 0.83rem; color: ${P.muted}; margin-bottom: 1rem; }
  .qr-img { border-radius: 8px; border: 1.5px solid ${P.light}; }
  .qr-amount { margin-top: 0.75rem; font-size: 1.3rem; font-weight: 700; color: ${P.espresso}; }
  .qr-amount span { color: ${P.amber}; }
  .submit-btn { width: 100%; background: ${P.espresso}; color: ${P.cream}; border: none; border-radius: 10px; padding: 1rem; font-size: 1rem; font-weight: 700; transition: background 0.2s; margin-top: 0.5rem; }
  .submit-btn:hover { background: #4a2e18; }

  .success-page { text-align: center; padding: 4rem 2rem; max-width: 480px; margin: 0 auto; }
  .success-icon { font-size: 4rem; margin-bottom: 1rem; }
  .success-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem; }
  .success-sub { color: ${P.muted}; line-height: 1.6; margin-bottom: 2rem; }

  .admin-container { max-width: 960px; margin: 0 auto; }
  .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1.5px solid ${P.light}; }
  .admin-badge { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; background: ${P.amber}; color: ${P.espresso}; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700; }
  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th { text-align: left; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: ${P.muted}; padding: 0.6rem 0.75rem; border-bottom: 1.5px solid ${P.light}; }
  .admin-table td { padding: 0.85rem 0.75rem; border-bottom: 1px solid ${P.light}; font-size: 0.88rem; vertical-align: middle; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-thumb { width: 44px; height: 44px; border-radius: 8px; background: ${P.light}; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; overflow: hidden; flex-shrink: 0; }
  .admin-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .toggle-btn { padding: 0.35rem 0.9rem; border-radius: 20px; border: 1.5px solid; font-size: 0.8rem; font-weight: 600; transition: all 0.2s; }
  .toggle-btn.on { border-color: ${P.sage}; color: ${P.sage}; background: transparent; }
  .toggle-btn.on:hover { background: ${P.sage}; color: white; }
  .toggle-btn.off { border-color: #ddd; color: #999; background: transparent; }
  .toggle-btn.off:hover { border-color: #bbb; color: #666; }
  .edit-btn { background: transparent; border: 1.5px solid ${P.light}; color: ${P.espresso}; border-radius: 8px; padding: 0.35rem 0.75rem; font-size: 0.8rem; font-weight: 600; transition: all 0.2s; }
  .edit-btn:hover { border-color: ${P.amber}; background: ${P.light}; }
  .delete-btn { background: transparent; border: 1.5px solid #fcc; color: #e24b4a; border-radius: 8px; padding: 0.35rem 0.75rem; font-size: 0.8rem; font-weight: 600; transition: all 0.2s; }
  .delete-btn:hover { background: #e24b4a; color: white; border-color: #e24b4a; }
  .action-cell { display: flex; gap: 0.4rem; }

  .add-product-form { background: ${P.cream}; border: 1.5px solid ${P.light}; border-radius: 12px; padding: 1.5rem; margin-top: 1.5rem; }
  .add-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
  .add-form-grid .span2 { grid-column: span 2; }
  .add-product-btn { background: ${P.espresso}; color: ${P.cream}; border: none; border-radius: 8px; padding: 0.65rem 1.4rem; font-size: 0.9rem; font-weight: 600; transition: background 0.2s; }
  .add-product-btn:hover { background: ${P.amber}; color: ${P.espresso}; }

  .upload-area { border: 2px dashed ${P.light}; border-radius: 8px; padding: 1rem; text-align: center; cursor: pointer; transition: border-color 0.2s; background: white; }
  .upload-area:hover { border-color: ${P.amber}; }
  .upload-area.has-image { border-style: solid; border-color: ${P.sage}; padding: 0; overflow: hidden; height: 100px; }
  .upload-area.has-image img { width: 100%; height: 100%; object-fit: cover; }
  .upload-label { font-size: 0.8rem; color: ${P.muted}; margin-top: 0.3rem; }

  .login-container { max-width: 400px; margin: 4rem auto; background: ${P.cream}; border: 1.5px solid ${P.light}; border-radius: 16px; padding: 2.5rem 2rem; text-align: center; }
  .login-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
  .login-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.4rem; }
  .login-sub { font-size: 0.85rem; color: ${P.muted}; margin-bottom: 1.75rem; line-height: 1.5; }
  .google-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; background: white; color: #3c4043; border: 1.5px solid #dadce0; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.95rem; font-weight: 500; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .google-btn:hover { background: #f8f9fa; border-color: #bbb; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
  .google-btn svg { flex-shrink: 0; }
  .login-divider { font-size: 0.75rem; color: ${P.muted}; margin: 1.25rem 0; display: flex; align-items: center; gap: 0.75rem; }
  .login-divider::before, .login-divider::after { content: ''; flex: 1; height: 1px; background: ${P.light}; }
  .login-error { background: #fcebeb; border: 1px solid #f09595; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.83rem; color: #a32d2d; margin-top: 1rem; text-align: left; line-height: 1.5; }
  .login-loading { font-size: 0.85rem; color: ${P.muted}; margin-top: 1rem; }
  .admin-user { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: ${P.cream}; }
  .admin-avatar { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid ${P.amber}; object-fit: cover; }
  .admin-avatar-placeholder { width: 28px; height: 28px; border-radius: 50%; background: ${P.amber}; color: ${P.espresso}; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; }
  .status-pill { display: inline-block; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 20px; letter-spacing: 0.05em; text-transform: uppercase; }
  .status-pill.available { background: #eaf3de; color: #3b6d11; }
  .status-pill.unavailable { background: #fcebeb; color: #a32d2d; }
  .loading-state { text-align: center; padding: 4rem 2rem; color: ${P.muted}; font-size: 1rem; }
  .loading-spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid ${P.light}; border-top-color: ${P.amber}; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .db-error { background: #fcebeb; border: 1px solid #f09595; border-radius: 10px; padding: 1rem 1.25rem; color: #a32d2d; font-size: 0.88rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.6rem; }

  /* Edit Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(44,26,14,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: ${P.bg}; border-radius: 16px; padding: 2rem; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; }
  .modal-close { background: transparent; border: none; font-size: 1.4rem; color: ${P.muted}; padding: 4px 8px; border-radius: 6px; transition: color 0.15s; }
  .modal-close:hover { color: ${P.espresso}; }
  .modal-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; justify-content: flex-end; }
  .save-btn { background: ${P.espresso}; color: ${P.cream}; border: none; border-radius: 8px; padding: 0.65rem 1.5rem; font-size: 0.9rem; font-weight: 600; transition: background 0.2s; }
  .save-btn:hover { background: ${P.amber}; color: ${P.espresso}; }
  .cancel-btn { background: transparent; border: 1.5px solid ${P.light}; color: ${P.muted}; border-radius: 8px; padding: 0.65rem 1.2rem; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; }
  .cancel-btn:hover { border-color: ${P.espresso}; color: ${P.espresso}; }

  .photo-upload-box { width: 100%; height: 160px; border: 2px dashed ${P.light}; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s; background: ${P.cream}; overflow: hidden; position: relative; }
  .photo-upload-box:hover { border-color: ${P.amber}; }
  .photo-upload-box img { width: 100%; height: 100%; object-fit: cover; }
  .photo-upload-overlay { position: absolute; inset: 0; background: rgba(44,26,14,0.55); display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; color: white; font-size: 0.85rem; }
  .photo-upload-box:hover .photo-upload-overlay { opacity: 1; }
  .photo-placeholder { font-size: 2.5rem; margin-bottom: 0.5rem; }
  .photo-hint { font-size: 0.78rem; color: ${P.muted}; margin-top: 0.3rem; }
  .remove-photo-btn { margin-top: 0.5rem; background: transparent; border: 1.5px solid #fcc; color: #e24b4a; border-radius: 6px; padding: 0.3rem 0.75rem; font-size: 0.78rem; font-weight: 600; transition: all 0.2s; }
  .remove-photo-btn:hover { background: #e24b4a; color: white; border-color: #e24b4a; }
`;

function ImageUpload({ image, emoji, onChange, onRemove }) {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <div className="photo-upload-box" onClick={() => ref.current.click()}>
        {image
          ? <><img src={image} alt="Product" /><div className="photo-upload-overlay">📷 Change photo</div></>
          : <><div className="photo-placeholder">{emoji || "📷"}</div><div className="photo-hint">Click to upload a photo</div></>
        }
        <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>
      {image && <button className="remove-photo-btn" onClick={onRemove} style={{ marginTop: "0.4rem" }}>✕ Remove photo</button>}
    </div>
  );
}

function EditModal({ product, onSave, onClose, saving }) {
  const [form, setForm] = useState({ ...product });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit Product</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Product Photo</label>
          <ImageUpload
            image={form.image}
            emoji={form.emoji}
            onChange={(img) => set("image", img)}
            onRemove={() => set("image", null)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Price (S$)</label>
            <input className="form-input" type="number" step="0.50" value={form.price} onChange={e => set("price", parseFloat(e.target.value) || 0)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="cake">Cake</option>
              <option value="brownie">Brownie</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sold as</label>
            <select className="form-input" value={form.soldAs || ""} onChange={e => set("soldAs", e.target.value)}>
              <option value="">— select —</option>
              {SOLD_AS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} style={{ resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="save-btn" onClick={() => onSave(form)} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("shop");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("all");
  const [adminUser, setAdminUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "cake", emoji: "🎂", image: null, soldAs: "", description: "" });
  const [addedId, setAddedId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const newPhotoRef = useRef();

  // Map Supabase snake_case to camelCase
  const mapProduct = (row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    category: row.category,
    emoji: row.emoji,
    image: row.image,
    soldAs: row.sold_as,
    available: row.available,
  });

  // Fetch products from Supabase on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      setProductsError("Could not load products. Please refresh the page.");
    } else {
      setProducts(data.map(mapProduct));
    }
    setProductsLoading(false);
  };

  // Google SSO
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => initGoogleSignIn();
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  const initGoogleSignIn = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse });
  };

  const handleGoogleSignIn = () => {
    if (!window.google) { setLoginError("Google Sign-In failed to load. Please refresh and try again."); return; }
    setLoginLoading(true);
    setLoginError("");
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        renderGoogleButton();
        setLoginLoading(false);
      }
    });
    renderGoogleButton();
  };

  const renderGoogleButton = () => {
    const el = document.getElementById("google-btn-target");
    if (!el || !window.google) return;
    window.google.accounts.id.renderButton(el, { theme: "outline", size: "large", width: 340 });
    setTimeout(() => el.querySelector("div[role=button]")?.click(), 100);
  };

  const handleGoogleResponse = (response) => {
    setLoginLoading(false);
    try {
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      const email = payload.email;
      if (ALLOWED_EMAILS.includes(email)) {
        setAdminUser({ email, name: payload.name, picture: payload.picture });
        setLoginError("");
      } else {
        setLoginError(`Access denied. ${email} is not authorised as an admin.`);
      }
    } catch {
      setLoginError("Something went wrong verifying your account. Please try again.");
    }
  };

  const handleSignOut = () => {
    if (window.google) window.google.accounts.id.disableAutoSelect();
    setAdminUser(null);
  };

  // Cart
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 700);
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const validateCheckout = () => {
    const e = {};
    if (!checkoutForm.name.trim()) e.name = "Please enter your full name.";
    if (!checkoutForm.email.trim() || !/\S+@\S+\.\S+/.test(checkoutForm.email)) e.email = "Please enter a valid email.";
    if (!checkoutForm.phone.trim() || !/^\+?[\d\s\-]{7,}$/.test(checkoutForm.phone)) e.phone = "Please enter a valid contact number.";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validateCheckout()) { setCart([]); setPage("success"); } };

  // Admin — Supabase CRUD
  const toggleAvailability = async (id) => {
    const product = products.find(p => p.id === id);
    const newVal = !product.available;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, available: newVal } : p));
    const { error } = await supabase.from("products").update({ available: newVal }).eq("id", id);
    if (error) { alert("Failed to update availability. Please try again."); fetchProducts(); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { alert("Failed to delete product. Please try again."); fetchProducts(); }
  };

  const saveEdit = async (updated) => {
    setSaving(true);
    const { error } = await supabase.from("products").update({
      name: updated.name,
      description: updated.description,
      price: updated.price,
      category: updated.category,
      emoji: updated.emoji,
      image: updated.image,
      sold_as: updated.soldAs,
      available: updated.available,
    }).eq("id", updated.id);
    setSaving(false);
    if (error) {
      alert("Failed to save changes. Please try again.");
    } else {
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditingProduct(null);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    setSaving(true);
    const { data, error } = await supabase.from("products").insert({
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      emoji: newProduct.emoji,
      image: newProduct.image,
      sold_as: newProduct.soldAs,
      available: true,
    }).select().single();
    setSaving(false);
    if (error) {
      alert("Failed to add product. Please try again.");
    } else {
      setProducts(prev => [...prev, mapProduct(data)]);
      setNewProduct({ name: "", price: "", category: "cake", emoji: "🎂", image: null, soldAs: "", description: "" });
    }
  };

  const handleNewPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewProduct(p => ({ ...p, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const visibleProducts = products.filter(p => filter === "all" || p.category === filter);

  return (
    <>
      <style>{css}</style>

      {editingProduct && <EditModal product={editingProduct} onSave={saveEdit} onClose={() => setEditingProduct(null)} saving={saving} />}

      <nav className="nav">
        <div className="nav-brand">Double Portion<span>· Cakes & Brownies</span></div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => setPage("shop")}>Shop</button>
          <button className="nav-btn cart-btn" onClick={() => setPage("cart")}>
            🛒 Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          {adminUser
            ? <button className="nav-btn" onClick={() => setPage("admin")} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {adminUser.picture
                  ? <img src={adminUser.picture} alt="" className="admin-avatar" />
                  : <span className="admin-avatar-placeholder">{adminUser.name?.[0]}</span>}
                Admin
              </button>
            : <button className="nav-btn" onClick={() => setPage("admin")}>Admin</button>
          }
        </div>
      </nav>

      {/* SHOP */}
      {page === "shop" && (
        <div className="page">
          <div className="hero">
            <p className="hero-eyebrow">Handcrafted with love · Singapore</p>
            <h1 className="hero-title">Made to make you<br /><em>say yes</em> to another slice.</h1>
            <p className="hero-sub">Each cake and brownie is baked fresh to order. No preservatives, no shortcuts.</p>
          </div>
          <div className="divider">our selection</div>
          <div className="filter-bar">
            {["all", "cake", "brownie"].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "Everything" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {productsLoading
              ? <div className="loading-state" style={{ gridColumn: "1/-1" }}><div className="loading-spinner"></div><p>Loading products…</p></div>
              : productsError
              ? <div className="db-error" style={{ gridColumn: "1/-1" }}>⚠️ {productsError}</div>
              : visibleProducts.map(product => (
              <div key={product.id} className={`product-card ${!product.available ? "unavailable" : ""}`}>
                <div className="product-img">
                  {product.image ? <img src={product.image} alt={product.name} /> : product.emoji}
                </div>
                <div className="product-body">
                  <p className="product-category">{product.category}</p>
                  <h2 className="product-name">{product.name}</h2>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <div>
                      <div className="product-price">S${product.price.toFixed(2)}</div>
                      {product.soldAs && <span className="sold-as-pill">{product.soldAs}</span>}
                    </div>
                    {product.available
                      ? <button className="add-btn" onClick={() => addToCart(product)} style={addedId === product.id ? { background: P.sage } : {}}>
                          {addedId === product.id ? "Added ✓" : "Add to Cart"}
                        </button>
                      : <span className="unavailable-tag">Unavailable</span>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CART */}
      {page === "cart" && (
        <div className="page">
          <div className="cart-container">
            <h1 className="section-title">Your Cart</h1>
            {cart.length === 0
              ? <div className="empty-cart"><div className="big-emoji">🛒</div><p>Nothing here yet — the bakery awaits.</p><button className="back-btn" onClick={() => setPage("shop")}>Browse the shop</button></div>
              : <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-thumb">
                        {item.image ? <img src={item.image} alt={item.name} /> : item.emoji}
                      </div>
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-price">S${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                        <span className="qty-num">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                  ))}
                  <div className="cart-summary">
                    {cart.map(item => (
                      <div key={item.id} className="summary-row"><span>{item.name} × {item.qty}</span><span>S${(item.price * item.qty).toFixed(2)}</span></div>
                    ))}
                    <div className="summary-row summary-total"><span>Total</span><span>S${cartTotal.toFixed(2)}</span></div>
                    <button className="checkout-btn" onClick={() => setPage("checkout")}>Proceed to Checkout →</button>
                  </div>
                </>
            }
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {page === "checkout" && (
        <div className="page">
          <div className="checkout-container">
            <h1 className="section-title">Complete Your Order</h1>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className={`form-input ${formErrors.name ? "error" : ""}`} placeholder="e.g. Sarah Tan" value={checkoutForm.name} onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })} />
              {formErrors.name && <p className="form-error">{formErrors.name}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className={`form-input ${formErrors.email ? "error" : ""}`} placeholder="you@example.com" type="email" value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} />
              {formErrors.email && <p className="form-error">{formErrors.email}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input className={`form-input ${formErrors.phone ? "error" : ""}`} placeholder="+65 9123 4567" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} />
              {formErrors.phone && <p className="form-error">{formErrors.phone}</p>}
            </div>
            <div className="qr-section">
              <p className="qr-title">💳 Scan to Pay via PayNow</p>
              <p className="qr-sub">Scan the QR code below with your banking app to complete payment.</p>
              <img src={QR_PLACEHOLDER} alt="PayNow QR Code" width="180" height="180" className="qr-img" />
              <p className="qr-amount">Amount: <span>S${cartTotal.toFixed(2)}</span></p>
            </div>
            <button className="submit-btn" onClick={handleSubmit}>✓ Confirm Order</button>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button className="back-btn" onClick={() => setPage("cart")}>← Back to cart</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {page === "success" && (
        <div className="page">
          <div className="success-page">
            <div className="success-icon">🎉</div>
            <h1 className="success-title">Order placed!</h1>
            <p className="success-sub">Thank you, {checkoutForm.name || "dear customer"}! We've received your order and will be in touch at {checkoutForm.email || "your email"} to confirm. Please complete your PayNow payment to begin preparation.</p>
            <button className="back-btn" onClick={() => { setPage("shop"); setCheckoutForm({ name: "", email: "", phone: "" }); }}>Back to shop</button>
          </div>
        </div>
      )}

      {/* ADMIN */}
      {page === "admin" && (
        <div className="page">
          {!adminUser ? (
            <div className="login-container">
              <div className="login-icon">🔐</div>
              <h2 className="login-title">Admin Access</h2>
              <p className="login-sub">Sign in with your authorised Google account to manage the Double Portion product catalogue.</p>
              <button className="google-btn" onClick={handleGoogleSignIn} disabled={loginLoading}>
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                {loginLoading ? "Signing in…" : "Sign in with Google"}
              </button>
              <div id="google-btn-target" style={{ display: "none" }} />
              {loginError && <div className="login-error">⚠️ {loginError}</div>}
              <div className="login-divider">only authorised accounts can access admin</div>
            </div>
          ) : (
            <div className="admin-container">
              <div className="admin-header">
                <div>
                  <h1 className="section-title" style={{ marginBottom: 0 }}>Product Manager</h1>
                  <p style={{ color: P.muted, fontSize: "0.85rem", marginTop: "0.25rem" }}>{products.length} products total</p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {adminUser.picture
                      ? <img src={adminUser.picture} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${P.amber}` }} />
                      : <span className="admin-avatar-placeholder">{adminUser.name?.[0]}</span>}
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: P.espresso }}>{adminUser.name}</div>
                      <div style={{ fontSize: "0.72rem", color: P.muted }}>{adminUser.email}</div>
                    </div>
                  </div>
                  <span className="admin-badge">Admin</span>
                  <button className="back-btn" onClick={handleSignOut}>Sign out</button>
                </div>
              </div>

              {productsError && <div className="db-error">⚠️ {productsError} <button className="edit-btn" style={{ marginLeft: "auto" }} onClick={fetchProducts}>Retry</button></div>}

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading
                    ? <tr><td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: P.muted }}><div className="loading-spinner" style={{ margin: "0 auto 0.5rem" }}></div><div>Loading…</div></td></tr>
                    : products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-thumb">
                          {product.image ? <img src={product.image} alt={product.name} /> : product.emoji}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{product.name}</div>
                        <div style={{ fontSize: "0.78rem", color: P.muted, maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.description}</div>
                      </td>
                      <td style={{ textTransform: "capitalize" }}>{product.category}</td>
                      <td>
                        <div>S${product.price.toFixed(2)}</div>
                        {product.soldAs && <div style={{ fontSize: "0.72rem", color: P.muted, marginTop: "2px" }}>{product.soldAs}</div>}
                      </td>
                      <td><span className={`status-pill ${product.available ? "available" : "unavailable"}`}>{product.available ? "Available" : "Hidden"}</span></td>
                      <td>
                        <button className={`toggle-btn ${product.available ? "on" : "off"}`} onClick={() => toggleAvailability(product.id)}>
                          {product.available ? "Hide" : "Show"}
                        </button>
                      </td>
                      <td>
                        <div className="action-cell">
                          <button className="edit-btn" onClick={() => setEditingProduct(product)}>✏️ Edit</button>
                          <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="add-product-form">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "1rem" }}>Add New Product</h3>
                <div className="add-form-grid">
                  <div>
                    <label className="form-label">Name</label>
                    <input className="form-input" placeholder="Product name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Price (S$)</label>
                    <input className="form-input" type="number" placeholder="0.00" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Category</label>
                    <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                      <option value="cake">Cake</option>
                      <option value="brownie">Brownie</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Sold as</label>
                    <select className="form-input" value={newProduct.soldAs || ""} onChange={e => setNewProduct({ ...newProduct, soldAs: e.target.value })}>
                      <option value="">— select —</option>
                      {SOLD_AS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Emoji (fallback)</label>
                    <input className="form-input" placeholder="🎂" value={newProduct.emoji} onChange={e => setNewProduct({ ...newProduct, emoji: e.target.value })} />
                  </div>
                  <div className="span2">
                    <label className="form-label">Description</label>
                    <input className="form-input" placeholder="Short description of the product" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                  </div>
                  <div className="span2">
                    <label className="form-label">Product Photo</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div className="upload-area" style={newProduct.image ? { padding: 0, height: "80px", width: "80px", borderStyle: "solid", borderColor: P.sage } : { height: "80px", width: "80px" }}
                        onClick={() => newPhotoRef.current.click()}>
                        {newProduct.image
                          ? <img src={newProduct.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} />
                          : <div style={{ fontSize: "1.8rem" }}>📷</div>
                        }
                        <input ref={newPhotoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleNewPhoto} />
                      </div>
                      <div>
                        <button className="edit-btn" onClick={() => newPhotoRef.current.click()}>Upload photo</button>
                        {newProduct.image && <button className="delete-btn" style={{ marginLeft: "0.5rem" }} onClick={() => setNewProduct(p => ({ ...p, image: null }))}>Remove</button>}
                        <p className="upload-label" style={{ marginTop: "0.4rem" }}>JPG, PNG, WebP · shown in shop & cart</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="add-product-btn" onClick={addProduct} disabled={saving}>{saving ? "Adding…" : "+ Add Product"}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
