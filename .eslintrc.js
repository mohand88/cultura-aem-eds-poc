module.exports = {
  root: true,
  extends: [
    "airbnb-base",
    "plugin:json/recommended",
    "plugin:xwalk/recommended",
  ],
  env: {
    browser: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: "module",
    requireConfigFile: false,
  },
  rules: {
    "import/extensions": ["error", { js: "always" }], // require js file extensions in imports
    "linebreak-style": ["error", "unix"], // enforce unix linebreaks
    "no-param-reassign": [2, { props: false }], // allow modifying properties of param
    "no-use-before-define": [2, { functions: false }],
    "no-console": "off",
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "operator-linebreak": "off", // désactive la règle des sauts de ligne autour des opérateurs
    "no-mixed-operators": "off", // désactive la règle des opérateurs mixtes
    "implicit-arrow-linebreak": "off", // désactive la règle des sauts de ligne dans les fonctions fléchées
    "function-paren-newline": "off", // désactive la règle des sauts de ligne avant les parenthèses
    "no-underscore-dangle": "off", // autorise les underscores dans les noms de variables
    "padding-line-between-statements": "off", // désactive la règle des lignes vides entre les blocs
    "import/prefer-default-export": "off", // désactive la règle qui préfère les exports par défaut
    quotes: "off",
    "comma-dangle": "off", // désactive l'exigence des virgules de fin
    "import/no-unresolved": "off", // désactive la résolution des modules pour permettre les imports d'URL
  },
};
