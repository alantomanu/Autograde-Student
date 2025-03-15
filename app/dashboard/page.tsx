// pages/dashboard.js
"use client"
import { useState, useEffect } from 'react';


import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface StudentData {
  student: {
    id: number;
    studentId: string;
    name: string;
    email: string;
    profilePictureUrl: string;
  };
  courses: Array<{
    id: number;
    courseId: number;
    courseCode: string;
    courseName: string;
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    teacherName: string;
    answerSheetUrl: string;
    rank: number;
    classAverage: number;
  }>;
  overallPerformance: {
    overallPercentage: number;
    overallRank: number;
    totalStudents: number;
  };
}

export default function Dashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const fetchStudentData = async () => {
        try {
            const response = await fetch('/api/student/dashboard');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setStudentData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setLoading(false);
        }
    };

    fetchStudentData();
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="mt-2 text-gray-600">Unable to load student data. Please try again later.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { student, courses, overallPerformance } = studentData;

  // Prepare data for bar chart
  const barChartData = courses.map((course) => ({
    name: course.courseCode,
    'Your Score': course.percentage,
    'Class Average': course.classAverage,
  }));

  // Prepare data for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const pieChartData = [
    { name: 'Top 10%', value: overallPerformance.overallRank <= Math.ceil(overallPerformance.totalStudents * 0.1) ? 1 : 0 },
    { name: 'Top 25%', value: overallPerformance.overallRank <= Math.ceil(overallPerformance.totalStudents * 0.25) && overallPerformance.overallRank > Math.ceil(overallPerformance.totalStudents * 0.1) ? 1 : 0 },
    { name: 'Top 50%', value: overallPerformance.overallRank <= Math.ceil(overallPerformance.totalStudents * 0.5) && overallPerformance.overallRank > Math.ceil(overallPerformance.totalStudents * 0.25) ? 1 : 0 },
    { name: 'Top 75%', value: overallPerformance.overallRank <= Math.ceil(overallPerformance.totalStudents * 0.75) && overallPerformance.overallRank > Math.ceil(overallPerformance.totalStudents * 0.5) ? 1 : 0 },
    { name: 'Bottom 25%', value: overallPerformance.overallRank > Math.ceil(overallPerformance.totalStudents * 0.75) ? 1 : 0 },
  ].filter(item => item.value > 0);

  return (
    <>
      

      <div className="min-h-screen bg-gray-50">
    

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Student Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800">Welcome, {student.name}</h2>
                <p className="text-gray-600">Student ID: {student.studentId}</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <div className="flex items-center mb-2">
                  <div className="text-4xl font-bold text-indigo-600">{overallPerformance.overallPercentage}%</div>
                  <div className="ml-2 text-gray-600">Overall Score</div>
                </div>
                <div className="text-sm text-gray-500">
                  Rank: {overallPerformance.overallRank} out of {overallPerformance.totalStudents} students
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Subject Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Your Score" fill="#8884d8" />
                      <Bar dataKey="Class Average" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Rank Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${entry.name}`}
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  You are in the top {Math.ceil((overallPerformance.overallRank / overallPerformance.totalStudents) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Course Cards */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className={`h-2 ${course.percentage >= 90 ? 'bg-green-500' : course.percentage >= 75 ? 'bg-blue-500' : course.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{course.courseName}</h4>
                      <p className="text-sm text-gray-600">{course.courseCode}</p>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{course.percentage}%</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">Score: {course.totalMarks}/{course.maxMarks}</div>
                    <div className="text-sm text-gray-600">Instructor: {course.teacherName}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Rank: <span className="font-medium">{course.rank}</span>
                    </div>
                    <Link 
                      href={`/course/${course.courseId}`}
                      className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-300 text-sm"
                      role="button"
                      aria-label={`View details for ${course.courseName}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}