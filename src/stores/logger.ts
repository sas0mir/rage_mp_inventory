import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLogger = defineStore('logger', () => {
  const logs = ref<string[]>([])
  function setLog(msg: string) {
    if (logs.value.length < 20) {
        logs.value.push(msg);
    } else {
        logs.value.shift();
        logs.value.push(msg);
    }
  }
  function clearLogs() {
    logs.value = [];
  }
  return { logs, setLog, clearLogs }
})
