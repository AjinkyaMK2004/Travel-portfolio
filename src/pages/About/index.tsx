import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Camera, Compass, Heart, Send, CheckCircle } from 'lucide-react';

export const About: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    
    // Simulate API Post
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

  const gearList = [
    { name: 'Fujifilm X-T5 Mirrorless Camera', desc: 'Main body used for capturing travel journals and landscape snapshots.' },
    { name: 'Fujinon XF 23mm f/1.4 R LM WR Lens', desc: 'Street photography workhorse providing cinematic low-light details.' },
    { name: 'Fujinon XF 18-55mm f/2.8-4 R LM OIS', desc: 'Versatile travel zoom lens used during mountain expeditions.' },
    { name: 'iPhone 15 Pro', desc: 'Used for quick route tracking, navigation, and supplementary wide captures.' }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background pt-16 pb-section-gap text-on-background transition-colors duration-300">
      <main className="px-margin-desktop max-w-container-max mx-auto pt-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="font-display-lg text-display-lg mb-4">Behind The Portfolio</h1>
          <p className="text-secondary dark:text-secondary-fixed-dim font-body-lg text-body-lg max-w-2xl leading-relaxed">
            The narrative of an exchange semester exploring Europe, compiling personal travel philosophy, camera equipment, and contact lines.
          </p>
        </header>

        {/* Storytelling Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-16 items-start">
          {/* Biography Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-headline-md text-2xl text-primary dark:text-primary-fixed mb-4">
              The Exchange Semester
            </h2>
            <div className="space-y-4 text-secondary dark:text-secondary-fixed-dim text-body-md leading-relaxed">
              <p>
                During the autumn of 2023 and spring of 2024, I embarked on a study exchange program based in central Europe. Living at the intersection of European transit lines allowed me to explore 14 neighboring countries, from Nordic channels to historic Mediterranean cliffs.
              </p>
              <p>
                This portfolio, <strong>EuroVenture</strong>, was built to move beyond simple social media posts. It acts as an interactive journal, visual photo archive, and geographical log that represents the architectural structures, daily local menus, and budget insights acquired along the way.
              </p>
            </div>

            <h2 className="font-headline-md text-2xl text-primary dark:text-primary-fixed pt-6 mb-4">
              My Travel Philosophy
            </h2>
            <div className="space-y-4 text-secondary dark:text-secondary-fixed-dim text-body-md leading-relaxed">
              <p className="flex gap-3 items-start">
                <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-1" />
                <span>
                  <strong>Slow Transit Priority:</strong> I believe the journey is as vital as the destination. Prioritizing trains and walking routes over short flights allows you to see the changing landscape, visit small border villages, and limit your carbon output.
                </span>
              </p>
              <p className="flex gap-3 items-start">
                <Compass className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                <span>
                  <strong>Unplanned Wandering:</strong> The best travel coordinates are rarely in tourist brochures. I dedicate significant parts of each city visit to getting lost along winding side streets, finding tiny bakeries, and chatting with locals.
                </span>
              </p>
            </div>
          </div>

          {/* Picture / Graphic Column */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-square border border-outline-variant/30 dark:border-outline/25 shadow-sm group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxzK8be2NpDcSMNg12Ve9RVltIWtQ3ArYOkvCzwMVbeWGqW5RxTAvnADPyAuXYb5B43gQvwyoWw3BYEzZX1B2HFy4lPYzceB6DnhxMHI20lj7MjFMe_kjdJjctK56BRY5AtyOMY7YoegvUJyjQr1ND0KeYxuyzVEgb0czjoxATGtrCcAC9RjjNyZ4YmPrI5RxHjp_MlD9vjbtwW6q9ZpnVETxf0V9dIzKFneB0pHkMMR9Ci-rVFsn7R1hRbzTaKqDPZVrMEyHyPVYl"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Stockholm café desk fika scene representing quiet travel study vibes"
            />
            <div className="absolute inset-0 bg-primary/10 dark:bg-black/20" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-primary/80 backdrop-blur-md px-4 py-3 rounded-xl border border-outline-variant/30">
              <span className="text-xs font-label-caps text-primary dark:text-primary-fixed block font-bold">
                Exchange Study Desk
              </span>
              <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim">
                Stockholm, Sweden
              </span>
            </div>
          </div>
        </section>

        {/* Equipment list */}
        <section className="border border-outline-variant/30 dark:border-outline/20 rounded-3xl p-8 bg-white dark:bg-surface-container-low/5 mb-16">
          <h2 className="font-headline-md text-2xl text-primary dark:text-primary-fixed mb-6 flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary dark:text-primary-fixed" /> Captured Hardware & Gear
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gearList.map((item, idx) => (
              <div key={idx} className="p-4 bg-surface-bright dark:bg-surface-container-low/10 rounded-xl border border-outline-variant/20">
                <h4 className="font-semibold text-primary dark:text-primary-fixed text-sm">{item.name}</h4>
                <p className="text-xs text-secondary dark:text-secondary-fixed-dim leading-relaxed mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
          {/* Social Profiles */}
          <div className="lg:col-span-5 border border-outline-variant/30 dark:border-outline/20 p-8 rounded-3xl bg-white dark:bg-surface-container-low/5 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-headline-md text-2xl text-primary dark:text-primary-fixed">Connect With Me</h2>
              <p className="text-sm text-secondary dark:text-secondary-fixed-dim leading-relaxed">
                If you have questions about specific cities, routes, exchange semester applications, or photography permissions, feel free to drop a message!
              </p>
            </div>
            
            <div className="space-y-3 pt-8 lg:pt-0">
              <a
                href="mailto:contact@example.com"
                className="flex items-center gap-3 p-3.5 border border-outline-variant/40 hover:border-primary rounded-xl text-sm font-label-caps text-primary dark:text-primary-fixed hover:bg-surface-container transition-all"
              >
                <Mail className="w-5 h-5 text-indigo-500" />
                contact@euroventure.com
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 border border-outline-variant/40 hover:border-primary rounded-xl text-sm font-label-caps text-primary dark:text-primary-fixed hover:bg-surface-container transition-all"
              >
                <svg className="w-5 h-5 text-blue-600 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                linkedin.com/in/euroventure
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 border border-outline-variant/40 hover:border-primary rounded-xl text-sm font-label-caps text-primary dark:text-primary-fixed hover:bg-surface-container transition-all"
              >
                <svg className="w-5 h-5 text-pink-500 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                instagram.com/euroventure
              </a>
            </div>
          </div>

          {/* Contact Input Form */}
          <div className="lg:col-span-7 border border-outline-variant/30 dark:border-outline/20 p-8 rounded-3xl bg-white dark:bg-surface-container-low/5">
            <h2 className="font-headline-md text-2xl text-primary dark:text-primary-fixed mb-6">Send A Message</h2>
            
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-64 flex flex-col items-center justify-center text-center space-y-3"
              >
                <CheckCircle className="w-12 h-12 text-emerald-500" />
                <h3 className="font-headline-sm text-lg text-primary dark:text-primary-fixed">Message Dispatched!</h3>
                <p className="text-xs text-secondary dark:text-secondary-fixed-dim max-w-xs leading-relaxed">
                  Thank you for reaching out. I've received your query and will reply as soon as my travels permit.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 text-xs font-label-caps text-primary border-b border-primary hover:opacity-80 pb-0.5"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary placeholder:text-secondary/50"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary placeholder:text-secondary/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your note here..."
                    className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary placeholder:text-secondary/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed py-3 rounded-xl font-label-caps text-label-caps hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
