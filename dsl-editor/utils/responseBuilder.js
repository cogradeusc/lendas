export function buildResponse(success, message, data = {}) {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}
