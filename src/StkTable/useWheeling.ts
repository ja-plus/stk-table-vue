export function useWheeling(resetDelay = 500) {
    let valueRef = false;
    let timerRef = 0;

    const get = () => valueRef;

    const set = (newValue: boolean) => {
        valueRef = newValue;

        if (newValue) {
            if (timerRef) {
                self.clearTimeout(timerRef);
            }

            timerRef = self.setTimeout(() => {
                valueRef = false;
                timerRef = 0;
            }, resetDelay) as unknown as number;
        }
    };

    return [get, set] as const;
}
