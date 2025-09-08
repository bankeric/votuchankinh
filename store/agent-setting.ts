import { create } from "zustand";
import { appToast } from "@/lib/toastify";
import { agentSettingService } from "@/service/agent-setting";
import { AgentSetting, CreateAgentSettingDto, UpdateAgentSettingDto } from "@/interfaces/agent-setting";

interface AgentSettingState {
  // States
  agentSettings: AgentSetting[];
  agentSettingMap: Record<string, AgentSetting>;
  isLoading: boolean;
  isSaving: boolean;

  // Actions
  fetchAgentSettings: () => Promise<void>;
  updateAgentSetting: (
    uuid: string,
    agentId: string,
  ) => Promise<AgentSetting | null>;
}

export const useAgentSettingStore = create<AgentSettingState>()((set, get) => {
  const fetchAgentSettings = async () => {
    set({ isLoading: true });
    try {
      const settings = await agentSettingService.getAll();
      
      const agentSettingMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting;
        return acc;
      }, {} as Record<string, AgentSetting>);

      set({ agentSettings: settings, agentSettingMap });
    } catch (error) {
      console.error("Error fetching agent settings:", error);
      appToast("Failed to load agent settings. Please try again.", {
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  };

  const updateAgentSetting = async (
    uuid: string,
    agentId: string,
  ) => {
    set({ isSaving: true });
    try {
      const updateData: UpdateAgentSettingDto = {
        agent_id: agentId,
      };

      const updatedSetting = await agentSettingService.update(uuid, updateData);
      await fetchAgentSettings();
      appToast("Agent setting updated successfully", {
        type: "success",
      });
      return updatedSetting;
    } catch (error) {
      console.error("Error updating agent setting:", error);
      appToast("Failed to update agent setting. Please try again.", {
        type: "error",
      });
      return null;
    } finally {
      set({ isSaving: false });
    }
  };

  return {
    // Initial states
    agentSettings: [],
    agentSettingMap: {},
    isLoading: false,
    isSaving: false,

    // Actions
    fetchAgentSettings,
    updateAgentSetting,
  };
});
