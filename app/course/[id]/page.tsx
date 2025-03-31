"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Worker } from '@react-pdf-viewer/core';

// Dynamically import PDF viewer with no SSR
const PDFViewer = dynamic(() => import('@react-pdf-viewer/core').then(mod => mod.Viewer), {
  ssr: false,
});

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

interface Feedback {
  mark: number;
  maxMark: number;
  reason: string;
  questionNumber: string;
}

interface CourseDetails {
  courseName: string;
  courseCode: string;
  teacherName: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  rank: number;
  classAverage: number;
  answerSheetUrl: string;
  feedback: Feedback[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/course/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch course details');
        const data = await response.json();
        setCourseDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Course Header Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Answer Sheet Section Skeleton */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="border rounded-lg overflow-hidden" style={{ height: '650px' }}>
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          {/* Question-wise Analysis Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="mb-3">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3"></div>
                  <div className="mt-4">
                    <div className="w-full p-4 bg-white rounded-xl border">
                      <div className="flex flex-col items-center">
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-20 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="mt-2 text-gray-600">Course details not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{courseDetails.courseName}</h1>
              <p className="text-lg text-gray-600">{courseDetails.courseCode}</p>
              <p className="text-gray-600">Class Average: {courseDetails.classAverage}%</p>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="text-4xl font-bold text-indigo-600">{courseDetails.percentage}%</div>
              <p className="text-gray-600">Score: {courseDetails.totalMarks}/{courseDetails.maxMarks}</p>
              <p className="text-gray-600">Rank: {courseDetails.rank}</p>
              
            </div>
          </div>
        </div>

        {/* Answer Sheet Section - Increased Height */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Answer Sheet</h2>
            <button 
              onClick={() => window.open(courseDetails.answerSheetUrl, '_blank')}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Full Screen
            </button>
          </div>
          <div className="border rounded-lg overflow-hidden" style={{ height: '650px', maxWidth: '100%' }}>
            {courseDetails.answerSheetUrl && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <div className="w-full h-full">
                  <PDFViewer 
                    fileUrl={courseDetails.answerSheetUrl}
                  />
                </div>
              </Worker>
            )}
          </div>
        </div>

        {/* Question-wise Analysis Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Question-wise Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseDetails.feedback.map((item) => {
              const marksLost = item.maxMark - item.mark;
              const percentageScore = (item.mark / item.maxMark) * 100;
              
              return (
                <div 
                  key={item.questionNumber}
                  className={`border rounded-lg p-4 transition-all duration-300 ${
                    marksLost === 0 
                      ? 'border-green-200 bg-green-50 hover:shadow-lg hover:shadow-green-100' 
                      : 'border-amber-200 bg-amber-50 hover:shadow-lg hover:shadow-amber-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Question {item.questionNumber}
                    </h3>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          marksLost === 0 ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {item.mark}/{item.maxMark}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          marksLost === 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {Math.round(percentageScore)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Insight */}
                  <div className="mb-3">
                    {marksLost === 0 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">
                          {item.reason ? item.reason : "No marks lost"}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">
                          Lost {marksLost} {marksLost === 1 ? 'mark' : 'marks'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        marksLost === 0 ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentageScore}%` }}
                    ></div>
                  </div>

                  {/* Feedback reason */}
                  {item.reason ? (
                    <div className="mt-4 flex justify-center">
                      <div className="w-full p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex flex-col items-center text-center">
                          <span className="inline-block mb-2 px-3 py-1 bg-gray-50 rounded-full text-sm font-medium text-gray-700">
                            Feedback
                          </span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : marksLost === 0 && (
                    <div className="mt-4 flex justify-center items-center min-h-[120px]">
                      <div className="mt-23 w-full p-4 bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200 ">
                        <div className="flex flex-col items-center justify-center text-center gap-2">
                          <span className="inline-block px-4 py-1.5 bg-green-50 rounded-full text-sm font-medium text-green-700">
                            Excellent!
                          </span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Perfect score! Keep up the excellent answer!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 