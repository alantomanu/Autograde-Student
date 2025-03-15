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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{courseDetails.courseName}</h1>
              <p className="text-lg text-gray-600">{courseDetails.courseCode}</p>
              <p className="text-gray-600 mt-2">Instructor: {courseDetails.teacherName}</p>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="text-4xl font-bold text-indigo-600">{courseDetails.percentage}%</div>
              <p className="text-gray-600">Score: {courseDetails.totalMarks}/{courseDetails.maxMarks}</p>
              <p className="text-gray-600">Rank: {courseDetails.rank}</p>
              <p className="text-gray-600">Class Average: {courseDetails.classAverage}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Viewer */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Answer Sheet</h2>
            <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
              {courseDetails.answerSheetUrl && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <PDFViewer fileUrl={courseDetails.answerSheetUrl} />
                </Worker>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Question-wise Feedback</h2>
            <div className="space-y-4">
              {courseDetails.feedback.map((item) => (
                <div 
                  key={item.questionNumber}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">
                      Question {item.questionNumber}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-indigo-600">
                        {item.mark} marks
                      </span>
                    </div>
                  </div>
                  {item.reason && (
                    <div className="mt-2">
                      <p className="text-gray-600 text-sm">
                        {item.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 