import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/common/AuthModal';

const CONTENT = {
  about: {
    eyebrow: 'About Us',
    title: 'Furniture built with intent, detail, and patience.',
    intro: 'True Furnitures brings together traditional craftsmanship and practical modern living for homes across Indore and nearby cities.',
    sections: [
      ['Our story', 'We design and build sofas, beds, wardrobes, dining sets, and custom storage that feel warm, durable, and made for everyday life. Each order is reviewed with our workshop before production begins.'],
      ['Why families choose us', 'Customers come to us for custom sizing, finish options, dependable delivery, and a team that helps them make the right decision rather than the fastest one.'],
      ['What we care about', 'Long-lasting construction, thoughtful proportions, quality upholstery, and a service experience that feels personal from consultation to installation.'],
    ],
  },
  careers: {
    eyebrow: 'Careers',
    title: 'Join a team that respects craft and customer care.',
    intro: 'We are always interested in furniture designers, workshop supervisors, polish experts, and customer support professionals who care about quality.',
    sections: [
      ['Open mindset', 'We value curiosity, accountability, and people who can solve real customer problems without losing the warmth of the brand.'],
      ['Roles we often hire for', 'Furniture sales consultants, digital marketing specialists, carpentry and upholstery experts, installation supervisors, and production planners.'],
      ['How to apply', 'Send your profile, role interest, and a short introduction to info@truefurnitures.in. Strong portfolios and real project examples always help.'],
    ],
  },
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'Your information is handled carefully and only for service.',
    intro: 'We collect only the customer details needed to manage orders, addresses, quotations, and support requests.',
    sections: [
      ['Information we store', 'Name, phone number, email, delivery address, wishlist items, and order history when you create an account or place an order.'],
      ['How we use it', 'We use this information to confirm orders, coordinate delivery, offer support, and improve the buying experience.'],
      ['What we do not do', 'We do not sell customer data. Sensitive details are used only for our store operations and order communication.'],
    ],
  },
  terms: {
    eyebrow: 'Terms & Conditions',
    title: 'Clear expectations for custom furniture orders.',
    intro: 'These terms help set delivery, payment, and customization expectations before production begins.',
    sections: [
      ['Order confirmation', 'Production starts only after the order is confirmed and the required advance payment has been received.'],
      ['Customization', 'Custom dimensions, finishes, and fabrics may affect delivery timelines and final pricing.'],
      ['Delivery and support', 'Estimated dates are shared in good faith. Final schedules can vary based on production complexity and delivery location.'],
    ],
  },
};

export default function StaticPage({ pageKey }) {
  const page = CONTENT[pageKey] || CONTENT.about;

  return (
    <>
      <Navbar />
      <AuthModal />
      <main className="pt-[84px] min-h-screen bg-ivory px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-5xl mx-auto">
          <section className="rounded-[2.5rem] bg-gradient-to-br from-white via-ivory to-warm border border-warm px-8 py-12 md:px-12 md:py-16">
            <p className="text-bark text-[0.72rem] tracking-[0.22em] uppercase mb-4">{page.eyebrow}</p>
            <h1 className="font-cormorant text-4xl md:text-6xl leading-[1.04] text-deep font-light max-w-4xl">{page.title}</h1>
            <p className="text-muted text-sm md:text-base max-w-2xl leading-relaxed mt-5">{page.intro}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            {page.sections.map(([title, text]) => (
              <article key={title} className="rounded-[1.8rem] border border-warm bg-white p-6">
                <h2 className="font-cormorant text-2xl text-deep mb-3">{title}</h2>
                <p className="text-muted text-sm leading-relaxed">{text}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
