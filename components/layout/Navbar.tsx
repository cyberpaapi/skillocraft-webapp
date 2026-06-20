"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// import { FaFacebookF, FaApple } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
import { IoMenu, IoClose, IoCart, IoNotificationsOutline, IoLogOutOutline, IoPersonOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Category } from "@/types";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosHomePublic, axiosHomeProtected } from "@/services/axiosHomeService";
import { toast } from "sonner";

// Interface for navbar API response
interface NavbarData {
  cartCount: number;
  notificationCount: number;
}

interface NavbarApiResponse {
  status: number;
  message: string;
  data: NavbarData;
}

// Fallback categories when DB is empty
const FALLBACK_CATEGORIES: Category[] = [
  { id: 'baking', name: 'Baking', description: '', status: 'ACTIVE', createdBy: '', createdAt: '', updatedAt: '', featured: false, subCategory: [] },
  { id: 'banking', name: 'Banking', description: '', status: 'ACTIVE', createdBy: '', createdAt: '', updatedAt: '', featured: false, subCategory: [] },
  { id: 'perfume', name: 'Perfume', description: '', status: 'ACTIVE', createdBy: '', createdAt: '', updatedAt: '', featured: false, subCategory: [] },
  { id: 'makeup', name: 'Makeup', description: '', status: 'ACTIVE', createdBy: '', createdAt: '', updatedAt: '', featured: false, subCategory: [] },
  { id: 'cooking', name: 'Cooking', description: '', status: 'ACTIVE', createdBy: '', createdAt: '', updatedAt: '', featured: false, subCategory: [] },
  { id: 'healthcare', name: 'Healthcare', description: '', status: 'ACTIVE', createdBy: '', createdAt: '', updatedAt: '', featured: false, subCategory: [] },
];

// Course Data
// const courseCategories = [
//   { label: "Baking", icon: "/icons/cake.svg" },
//   { label: "Baking", icon: "/icons/cake.svg" },
//   { label: "Cosmetology", icon: "/icons/perfume.svg" },
//   { label: "Cosmetology", icon: "/icons/perfume.svg" },
//   { label: "Makeup", icon: "/icons/makeup-2.svg" },
//   { label: "Makeup", icon: "/icons/makeup-2.svg" },
//   { label: "Cooking", icon: "/icons/cooking.svg" },
//   { label: "Cooking", icon: "/icons/cooking.svg" },
//   { label: "Health care", icon: "/icons/health.svg" },
//   { label: "Health care", icon: "/icons/health.svg" },
// ];

// Social Data
// const socialLogins = [
//   {
//     label: "Continue with Facebook",
//     href: "",
//     icon: <FaFacebookF />,
//     className: "bg-gradient-to-r from-blue-500 to-blue-700",
//   },
//   {
//     label: "Continue with Apple",
//     href: "",
//     icon: <FaApple />,
//     className: "bg-gray-900",
//   },
//   {
//     label: "Continue with Google",
//     href: "",
//     icon: <FcGoogle />,
//     className: "border border-white",
//   },
// ];

