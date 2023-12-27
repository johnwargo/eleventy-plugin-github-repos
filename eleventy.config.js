const githubRepos = require('./eleventy-plugin-github-repos.js');

module.exports = eleventyConfig => {

  const apiKey = process.env.GITHUB_API_KEY;
  const debugMode = true;
  const quitOnError = false;
  
  eleventyConfig.addPlugin(githubRepos, { userAccount: 'johnwargo', apiKey, debugMode, quitOnError});

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