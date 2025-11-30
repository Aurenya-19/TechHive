import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  GraduationCap,
  Clock,
  Zap,
  Users,
  Star,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Code,
  Database,
  Cloud,
  Shield,
  Brain,
  Settings,
} from "lucide-react";
import type { Course, UserCourse } from "@shared/schema";

const categoryIcons: Record<string, typeof Code> = {
  programming: Code,
  databases: Database,
  cloud: Cloud,
  security: Shield,
  ai: Brain,
  devops: Settings,
  general: BookOpen,
};

function CourseCard({
  course,
  userCourse,
}: {
  course: Course;
  userCourse?: UserCourse & { course: Course };
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEnrolled = !!userCourse;
  const progress = userCourse?.progress || 0;
  const isCompleted = userCourse?.isCompleted || false;
  const Icon = categoryIcons[course.category || "general"] || BookOpen;

  const startCourse = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/courses/${course.id}/start`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
      toast({
        title: "Course started!",
        description: `You're now enrolled in "${course.title}"`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start course.",
        variant: "destructive",
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-chart-5/10 text-chart-5";
      case "intermediate":
        return "bg-chart-4/10 text-chart-4";
      case "advanced":
        return "bg-chart-3/10 text-chart-3";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <Card className="hover-elevate overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-lg font-semibold">{course.title}</h3>
              <Badge className={`text-xs ${getDifficultyColor(course.difficulty || "beginner")}`}>
                {course.difficulty}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>

            {course.tags && course.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {course.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {isEnrolled && !isCompleted && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="mt-2 h-2" />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {(course.enrollments || 0).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-chart-4" />
                  +{course.xpReward}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              {!isEnrolled ? (
                <Button
                  onClick={() => startCourse.mutate()}
                  disabled={startCourse.isPending}
                  data-testid={`button-start-course-${course.id}`}
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  {startCourse.isPending ? "Enrolling..." : "Start Course"}
                </Button>
              ) : isCompleted ? (
                <Badge variant="outline" className="text-chart-5">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              ) : (
                <Button asChild>
                  <Link href={`/courses/${course.id}`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continue
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const categories = [
  { value: "all", label: "All Courses" },
  { value: "programming", label: "Programming" },
  { value: "databases", label: "Databases" },
  { value: "cloud", label: "Cloud" },
  { value: "security", label: "Security" },
  { value: "ai", label: "AI/ML" },
  { value: "devops", label: "DevOps" },
];

export default function Courses() {
  const { data: courses, isLoading: coursesLoading, isError: coursesError, error: coursesErrorMsg } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: userCourses } = useQuery<(UserCourse & { course: Course })[]>({
    queryKey: ["/api/user/courses"],
  });

  const userCourseMap = new Map(
    userCourses?.map((uc) => [uc.courseId, uc]) || []
  );

  const inProgressCourses = userCourses?.filter((uc) => !uc.isCompleted) || [];
  const completedCourses = userCourses?.filter((uc) => uc.isCompleted) || [];

  if (coursesError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {coursesErrorMsg instanceof Error ? coursesErrorMsg.message : "Unable to load courses"}
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (coursesLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Mini-Courses</h1>
        <p className="mt-1 text-muted-foreground">
          Learn new skills in 5-15 minute bite-sized lessons
        </p>
      </div>

      {inProgressCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              Continue Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inProgressCourses.slice(0, 2).map((uc) => (
              <CourseCard key={uc.id} course={uc.course} userCourse={uc} />
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} data-testid={`tab-courses-${cat.value}`}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="mt-6 space-y-4">
            {courses && courses.length > 0 ? (
              courses
                .filter((course) => cat.value === "all" || course.category === cat.value)
                .map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    userCourse={userCourseMap.get(course.id)}
                  />
                ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No courses available</p>
                  <p className="text-sm text-muted-foreground">New courses coming soon!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
