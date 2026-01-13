import githubRepos from './eleventy-plugin-github-repos.js';

const apiKey = process.env.GITHUB_API_KEY;
const debugMode = false;
const quitOnError = true;

export default async function (eleventyConfig) {

  eleventyConfig.addPlugin(githubRepos,
    {
      userAccount: 'johnwargo',
      apiKey,
      debugMode,
      quitOnError,
      cacheRequests: true,
      cacheDuration: '1d'
    });

  eleventyConfig.addPassthroughCopy('src/assets/');

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    }
  }
};