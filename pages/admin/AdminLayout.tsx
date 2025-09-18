
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { LayoutDashboard, FileText, Tags, MessageSquare, LogOut, ExternalLink, Menu, X, Sun, Moon, Youtube, Megaphone } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AIAssistant from '../../components/AIAssistant';

const AdminLayout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Posts', path: '/admin/posts', icon: FileText },
        { name: 'Categories', path: '/admin/categories', icon: Tags },
        { name: 'Comments', path: '/admin/comments', icon: MessageSquare },
        { name: 'YouTube Tool', path: '/admin/youtube-tool', icon: Youtube },
        { name: 'Advertisement', path: '/admin/advertisement', icon: Megaphone },
    ];
    
    const activeClass = "bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-white";
    const inactiveClass = "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 dark:text-gray-400">
                    <X size={20}/>
                </button>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/admin'}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? activeClass : inactiveClass}`}
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <a href="/#/" target="_blank" rel="noopener noreferrer" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${inactiveClass}`}>
                    <ExternalLink className="mr-3 h-5 w-5" />
                    View Site
                </a>
                <button onClick={handleLogout} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${inactiveClass}`}>
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 flex lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
                <div className="relative w-64 max-w-xs flex-1 flex flex-col bg-white dark:bg-gray-800">
                    <SidebarContent/>
                </div>
                <div className="flex-shrink-0 w-14" onClick={() => setSidebarOpen(false)}></div>
            </div>
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-shrink-0 w-64">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                        <SidebarContent />
                    </div>
                </div>
            </aside>
            
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <header className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => setSidebarOpen(true)} className="px-4 text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden">
                        <Menu size={24} />
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                        <div className="flex-1 flex">
                            {/* Search bar can go here */}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                             <div className="text-sm">
                                <p className="font-medium">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
            <AIAssistant />
        </div>
    );
};

export default AdminLayout;