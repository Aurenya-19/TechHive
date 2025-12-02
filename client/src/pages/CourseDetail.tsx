import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Lightbulb, Clipboard, BarChart3, ListChecks } from "lucide-react";

interface CourseContent {
  notes?: string[];
  lectures?: Array<{ title: string; duration: number; videoUrl?: string }>;
  flashcards?: Array<{ front: string; back: string }>;
  practice?: Array<{ problem: string; difficulty: string; estimatedTime: number }>;
  quizzes?: Array<{ question: string; options: string[]; correct: number }>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  xpReward: number;
  enrollments: number;
  rating: number;
  content: CourseContent;
}

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
  });

  if (isLoading) return <div className="space-y-4 p-6"><Skeleton className="h-96" /></div>;
  if (!course) return <div className="p-6">Course not found</div>;

  const difficultyColor = {
    beginner: "bg-green-500/10 text-green-600",
    intermediate: "bg-yellow-500/10 text-yellow-600",
    advanced: "bg-red-500/10 text-red-600"
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-2">{course.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-500">+{course.xpReward} XP</div>
            <div className="text-sm text-muted-foreground">{course.enrollments} enrolled</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={difficultyColor[course.difficulty as keyof typeof difficultyColor]}>
            {course.difficulty}
          </Badge>
          <Badge variant="outline">{course.category}</Badge>
          <Badge variant="outline">⏱️ {course.duration} mins</Badge>
          <Badge variant="outline">⭐ {course.rating.toFixed(1)}</Badge>
        </div>
      </div>

      <Tabs defaultValue="lectures" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lectures" className="text-xs sm:text-sm">
            <Lightbulb className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Lectures</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs sm:text-sm">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="text-xs sm:text-sm">
            <Clipboard className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Flash</span>
          </TabsTrigger>
          <TabsTrigger value="practice" className="text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Practice</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="text-xs sm:text-sm">
            <ListChecks className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lectures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Lectures</CardTitle>
              <CardDescription>Learn from expert instructors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.content.lectures?.map((lecture, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                  <div>
                    <p className="font-semibold">{lecture.title}</p>
                    <p className="text-sm text-muted-foreground">⏱️ {lecture.duration} minutes</p>
                  </div>
                  <Button size="sm">Watch</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Notes</CardTitle>
              <CardDescription>Comprehensive written materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.content.notes?.map((note, i) => (
                <div key={i} className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flashcards</CardTitle>
              <CardDescription>Quick memorization and recall</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {course.content.flashcards?.map((card, i) => (
                  <div key={i} className="p-4 border rounded-lg hover-elevate cursor-pointer" data-testid={`flashcard-${i}`}>
                    <p className="font-semibold text-sm mb-2">Q: {card.front}</p>
                    <p className="text-sm text-muted-foreground">A: {card.back}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Practice Problems</CardTitle>
              <CardDescription>Hands-on projects and challenges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.content.practice?.map((project, i) => (
                <div key={i} className="p-4 border rounded-lg hover-elevate">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{project.problem}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">{project.difficulty}</Badge>
                        <Badge variant="outline" className="text-xs">⏱️ {project.estimatedTime} mins</Badge>
                      </div>
                    </div>
                    <Button size="sm">Start</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Check Quiz</CardTitle>
              <CardDescription>Test your understanding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {course.content.quizzes?.map((q, i) => (
                <div key={i} className="space-y-3">
                  <p className="font-semibold">{i + 1}. {q.question}</p>
                  <div className="space-y-2 pl-4">
                    {q.options.map((option, j) => (
                      <label key={j} className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
                        <input type="radio" name={`q${i}`} value={j} data-testid={`option-${i}-${j}`} />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <Button className="w-full">Submit Quiz</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button size="lg" className="w-full">Enroll in Course</Button>
    </div>
  );
}