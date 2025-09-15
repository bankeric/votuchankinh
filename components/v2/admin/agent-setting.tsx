import useAgents from "@/hooks/use-agents";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgentSettingStore } from "@/store/agent-setting";
import { useAgentStore } from "@/store/agent";
import { cn } from "@/lib/utils";
import { appToast } from "@/lib/toastify";

interface AgentSettingProps {
  isMobile?: boolean;
}

const AgentSetting = ({ isMobile = false }: AgentSettingProps) => {
  const { t } = useTranslation();
  const { modes } = useAgents();
  const { agentSettings, agentSettingMap, updateAgentSetting, isSaving } =
    useAgentSettingStore();
  const { agents } = useAgentStore();

  const handleAgentChange = async (modeKey: string, agentId: string) => {
    const existingSetting = agentSettingMap[modeKey];
    if (existingSetting) {
      await updateAgentSetting(existingSetting.uuid, agentId);
    }
  };

  return (
    <div className={cn(isMobile ? "space-y-4" : "space-y-6", "mb-4")}>
      <Label
        className={isMobile ? "text-sm font-medium" : "text-base font-medium"}
      >
        {t("gptEditor.agentSetting.title")}
      </Label>

      {modes.map((mode) => (
        <div
          key={mode.id}
          className="flex items-center justify-between max-w-[520px]"
        >
          <Label className="text-sm font-medium">{mode.label}</Label>
          <Select
            value={agentSettingMap[mode.id]?.agent_id || ""}
            onValueChange={(value) => handleAgentChange(mode.id, value)}
            disabled={isSaving}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder={t("gptEditor.agentSetting.select")} />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.uuid} value={agent.uuid}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default AgentSetting;
