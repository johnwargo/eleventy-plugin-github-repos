# Eleventy Plugin GitHub Repositories

An Eleventy plugin that creates a collection containing metadata from an account's GitHub repositories.

# Usage

Install the plugin by opening a terminal window or command prompt, navigating to an Eleventy project folder, and executing the following command:

```shell
npm install eleventy-plugin-github-repos
```

Next, in your Eleventy project's eleventy.config.js file, import the plugin as shown below:

```shell
const githubRepos = require('eleventy-plugin-github-repos.js');
```

Then, inside the module.exports section, load the plugin:

```shell
eleventyConfig.addPlugin(githubRepos, { userAccount: 'johnwargo' });
```

The `userAccount` configuration property specifies the GitHub account the plugin will build the list from. 

With this configuration, the plugin calls the GitHub `repos` API in unauthenticated mode (see [Adding a GitHub Repository List to an Eleventy Site](https://johnwargo.com/posts/2023/github-repository-list-eleventy/) for details) and GitHub will rate limit API requests to 60 per hour.

To get around this limitation, configure the plugin with a GitHub Access Token (for instructions on how to create one, see [Adding a GitHub Repository List to an Eleventy Site (part 2)](https://johnwargo.com/posts/2023/github-repository-list-eleventy-2/#:~:text=Generating%20a%20GitHub%20API%20Token)).

Write the GitHub Access Token to an environment variable called `GITHUB_API_KEY`, then modify the Eleventy site to configure the plugin to use the token using the following code:

```shell
const apiKey = process.env.GITHUB_API_KEY;
  
eleventyConfig.addPlugin(githubRepos, { userAccount: 'johnwargo', apiKey});
```



# Rendering Repository Metadata


# Demonstration

![Sample Page](images/image-01.png)


*** 

If this code helps you, please consider buying me a coffee.

<a href="https://www.buymeacoffee.com/johnwargo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>