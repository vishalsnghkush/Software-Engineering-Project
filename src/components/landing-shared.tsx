"use client";

import React from "react";
import Link from "next/link";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { Brain } from "@phosphor-icons/react";

export function LandingNavbar() {
  return (
    <Navbar maxWidth="xl" className="border-b border-slate-200 bg-white/80 backdrop-blur-md" isBlurred>
      <NavbarBrand>
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Brain weight="fill" size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">TCAS</span>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/" className="font-medium text-sm text-slate-600 hover:text-indigo-600 transition-colors">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/features" className="font-medium text-sm text-slate-600 hover:text-indigo-600 transition-colors">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/how-it-works" className="font-medium text-sm text-slate-600 hover:text-indigo-600 transition-colors">
            How It Works
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/analysis-preview" className="font-medium text-sm text-slate-600 hover:text-indigo-600 transition-colors">
            Analysis
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login" className="font-medium text-sm text-slate-600 hover:text-indigo-600">
            Log In
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/signup" variant="solid" className="font-medium shadow-sm">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Brain weight="fill" size={24} className="text-indigo-600" />
            <span className="font-bold text-xl text-slate-800 tracking-tight">TCAS</span>
          </div>
          <p className="text-sm text-slate-500 max-w-sm">
            Test Conduction and Assessment Software specifically tailored to mimic the demands of modern competitive examinations with integrated AI Models.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-slate-900 mb-2">Platform</h4>
          <Link href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Documentation</Link>
          <Link href="/features" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="/analysis-preview" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Performance Criteria</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-slate-900 mb-2">Support</h4>
          <Link href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Help Center</Link>
          <Link href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Contact Us</Link>
          <Link href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">System Status</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs text-slate-400">© 2026 TCAS System. All rights reserved.</p>
        <p className="text-xs text-slate-400 mt-4 md:mt-0">Powered by Next.js & Drizzle ORM</p>
      </div>
    </footer>
  );
}
