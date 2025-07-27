// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    // 全局配置，让 ESLint 知道我们代码的运行环境
    {
        languageOptions: {
            globals: {
                ...globals.browser, // 浏览器环境的全局变量
                ...globals.node     // Node.js 环境的全局变量
            }
        }
    },

    // 启用 ESLint 官方推荐的核心规则
    pluginJs.configs.recommended,

    // 关键！禁用所有与 Prettier 冲突的 ESLint 格式化规则
    eslintConfigPrettier,
];
