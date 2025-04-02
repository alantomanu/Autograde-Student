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
import { 
  BarChart3, 
  Target, 
  LineChart, 
  FileText,
  CheckCircle 
} from 'lucide-react';
import { Outfit } from 'next/font/google';
import { SparklesText } from "@/components/magicui/sparkles-text";
import { TypingAnimation } from "@/components/magicui/typing-animation";

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

// Initialize font
const outfit = Outfit({ subsets: ['latin'] });

export default function Dashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCourseId, setLoadingCourseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
        try {
            const response = await fetch('/api/student/dashboard');
            const data = await response.json();
            // Validate that the data has the expected structure
            if (data && data.courses && data.student && data.overallPerformance) {
                setStudentData(data);
            } else {
                setStudentData(null);
            }
        } catch {
            setStudentData(null);
        } finally {
            setLoading(false);
        }
    };

    fetchStudentData();
  }, []);



  if (loading) {
    // For logged-in users (when studentData exists and has valid properties)
    try {
      const { student, courses, overallPerformance } = studentData || {};
      if (student && courses && overallPerformance) {
        return (
          <div className="min-h-screen bg-transparent">
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {/* Skeleton for Student Overview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex flex-col items-center md:items-end">
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Skeleton for Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 h-full">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 h-full">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Skeleton for Course Cards */}
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
                    <div className="h-2 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        );
      }
    } catch {
      // If destructuring fails, show login skeleton
    }

    // For non-logged in users or invalid studentData
    return (
      <div className="min-h-[calc(100vh-64px)] bg-transparent">
        <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Left side skeleton */}
            <div className="space-y-4">
              {/* Title and subtitle skeleton */}
              <div className="space-y-3">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Features skeleton */}
              <div className="space-y-4 mt-8">
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid gap-4">
                  {[1, 2, 3, 4].map((index) => (
                    <div 
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm"
                    >
                      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side skeleton */}
            <div className="flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-48 mx-auto bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-56 mx-auto bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-4 w-40 mx-auto bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!studentData || !studentData.courses || !studentData.student || !studentData.overallPerformance) {
    return (
      <div className={`flex items-center justify-center min-h-[calc(100vh-64px)] px-4 ${outfit.className}`}>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 p-5 md:p-4 max-w-6xl w-full">
          {/* Left side - Welcome content */}
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <div className="text-2xl md:text-4xl font-bold">
                <SparklesText 
                  text="AutoGrade"
                  colors={{ first: "#4F46E5", second: "#7C3AED" }}
                  className="text-gray-800 text-3xl md:text-5xl"
                />
              </div>
              <div className="block">
                <TypingAnimation
                  className="text-lg md:text-2xl font-medium text-gray-800"
                  duration={50}
                  delay={800}
                >
                  Revolutionizing Answer Evaluation with AI
                </TypingAnimation>
              </div>
              <p className="text-sm md:text-base text-gray-600 mt-2">
                Experience the future of academic assessment powered by Meta-LLaMA 3. Get detailed insights into your performance with our AI-driven evaluation system.
              </p>
            </div>

            <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">What you&apos;ll get:</h2>
              <div className="grid gap-3 md:gap-4">
                {[
                  {
                    icon: BarChart3,
                    title: "Comprehensive Analytics",
                    description: "Access detailed performance metrics and subject-wise analysis"
                  },
                  {
                    icon: Target,
                    title: "Question-wise Breakdown",
                    description: "Gain insight into where and why you lost marks to improve your performance effectively."
                  },
                  {
                    icon: LineChart,
                    title: "Performance Tracking",
                    description: "Track progress with interactive charts and rankings"
                  },
                  {
                    icon: FileText,
                    title: "Answer Sheet Access",
                    description: "Review AI-annotated answer sheets instantly"
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group"
                  >
                    <span className="p-2 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                      <feature.icon className="w-6 h-6 text-indigo-600" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Sign in card */}
          <div className="flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
              <div className="text-center space-y-4">
                <div className="inline-block p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  Sign in to Continue
                </h2>
                <p className="text-gray-600">
                  Access your AI-evaluated answer sheets and analytics
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
                >
                  Sign In to Get Started
                </Link>
                <div className="text-sm text-gray-500 text-center">
                  Powered by advanced AI for accurate evaluation
                </div>
              </div>
            </div>
          </div>
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

  // Prepare data for pie chart with better calculations
  const COLORS = ['#22C55E', '#3B82F6', '#EAB308', '#F97316', '#EF4444'];
  const calculateRankCategory = () => {
    const rankPercentile = (overallPerformance.overallRank / overallPerformance.totalStudents) * 100;
    
    if (rankPercentile <= 10) return { name: 'Top 10%', color: COLORS[0] };
    if (rankPercentile <= 25) return { name: 'Top 25%', color: COLORS[1] };
    if (rankPercentile <= 50) return { name: 'Top 50%', color: COLORS[2] };
    if (rankPercentile <= 75) return { name: 'Top 75%', color: COLORS[3] };
    return { name: 'Bottom 25%', color: COLORS[4] };
  };

  const rankCategory = calculateRankCategory();
  const pieChartData = [
    { name: rankCategory.name, value: 1 }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Student Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 h-full">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 h-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rank Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill={rankCategory.color}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      <Cell key={`cell-${rankCategory.name}`} fill={rankCategory.color} />
                    </Pie>
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xl font-bold"
                    >
                      {rankCategory.name}
                    </text>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Your rank: <span className="font-semibold">{overallPerformance.overallRank}</span> out of <span className="font-semibold">{overallPerformance.totalStudents}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Top <span className="font-semibold">{Math.ceil((overallPerformance.overallRank / overallPerformance.totalStudents) * 100)}%</span> of your class
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Courses</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                  
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Rank: <span className="font-medium">{course.rank}</span>
                  </div>
                  <Link 
                    href={`/course/${course.courseId}`}
                    className={`inline-block px-4 py-2 ${
                      loadingCourseId === course.courseId
                        ? 'bg-indigo-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white rounded transition-colors duration-300 text-sm`}
                    role="button"
                    aria-label={`View details for ${course.courseName}`}
                    onClick={() => {
                      setLoadingCourseId(course.courseId);
                    }}
                  >
                    {loadingCourseId === course.courseId ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </div>
                    ) : (
                      'View Details'
                    )}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}