import { generateObject } from "ai"
import { z } from "zod"

export const HR_TASK_TYPES = {
  JOB_DESCRIPTION: "job_description",
  OFFER_LETTER: "offer_letter",
  ONBOARDING_EMAIL: "onboarding_email",
  POLICY: "policy",
  INTERVIEW_QUESTIONS: "interview_questions",
  PERFORMANCE_REVIEW: "performance_review",
  TERMINATION_LETTER: "termination_letter",
} as const

export type HRTaskType = (typeof HR_TASK_TYPES)[keyof typeof HR_TASK_TYPES]

export const HR_TASK_LABELS = {
  [HR_TASK_TYPES.JOB_DESCRIPTION]: "Job Description",
  [HR_TASK_TYPES.OFFER_LETTER]: "Offer Letter",
  [HR_TASK_TYPES.ONBOARDING_EMAIL]: "Onboarding Email",
  [HR_TASK_TYPES.POLICY]: "Company Policy",
  [HR_TASK_TYPES.INTERVIEW_QUESTIONS]: "Interview Questions",
  [HR_TASK_TYPES.PERFORMANCE_REVIEW]: "Performance Review",
  [HR_TASK_TYPES.TERMINATION_LETTER]: "Termination Letter",
}

interface GenerateHRDocumentParams {
  type: HRTaskType
  description: string
  additionalContext?: string
}

export async function generateHRDocument({ type, description, additionalContext }: GenerateHRDocumentParams) {
  const prompts = {
    [HR_TASK_TYPES.JOB_DESCRIPTION]: `Generate a professional job description based on: ${description}. ${additionalContext || ""}
    
Include: job title, overview, responsibilities, requirements, qualifications, and benefits.`,

    [HR_TASK_TYPES.OFFER_LETTER]: `Generate a professional offer letter based on: ${description}. ${additionalContext || ""}
    
Include: position, start date, salary, benefits, reporting structure, and acceptance instructions.`,

    [HR_TASK_TYPES.ONBOARDING_EMAIL]: `Generate a warm onboarding email based on: ${description}. ${additionalContext || ""}
    
Include: welcome message, first day details, required documents, team introduction, and contact info.`,

    [HR_TASK_TYPES.POLICY]: `Generate a clear company policy document based on: ${description}. ${additionalContext || ""}
    
Include: policy purpose, scope, guidelines, procedures, and compliance requirements.`,

    [HR_TASK_TYPES.INTERVIEW_QUESTIONS]: `Generate insightful interview questions based on: ${description}. ${additionalContext || ""}
    
Include: 8-10 questions covering technical skills, behavioral scenarios, and cultural fit.`,

    [HR_TASK_TYPES.PERFORMANCE_REVIEW]: `Generate a comprehensive performance review template based on: ${description}. ${additionalContext || ""}
    
Include: performance metrics, achievements, areas for improvement, goals, and development plan.`,

    [HR_TASK_TYPES.TERMINATION_LETTER]: `Generate a professional termination letter based on: ${description}. ${additionalContext || ""}
    
Include: termination date, reason (if applicable), final pay details, benefits info, and next steps.`,
  }

  const result = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: z.object({
      title: z.string().describe("A clear, professional title for the document"),
      content: z.string().describe("The complete document content in markdown format"),
    }),
    prompt: prompts[type],
  })

  return result.object
}
