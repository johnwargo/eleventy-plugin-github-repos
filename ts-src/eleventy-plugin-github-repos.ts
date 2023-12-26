//@ts-ignore
import logger from 'cli-logger';

type ModuleOptions = {
  apiKey?: string;
  userAccount?: string;
  debugMode?: boolean;
  quitOnError?: boolean;
}

module.exports = function (
  eleventyConfig: any, 
  options: ModuleOptions = {}
  ) {

  eleventyConfig.addCollection('repositories', async (collectionApi: any) => {

    const configDefaults: ModuleOptions = {
      apiKey: '',
      userAccount: '',
      debugMode: false,
      quitOnError: false
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
    const config: ModuleOptions = Object.assign({}, configDefaults, options);

    // set the logger log level
    const debugMode = options.debugMode || false;
    log.level(debugMode ? log.DEBUG : log.INFO);
    log.debug('Debug mode enabled\n');
    if (debugMode) console.dir(config);

    // validate the configuration  
    if (!config.userAccount) {
      log.error('Missing GitHub user account');
      if (config.quitOnError) process.exit(1);
      return;
    }

    if (!config.apiKey) {
      log.error('No GitHub API key provided, using unauthenticated access');
    }

    var currentPage: number = 0;
    var done: boolean = false;
    var repoURL: string;
    var options: any = {};
    var result: any[] = [];

    log.info(`Fetching GitHub repositories for ${config.userAccount}`);
    console.time(durationStr);
    while (!done) {
      currentPage += 1;
      if (config.apiKey) options.headers = { 'Authorization': `Bearer ${config.apiKey}` };
      repoURL = `https://api.github.com/users/${config.userAccount}/repos?per_page=100&page=${currentPage}`;
      log.info(`Fetching ${repoURL}`);
      var response = await fetch(repoURL, options);
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
    console.timeEnd(durationStr);
    log.info(`Retrieved repository metadata for ${result.length} repos`);
    // if (debugMode) console.dir(result);
    return result;
  });
}
