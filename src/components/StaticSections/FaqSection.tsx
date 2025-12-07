import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type QA = {
  question: string;
  answer: React.ReactNode;
};

type Section = {
  title: string;
  qas: QA[];
};

const sections: Section[] = [
  {
    title: '1. ORDER-RELATED FAQs',
    qas: [
      {
        question: 'How can I place an order on Fakira Fab?',
        answer:
          'You can place an order directly through our official website or by contacting us on WhatsApp. Simply select the product, choose the variant, and proceed to checkout.'
      },
      {
        question: 'Can I change or cancel my order after placing it?',
        answer: 'Orders can be changed or cancelled within 2 hours of placing them. After dispatch, no changes are possible.'
      },
      {
        question: 'How will I know if my order is confirmed?',
        answer: 'You will receive an order confirmation message on WhatsApp or email once your payment and order details are verified.'
      },
      {
        question: 'Do you offer bulk or wholesale orders?',
        answer:
          'Yes. Fakira Fab is a manufacturer, wholesaler, and retailer. For bulk orders, contact us on WhatsApp for special pricing.'
      }
    ]
  },
  {
    title: '2. PRODUCT-RELATED FAQs',
    qas: [
      {
        question: 'Are all products hand-block printed?',
        answer: 'Yes. All fabrics and garments are crafted using traditional hand-block printing techniques with organic and natural dyes.'
      },
      {
        question: 'Will the colors fade after washing?',
        answer:
          'Our products are dyed using natural & eco-friendly dyes. Slight bleeding in the first wash is normal. Follow the wash care instructions for the best longevity.'
      },
      {
        question: 'Do you provide customized prints or colors?',
        answer: 'Yes, customized orders are accepted for bulk/wholesale quantities. Contact us directly for customization.'
      },
      {
        question: 'Are color variations possible?',
        answer:
          'Yes, because hand-block printing is a manual artisan process, slight variations in print, color, and texture indicate authenticity, not defects.'
      }
    ]
  },
  {
    title: '3. SHIPPING-RELATED FAQs',
    qas: [
      {
        question: 'Do you ship across India?',
        answer: 'Yes, we ship to all states in India.'
      },
      {
        question: 'How long will it take to deliver my order?',
        answer:
          "Delivery times:\n\nReady products: 4–7 business days\n\nMade-to-order: 7–12 business days"
      },
      {
        question: 'How can I track my order?',
        answer: 'Once dispatched, a tracking number will be shared via WhatsApp or email.'
      },
      {
        question: 'Is shipping free?',
        answer: 'Shipping charges depend on the product and location. Free shipping is available on select order values as per ongoing offers.'
      }
    ]
  },
  {
    title: '4. RETURN & EXCHANGE-RELATED FAQs',
    qas: [
      {
        question: 'Do you offer returns or exchanges?',
        answer:
          'Yes, we accept returns/exchanges only if: The product is damaged, The wrong product is received, There is a manufacturing defect. Returns must be requested within 48 hours of delivery.'
      },
      {
        question: 'What items are NOT eligible for return?',
        answer:
          'Fabrics cut as per order, Used or washed products, Customized items, Bulk/wholesale orders.'
      },
      {
        question: 'How do I request a return?',
        answer:
          'Share an unboxing video and product images on WhatsApp. After review, our team will guide you through the return process.'
      },
      {
        question: 'What if my order arrives damaged?',
        answer:
          'We will offer a replacement or refund, provided you share a proper unboxing video within 48 hours.'
      }
    ]
  },
  {
    title: '5. PAYMENT-RELATED FAQs',
    qas: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We only accept online payments. Modes include: UPI, Net Banking, Debit/Credit Cards, Wallets (depending on gateway).'
      },
      {
        question: 'Do you offer Cash on Delivery (COD)?',
        answer: 'No, we do not offer COD. All orders must be prepaid.'
      },
      {
        question: 'Is online payment safe on your website?',
        answer: 'Yes. We use trusted and secure payment gateways to ensure 100% safety.'
      }
    ]
  },
  {
    title: '6. CUSTOMER SERVICE-RELATED FAQs',
    qas: [
      {
        question: 'How can I contact customer support?',
        answer: (
          <>
            You can reach us through:<br />
            WhatsApp: +91 9998042577<br />
            Email: fakirafab2410@gmail.com<br />
            Website Contact Form
          </>
        )
      },
      {
        question: 'What are your customer service hours?',
        answer: 'Monday to Saturday: 10:00 AM – 7:00 PM'
      }
    ]
  },
  {
    title: '7. STORE-RELATED FAQs',
    qas: [
      {
        question: 'Do you have an offline store?',
        answer:
          'Yes, we have an offline store. You can visit us to explore our full handblock-printed collection in person'
      },
      {
        question: 'Can I visit your workshop?',
        answer: 'Yes, visits for wholesalers and distributors can be arranged with prior appointment.'
      }
    ]
  },
  {
    title: '8. NEED HELP?',
    qas: [
      {
        question: 'I am confused about selecting products. What should I do?',
        answer:
          'Just message us on WhatsApp. Our team will guide you with: Product suggestions, WhatsApp catalogs, Fabric details, Pricing & availability.'
      },
      {
        question: 'Do you provide customer support for order tracking or product help?',
        answer:
          "Yes, our WhatsApp team is always ready to assist you with any query."
      }
    ]
  }
];

const FaqSection: React.FC<{ allowMultiple?: boolean }> = ({ allowMultiple = false }) => {
  const [open, setOpen] = useState<string | null>(null);
  const [openSet, setOpenSet] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenSet(prev => ({ ...prev, [id]: !prev[id] }));
      return;
    }

    setOpen(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-3 text-gray-600">Fakira Fab – Frequently Asked Questions (FAQs)</p>
        </div>

        <div className="space-y-8">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">{section.title}</h3>
              </div>

              <div>
                {section.qas.map((qa, qIdx) => {
                  const id = `${sIdx}-${qIdx}`;
                  const isOpen = allowMultiple ? !!openSet[id] : open === id;

                  return (
                    <div key={id} className="border-t border-gray-100">
                      <button
                        id={`button-${id}`}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`panel-${id}`}
                        onClick={() => toggle(id)}
                        className="w-full px-6 py-6 flex items-start justify-between gap-4 text-left"
                      >
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{qa.question}</p>
                        </div>
                        <div className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        </div>
                      </button>

                      <div
                        id={`panel-${id}`}
                        role="region"
                        aria-labelledby={`button-${id}`}
                        className={`px-6 overflow-hidden transition-[max-height,padding] duration-300 ${isOpen ? 'py-4' : 'py-0'}`}
                        style={{ maxHeight: isOpen ? 400 : 0 }}
                      >
                        <div className="text-gray-600 whitespace-pre-line">{qa.answer}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
