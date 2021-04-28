const webpack = require('webpack');

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }

    config.optimization = {
        minimize: true
    }

    config.devtool = false;

    config.plugins = [new webpack.SourceMapDevToolPlugin({})]

    config.module.rules = config.module.rules.map(rule => {
        if (rule.oneOf instanceof Array) {
            return {
                ...rule,
                oneOf: [
                    {
                        test: /theme[/\\]icons[/\\][^/\\]+\.svg$/,
                        use: ['raw-loader']
                    },
                    ...rule.oneOf
                ]
            };
        }

        return rule;
    });

    config.externals = {
        desmos: "Desmos"
    }

    return config;
}