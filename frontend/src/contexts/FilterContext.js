import React, { createContext, useContext, useReducer } from 'react';

const FilterContext = createContext();

const initialState = {
  searchQuery: '',
  selectedSources: [],
  selectedCategories: ['AI'],
  keywords: [],
  minHotness: 0,
  sortBy: 'hotness',
  timeRange: '7d',
  showSummaries: true,
  showImages: true,
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SELECTED_SOURCES':
      return { ...state, selectedSources: action.payload };
    
    case 'ADD_SOURCE':
      return {
        ...state,
        selectedSources: [...state.selectedSources, action.payload]
      };
    
    case 'REMOVE_SOURCE':
      return {
        ...state,
        selectedSources: state.selectedSources.filter(source => source !== action.payload)
      };
    
    case 'SET_SELECTED_CATEGORIES':
      return { ...state, selectedCategories: action.payload };
    
    case 'ADD_CATEGORY':
      return {
        ...state,
        selectedCategories: [...state.selectedCategories, action.payload]
      };
    
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        selectedCategories: state.selectedCategories.filter(cat => cat !== action.payload)
      };
    
    case 'SET_KEYWORDS':
      return { ...state, keywords: action.payload };
    
    case 'ADD_KEYWORD':
      return {
        ...state,
        keywords: [...state.keywords, action.payload]
      };
    
    case 'REMOVE_KEYWORD':
      return {
        ...state,
        keywords: state.keywords.filter(keyword => keyword !== action.payload)
      };
    
    case 'SET_MIN_HOTNESS':
      return { ...state, minHotness: action.payload };
    
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    
    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.payload };
    
    case 'SET_SHOW_SUMMARIES':
      return { ...state, showSummaries: action.payload };
    
    case 'SET_SHOW_IMAGES':
      return { ...state, showImages: action.payload };
    
    case 'RESET_FILTERS':
      return initialState;
    
    case 'SET_FILTERS':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const actions = {
    setSearchQuery: (query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    setSelectedSources: (sources) => dispatch({ type: 'SET_SELECTED_SOURCES', payload: sources }),
    addSource: (source) => dispatch({ type: 'ADD_SOURCE', payload: source }),
    removeSource: (source) => dispatch({ type: 'REMOVE_SOURCE', payload: source }),
    setSelectedCategories: (categories) => dispatch({ type: 'SET_SELECTED_CATEGORIES', payload: categories }),
    addCategory: (category) => dispatch({ type: 'ADD_CATEGORY', payload: category }),
    removeCategory: (category) => dispatch({ type: 'REMOVE_CATEGORY', payload: category }),
    setKeywords: (keywords) => dispatch({ type: 'SET_KEYWORDS', payload: keywords }),
    addKeyword: (keyword) => dispatch({ type: 'ADD_KEYWORD', payload: keyword }),
    removeKeyword: (keyword) => dispatch({ type: 'REMOVE_KEYWORD', payload: keyword }),
    setMinHotness: (hotness) => dispatch({ type: 'SET_MIN_HOTNESS', payload: hotness }),
    setSortBy: (sortBy) => dispatch({ type: 'SET_SORT_BY', payload: sortBy }),
    setTimeRange: (range) => dispatch({ type: 'SET_TIME_RANGE', payload: range }),
    setShowSummaries: (show) => dispatch({ type: 'SET_SHOW_SUMMARIES', payload: show }),
    setShowImages: (show) => dispatch({ type: 'SET_SHOW_IMAGES', payload: show }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
  };

  return (
    <FilterContext.Provider value={{ ...state, ...actions }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}

export default FilterContext;