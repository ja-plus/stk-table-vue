import { defineWorkspace } from 'vitest/config';

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
    'packages/*',
    {
        // add "extends" to merge two configs together
        extends: './vite.config.js',
        test: {
            include: ['test/*.test.js'],
            // it is recommended to define a name when using inline configs
            name: 'happy-dom',
            environment: 'happy-dom',
        },
    },
]);
