'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { Category } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CoursesFilterProps {
  categories: Category[];
}

export default function CoursesFilter({ categories }: CoursesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    setSearchQuery(query);
    setSelectedCategory(category);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    router.push(`/courses?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    router.push('/courses');
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-secondary">Browse Courses</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <FiFilter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          {(searchQuery || selectedCategory) && (
            <Button variant="ghost" onClick={clearFilters}>
              <FiX className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-64">
              <select
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 bg-white text-gray-800"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Button type="submit" className="w-full sm:w-auto px-6 h-10">
                <FiSearch className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
