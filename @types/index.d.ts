declare interface IFont {
    displayName: string;
    name: string;
}

declare type Degree = 0 | 90 | 180 | 270;

declare interface IWord {
    id: number;
    text: string;
    value: number;
    rotate: Degree;
}

declare interface IWordEdit {
    id: number;
    text?: string;
    value?: number;
    rotate?: Degree;
}
