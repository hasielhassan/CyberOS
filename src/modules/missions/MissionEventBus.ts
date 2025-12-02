type MissionEventCallback = (payload: any) => void;

class MissionEventBus {
    private listeners: { [key: string]: MissionEventCallback[] } = {};

    subscribe(event: string, callback: MissionEventCallback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    unsubscribe(event: string, callback: MissionEventCallback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event: string, payload: any) {
        console.log(`[MissionEventBus] Emitting: ${event}`, payload);
        if (!this.listeners[event]) {
            console.log(`[MissionEventBus] No listeners for: ${event}`);
            return;
        }
        console.log(`[MissionEventBus] Notifying ${this.listeners[event].length} listeners for: ${event}`);
        this.listeners[event].forEach(callback => callback(payload));
    }
}

export const missionEventBus = new MissionEventBus();
