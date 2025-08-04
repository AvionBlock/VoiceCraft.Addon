// rollup.config.js
export default {
  input: "index.js",
  output: [
    {
      file: "bundle/VoiceCraftAPI.js",
      format: "esm",
    },
    {
      file: "../Core.McWss/packs/BP/scripts/dependencies/VoiceCraftAPI.js",
      format: "esm",
    },
  ],
};
