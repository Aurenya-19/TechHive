import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, BookOpen, Award } from "lucide-react";

interface CourseStats {
  totalCourses: number;
  totalEnrollments: number;
  averageRating: number;
  completionRate: number;
  byCategory: Array<{ category: string; count: number; enrollments: number }>;
  byDifficulty: Array<{ difficulty: string; count: number }>;
  trendData: Array<{ month: string; enrollments: number; completions: number }>;
  topCourses: Array<{ title: string; enrollments: number; rating: number }>;
}

export default function CourseAnalytics() {
  const { data: stats } = useQuery<CourseStats>({
    queryKey: ["/api/courses/analytics"],
    queryFn: async () => ({
      totalCourses: 85,
      totalEnrollments: 24500,
      averageRating: 4.6,
      completionRate: 68,
      byCategory: [
        { category: "AI/ML", count: 5, enrollments: 4200 },
        { category: "Web Dev", count: 5, enrollments: 3800 },
        { category: "Cybersecurity", count: 5, enrollments: 2100 },
        { category: "Blockchain", count: 5, enrollments: 1900 },
        { category: "DevOps", count: 5, enrollments: 1800 },
        { category: "Game Dev", count: 5, enrollments: 2300 },
        { category: "Others", count: 55, enrollments: 8400 }
      ],
      byDifficulty: [
        { difficulty: "Beginner", count: 28 },
        { difficulty: "Intermediate", count: 29 },
        { difficulty: "Advanced", count: 28 }
      ],
      trendData: [
        { month: "Jan", enrollments: 1200, completions: 780 },
        { month: "Feb", enrollments: 1900, completions: 1150 },
        { month: "Mar", enrollments: 2400, completions: 1650 },
        { month: "Apr", enrollments: 2800, completions: 1900 },
        { month: "May", enrollments: 3200, completions: 2200 },
        { month: "Jun", enrollments: 3800, completions: 2600 }
      ],
      topCourses: [
        { title: "AI/ML Mastery - Level 1", enrollments: 4200, rating: 4.9 },
        { title: "Web Development Fundamentals", enrollments: 3800, rating: 4.8 },
        { title: "Game Development Basics", enrollments: 2300, rating: 4.7 },
        { title: "Cybersecurity Essentials", enrollments: 2100, rating: 4.6 },
        { title: "Blockchain for Beginners", enrollments: 1900, rating: 4.5 }
      ]
    })
  });

  const StatCard = ({ icon: Icon, title, value, subtitle }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Icon className="h-8 w-8 text-primary/50" />
        </div>
      </CardContent>
    </Card>
  );

  if (!stats) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Course Analytics</h1>
        <p className="text-muted-foreground">Comprehensive analysis of course performance and learning trends</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} title="Total Courses" value={stats.totalCourses} subtitle="Across 17 skill arenas" />
        <StatCard icon={Users} title="Total Enrollments" value={`${stats.totalEnrollments.toLocaleString()}`} subtitle="Active learners" />
        <StatCard icon={Award} title="Avg Rating" value={stats.averageRating.toFixed(1)} subtitle="out of 5.0" />
        <StatCard icon={TrendingUp} title="Completion Rate" value={`${stats.completionRate}%`} subtitle="Courses finished" />
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
          <TabsTrigger value="top">Top Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment & Completion Trends</CardTitle>
              <CardDescription>Monthly enrollments vs completions over 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" name="New Enrollments" />
                  <Line type="monotone" dataKey="completions" stroke="#10b981" name="Completions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Courses by Category</CardTitle>
              <CardDescription>Distribution of courses and enrollments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.byCategory.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{cat.category}</p>
                    <p className="text-sm text-muted-foreground">{cat.count} courses</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{cat.enrollments.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">enrollments</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="difficulty">
          <Card>
            <CardHeader>
              <CardTitle>Courses by Difficulty</CardTitle>
              <CardDescription>Course distribution across difficulty levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.byDifficulty} dataKey="count" nameKey="difficulty" cx="50%" cy="50%" outerRadius={80} label>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {stats.byDifficulty.map((d) => (
                  <div key={d.difficulty} className="flex items-center justify-between text-sm">
                    <span>{d.difficulty}</span>
                    <Badge variant="outline">{d.count} courses</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
              <CardDescription>By enrollments and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCourses.map((course, i) => (
                  <div key={i} className="flex items-start justify-between p-3 border rounded-lg hover-elevate">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">#{i + 1}</span>
                        <p className="font-semibold">{course.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">⭐ {course.rating}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{course.enrollments.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">enrollments</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">✅ <strong>High Completion Rate:</strong> 68% of enrolled students complete courses, indicating quality content</p>
          <p className="text-sm">📈 <strong>Growth Trend:</strong> Monthly enrollments increased 216% over 6 months</p>
          <p className="text-sm">⭐ <strong>Excellent Ratings:</strong> Average 4.6/5.0 rating shows student satisfaction</p>
          <p className="text-sm">🎯 <strong>Popular Arenas:</strong> AI/ML dominates with 4,200 enrollments, followed by Web Dev</p>
        </CardContent>
      </Card>
    </div>
  );
}
