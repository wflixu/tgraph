interface ThOjbect {
    [key: string]: any;
}
type Optional<T> = T | undefined | null;
interface ThEvent {
    [key: string]: any;
}
type ThEventHandler = (...args: any[]) => any;
