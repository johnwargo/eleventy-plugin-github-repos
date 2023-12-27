"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_logger_1 = __importDefault(require("cli-logger"));
module.exports = function (eleventyConfig, options = {}) {
    eleventyConfig.addCollection('repositories', async (collectionApi) => {
        const configDefaults = {
            apiKey: '',
            userAccount: '',
            debugMode: false,
            quitOnError: false
        };
        const APP_NAME = 'Eleventy-Plugin-GitHub-Repos';
        const durationStr = `[${APP_NAME}] Duration`;
        var conf = { console: true, level: cli_logger_1.default.INFO };
        conf.prefix = function (record) {
            return `[${APP_NAME}]`;
        };
        var log = (0, cli_logger_1.default)(conf);
        console.dir(options);
        const config = Object.assign({}, configDefaults, options);
        const debugMode = config.debugMode || false;
        log.level(debugMode ? log.DEBUG : log.INFO);
        log.debug('Debug mode enabled\n');
        console.dir(config);
        if (!config.userAccount) {
            log.error('Missing GitHub user account');
            process.exit(1);
        }
        if (!config.apiKey) {
            log.error('No GitHub API key provided, using unauthenticated access');
            if (config.quitOnError)
                process.exit(1);
        }
        var currentPage = 0;
        var done = false;
        var repoURL;
        var options = {};
        var result = [];
        log.info(`Fetching GitHub repositories for ${config.userAccount}`);
        console.time(durationStr);
        while (!done) {
            currentPage += 1;
            if (config.apiKey)
                options.headers = { 'Authorization': `Bearer ${config.apiKey}` };
            repoURL = `https://api.github.com/users/${config.userAccount}/repos?per_page=100&page=${currentPage}`;
            log.info(`Fetching ${repoURL}`);
            var response = await fetch(repoURL, options);
            var tempRes = await response.json();
            if (response.status == 200) {
                if (tempRes.length === 0) {
                    done = true;
                }
                else {
                    log.debug(`Found ${tempRes.length} repos`);
                    result = result.concat(tempRes);
                }
            }
            else {
                log.error(`\nError: ${response.status} - ${response.statusText}\n`);
                if (tempRes.message)
                    log.info(tempRes.message, tempRes.documentation_url);
                if (config.quitOnError)
                    process.exit(1);
            }
        }
        console.timeEnd(durationStr);
        log.info(`Retrieved repository metadata for ${result.length} repos`);
        if (debugMode)
            console.dir(result);
        return result;
    });
};
