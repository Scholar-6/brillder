const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }

    config.module.rules = config.module.rules.map(rule => {
        if (rule.oneOf instanceof Array) {
          return {
            ...rule,
            oneOf: [
                {
                    test: /theme[/\\]icons[/\\][^/\\]+\.svg$/,
                    use: [ 'raw-loader' ]
                },
                {
                    test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                    use: [ 'raw-loader' ]
                },
                {
                    test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                injectType: 'singletonStyleTag',
                                attributes: {
                                    'data-cke': true
                                }
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: styles.getPostCssConfig( {
                                themeImporter: {
                                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                                },
                                minify: true,
                                modules: {
                                    localIdentName: "[name]__[local]___[hash:base64:5]"
                                }
                            } )
                        }
                    ]
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