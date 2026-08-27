'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuth } from '@/components/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendEnrollmentEmail } from '@/lib/actions/email';
import { 
  BookOpen, 
  Code2, 
  Search,
  ArrowRight,
  Clock,
  BarChart3,
  Shield,
  X,
  Loader2,
  CheckCircle2,
  Bot,
  Container,
  Workflow,
  HardDrive,
  Terminal
} from 'lucide-react';

const courses = [
  {
    title: 'AI Agents & Agent Engineering',
    description: 'Agents, specs, workflows, tools, and agent skills.',
    duration: '12 weeks',
    level: 'Intermediate',
    category: 'AI',
    icon: Bot,
    accent: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    color: '#f43f5e',
    videoUrl: '/videos/a.mp4'
  },
  {
    title: 'DevOps & Infrastructure',
    description: 'Docker, CI/CD, containers, servers, and deployment.',
    duration: '12 weeks',
    level: 'Advanced',
    category: 'Infrastructure',
    icon: Container,
    accent: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    color: '#f59e0b',
    videoUrl: '/videos/b.mp4'
  },
  {
    title: 'n8n Automation',
    description: 'Workflow automation, integrations, APIs, and AI workflows.',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'Automation',
    icon: Workflow,
    accent: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    color: '#3b82f6',
    videoUrl: '/videos/a.mp4'
  },
  {
    title: 'Modern Web Development',
    description: 'Next.js, React, APIs, and full-stack development.',
    duration: '10 weeks',
    level: 'Beginner',
    category: 'Development',
    icon: Code2,
    accent: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    color: '#10b981',
    videoUrl: '/videos/b.mp4'
  },
  {
    title: 'Self-Hosted AI',
    description: 'Ollama, local LLMs, model deployment, and running your own AI.',
    duration: '10 weeks',
    level: 'Intermediate',
    category: 'AI',
    icon: HardDrive,
    accent: 'bg-violet-50',
    badge: 'bg-violet-100 text-violet-700',
    color: '#8b5cf6',
    videoUrl: '/videos/a.mp4'
  },
  {
    title: 'AI Coding & Developer Tools',
    description: 'AI-assisted development, coding agents, OpenCode, and modern dev tools.',
    duration: '8 weeks',
    level: 'Intermediate',
    category: 'Development',
    icon: Terminal,
    accent: 'bg-cyan-50',
    badge: 'bg-cyan-100 text-cyan-700',
    color: '#06b6d4',
    videoUrl: '/videos/b.mp4'
  }
];

const LocalVideo = ({ url }: { url: string }) => {
  return (
    <div className="w-full aspect-video mb-4 overflow-hidden rounded-xl border-2 border-[#1c1c1c] shadow-[4px_4px_0px_0px_#1c1c1c] bg-[#1c1c1c] relative group/video">
      <video 
        src={url} 
        className="w-full h-full object-cover"
        autoPlay 
        muted 
        loop 
        playsInline
      />
      <div className="absolute inset-0 bg-black/20 group-hover/video:bg-transparent transition-colors duration-300" />
    </div>
  );
};

