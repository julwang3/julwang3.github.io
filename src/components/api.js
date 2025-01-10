import { Octokit } from '@octokit/core';
import { Buffer } from 'buffer';

const token = process.env.REACT_APP_TOKEN;
const owner = process.env.REACT_APP_OWNER;
const repo = process.env.REACT_APP_REPO;
const bufferFrom = process.env.REACT_APP_BUFFER_FROM;
const bufferTo = process.env.REACT_APP_BUFFER_TO;
const filePath = process.env.REACT_APP_FILE_PATH;

const octokit = new Octokit({
    auth: token
})

const fileContent = await getFileContent(filePath);

async function getFileContent(path) {
    try {
        // Get file content API call
        const response = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}`, {
            owner,
            repo,
            path,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
        // Return file content
        return response.data.content;
    } 
    catch (error) {
        console.error("[ERROR] Fetching file:", error.message);
        return "{}";
    }
}

export async function submitPassword(password) {
    // Get files
    const files = JSON.parse(Buffer.from(fileContent, bufferFrom).toString(bufferTo))[password];
    // Return contents of all the files
    const passwordContents = [];
    if (files !== undefined) {
        for (let i = 0; i < files.length; i++) {
          // Decode content
          const content = await getFileContent(files[i]);
          passwordContents[i] = Buffer.from(content, bufferFrom).toString(bufferTo);
        }
    }
    return passwordContents;
}