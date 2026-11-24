const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
for (const extension of ['onnx', 'data']) {
  if (!config.resolver.assetExts.includes(extension)) {
    config.resolver.assetExts.push(extension);
  }
}
// Zustand's ESM middleware currently leaves `import.meta` in Expo Web's
// classic development bundle. Use Metro's documented classic resolver until
// the dependency path is compatible with this Expo Web build.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
