'use client';
import Link from 'next/link';
//import { Button } from '@/components/ui/button';
//import { BookOpen, Clock, Mail, Calendar, Clock3, CheckCircle, Award, Users, BookText, ShoppingCart, DollarSign, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { BookOpen, Award, Users, BookText, ShoppingCart, DollarSign } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="mx-auto flex w-full max-w-[520px] flex-col items-center justify-center space-y-6 text-center">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Skillocraft
            </span>
          </div>
        </Link>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Coming Soon
            </h1>
            <p className="text-lg text-muted-foreground">
              We are working hard to bring you something amazing. Stay tuned!
            </p>
          </div>

          {/* Countdown Timer */}
          {/* <div className="grid grid-cols-4 gap-4 py-6">
            {[
              { value: '14', label: 'Days', icon: Calendar },
              { value: '23', label: 'Hours', icon: Clock },
              { value: '45', label: 'Minutes', icon: Clock3 },
              { value: '12', label: 'Seconds', icon: CheckCircle },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center space-y-1 rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Icon className="h-5 w-5 text-primary mb-1" />
                  <span className="text-3xl font-bold">{item.value}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div> */}

          {/* Subscription Form */}
          {/* <div className="w-full max-w-md space-y-4">
            <p className="text-muted-foreground">
              Get notified when we launch
            </p>
            <form className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>
              <Button type="submit" className="whitespace-nowrap">
                Notify Me
              </Button>
            </form>
          </div> */}

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            {[
              { icon: BookOpen, text: 'Expert Courses' },
              { icon: Users, text: 'Skilled Instructors' },
              { icon: BookText, text: 'Interactive Learning' },
              { icon: Award, text: 'Certification' },
              { icon: ShoppingCart, text: 'Easy Enrollment' },
              { icon: DollarSign, text: 'Affordable Pricing' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* Social Links */}
          {/* <div className="flex items-center justify-center space-x-4 pt-8">
            {[
              { icon: Facebook, url: '#' },
              { icon: Twitter, url: '#' },
              { icon: Instagram, url: '#' },
              { icon: Linkedin, url: '#' },
              { icon: Youtube, url: '#' },
            ].map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{social.icon.name}</span>
                </a>
              );
            })}
          </div> */}
        </div>
      </div>
    </div>
  );
}