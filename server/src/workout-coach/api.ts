const BASE_URL = "https://www.exercisedb.dev/api/v1";
import { z } from "zod";

export const exerciseSchema = z.object({
  exerciseId: z.string(),
  name: z.string(),
  gifUrl: z.string().url(),
  targetMuscles: z.array(z.string()),
  bodyParts: z.array(z.string()),
  equipments: z.array(z.string()),
  secondaryMuscles: z.array(z.string()),
  instructions: z.array(z.string()),
});

// Gera a interface automaticamente
export type Exercise = z.infer<typeof exerciseSchema>;

interface Response {
  success: boolean;
  metadata: {
    totalPages: number;
    totalExercises: number;
    currentPage: number;
    previousPage: string | null;
    nextPage: string | null;
  };
  data: Exercise[];
}

export const searchExercise = async (q: string) => {
  const params = new URLSearchParams();

  params.append("q", q);
  params.append("limit", "4");

  const response = await fetch(`${BASE_URL}/exercises/search?${params}`);
  const data: Response = await response.json();
  console.log(data.data);
  return data.data;
};
