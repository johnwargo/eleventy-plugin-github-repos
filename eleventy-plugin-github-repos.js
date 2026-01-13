import Fetch from "@11ty/eleventy-fetch";
import logger from 'cli-logger';
export default function (eleventyConfig, _options = {}) {
    eleventyConfig.addCollection('githubRepos', async (collectionApi) => {
        const configDefaults = {
            apiKey: '',
            cacheRequests: false,
            cacheDuration: '1d',
            debugMode: false,
            quitOnError: false,
            userAccount: ''
        };
        const APP_NAME = 'Eleventy-Plugin-GitHub-Repos';
        const durationStr = `[${APP_NAME}] Duration`;
        var conf = { console: true, level: logger.INFO };
        conf.prefix = function (record) {
            return `[${APP_NAME}]`;
        };
        var log = logger(conf);
        const config = Object.assign({}, configDefaults, _options);
        const debugMode = config.debugMode || false;
        log.level(debugMode ? log.DEBUG : log.INFO);
        log.debug('Debug mode enabled');
        console.log();
        if (debugMode) {
            console.log('Configuration:');
            console.table(config);
        }
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
        var options = {};
        var repoURL;
        var requestOptions = {};
        var result = [];
        if (config.apiKey)
            requestOptions.headers = { 'Authorization': `Bearer ${config.apiKey}` };
        options.fetchOptions = { options: requestOptions };
        if (config.cacheRequests) {
            options.duration = config.cacheDuration;
            options.type = "json";
        }
        if (debugMode) {
            console.log('Fetch Options:');
            console.table(options);
            console.log();
        }
        log.info(`Fetching GitHub repositories for ${config.userAccount} using ${config.cacheRequests ? 'Eleventy-Fetch' : 'fetch'}`);
        console.time(durationStr);
        while (!done) {
            currentPage += 1;
            repoURL = `https://api.github.com/users/${config.userAccount}/repos?per_page=100&page=${currentPage}`;
            log.info(`Fetching ${repoURL}`);
            if (config.cacheRequests) {
                var data = await Fetch(repoURL, options);
                if (data.length > 0) {
                    log.debug(`Found ${data.length} repos`);
                    result = result.concat(data);
                }
                else {
                    log.debug('No more repos');
                    done = true;
                }
            }
            else {
                var response = await fetch(repoURL, requestOptions);
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
        }
        console.timeEnd(durationStr);
        log.info(`Gathered repository metadata for ${result.length} repos`);
        return result;
    });
}
