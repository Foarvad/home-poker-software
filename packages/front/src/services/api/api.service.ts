const ws = new WebSocket("ws://localhost:9801");

// Temporary types

type ApiMessage = {
  type: 'test',
  payload: {
    message: string;
  }
}

export const useApi = () => {
  const send = (message: ApiMessage) => {
    ws.send(JSON.stringify(message));
  }

  return { send }
}