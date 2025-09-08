import { appToast } from "@/lib/toastify";
import { useAgentStore } from "@/store/agent";
import { useTranslations } from "./use-translations";
import { useCallback } from "react";

export const useKnowledge = () => {
  const {
    isLoading,
    files,
    selectedAgentId,
    agentsMap,
    uploadFiles,
    getFiles,
    fetchAgents,
    removeFile,
  } = useAgentStore();
  const selectedAgent = selectedAgentId ? agentsMap[selectedAgentId] : null;
  const { language } = useTranslations();
  const corpusId = selectedAgent?.corpus_id;
  const agentId = selectedAgentId;  
  // console.log("agentId", agentId);
  // console.log("corpusId", corpusId);
  // console.log("selectedAgent", selectedAgent);
  // console.log("selectedAgentId", selectedAgentId);
  // console.log("agentsMap", agentsMap);
  const handleUploadFiles = useCallback(async (files: File[]) => {
    if (!agentId) {
      appToast("Agent is not selected", {
        type: "error",
      });
      return;
    }
    console.log("agentId>>>>>>>>>>>> INNNNN", agentId);
    await uploadFiles(agentId, files);
    await getFiles(agentId, corpusId);
    await fetchAgents(language, false);
  }, [selectedAgentId, language, corpusId]);

  const handleRemoveFile = async (fileId: string) => {
    if (!agentId) {
      appToast("Agent is not selected", {
        type: "error",
      });
      return;
    }
    await removeFile(fileId, agentId, corpusId);
    await getFiles(agentId, corpusId);
    await fetchAgents(language, false);
  };

  const handleGetFiles = async () => {
    if (!agentId) {
      return;
    }
    await getFiles(agentId, corpusId);
  };
  return {
    isLoading,
    selectedAgentId,
    handleUploadFiles,
    handleGetFiles,
    files,
    handleRemoveFile,
  };
};
