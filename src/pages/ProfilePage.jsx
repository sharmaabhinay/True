import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/common/AuthModal';
import { openAuthModal, selectCurrentUser, selectIsCustomerAuthenticated, updateProfile } from '../store/slices/customerSlice';
import { showToast } from '../store/slices/uiSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    landmark: '',
  });

  useEffect(() => {
    if (!isAuthenticated) dispatch(openAuthModal({ mode: 'login', redirectTo: '/profile' }));
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      line1: user?.address?.line1 || '',
      line2: user?.address?.line2 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postalCode: user?.address?.postalCode || '',
      landmark: user?.address?.landmark || '',
    });
  }, [user]);

  const saveProfile = () => {
    dispatch(updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: {
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        landmark: form.landmark,
      },
    }));
    dispatch(showToast('Your profile has been updated.'));
  };

  return (
    <>
      <Navbar />
      <AuthModal />
      <main className="pt-[84px] min-h-screen bg-ivory px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-bark text-[0.72rem] tracking-[0.22em] uppercase mb-3">Edit Profile</p>
            <h1 className="font-cormorant text-4xl md:text-5xl text-deep font-light">Keep your account ready for checkout</h1>
          </div>

          <div className="rounded-[2rem] border border-warm bg-white p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Full name', 'name'],
              ['Email address', 'email'],
              ['Phone number', 'phone'],
              ['Address line 1', 'line1'],
              ['Address line 2', 'line2'],
              ['City', 'city'],
              ['State', 'state'],
              ['Postal code', 'postalCode'],
              ['Landmark', 'landmark'],
            ].map(([label, key]) => (
              <label key={key} className={key === 'line1' || key === 'line2' ? 'md:col-span-2' : ''}>
                <span className="text-muted text-[0.72rem] uppercase tracking-[0.12em] mb-2 block">{label}</span>
                <input
                  value={form[key]}
                  onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                  className="w-full rounded-2xl border border-warm bg-ivory px-4 py-3 text-sm text-deep outline-none font-dm"
                />
              </label>
            ))}

            <div className="md:col-span-2">
              <button onClick={saveProfile} className="bg-deep text-cream px-6 py-3 rounded-xl text-sm hover:bg-wood transition-colors cursor-pointer border-none">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
