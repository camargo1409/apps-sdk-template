import { Spinner } from "@/components/ui/shadcn-io/spinner";
import "@/index.css";

import { mountWidget, useToolOutput } from "skybridge/web";

interface IExercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

type Payload = {
  exerciseList: IExercise[];
};

function ExerciseCard({ exercise }: { exercise: IExercise }) {
  return (
    <div
      className="
        flex flex-col md:flex-row gap-4
        rounded-xl border bg-slate-800/80 text-white border-slate-700 shadow
        p-4 w-full md:w-[480px] lg:w-[420px]
      "
    >
      <div className="flex-shrink-0 flex justify-center items-start">
        <img
          src={exercise.gifUrl}
          alt={exercise.name}
          className="w-32 h-32 object-contain drop-shadow-2xl rounded-md bg-black/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-semibold leading-tight">{exercise.name}</h2>
          <div className="text-xs text-slate-300">
            <p>
              <span className="font-medium text-slate-200">Alvo:</span> {exercise.targetMuscles.join(", ")}
            </p>
            <p>
              <span className="font-medium text-slate-200">Equipamento:</span> {exercise.equipments.join(", ")}
            </p>
          </div>
        </div>

        <ul className="text-sm text-slate-100 list-disc list-inside space-y-1">
          {exercise.instructions.map((instruction, idx) => (
            <li key={idx}>{instruction}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Exercise() {
  const exerciseList = useToolOutput() as Payload | null;

  if (!exerciseList) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  const items = exerciseList.exerciseList ?? [];

  if (!items.length) {
    return <div className="text-center text-slate-400 text-sm py-8">Nenhum exercício disponível.</div>;
  }

  return (
    <div
      className="
        p-4 flex flex-wrap gap-4
        bg-slate-900/60 rounded-xl
      "
    >
      {items.map((exercise) => (
        <ExerciseCard key={exercise.exerciseId} exercise={exercise} />
      ))}
    </div>
  );
}

export default Exercise;

mountWidget(<Exercise />);
