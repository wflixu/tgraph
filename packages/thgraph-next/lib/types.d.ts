interface ThOjbect {
    [key: string]: any;
}
declare type Optional<T> = T | undefined | null;
interface ThEvent {
    [key: string]: any;
}
declare type ThEventHandler = (...args: any[]) => any;
