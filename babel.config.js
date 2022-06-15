module.exports = (api) => {
    api.cache(true);

    const plugins = ['react-hot-loader/babel'];
    const presets = [
        [
            '@babel/react',
            {
                runtime: 'automatic'
            }
        ],
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: 3
            }
        ]
    ];

    return { plugins, presets };
};
