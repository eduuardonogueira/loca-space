import { Separator } from "@radix-ui/react-select";
import { Check, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface IStepsHeaderProps {
  currentStep: number;
  steps: {
    id: number;
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }[];
  goToStep: (targetStep: number) => Promise<void>;
}

export function StepsHeader({
  currentStep,
  steps,
  goToStep,
}: IStepsHeaderProps) {
  return (
    <nav aria-label="Etapas do formulario">
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const Icon = step.icon;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => goToStep(index)}
                className={`
                    flex flex-1 flex-col items-center gap-2 rounded-lg px-3 py-3 transition-colors
                    ${
                      isCurrent
                        ? "bg-primary/10 text-primary"
                        : isCompleted
                          ? "text-primary/70 hover:bg-primary/5"
                          : "text-muted-foreground hover:bg-muted"
                    }
                  `}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={`
                      flex size-10 items-center justify-center rounded-full border-2 transition-colors
                      ${
                        isCurrent
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 bg-background text-muted-foreground"
                      }
                    `}
                >
                  {isCompleted ? (
                    <Check className="size-5" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </span>
                <span className="text-xs font-medium hidden sm:block">
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <Separator
                  className={`hidden w-8 sm:block ${
                    index < currentStep ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

