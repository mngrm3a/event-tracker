/**
 * Store - A wrapper around IndexedDB to manage events keyed by date.
 * Each event stores the time part of a Date object in UTC.
 */
export class Store {
    private storeName = "events";
    private db: IDBDatabase;

    /**
     * Private constructor to enforce async initialization via the factory method.
     */
    private constructor(db: IDBDatabase) {
        this.db = db;
    }

    /**
     * Factory method to create and initialize a Store instance.
     * @returns A Promise resolving to a fully initialized Store.
     */
    static async create(): Promise<Store> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("EventTracker", 1);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("events")) {
                    db.createObjectStore("events", { keyPath: "date" });
                }
            };

            request.onsuccess = () => resolve(new Store(request.result));
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Converts a Date object to a UTC date string (YYYY-MM-DD)
     * @param date Date object
     * @returns UTC date string
     */
    private formatDateUTC(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    /**
     * Converts a Date object to a UTC time string (HH:mm:ss.sssZ)
     * @param date Date object
     * @returns UTC time string
     */
    private formatTimeUTC(date: Date): string {
        return date.toISOString().slice(11, 23) + "Z";
    }

    /**
     * Adds an event at a specific DateTime.
     * Stores the date part as the key and the time part in an array of times.
     * @param dateTime Date object for the event
     */
    async addEvent(dateTime: Date): Promise<void> {
        const dateKey = this.formatDateUTC(dateTime);
        const timeValue = this.formatTimeUTC(dateTime);

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);

            // Get existing record for the date, or create a new one
            const getReq = store.get(dateKey);
            getReq.onsuccess = () => {
                const record = getReq.result || { date: dateKey, times: [] };
                record.times.push(timeValue);
                store.put(record); // put will update if key exists
            };

            // Only check transaction success/failure
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    /**
     * Retrieves all events for a specific date.
     * Returns an array of Date objects representing the stored times in UTC.
     * @param date Date object representing the date to query
     * @returns Array of Date objects in UTC
     */
    async getEvents(date: Date): Promise<Date[]> {
        const dateKey = this.formatDateUTC(date);

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);

            const request = store.get(dateKey);
            request.onsuccess = () => {
                const times: string[] = request.result?.times || [];
                // Combine date + stored time to recreate full UTC Date objects
                const result = times.map(t => new Date(`${dateKey}T${t}`));
                resolve(result);
            };

            tx.oncomplete = () => { };
            tx.onerror = () => reject(tx.error);
        });
    }

    /**
     * Deletes a specific event by DateTime.
     * Removes the time part from the array of times; deletes the date record if empty.
     * @param dateTime Date object of the event to remove
     */
    async deleteEvent(dateTime: Date): Promise<void> {
        const dateKey = this.formatDateUTC(dateTime);
        const timeValue = this.formatTimeUTC(dateTime);

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);

            const getReq = store.get(dateKey);
            getReq.onsuccess = () => {
                const record = getReq.result;
                if (record) {
                    // Remove the specific time
                    record.times = record.times.filter((t: string) => t !== timeValue);

                    if (record.times.length > 0) {
                        store.put(record); // update remaining times
                    } else {
                        store.delete(dateKey); // delete date if no times left
                    }
                }
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    /**
     * Clears all events for a specific date.
     * @param date Date object representing the date to clear
     */
    async clearDate(date: Date): Promise<void> {
        const dateKey = this.formatDateUTC(date);

        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(this.storeName, "readwrite");
            tx.objectStore(this.storeName).delete(dateKey);

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
}
