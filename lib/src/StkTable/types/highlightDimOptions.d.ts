type HighlightDimBaseOption = {
    duration?: number;
};
type HighlightDimAnimationOption = HighlightDimBaseOption & {
    /** use Animation API */
    method: 'animation';
    /**
     * same as https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
     */
    keyframe?: Parameters<Animatable['animate']>['0'];
};
type HighlightDimCssOption = HighlightDimBaseOption & {
    method: 'css';
    /** class name with css animation */
    className?: string;
    /** control delay time to remove className */
    duration?: number;
};
type HighlightDimJsOption = HighlightDimBaseOption & {
    /** use d3-interpolate js to change background color */
    method: 'js';
};
export type HighlightDimCellOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption;
export type HighlightDimRowOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption | HighlightDimJsOption;
export {};
