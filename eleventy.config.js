const githubRepos = require('./eleventy-plugin-github-repos.js');

module.exports = eleventyConfig => {

  const debugMode = false;
  
  eleventyConfig.addPlugin(githubRepos, { debugMode });
  // eleventyConfig.addPlugin(githubRepos, {userAccount: 'johnwargo', debugMode});
  // get the API key from the environment
  // eleventyConfig.addPlugin(githubRepos, {userAccount: 'johnwargo', apiKey: 'YOUR_API_KEY', debugMode});

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