let pluginsRoutes = [];
let customLocales = {}
// let customDisabledMenuItems = [];
let foundPlugins = {};
const plugins = require.context('./plugins', true, /[A-Za-z0-9-_,\s]+\/main\.js$/i)

plugins.keys().forEach(key => {
    // console.log(`plugins. key: ${key}`)
    const matched = key.match(/([A-Za-z0-9-_,\s]+)\/main\.js$/i)
    if (matched && matched.length > 1) {
        const pluginName = matched[1]
        console.log(`plugins. pluginName: ${pluginName}`)
        const plugin = plugins(key)
        // console.log(`plugins. plugin: ${plugin}`)
        // console.dir(plugin);
        try {
            plugin.initPlugin();
            foundPlugins[pluginName] = plugin;
            if (plugin.routes) {
                pluginsRoutes = pluginsRoutes.concat(plugin.routes);
            }
            if (plugin.customLocales) {                
                for (const locale in plugin.customLocales) {
                    if (customLocales[locale]) {
                        customLocales[locale] = Object.assign(window.customLocales[locale], plugin.customLocales[locale]);
                    } else {
                        customLocales[locale] = plugin.customLocales[locale];
                    }
                }
            }
            // if (plugin.customDisabledMenuItems) {
            //     customDisabledMenuItems = customDisabledMenuItems.concat(plugin.customDisabledMenuItems);
            // }
        } catch (e) {
            console.error(`Error loading plugin ${pluginName}: ${e}`,e);
        }
    }
});

// function getCustomMenuItems(appData) {
//     let customMenuItems = [];
//     for (const pluginName in foundPlugins) {
//         const plugin = foundPlugins[pluginName];
//         if (plugin.customMenuItems && typeof plugin.customMenuItems === 'function') {
//             customMenuItems = customMenuItems.concat(plugin.customMenuItems(appData));
//         } else if (plugin.customMenuItems && Array.isArray(plugin.customMenuItems)) {
//             customMenuItems = customMenuItems.concat(plugin.customMenuItems);
//         }
//     }
//     return customMenuItems;
// }

export default {
    pluginsRoutes,
    customLocales,
    // customDisabledMenuItems,
    // getCustomMenuItems,
    plugins: foundPlugins,
}