export default function CoursesPage() {
  const { user, userDoc } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    isMember: false
  });

  // Pre-fill form if user is logged in
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || userDoc?.name || '',
        email: prev.email || user.email || '',
        isMember: userDoc?.role !== 'pending' && userDoc?.role !== undefined
      }));
    }
  }, [user, userDoc]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    
    setIsEnrolling(true);
    try {
      const price = formData.isMember ? 0 : 150;
      
      // 1. Save to Firestore
      await addDoc(collection(db, 'enrollments'), {
        courseTitle: selectedCourse.title,
        userId: user?.uid || 'guest',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        isMember: formData.isMember,
        price,
        status: 'pending',
        enrolledAt: serverTimestamp()
      });

      // 2. Send Confirmation Email
      await sendEnrollmentEmail(
        formData.email,
        formData.fullName,
        selectedCourse.title,
        price
      );

      setEnrolled(true);
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const closeEnrollModal = () => {
    setSelectedCourse(null);
    setEnrolled(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#1C1C1C] font-sans selection:bg-[#fbd35a] selection:text-[#1c1c1c]">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-[#fbd35a] border-2 border-[#1c1c1c] rounded-lg shadow-[2px_2px_0px_0px_#1c1c1c]">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#6b6b6b]">
              Academic Excellence
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Our <span className="text-orange-500 italic">Curriculum</span>
          </h1>
          <p className="text-xl text-[#555555] max-w-2xl leading-relaxed">
            Upskill with our hands-on courses designed by industry experts and club leads. 
            From design to deployment, we've got you covered.
          </p>
        </motion.div>

        {/* Search & Filter Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full h-14 pl-12 pr-4 bg-white border-2 border-[#1c1c1c] rounded-xl shadow-[4px_4px_0px_0px_#1c1c1c] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_0px_#1c1c1c] transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Development', 'AI', 'Infrastructure', 'Security'].map((cat) => (
              <button 
                key={cat}
                className={`px-6 h-14 rounded-xl border-2 border-[#1c1c1c] font-bold text-sm shadow-[4px_4px_0px_0px_#1c1c1c] transition-all hover:bg-[#fbd35a] active:shadow-none active:translate-x-1 active:translate-y-1 ${cat === 'All' ? 'bg-[#fbd35a]' : 'bg-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedCourse(course)}
                className="group relative bg-white border-2 border-[#1c1c1c] rounded-2xl p-6 shadow-[6px_6px_0px_0px_#1c1c1c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#1c1c1c] transition-all flex flex-col h-full cursor-pointer"
              >
                {/* Media Section */}
                <div className="relative mb-6">
                  {course.videoUrl ? (
                    <LocalVideo url={course.videoUrl} />
                  ) : (
                    <div className={`${course.accent} w-full aspect-video rounded-xl border-2 border-[#1c1c1c] flex items-center justify-center shadow-[3px_3px_0px_0px_#1c1c1c]`}>
                      <Icon className="w-12 h-12" style={{ color: course.color }} />
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 z-10 px-4 py-2 bg-[#fbd35a] text-[#1c1c1c] font-bold text-xs rounded-lg border-2 border-[#1c1c1c] shadow-[2px_2px_0px_0px_#1c1c1c] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0px_0px_#1c1c1c] transition-all flex items-center gap-2">
                    Enroll
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#1c1c1c]/10 ${course.badge}`}>
                    {course.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-[#555555] text-sm leading-relaxed mb-6 flex-grow">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6b6b6b]" />
                    <span className="text-xs font-semibold text-[#6b6b6b]">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#6b6b6b]" />
                    <span className="text-xs font-semibold text-[#6b6b6b]">{course.level}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enrollment Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeEnrollModal}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-[#FAF6EF] border-4 border-[#1c1c1c] rounded-[2.5rem] shadow-[12px_12px_0px_0px_#1c1c1c] overflow-hidden"
              >
                <div className="p-0 overflow-y-auto max-h-[90vh]">
                  <button 
                    onClick={closeEnrollModal}
                    className="absolute top-6 right-6 z-10 p-2 bg-white border-2 border-[#1c1c1c] rounded-full hover:bg-[#fbd35a] transition-all shadow-[2px_2px_0px_0px_#1c1c1c] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {!enrolled ? (
                    <div className="flex flex-col md:flex-row">
                      {/* Left: Course Info */}
                      <div className="md:w-5/12 p-8 md:p-10 bg-white border-b-4 md:border-b-0 md:border-r-4 border-[#1c1c1c]">
                        <div className={`w-16 h-16 ${selectedCourse.accent} rounded-2xl border-2 border-[#1c1c1c] flex items-center justify-center shadow-[4px_4px_0px_0px_#1c1c1c] mb-8`}>
                          <selectedCourse.icon className="w-8 h-8" style={{ color: selectedCourse.color }} />
                        </div>
                        
                        <span className="text-xs font-black uppercase tracking-widest text-orange-600 mb-2 block">Curriculum 2026</span>
                        <h2 className="text-3xl font-black leading-tight mb-4">{selectedCourse.title}</h2>
                        
                        <p className="text-[#555555] text-sm leading-relaxed mb-8">
                          {selectedCourse.description}
                        </p>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center border border-[#1c1c1c]/10">
                              <Clock className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider leading-none mb-1">Duration</p>
                              <p className="text-sm font-black">{selectedCourse.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center border border-[#1c1c1c]/10">
                              <BarChart3 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider leading-none mb-1">Level</p>
                              <p className="text-sm font-black">{selectedCourse.level}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center border border-[#1c1c1c]/10">
                              <Shield className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider leading-none mb-1">Certification</p>
                              <p className="text-sm font-black">Professional PDF</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Enrollment Form */}
                      <div className="md:w-7/12 p-8 md:p-10">
                        <header className="mb-8">
                          <h3 className="text-xl font-black">Reserve your spot</h3>
                          <p className="text-xs text-[#6b6b6b] mt-1">Fill in your details to get started.</p>
                        </header>

                        <form onSubmit={handleEnroll} className="space-y-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-[#1c1c1c]">Full Name</label>
                            <input
                              required
                              type="text"
                              value={formData.fullName}
                              onChange={e => setFormData({...formData, fullName: e.target.value})}
                              className="w-full h-12 px-4 bg-white border-2 border-[#1c1c1c] rounded-xl shadow-[4px_4px_0px_0px_#1c1c1c] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_0px_#1c1c1c] transition-all"
                              placeholder="John Doe"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-[#1c1c1c]">Email Address</label>
                            <input
                              required
                              type="email"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                              className="w-full h-12 px-4 bg-white border-2 border-[#1c1c1c] rounded-xl shadow-[4px_4px_0px_0px_#1c1c1c] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_0px_#1c1c1c] transition-all"
                              placeholder="john@example.com"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-[#1c1c1c]">Phone Number</label>
                            <input
                              required
                              type="tel"
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              className="w-full h-12 px-4 bg-white border-2 border-[#1c1c1c] rounded-xl shadow-[4px_4px_0px_0px_#1c1c1c] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_0px_#1c1c1c] transition-all"
                              placeholder="+267 ..."
                            />
                          </div>

                          <div className="bg-[#EDF9F7] border-2 border-[#1c1c1c] rounded-xl p-4 shadow-[4px_4px_0px_0px_#1c1c1c]">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.isMember}
                                  onChange={e => setFormData({...formData, isMember: e.target.checked})}
                                  className="peer sr-only"
                                />
                                <div className="w-6 h-6 border-2 border-[#1c1c1c] rounded bg-white peer-checked:bg-[#fbd35a] transition-colors" />
                                <CheckCircle2 className="w-4 h-4 absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                                <span className="text-sm font-bold">I am an Innovation Club member</span>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white border-2 border-[#1c1c1c] rounded-xl">
                            <span className="text-sm font-bold text-[#6b6b6b]">Registration Fee:</span>
                            <span className="text-2xl font-black">
                              {formData.isMember ? 'FREE' : 'P 150.00'}
                            </span>
                          </div>

                          <button
                            disabled={isEnrolling}
                            type="submit"
                            className="w-full h-14 bg-[#1c1c1c] text-white rounded-xl font-bold text-lg shadow-[6px_6px_0px_0px_#fbd35a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#fbd35a] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                          >
                            {isEnrolling ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Complete Enrollment
                                <ArrowRight className="w-5 h-5" />
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 px-8 text-center max-w-sm mx-auto">
                      <div className="w-24 h-24 bg-[#fbd35a] border-4 border-[#1c1c1c] rounded-[2rem] shadow-[8px_8px_0px_0px_#1c1c1c] flex items-center justify-center mx-auto mb-10">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <h2 className="text-4xl font-black mb-4">You're in!</h2>
                      <p className="text-[#6b6b6b] mb-10 leading-relaxed font-medium">
                        Confirmation sent to <strong>{formData.email}</strong>.<br/>We'll reach out with class schedules soon.
                      </p>
                      <button
                        onClick={closeEnrollModal}
                        className="w-full h-16 bg-[#1c1c1c] text-white rounded-2xl font-bold text-xl shadow-[6px_6px_0px_0px_#fbd35a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#fbd35a] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                      >
                        Return to Courses
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 bg-orange-500 rounded-[2.5rem] border-2 border-[#1c1c1c] shadow-[10px_10px_0px_0px_#1c1c1c] text-white text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Want to teach?</h2>
          <p className="text-xl mb-10 max-w-xl mx-auto opacity-90">
            Share your expertise with the community. We're always looking for passionate instructors.
          </p>
          <button className="px-10 py-5 bg-[#1c1c1c] text-white rounded-2xl font-bold text-lg border-2 border-[#1c1c1c] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all">
            Apply as Instructor
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
