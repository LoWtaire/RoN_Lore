import { Octokit } from "@octokit/rest";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getGithubConfig() {
  return {
    token: requiredEnv("GITHUB_TOKEN"),
    owner: requiredEnv("GITHUB_OWNER"),
    repo: requiredEnv("GITHUB_REPO"),
    branch: process.env.GITHUB_BRANCH || "main",
    authorName: requiredEnv("GITHUB_COMMIT_AUTHOR_NAME"),
    authorEmail: requiredEnv("GITHUB_COMMIT_AUTHOR_EMAIL")
  };
}

function createOctokit(token) {
  return new Octokit({ auth: token });
}

function decodeGithubContent(file) {
  if (!file || Array.isArray(file) || file.type !== "file" || !file.content) {
    throw new Error("GitHub path does not point to a file");
  }

  return Buffer.from(file.content, file.encoding || "base64").toString("utf8");
}

async function getFile(path) {
  const config = getGithubConfig();
  const octokit = createOctokit(config.token);

  const response = await octokit.repos.getContent({
    owner: config.owner,
    repo: config.repo,
    path,
    ref: config.branch
  });

  const content = decodeGithubContent(response.data);

  return {
    path,
    sha: response.data.sha,
    content,
    json: JSON.parse(content)
  };
}

async function updateJsonFile(path, data, commitMessage) {
  const config = getGithubConfig();
  const octokit = createOctokit(config.token);
  const currentFile = await getFile(path);
  const content = `${JSON.stringify(data, null, 2)}\n`;

  const response = await octokit.repos.createOrUpdateFileContents({
    owner: config.owner,
    repo: config.repo,
    path,
    branch: config.branch,
    message: commitMessage,
    content: Buffer.from(content, "utf8").toString("base64"),
    sha: currentFile.sha,
    author: {
      name: config.authorName,
      email: config.authorEmail
    },
    committer: {
      name: config.authorName,
      email: config.authorEmail
    }
  });

  return {
    path,
    commit: response.data.commit.sha,
    content: response.data.content
  };
}

async function getLatestCommit() {
  const config = getGithubConfig();
  const octokit = createOctokit(config.token);

  const response = await octokit.repos.listCommits({
    owner: config.owner,
    repo: config.repo,
    sha: config.branch,
    per_page: 1
  });

  const commit = response.data[0];
  if (!commit) return null;

  return {
    sha: commit.sha,
    message: commit.commit.message || ''
  };
}

export { getFile, getLatestCommit, updateJsonFile };
