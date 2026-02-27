import { ArrowLeft, ArrowRight, Loader2, LucideProps } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from "react";

interface IStepsFooterProps {
  goToStep: (targetStep: number) => Promise<void>;
  currentStep: number;
  steps: {
    id: number;
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }[];
  setCurrentStep: Dispatch<SetStateAction<number>>;
  isSubmitting: boolean;
}

export function StepsFooter({
  goToStep,
  steps,
  currentStep,
  setCurrentStep,
  isSubmitting,
}: IStepsFooterProps) {
  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));

  return (
    <div className="mt-6 flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 0}
        className="gap-2"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Button>

      {currentStep < steps.length - 2 ? (
        <Button type="button" onClick={nextStep} className="gap-2">
          Proximo
          <ArrowRight className="size-4" />
        </Button>
      ) : (
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {currentStep === steps.length
                ? "Enviando imagens..."
                : "Criando..."}
            </>
          ) : currentStep === steps.length ? (
            "Enviar imagens"
          ) : (
            "Criar"
          )}
        </Button>
      )}
    </div>
  );
}

