import React from 'react';
import { 
  CpuChipIcon,
  EyeIcon,
  BoltIcon,
  BeakerIcon,
  ChartBarIcon,
  ScaleIcon,
  RobotIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const CATEGORIES = [
  {
    name: 'Machine Learning',
    icon: CpuChipIcon,
    description: 'Latest developments in ML algorithms and techniques',
    color: 'blue',
    count: 156
  },
  {
    name: 'Computer Vision',
    icon: EyeIcon,
    description: 'Image recognition, video analysis, and visual AI',
    color: 'green',
    count: 89
  },
  {
    name: 'Natural Language Processing',
    icon: BoltIcon,
    description: 'Language models, translation, and text analysis',
    color: 'purple',
    count: 234
  },
  {
    name: 'Deep Learning',
    icon: BeakerIcon,
    description: 'Neural networks and deep learning research',
    color: 'orange',
    count: 178
  },
  {
    name: 'Data Science',
    icon: ChartBarIcon,
    description: 'Data analysis, visualization, and insights',
    color: 'indigo',
    count: 123
  },
  {
    name: 'Policy & Regulation',
    icon: ScaleIcon,
    description: 'AI governance, ethics, and legal frameworks',
    color: 'red',
    count: 67
  },
  {
    name: 'Robotics',
    icon: RobotIcon,
    description: 'Autonomous systems and robotic applications',
    color: 'gray',
    count: 94
  },
  {
    name: 'General AI',
    icon: GlobeAltIcon,
    description: 'AGI research and broad AI developments',
    color: 'yellow',
    count: 201
  }
];

function Categories() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Browse by Category
        </h1>
        <p className="text-gray-600 mt-1">
          Explore AI news organized by specific topics and domains
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
            green: 'bg-green-100 text-green-600 hover:bg-green-200',
            purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
            orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
            indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
            red: 'bg-red-100 text-red-600 hover:bg-red-200',
            gray: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
          };

          return (
            <div
              key={category.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg transition-colors duration-200 ${colorClasses[category.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {category.count} articles
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                {category.name}
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-primary-900 mb-2">
          Category Browsing Coming Soon
        </h3>
        <p className="text-primary-700">
          We're working on implementing category-based article browsing. 
          For now, you can use the filters in the sidebar to narrow down articles by topic.
        </p>
      </div>
    </div>
  );
}

export default Categories;