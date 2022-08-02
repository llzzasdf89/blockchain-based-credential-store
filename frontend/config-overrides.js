//This file is a configuration file for 'react-rewired';
//The aim of using 'react-rewired' instead of 'react-scripts' is to get rid of the contraints that modules could only be imported within the 'src' scope
//Besides, some dependencies of this project comes from node environment, which needs to be polyfilled by webpack. This configuration is also used to enable webpack's polyfill feature
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
module.exports = function override(config, env) {
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
    config.plugins.push(
        new NodePolyfillPlugin()
    );
    config.resolve.fallback = { fs: false };
    return config;
  }