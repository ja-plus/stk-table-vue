import postcssPresetEnv from 'postcss-preset-env';
import postcssDiscardComments from 'postcss-discard-comments';

export default {
    plugins: [postcssPresetEnv(), postcssDiscardComments()],
};
