import React from 'react';
import { Sprout, HeartPulse, Home, GraduationCap, Briefcase, Users } from 'lucide-react';
import type { CategoryMeta } from '../types';

interface CategoryCardsProps {
  categories: CategoryMeta[];
  selectedCategory?: string;
  onSelectCategory: (categoryId?: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="w-6 h-6 text-emerald-600" />,
  HeartPulse: <HeartPulse className="w-6 h-6 text-rose-600" />,
  Home: <Home className="w-6 h-6 text-blue-600" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-purple-600" />,
  Briefcase: <Briefcase className="w-6 h-6 text-amber-600" />,
  Users: <Users className="w-6 h-6 text-pink-600" />,
};

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Browse by Sector
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Explore Scheme Categories
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select a domain to view verified central and state government programs
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(undefined)}
              className="mt-3 md:mt-0 text-sm font-semibold text-amber-700 hover:text-amber-800 underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
                className={`group p-6 rounded-2xl border transition-smooth cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-smooth">
                    {ICON_MAP[cat.icon] || <Sprout className="w-6 h-6 text-slate-600" />}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {cat.scheme_count} {cat.scheme_count === 1 ? 'Scheme' : 'Schemes'}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-smooth">
                  {cat.label}
                </h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {cat.description}
                </p>

                <div className="mt-4 flex items-center text-xs font-semibold text-amber-600">
                  <span>{isSelected ? 'Selected' : 'View schemes'}</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-smooth">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
