const repositories = require('./eleventy-plugin-github-repos.js');

module.exports = eleventyConfig => {

  const debugMode = true;
  const apiKey = process.env.GITHUB_API_KEY;

  // eleventyConfig.addPlugin(repositories, { debugMode });
  // eleventyConfig.addPlugin(repositories, { userAccount: 'johnwargo', debugMode });
  eleventyConfig.addPlugin(repositories, {userAccount: 'johnwargo', apiKey, debugMode});

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