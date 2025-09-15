"use client";

import { useEffect, useState } from "react";
import { Brain, Play, Pause, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import useFineTuneStore from "@/store/fine-tune";
import { getJobState } from "@/lib/utils";
import { Language, Model } from "@/interfaces/chat";
import ModelSelector from "@/components/v2/admin/model-selector";
import useAgents from "@/hooks/use-agents";

interface File {
  id: number;
  name: string;
  status: string;
  size: string;
  questions: number;
}

interface FinetuneSectionProps {}

export function FinetuneSection({}: FinetuneSectionProps) {
  const {
    qAndAPairs,
    startTraining,
    fineTuningJobs,
    getFineTuningJobs,
  } = useFineTuneStore();
  const files = qAndAPairs;
  const { t, i18n } = useTranslation();
  const language = i18n.language as Language;
  const { currentAgent } = useAgents();
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedBaseModel, setSelectedBaseModel] = useState<Model | null>(
    null
  );

  const handleStartTraining = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmTraining = () => {
    if (!selectedBaseModel) {
      alert("Please select a base model first");
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    setShowConfirmDialog(false);

    // Simulate training progress
    // const interval = setInterval(() => {
    //   setTrainingProgress((prev) => {
    //     if (prev >= 100) {
    //       clearInterval(interval);
    //       setIsTraining(false);
    //       return 100;
    //     }
    //     return prev + 10;
    //   });
    // }, 1000);

    // Pass the selected model to startTraining
    startTraining(selectedBaseModel.name);
  };

  const handleStopTraining = () => {
    setIsTraining(false);
    setTrainingProgress(0);
  };

  const handleModelSelect = (model: Model) => {
    setSelectedBaseModel(model);
  };

  useEffect(() => {
    getFineTuningJobs();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Brain className="w-5 h-5" />
            {t("admin.finetune.title")}

            {currentAgent && (
              <span className="font-medium mr-4">{currentAgent?.name}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("admin.finetune.baseModel") || "Base Model"}
                </label>
                <ModelSelector
                  value={selectedBaseModel}
                  onSelectModel={handleModelSelect}
                  placeholder="Select base model for fine-tuning"
                />
              </div>
            </div>

            {/* Training Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <Button
                  onClick={handleStartTraining}
                  className="gap-2 bg-orange-500 hover:bg-orange-600"
                  disabled={isTraining}
                  size="sm"
                >
                  <Play className="w-4 h-4" />
                  {isTraining
                    ? t("admin.finetune.training")
                    : t("admin.finetune.start")}
                </Button>

                {isTraining && (
                  <Button
                    onClick={handleStopTraining}
                    variant="outline"
                    className="gap-2 border-orange-200 hover:bg-orange-50"
                    size="sm"
                  >
                    <Pause className="w-4 h-4" />
                    {t("admin.finetune.stop")}
                  </Button>
                )}
              </div>

              {isTraining && (
                <div className="flex-1 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${trainingProgress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {trainingProgress}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Training Status */}
            {fineTuningJobs.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm md:text-base text-gray-800">
                  {t("admin.finetune.existingModels") ||
                    "Existing Fine-tuned Models"}
                </h4>
                {fineTuningJobs.map((job) => (
                  <div
                    key={job.job_name}
                    className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base mb-2 text-orange-800">
                          {job.display_name}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            {t("admin.finetune.status.state")}:{" "}
                            {getJobState(job.status, language)}
                          </p>
                          <p>
                            {t("admin.finetune.status.lastTraining")}:{" "}
                            {job.updated_at
                              ? new Date(job.updated_at).toLocaleString()
                              : "N/A"}
                          </p>
                          <p>
                            {t("admin.finetune.status.currentModel")}:{" "}
                            {job.base_model}
                          </p>
                        </div>
                      </div>
                      {job.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          onClick={() => {
                            setSelectedBaseModel({
                              name: job.base_model,
                              description: `Retrain ${job.display_name}`,
                            });
                            setShowConfirmDialog(true);
                          }}
                        >
                          {t("admin.finetune.retrain") || "Retrain"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Training Configuration */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-orange-200 rounded-lg bg-white">
                <h4 className="font-medium text-sm mb-2">
                  {t("admin.finetune.config.title")}
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{t("admin.finetune.config.learningRate")}:</span>
                    <span className="text-orange-600">0.0001</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("admin.finetune.config.batchSize")}:</span>
                    <span className="text-orange-600">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("admin.finetune.config.epochs")}:</span>
                    <span className="text-orange-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("admin.finetune.config.validationSplit")}:</span>
                    <span className="text-orange-600">20%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-orange-200 rounded-lg bg-white">
                <h4 className="font-medium text-sm mb-2">
                  {t("admin.finetune.stats.title")}
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{t("admin.finetune.stats.totalFiles")}:</span>
                    <span className="text-orange-600">{files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("admin.finetune.stats.trained")}:</span>
                    <span className="text-orange-600">
                      {
                        files.filter(
                          (f) => f.status === t("admin.files.status.trained")
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("admin.finetune.stats.totalQuestions")}:</span>
                    <span className="text-orange-600">
                      {files.reduce((sum, f) => sum + f.questions, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("admin.finetune.stats.size")}:</span>
                    <span className="text-orange-600">9.7 MB</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Quick Actions */}
            {/* <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 hover:bg-orange-50"
              >
                📊 {t("admin.finetune.actions.viewLogs")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 hover:bg-orange-50"
              >
                💾 {t("admin.finetune.actions.backup")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 hover:bg-orange-50"
              >
                🔄 {t("admin.finetune.actions.rollback")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 hover:bg-orange-50"
              >
                ⚙️ {t("admin.finetune.actions.advancedConfig")}
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-orange-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-900 font-serif flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              {t("admin.finetune.confirm.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.finetune.confirm.description")}
              <ul className="mt-2 space-y-1 text-sm">
                <li>• {t("admin.finetune.confirm.effects.useData")}</li>
                <li>• {t("admin.finetune.confirm.effects.takeTime")}</li>
                <li>• {t("admin.finetune.confirm.effects.createModel")}</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-orange-300 text-orange-700">
              {t("admin.finetune.confirm.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmTraining}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {t("admin.finetune.confirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