const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const { openModal } = useModal();
  const currentPath = usePathname() || '';
  const queryClient = useQueryClient();

  const [categories, setCategories] = useState<Category[]>([]);
  
  const { data: response } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await axiosHomePublic.get<{ 
          status: number;
          message: string;
          data: Category[];
        }>('/categories');
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch categories');
        return { data: [] };
      }
    },
    refetchOnWindowFocus: false,
  });

  // Navbar data query - only fetch if user is logged in
  const { data: navbarData } = useQuery({
    queryKey: ['navbar-data'],
    queryFn: async () => {
      try {
        const response = await axiosHomeProtected.get<NavbarApiResponse>('/navbar/data');
        return response.data.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch navbar data');
        return { cartCount: 0, notificationCount: 0 };
      }
    },
    enabled: isLoggedIn && !isLoading, // Only fetch when user is logged in and loading is complete
    refetchOnWindowFocus: true, // Refetch when window gets focus (page reload)
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    if (response?.data && response.data.length > 0) {
      setCategories(response.data);
    } else if (response) {
      setCategories(FALLBACK_CATEGORIES);
    }
  }, [response]);

  // Refetch navbar data when login state changes
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      // Refetch navbar data when user logs in
      queryClient.invalidateQueries({ queryKey: ['navbar-data'] });
    }
  }, [isLoggedIn, isLoading, queryClient]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openLoginDialog = () => {
    //setIsLoginDialogOpen(true);
    openModal('login')
    setIsSidebarOpen(false);
  };

  const openSignupDialog = () => {
    //setIsSignupDialogOpen(true);
    openModal('signup')
    setIsSidebarOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 text-sm text-gray-800 w-full border-b border-b-gray-100 bg-white" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 md:py-4 py-2">
            <Link href="/">
              <Image
                src="/logo.png"
                width={500}
                height={500}
                alt="Logo"
                className="md:h-16 h-12 w-auto"
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            {!isLoading && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-700 hover:text-primary"
              >
                <IoMenu className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`font-sans hover:text-primary ${isActive("/") ? "text-primary font-extrabold" : "text-[#8283A2] font-normal"}`}
            >
              Home
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`font-sans hover:text-primary p-0 h-auto bg-transparent hover:bg-transparent ${isActive("/courses") ? "text-primary font-extrabold" : "text-[#8283A2] font-normal"}`}>
                    Courses
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[460px] p-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3 px-1">Browse by Category</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {categories.map((category, index) => (
                          <li key={`${category.id}-${index}`}>
                            <Link
                              href={`/courses?category=${category.id}`}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-all group"
                            >
                              {category.icon ? (
                                <Image
                                  src={category.icon.startsWith('http') ? category.icon : `${process.env.NEXT_PUBLIC_API_URL}${category.icon}`}
                                  width={40}
                                  height={40}
                                  alt={category.name}
                                  className="size-10 rounded-lg flex-shrink-0 object-cover"
                                />
                              ) : (
                                <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center text-lg font-bold text-primary">
                                  {category.name.charAt(0)}
                                </span>
                              )}
                              <span className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">{category.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link
              href="/success"
              className={`font-sans hover:text-primary ${isActive("/success") ? "text-primary font-extrabold" : "text-[#8283A2] font-normal"}`}
            >
              Success Stories
            </Link>
            <Link
              href="/referral"
              className={`font-sans hover:text-primary ${isActive("/referral") ? "text-primary font-extrabold" : "text-[#8283A2] font-normal"}`}
            >
              Refer & Earn
            </Link>
            <Link
              href="/live"
              className={`font-sans hover:text-primary ${isActive("/live") ? "text-primary font-extrabold" : "text-[#8283A2] font-normal"}`}
            >
              Skillocraft Live
            </Link>
            <Link
              href="/marketplace"
              className={`font-sans hover:text-primary ${isActive("/marketplace") ? "text-primary font-extrabold" : "text-[#8283A2] font-normal"}`}
            >
              Marketplace
            </Link>
            <Link
              href="/blogs"
              className={`font-sans hover:text-primary ${isActive("/blogs") ? "text-primary font-extrabold" : "text-[#8283A2] font-normal"}`}
            >
              Blogs
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : isLoggedIn ? (
              <>
                {/* Cart Icon */}
                <Link href="/cart" className="relative p-1.5 rounded-full hover:bg-gray-100">
                  <IoCart className="h-5 w-5 text-gray-700" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {navbarData?.cartCount || 0}
                  </Badge>
                </Link>
                
                {/* Notification Icon */}
                <button className="relative p-1.5 rounded-full hover:bg-gray-100">
                  <IoNotificationsOutline className="h-5 w-5 text-gray-700" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-500">
                    {navbarData?.notificationCount || 0}
                  </Badge>
                </button>
                
                {/* User Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer h-10 w-10 border-2 border-gray-200 hover:border-primary transition-colors">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => window.location.href = '/profile'} className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <ul className="flex items-center gap-4">
                <li>
                  <button
                    className="font-semibold text-secondary"
                    onClick={openLoginDialog}
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    className="font-semibold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg"
                    onClick={openSignupDialog}
                  >
                    SIGN UP
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Menu for Mobile */}
      <div
        className={`fixed w-full h-screen inset-0 bg-black/60 z-20 transition-all ${isSidebarOpen ? "block" : "hidden"
          }`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`text-xs fixed top-0 right-0 h-screen overflow-y-auto bg-background z-30 transform ${isSidebarOpen ? "w-64" : "w-0"
          } transition-all`}
      >
        <button className="ms-4 mt-4 text-gray-800" onClick={toggleSidebar}>
          <IoClose className="size-6" />
        </button>
        <ul className="flex flex-col gap-4 p-4">
          <Link
            href="/"
            className={`hover:text-primary ${isActive("/") ? "text-primary" : ""}`}
          >
            Home
          </Link>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="text-xs font-normal p-0 hover:text-primary">Courses</AccordionTrigger>
              <AccordionContent className="p-0">
                <ul className="grid gap-3 ps-4 pt-3">
                  <li>
                    <Link href="/courses" onClick={toggleSidebar} className="text-xs text-primary font-semibold hover:underline">
                      Browse All Courses →
                    </Link>
                  </li>
                  {categories.map((category, index) => (
                    <li key={`${category.id}-${index}`}>
                      <Link
                        href={`/courses?category=${category.id}`}
                        onClick={toggleSidebar}
                        className={`text-xs flex items-center gap-2 hover:text-primary ${isActive("/courses") ? "text-primary" : "text-gray-600"}`}
                      >
                        {category.icon && (
                          <Image
                            src={category.icon.startsWith('http') ? category.icon : `${process.env.NEXT_PUBLIC_API_URL}${category.icon}`}
                            width={16}
                            height={16}
                            alt={category.name}
                            className="size-4 rounded"
                          />
                        )}
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            href="/success"
            className={`hover:text-primary ${isActive("/success") ? "text-primary" : ""}`}
          >
            Success Stories
          </Link>
          <Link
            href="/referral"
            className={`hover:text-primary ${isActive("/referral") ? "text-primary" : ""}`}
          >
            Refer & Earn
          </Link>
          <Link
            href="/live"
            className={`hover:text-primary ${isActive("/live") ? "text-primary" : ""}`}
          >
            Skillocraft Live
          </Link>
          <Link
            href="/marketplace"
            className={`hover:text-primary ${isActive("/marketplace") ? "text-primary" : ""}`}
          >
            Marketplace
          </Link>
          <Link
            href="/blogs"
            className={`hover:text-primary ${isActive("/blogs") ? "text-primary" : ""}`}
          >
            Blogs
          </Link>
        </ul>
        {/* Mobile Menu - Logged In */}
        {isLoggedIn ? (
          <div className="w-full px-4 pb-4 pt-2 mt-2 border-t border-gray-100">
            {/* Account card */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl mb-3">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-primary text-white text-base font-semibold">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-secondary truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <Link href="/profile" onClick={toggleSidebar} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                <IoPersonOutline className="h-5 w-5" />
                <span className="text-[11px] font-medium">Profile</span>
              </Link>
              <Link href="/cart" onClick={toggleSidebar} className="relative flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                <div className="relative">
                  <IoCart className="h-5 w-5" />
                  {(navbarData?.cartCount || 0) > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                      {navbarData?.cartCount || 0}
                    </Badge>
                  )}
                </div>
                <span className="text-[11px] font-medium">Cart</span>
              </Link>
              <button className="relative flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                <div className="relative">
                  <IoNotificationsOutline className="h-5 w-5" />
                  {(navbarData?.notificationCount || 0) > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-500">
                      {navbarData?.notificationCount || 0}
                    </Badge>
                  )}
                </div>
                <span className="text-[11px] font-medium">Alerts</span>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors"
            >
              <IoLogOutOutline className="h-5 w-5" /> Logout
            </button>
          </div>
        ) : (
          /* Mobile Menu - Logged Out */
          <div className="w-full p-4 space-y-3">
            <button
              className="w-full text-center p-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
              onClick={openLoginDialog}
            >
              Login
            </button>
            <button
              className="w-full text-center p-3 border border-primary text-primary hover:bg-primary/5 rounded-lg font-medium"
              onClick={openSignupDialog}
            >
              Create Account
            </button>
          </div>
        )}
      </div>

      {/* Login Dialog */}
      {/* <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="lg:max-w-3xl md:max-w-2xl max-w-xs p-0 overflow-hidden border-0 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/10">
          <div className="grid md:grid-cols-2 grid-cols-1">
            <Image
              src="/login.jpg"
              width={500}
              height={500}
              alt=""
              className="w-full h-full object-cover md:block hidden"
            />
            <div className="grid content-start gap-4 px-4 py-8">
              <div>
                <Image
                  src="/logo.png"
                  width={500}
                  height={500}
                  alt=""
                  className="h-12 w-auto"
                />
                <DialogTitle className="md:text-md text-sm font-light tracking-normal text-white mt-3">
                  Join us and get more benefits. We promise to keep your data safely.
                </DialogTitle>
              </div>
              <div className="grid gap-2">
                <InputWithIcon className="w-full bg-white" id="email" placeholder="Email Address" icon={<BiEnvelope />} iconPosition="left" />
                <Input id="email" className="w-full bg-white" placeholder="Email Address" />
                <Input id="text" className="w-full bg-white" placeholder="Password" />
                <Button variant="default" onClick={loginApiCall}>Login</Button>
              </div>
              <div className="text-center text-xs text-gray-50">or</div>
              <div className="grid gap-2">
                {socialLogins.map((social, index) => (
                  <Link
                    key={`${social.label}-${index}`}
                    href={social.href}
                    className={`flex items-center justify-center gap-2 px-4 py-3 text-sm text-white rounded-lg ${social.className}`}
                  >
                    {social.icon}
                    {social.label}
                  </Link>
                ))}
              </div>
              <div className="text-center text-xs font-light text-gray-50">
                Need an account? <Link href="" onClick={openSignupDialog} className="font-medium text-primary hover:underline">Sign up</Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Signup Dialog */}
      {/* <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
        <DialogContent className="lg:max-w-3xl md:max-w-2xl max-w-xs p-0 overflow-hidden border-0 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/10">
          <div className="grid md:grid-cols-2 grid-cols-1">
            <Image
              src="/signup.jpg"
              width={500}
              height={500}
              alt=""
              className="w-full h-full object-cover md:block hidden"
            />
            <div className="grid content-start gap-4 px-4 py-8">
              <div>
                <Image
                  src="/logo.png"
                  width={500}
                  height={500}
                  alt=""
                  className="h-12 w-auto"
                />
                <DialogTitle className="md:text-md text-sm font-light tracking-normal text-white mt-3">
                  Join us and get more benefits. We promise to keep your data safely.
                </DialogTitle>
              </div>
              <div className="grid gap-2">
                {socialLogins.map((social, index) => (
                  <Link
                    key={`${social.label}-${index}`}
                    href={social.href}
                    className={`flex items-center justify-center gap-2 px-4 py-3 text-sm text-white rounded-lg ${social.className}`}
                  >
                    {social.icon}
                    {social.label}
                  </Link>
                ))}
              </div>
              <div className="text-center text-xs text-gray-50">or</div>
              <div className="grid gap-2">
                <Input id="email" className="w-full bg-white" placeholder="Email Address" />
                <Input id="text" className="w-full bg-white" placeholder="Password" />
                <Button variant="default">Sign Up</Button>
              </div>
              <div className="text-center text-xs font-light text-gray-50">
                Already have an account? <Link href="" onClick={openLoginDialog} className="font-medium text-primary hover:underline">Sign In</Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </nav>
  );
};

export default Navbar;
