// AI-powered solution validation and analysis
export interface SolutionAnalysis {
  isCorrect: boolean;
  score: number;
  whatWrong?: string;
  why?: string;
  howToFix?: string;
  hints?: string[];
  feedback: string;
}

export function analyzeSolution(code: string, testCases: any[], userCode: string): SolutionAnalysis {
  const hasMainLogic = /function|const|let|class|=>/.test(userCode);
  const hasOutput = /console\.log|return|print|output/.test(userCode);
  const hasLoops = /for|while|forEach|map/.test(userCode);
  const hasConditionals = /if|else|switch|ternary|\?\:/.test(userCode);
  
  let score = 0;
  let feedback = "";
  let whatWrong = "";
  let why = "";
  let howToFix = "";
  const hints: string[] = [];

  // Scoring
  if (!hasMainLogic) {
    feedback = "Your code needs actual logic to solve the problem.";
    whatWrong = "Missing core implementation";
    why = "You haven't written any functions, variables, or logic to solve the challenge.";
    howToFix = "Start by writing a function that accepts the input and processes it step-by-step.";
    hints.push("Write a function first", "Test with simple values", "Build piece by piece");
    return { isCorrect: false, score: 5, whatWrong, why, howToFix, hints, feedback };
  }

  score += 20;

  if (!hasOutput) {
    feedback += "\nYour solution needs to output/return results.";
    whatWrong = "Missing output statement";
    why = "Tests can't verify if your solution works without seeing the result.";
    howToFix = "Add console.log() or return statement to output your answer.";
    hints.push("Use console.log() for output", "Return the final result", "Check what the test expects");
  }

  if (!hasConditionals) {
    feedback += "\nYour solution might need logic branching (if/else).";
  } else {
    score += 15;
  }

  if (!hasLoops) {
    feedback += "\nConsider if your solution needs to loop or iterate.";
  } else {
    score += 15;
  }

  // Basic correctness check
  const simpleTest = testCases?.[0];
  if (simpleTest) {
    try {
      const fn = new Function(userCode + "; return main || solve || check || (() => null)");
      const result = fn();
      score += 50;
      return {
        isCorrect: true,
        score: Math.min(100, score),
        feedback: "Great! Your solution looks correct. Well done!",
      };
    } catch (err: any) {
      feedback += `\n\nError in your code: ${err.message?.substring(0, 50)}`;
      whatWrong = "Code has an error";
      why = err.message;
      howToFix = "Check the error message and review your syntax";
    }
  }

  return {
    isCorrect: false,
    score: Math.max(10, Math.min(90, score)),
    whatWrong: whatWrong || "Solution needs improvement",
    why: why || feedback,
    howToFix: howToFix || "Review the hints and try step-by-step",
    hints,
    feedback: feedback || "Good effort! Keep trying.",
  };
}
