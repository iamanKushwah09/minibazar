'use client';

import { useState } from 'react';
import Header from '../../components/Header';

import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  AcademicCapIcon,
  HeartIcon,
  UsersIcon,
  SparklesIcon,
  RocketLaunchIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'design', name: 'Design' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'customer-support', name: 'Customer Support' },
    { id: 'operations', name: 'Operations' }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'remote', name: 'Remote' },
    { id: 'new-york', name: 'New York' },
    { id: 'san-francisco', name: 'San Francisco' },
    { id: 'london', name: 'London' },
    { id: 'berlin', name: 'Berlin' }
  ];

  const jobListings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'engineering',
      location: 'remote',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      description: 'Build amazing user experiences with React, TypeScript, and modern web technologies.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team collaboration'],
      postedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'design',
      location: 'new-york',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      description: 'Create beautiful, intuitive designs that delight our customers.',
      requirements: ['3+ years design experience', 'Figma expertise', 'User research skills'],
      postedDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'Digital Marketing Manager',
      department: 'marketing',
      location: 'san-francisco',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      description: 'Drive growth through innovative digital marketing strategies.',
      requirements: ['5+ years marketing experience', 'Analytics expertise', 'Campaign management'],
      postedDate: '2024-01-08'
    },
    {
      id: 4,
      title: 'Customer Success Specialist',
      department: 'customer-support',
      location: 'remote',
      type: 'Full-time',
      salary: '$60,000 - $80,000',
      description: 'Help customers succeed and build lasting relationships.',
      requirements: ['2+ years customer service', 'Problem-solving skills', 'Communication excellence'],
      postedDate: '2024-01-05'
    }
  ];

  const filteredJobs = jobListings.filter(job => {
    const departmentMatch = selectedDepartment === 'all' || job.department === selectedDepartment;
    const locationMatch = selectedLocation === 'all' || job.location === selectedLocation;
    return departmentMatch && locationMatch;
  });

  const benefits = [
    {
      icon: HeartIcon,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: AcademicCapIcon,
      title: 'Learning & Development',
      description: 'Professional development budget, conference attendance, and skill-building workshops'
    },
    {
      icon: UsersIcon,
      title: 'Flexible Work',
      description: 'Remote work options, flexible hours, and work-life balance support'
    },
    {
      icon: SparklesIcon,
      title: 'Innovation Time',
      description: '20% time for personal projects and innovation initiatives'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Career Growth',
      description: 'Clear career paths, mentorship programs, and promotion opportunities'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Team',
      description: 'Work with talented people from around the world in a diverse environment'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Build the future of e-commerce with a team that values innovation, 
              creativity, and making a difference in people's lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5" />
                <span>200+ Team Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5" />
                <span>15+ Countries</span>
              </div>
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5" />
                <span>Innovation First</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Culture</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe in creating an environment where everyone can thrive, 
              innovate, and make a meaningful impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600">
              Find your next opportunity with us
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.type}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <BriefcaseIcon className="h-8 w-8 text-gray-400" />
                </div>
                
                <p className="text-gray-600 mb-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requirements.map((req, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {req}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="capitalize">{job.location.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see the right fit?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. 
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Submit General Application
          </button>
        </div>
      </section>


    </div>
  );
} 