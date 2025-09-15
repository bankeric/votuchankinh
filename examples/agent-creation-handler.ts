// Example usage of handleAgentCreationEvent
import { handleAgentCreationEvent } from '@/lib/toastify'
import { useTranslations } from '@/hooks/use-translations'

export function useAgentCreationHandler() {
  const { t } = useTranslations()
  let toastId: string | number | null = null

  const handleEvent = (event: any) => {
    toastId = handleAgentCreationEvent(event, toastId, t)
  }

  return { handleEvent }
}

// Example implementation in a component:
/*
export function AgentCreationComponent() {
  const { handleEvent } = useAgentCreationHandler();

  const createAgent = async () => {
    // Subscribe to agent creation events
    const eventSource = new EventSource('/api/agent/create');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleEvent(data);
      
      // Close event source when completed
      if (data.status === 'completed' || data.status === 'failed') {
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };
  };

  return (
    <button onClick={createAgent}>
      Create Agent
    </button>
  );
}
*/
//

// Or if using WebSocket:
/*
export function AgentCreationWithWebSocket() {
  const { handleEvent } = useAgentCreationHandler();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/agent-creation');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleEvent(data);
    };

    return () => ws.close();
  }, []);
}
*/

// Or if using a direct API call with streaming:
/*
export async function createAgentWithStreaming() {
  const { handleEvent } = useAgentCreationHandler();
  
  const response = await fetch('/api/agent/create', {
    method: 'POST',
    body: formData,
  });

  const reader = response.body?.getReader();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = new TextDecoder().decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const event = JSON.parse(line);
          handleEvent(event);
        } catch (e) {
          console.error('Failed to parse event:', e);
        }
      }
    }
  }
}
*/
