import { Twitter, Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">About Us</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            NewsHub is your go-to source for the latest news and information from around the world.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Home</Link></li>
                            <li><Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Blog</Link></li>
                            <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500"><Twitter /></a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500"><Facebook /></a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500"><Instagram /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; 2024 NewsHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
