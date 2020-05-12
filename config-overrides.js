const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

console.log(55)
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
                                minify: true
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

    return config;
}