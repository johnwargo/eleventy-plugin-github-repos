/**********************************************************
 * Eleventy Plugin: GitHub Repos
 * 
 * Fetches all repositories from GitHub for a 
 * given author.
 **********************************************************/

//@ts-ignore
import Fetch from "@11ty/eleventy-fetch";
//@ts-ignore
import logger from 'cli-logger';

type ModuleOptions = {
  apiKey?: string;
  debugMode?: boolean;
  cacheRequests?: boolean;
  cacheDuration?: string;
  quitOnError?: boolean;
  userAccount?: string;
}

export default function (eleventyConfig: any, _options: ModuleOptions = {}) {
  eleventyConfig.addCollection('githubRepos', async (collectionApi: any) => {

    const configDefaults: ModuleOptions = {
      apiKey: '',
      cacheRequests: false,
      cacheDuration: '1d',
      debugMode: false,
      quitOnError: false,
      userAccount: ''
    };

    const APP_NAME = 'Eleventy-Plugin-GitHub-Repos';
    const durationStr = `[${APP_NAME}] Duration`;

    // configure the logger
    var conf: any = { console: true, level: logger.INFO };
    conf.prefix = function (record: any) {
      return `[${APP_NAME}]`;
    }
    var log = logger(conf);

    // merge the defaults (first) with the provided options (second)
    const config: ModuleOptions = Object.assign({}, configDefaults, _options);

    // set the logger log level
    const debugMode = config.debugMode || false;
    log.level(debugMode ? log.DEBUG : log.INFO);
    log.debug('Debug mode enabled');
    if (debugMode) {      
      console.log('\nConfiguration:');
      console.table(config);
    }

    // validate the configuration  
    if (!config.userAccount) {
      log.error('Missing GitHub user account');
      process.exit(1);
    }

    if (!config.apiKey) {
      log.error('No GitHub API key provided, using unauthenticated access');
      if (config.quitOnError) process.exit(1);
    }

    var currentPage: number = 0;
    var done: boolean = false;
    var options: any = {};
    var repoURL: string;
    var requestOptions: any = {};
    var result: any[] = [];

    if (config.apiKey) requestOptions.headers = { 'Authorization': `Bearer ${config.apiKey}` };
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
        // use Eleventy-Fetch
        var data = await Fetch(repoURL, options);
        if (data.length > 0) {
          log.debug(`Found ${data.length} repos`);
          result = result.concat(data);
        } else {
          log.debug('No more repos');
          done = true;
        }
      } else {
        // use fetch directly
        var response = await fetch(repoURL, requestOptions);
        var tempRes = await response.json();
        if (response.status == 200) {
          if (tempRes.length === 0) {
            done = true;
          } else {
            log.debug(`Found ${tempRes.length} repos`);
            result = result.concat(tempRes);
          }
        } else {
          log.error(`\nError: ${response.status} - ${response.statusText}\n`);
          if (tempRes.message) log.info(tempRes.message, tempRes.documentation_url);
          if (config.quitOnError) process.exit(1);
        }
      }

    }
    console.timeEnd(durationStr);
    log.info(`Gathered repository metadata for ${result.length} repos`);
    return result;
  });
}
